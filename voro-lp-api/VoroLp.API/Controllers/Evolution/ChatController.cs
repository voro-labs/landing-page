using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using VoroLp.API.Extensions;
using VoroLp.API.ViewModels;
using VoroLp.Application.DTOs;
using VoroLp.Application.DTOs.Evolution;
using VoroLp.Application.DTOs.Evolution.Webhook;
using VoroLp.Application.DTOs.Request;
using VoroLp.Application.Services.Interfaces.Evolution;
using VoroLp.Domain.Enums;
using VoroLp.Shared.Extensions;

namespace VoroLp.API.Controllers.Evolution
{
    [Route("api/v{version:version}/[controller]")]
    [Tags("Evolution")]
    [ApiController]
    [Authorize]
    public class ChatController(
        IChatService chatService,
        IGroupService groupService,
        IMessageService messageService,
        IContactService contactService,
        IEvolutionService evolutionService,
        IInstanceService instanceService,
        IGroupMemberService groupMemberService,
        IMessageReactionService messageReactionService,
        IContactIdentifierService contactIdentifierService,
        IMapper mapper) : ControllerBase
    {
        private readonly IChatService _chatService = chatService;
        private readonly IGroupService _groupService = groupService;
        private readonly IContactService _contactService = contactService;
        private readonly IMessageService _messageService = messageService;
        private readonly IEvolutionService _evolutionService = evolutionService;
        private readonly IInstanceService _instanceService = instanceService;
        private readonly IGroupMemberService _groupMemberService = groupMemberService;
        private readonly IMessageReactionService _messageReactionService = messageReactionService;
        private readonly IContactIdentifierService _contactIdentifierService = contactIdentifierService;
        private readonly IMapper _mapper = mapper;

        // ======================================================
        // GET → Conversas unificadas (contatos + grupos)
        // ======================================================
        [HttpGet("contacts")]
        public async Task<IActionResult> GetContacts()
        {
            try
            {
                // contatos (privado)
                var contacts = await _contactService.Query(c => !c.GroupMemberships.Any())
                    .Include(item => item.Messages)
                    .OrderByDescending(c => c.LastMessageAt)
                    .ToListAsync();

                //contacts
                //    LastMessage = c.Messages
                //            .OrderByDescending(m => m.SentAt)
                //            .Select(m => m.Content)
                //            .FirstOrDefault()

                //// grupos (conversas de grupo)
                //var groups = await _groupService.Query()
                //    .OrderByDescending(c => c.LastMessageAt)
                //    .Select(c => new ConversationDto
                //    {
                //        Id = c.Id,
                //        Name = c.Name,
                //        Number = c.RemoteJid,
                //        LastMessageAt = c.LastMessageAt,
                //        LastMessage = c.Messages
                //            .OrderByDescending(m => m.SentAt)
                //            .Select(m => m.Content)
                //            .FirstOrDefault()
                //    })
                //    .ToListAsync();

                //var result = contacts.Concat(groups).ToList();

                var contactsDtos = _mapper.Map<IEnumerable<ContactDto>>(contacts);

                return ResponseViewModel<IEnumerable<ContactDto>>
                    .Success(contactsDtos)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<IEnumerable<ContactDto>>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }

        // ======================================================
        // POST → Enviar mensagem
        // ======================================================
        [HttpPost("contacts/save")]
        public async Task<IActionResult> ContactSave([FromBody] ContactDto request)
        {
            try
            {
                var (senderContact, group, chat) = await _evolutionService.CreateChatAndGroupOrContactAsync(
                    $"{request.InstanceName}", $"{request.Number}@s.whatsapp.net",
                    $"{request.DisplayName}", $"{request.Number}@s.whatsapp.net", false, string.Empty);

                if (senderContact != null)
                    _contactService.Update(senderContact);

                _chatService.Update(chat);

                await _contactService.SaveChangesAsync();
                await _chatService.SaveChangesAsync();

                if (senderContact == null)
                    return ResponseViewModel<ContactDto>
                        .Fail("Contato não foi cadastrado")
                        .ToActionResult();

                var contactDto = _mapper.Map<ContactDto>(senderContact);

                return ResponseViewModel<ContactDto>
                    .Success(contactDto)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<ContactDto>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }

        [HttpPut("contacts/{contactId:guid}/update")]
        public async Task<IActionResult> ContactUpdate(Guid contactId, [FromForm] ContactDto request)
        {
            try
            {
                var senderContact = await _contactService.Query(c => c.Id == contactId).FirstOrDefaultAsync();

                if (senderContact == null)
                    return ResponseViewModel<ContactDto>
                        .Fail("Contato não foi cadastrado")
                        .ToActionResult();

                var profilePicture = "";

                if (request.ProfilePicture != null)
                {
                    var media = new MediaDto(request.ProfilePicture);

                    if (media.MediaStream != null)
                    {
                        string? mediaBase64 = await media.MediaStream.ToBase64Async(media.Mimetype);

                        profilePicture = $"{mediaBase64}";
                    }
                }
                    

                await _contactService.UpdateContact(senderContact, request.DisplayName, profilePicture);

                await _contactService.SaveChangesAsync();

                var contactDto = _mapper.Map<ContactDto>(senderContact);

                return ResponseViewModel<ContactDto>
                    .Success(contactDto)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<ContactDto>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }

        // ======================================================
        // GET → Mensagens de um contato
        // ======================================================
        [HttpGet("messages/{contactId:guid}")]
        public async Task<IActionResult> GetMessages(Guid contactId)
        {
            try
            {
                var messages = await _messageService
                    .Query(m => 
                        m.ContactId == contactId &&
                        m.Status != MessageStatusEnum.Deleted)
                    .Include(m => m.QuotedMessage)
                        .ThenInclude(q => q!.Contact)
                    .Include(m => m.MessageReactions)
                    .OrderBy(m => m.SentAt)
                    .ToListAsync();

                var messagesDtos = _mapper.Map<IEnumerable<MessageDto>>(messages);

                return ResponseViewModel<IEnumerable<MessageDto>>
                    .Success(messagesDtos)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<IEnumerable<MessageDto>>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }

        // ======================================================
        // POST → Enviar mensagem
        // ======================================================
        [HttpPost("messages/{contactId:guid}/send")]
        public async Task<IActionResult> SendMessage(Guid contactId, [FromBody] MessageRequestDto request)
        {
            try
            {
                var contact = await _contactService.Query(c => c.Id == contactId).FirstOrDefaultAsync();

                var chat = await _chatService.Query(chat => chat.ContactId == contactId).FirstOrDefaultAsync();

                if (chat == null)
                    return NoContent();

                if (contact == null)
                    return BadRequest("Contato não encontrado!");

                if (string.IsNullOrWhiteSpace(contact.Number))
                    return BadRequest("Contato não possui número cadastrado.");

                if (string.IsNullOrWhiteSpace(request.Conversation))
                    return BadRequest("Mensagem não pode ser vazia.");

                request.Number = contact.Number;

                // EvolutionService retorna STRING → ajustado
                var responseString = await _evolutionService.SendMessageAsync(request);

                var response = JsonSerializer.Deserialize<MessageUpsertDataDto>(responseString);

                var messageDto = new MessageDto()
                {
                    ChatId = chat.Id,
                    ContactId = contact.Id,
                    Content = $"{response?.Message.Conversation}",
                    ExternalId = $"{response?.Key.Id}",
                    IsFromMe = true,
                    RawJson = responseString,
                    RemoteFrom = "",
                    RemoteTo = contact.RemoteJid,
                    SentAt = DateTimeOffset.UtcNow,
                    Status = MessageStatusEnum.Sent,
                    Type = MessageTypeEnum.Text
                };

                await _messageService.AddAsync(messageDto);

                contact.LastMessageAt = DateTimeOffset.UtcNow;
                
                _contactService.Update(contact);

                await _messageService.SaveChangesAsync();
                
                await _contactService.SaveChangesAsync();

                return ResponseViewModel<MessageDto>
                    .Success(messageDto)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<MessageDto>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }

        // ======================================================
        // POST → Enviar resposta para mensagem
        // ======================================================
        [HttpPost("messages/{contactId:guid}/send/quoted")]
        public async Task<IActionResult> SendQuotedMessage(Guid contactId, [FromBody] MessageRequestDto request)
        {
            try
            {
                var contact = await _contactService.Query(c => c.Id == contactId).FirstOrDefaultAsync();

                var chat = await _chatService.Query(chat => chat.ContactId == contactId).FirstOrDefaultAsync();

                _ = Guid.TryParse(request.Quoted?.Key.Id, out var guid);

                var message = await _messageService.Query(m => m.Id == guid && m.ContactId == contactId).FirstOrDefaultAsync();

                if (chat == null)
                    return NoContent();

                if (message == null)
                    return NoContent();

                if (contact == null)
                    return BadRequest("Contato não encontrado!");

                if (string.IsNullOrWhiteSpace(contact.Number))
                    return BadRequest("Contato não possui número cadastrado.");

                if (string.IsNullOrWhiteSpace(request.Conversation))
                    return BadRequest("Mensagem não pode ser vazia.");

                request.Number = contact.Number;

                if (request.Quoted != null)
                    request.Quoted.Key.Id = message.ExternalId;

                // EvolutionService retorna STRING → ajustado
                var responseString = await _evolutionService.SendQuotedMessageAsync(request);

                var response = JsonSerializer.Deserialize<MessageUpsertDataDto>(responseString);

                var messageDto = new MessageDto()
                {
                    ChatId = chat.Id,
                    ContactId = contact.Id,
                    Content = $"{response?.Message.Conversation}",
                    ExternalId = $"{response?.Key.Id}",
                    IsFromMe = true,
                    RawJson = responseString,
                    RemoteFrom = "",
                    RemoteTo = contact.RemoteJid,
                    SentAt = DateTimeOffset.UtcNow,
                    Status = MessageStatusEnum.Sent,
                    Type = MessageTypeEnum.Text,
                    QuotedMessageId = message.Id
                };

                await _messageService.AddAsync(messageDto);

                contact.LastMessageAt = DateTimeOffset.UtcNow;
                
                _contactService.Update(contact);

                await _messageService.SaveChangesAsync();
                
                await _contactService.SaveChangesAsync();

                messageDto.QuotedMessage = _mapper.Map<MessageDto>(message);

                return ResponseViewModel<MessageDto>
                    .Success(messageDto)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<MessageDto>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }

        // ======================================================
        // POST → Enviar resposta para mensagem
        // ======================================================
        [HttpPost("messages/{contactId:guid}/send/attachment")]
        public async Task<IActionResult> SendAttachmentMessage(Guid contactId, [FromForm] MediaDto request)
        {
            try
            {
                var contact = await _contactService.Query(c => c.Id == contactId).FirstOrDefaultAsync();

                var chat = await _chatService.Query(chat => chat.ContactId == contactId).FirstOrDefaultAsync();

                if (chat == null)
                    return NoContent();

                if (contact == null)
                    return BadRequest("Contato não encontrado!");

                if (string.IsNullOrWhiteSpace(contact.Number))
                    return BadRequest("Contato não possui número cadastrado.");

                if (request.Attachment == null)
                    return BadRequest("Anexo não pode ser nulo.");

                MediaRequestDto? mediaRequest = null;

                if (request.MediaStream != null)
                {
                    string? mediaBase64 = await request.MediaStream.ToBase64Async(request.Mimetype);

                    mediaRequest = new MediaRequestDto(contact.Number, "", $"{mediaBase64}", request);
                }

                if (mediaRequest == null)
                    return BadRequest("Anexo não pode ser nulo.");

                // EvolutionService retorna STRING → ajustado
                var responseString = await _evolutionService.SendMediaMessageAsync(mediaRequest);

                var response = JsonSerializer.Deserialize<MessageUpsertDataDto>(responseString);

                var messageDto = new MessageDto()
                {
                    ChatId = chat.Id,
                    ContactId = contact.Id,
                    Content = $"{response?.Message.Conversation}",
                    ExternalId = $"{response?.Key.Id}",
                    IsFromMe = true,
                    RawJson = responseString,
                    RemoteFrom = "",
                    RemoteTo = contact.RemoteJid,
                    SentAt = DateTimeOffset.UtcNow,
                    Status = MessageStatusEnum.Sent,
                    Type = MessageTypeEnum.Image
                };

                await _messageService.AddAsync(messageDto);

                contact.LastMessageAt = DateTimeOffset.UtcNow;
                
                _contactService.Update(contact);

                await _messageService.SaveChangesAsync();
                
                await _contactService.SaveChangesAsync();

                return ResponseViewModel<MessageDto>
                    .Success(messageDto)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<MessageDto>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }

        // ======================================================
        // POST → Enviar reação para mensagem
        // ======================================================
        [HttpPost("messages/{contactId:guid}/send/reaction")]
        public async Task<IActionResult> SendReactionMessage(Guid contactId, [FromBody] ReactionRequestDto request)
        {
            try
            {
                var contact = await _contactService.Query(c => c.Id == contactId).FirstOrDefaultAsync();

                var chat = await _chatService.Query(chat => chat.ContactId == contactId).FirstOrDefaultAsync();

                _ = Guid.TryParse(request.Key.Id, out var guid);

                var message = await _messageService.Query(m => m.Id == guid && m.ContactId == contactId).FirstOrDefaultAsync();

                if (chat == null)
                    return NoContent();

                if (message == null)
                    return NoContent();

                if (contact == null)
                    return BadRequest("Contato não encontrado!");

                if (string.IsNullOrWhiteSpace(contact.Number))
                    return BadRequest("Contato não possui número cadastrado.");

                if (string.IsNullOrWhiteSpace(request.Reaction))
                    return BadRequest("Mensagem não pode ser vazia.");

                request.Key.RemoteJid = contact.RemoteJid;

                request.Key.FromMe = true;

                request.Key.Id = message.ExternalId;

                // EvolutionService retorna STRING → ajustado
                var responseString = await _evolutionService.SendReactionMessageAsync(request);

                var response = JsonSerializer.Deserialize<MessageUpsertDataDto>(responseString);

                var messageReaction = new MessageReactionDto
                {
                    MessageId = message.Id,
                    ContactId = contact.Id,
                    Reaction = request.Reaction
                };

                await _messageReactionService.AddAsync(messageReaction);

                await _messageReactionService.SaveChangesAsync();
                
                return ResponseViewModel<object>
                    .Success(null)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<object>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }

        // ======================================================
        // POST → Deleta a mensagem
        // ======================================================
        [HttpPost("messages/{contactId:guid}/delete")]
        public async Task<IActionResult> DeleteMessage(Guid contactId, [FromBody] DeleteRequestDto request)
        {
            try
            {
                var contact = await _contactService.Query(c => c.Id == contactId).FirstOrDefaultAsync();

                var chat = await _chatService.Query(chat => chat.ContactId == contactId).FirstOrDefaultAsync();

                _ = Guid.TryParse(request.Id, out var guid);

                var message = await _messageService.Query(m => m.Id == guid && m.ContactId == contactId).FirstOrDefaultAsync();

                if (chat == null)
                    return NoContent();

                if (message == null)
                    return NoContent();

                if (contact == null)
                    return BadRequest("Contato não encontrado!");

                if (string.IsNullOrWhiteSpace(contact.Number))
                    return BadRequest("Contato não possui número cadastrado.");

                request.RemoteJid = contact.RemoteJid;

                request.FromMe = true;

                request.Id = message.ExternalId;

                // EvolutionService retorna STRING → ajustado
                var responseString = await _evolutionService.DeleteMessageAsync(request);

                var response = JsonSerializer.Deserialize<MessageUpsertDataDto>(responseString);

                message.Status = MessageStatusEnum.Deleted;

                _messageService.Update(message);

                await _messageService.SaveChangesAsync();
                
                return ResponseViewModel<object>
                    .Success(null)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<object>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }

        // ======================================================
        // POST → Encaminha a mensagem
        // ======================================================
        [HttpPost("messages/{contactId:guid}/forward")]
        public async Task<IActionResult> ForwardMessage(Guid contactId, [FromBody] ForwardRequestDto request)
        {
            try
            {
                var contact = await _contactService.Query(c => c.Id == contactId).FirstOrDefaultAsync();

                var chat = await _chatService.Query(chat => chat.ContactId == contactId).FirstOrDefaultAsync();

                _ = Guid.TryParse(request.Id, out var guid);

                var message = await _messageService.Query(m => m.Id == guid).FirstOrDefaultAsync();

                if (chat == null)
                    return NoContent();

                if (message == null)
                    return NoContent();

                if (contact == null)
                    return BadRequest("Contato não encontrado!");

                if (string.IsNullOrWhiteSpace(contact.Number))
                    return BadRequest("Contato não possui número cadastrado.");

                request.RemoteJid = contact.RemoteJid;

                request.FromMe = true;

                request.Id = message.ExternalId;

                string conversation = message.Content;

                if (!message.IsFromMe)
                  conversation = $"""
                    Mensagem de {contact.DisplayName}:
                    Conteúdo: {message.Content}
                  """;

                var messageRequest = new MessageRequestDto
                {
                    Number = contact.Number,
                    Conversation = conversation
                };

                // EvolutionService retorna STRING → ajustado
                var responseString = await _evolutionService.SendMessageAsync(messageRequest);

                var response = JsonSerializer.Deserialize<MessageUpsertDataDto>(responseString);

                message.Status = MessageStatusEnum.Deleted;

                _messageService.Update(message);

                await _messageService.SaveChangesAsync();
                
                return ResponseViewModel<object>
                    .Success(null)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<object>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }
    }
}

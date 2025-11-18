namespace VoroLp.Application.DTOs.Request
{
    public class QuotedRequestDto
    {
        public string Number { get; set; } = string.Empty;
        public QuotedKeyRequestDto Key { get; set; } = null!;
        public MessageRequestDto Message { get; set; } = null!;
    }

    public class QuotedKeyRequestDto
    {
        public string Id { get; set; } = string.Empty;
    }
}

namespace VoroLp.Application.DTOs.Request
{
    public class MediaRequestDto
    {
        public string Number { get; set; } = "remoteJid";
        public string Mediatype { get; set; } = "image";
        public string Mimetype { get; set; } = "image/png";
        public string Caption { get; set; } = "Teste de caption";
        public string Media { get; set; } = "https://s3.amazonaws.com/atendai/company-3708fcdf-954b-48f8-91ff-25babaccac67/1712605171932.jpeg";
        public string FileName { get; set; } = "Imagem.png";
    }
}

namespace VoroLp.Application.DTOs.Request
{
    public class QuotedRequestDto : MessageRequestDto
    {
        public QuotedKeyRequestDto Key { get; set; } = null!;
    }

    public class QuotedKeyRequestDto
    {
        public string Id { get; set; } = string.Empty;
    }
}

namespace VoroLp.Shared.Extensions
{
    public static class StreamExtension
    {
        public static async Task<string> ToBase64Async(this Stream stream, string contentType)
        {
            using var ms = new MemoryStream();
            await stream.CopyToAsync(ms);

            var bytes = ms.ToArray();
            var base64 = Convert.ToBase64String(bytes);

            return $"data:{contentType};base64,{base64}";
        }
    }
}

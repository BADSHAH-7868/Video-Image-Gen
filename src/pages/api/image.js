export async function generateImage(prompt) {
  const baseUrl =
    import.meta.env.MODE === "development"
      ? "/api/image"
      : "https://image.pollinations.ai";

  // Pollinations image API returns a direct image URL
  return `${baseUrl}/p/${encodeURIComponent(prompt)}?model=flux`;
}

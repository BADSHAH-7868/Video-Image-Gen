export async function generateText(prompt) {
  const baseUrl =
    import.meta.env.MODE === "development"
      ? "/api/text"
      : "https://text.pollinations.ai";

  const response = await fetch(`${baseUrl}/${encodeURIComponent(prompt)}`);
  if (!response.ok) throw new Error("Text generation failed");
  return response.text();
}

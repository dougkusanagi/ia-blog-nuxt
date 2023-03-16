export async function useChatGPT(prompt) {
  return await useFetch("/api/chatgpt", {
    method: "POST",
    body: { prompt },
  });
}

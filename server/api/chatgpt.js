export default defineEventHandler(async (event) => {
  const { prompt } = await readBody(event);
  return prompt;
});

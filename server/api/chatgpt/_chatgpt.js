import { Configuration, OpenAIApi } from "openai";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const prompt = body.prompt;
  return prompt;

  const OPENAI_API_KEY = "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";
  const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);
  // return "test";

  // const prompt = `100 words about nuxt`;

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    max_tokens: 4000,
    prompt: prompt,
  });

  return await completion.data.choices[0].text;
});

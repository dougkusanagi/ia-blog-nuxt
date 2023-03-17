import { Configuration, OpenAIApi } from "openai";

export default defineEventHandler(async (event) => {
  const { prompt } = await readBody(event);

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    max_tokens: 4000,
    prompt: prompt,
  });

  return completion.data.choices[0].text;
});

import { storePostImagine } from "~~/server/repositories/PostImagineRepository";

export default defineEventHandler(async (event) => {
  const { imagine } = await readBody(event);

  if (!imagine.question) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Campo de pergunta não encontrado",
      })
    );
  }

  if (!imagine.answer) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Campo de resposta do chatgpt não encontrado",
      })
    );
  }

  const post = await storePostImagine(imagine);

  return { post };
});

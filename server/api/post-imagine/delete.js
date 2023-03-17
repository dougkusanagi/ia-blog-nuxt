import { deletePostImagine } from "~~/server/repositories/PostImagineRepository";

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event);

  if (!id) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: "Id não encontrado" })
    );
  }

  return await deletePostImagine(id);
});

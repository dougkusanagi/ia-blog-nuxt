import {
  findPostByTitle,
  storePost,
} from "~~/server/repositories/PostRepository";

export default defineEventHandler(async (event) => {
  const { title } = await readBody(event);

  if (!title) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: "Preencha o título" })
    );
  }

  const postExist = await findPostByTitle(title);

  if (postExist) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: `Título com título:"${postExist.title}" já cadastrado`,
      })
    );
  }

  const post = await storePost({ title });

  return { post };
});

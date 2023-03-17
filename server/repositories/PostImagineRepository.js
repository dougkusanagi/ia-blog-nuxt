import { prisma } from "../lib/prisma";

export const findAll = async () =>
  await prisma.postImagine.findMany({
    include: {
      post: true,
    },
  });

export const findPostImagineByQuestion = async (question) => {
  const imagine = await prisma.postImagine.findMany({
    where: {
      question: {
        equals: question,
      },
    },
  });
  return imagine && imagine.length > 0 ? imagine[0] : false;
};

export const findPostImagineByAnswer = async (answer) => {
  const imagine = await prisma.postImagine.findMany({
    where: {
      answer: {
        equals: answer,
      },
    },
  });
  return imagine && imagine.length > 0 ? imagine[0] : false;
};

export const storePostImagine = async ({ question, answer, postId }) => {
  const newPostImagine = await prisma.postImagine.create({
    data: { question, answer, postId },
  });
  return newPostImagine;
};

export const deletePostImagine = async (id) => {
  return await prisma.postImagine.delete({
    where: { id },
  });
};

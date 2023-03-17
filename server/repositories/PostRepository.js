import { prisma } from "../lib/prisma";

export const findAll = async () =>
  await prisma.post.findMany({
    include: {
      postImagines: true,
    },
  });

export const findPostByTitle = async (title) => {
  const post = await prisma.post.findMany({
    where: {
      title: {
        equals: title,
      },
    },
  });
  // console.log(post);
  return post && post.length > 0 ? post[0] : false;
};

export const storePost = async (data) => {
  const newPost = await prisma.post.create({
    data: {
      title: data.title,
    },
  });
  return newPost;
};

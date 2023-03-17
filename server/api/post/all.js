import { findAll } from "~~/server/repositories/PostRepository";

export default defineEventHandler(async () => {
  return await findAll();
});

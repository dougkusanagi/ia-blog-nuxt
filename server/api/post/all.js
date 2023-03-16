import { findAll } from "~~/server/repositories/Post";

export default defineEventHandler(async () => {
  return await findAll();
});

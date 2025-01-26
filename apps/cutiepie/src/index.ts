import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import IORedis from "ioredis";

const redis_url = String(process.env.REDIS_HOST_URL);
console.log(redis_url);

const connection = new IORedis(redis_url, { maxRetriesPerRequest: null });

async function sendMessage() {}

const worker = new Worker(
  "cronpie",
  async (job) => {
    await sendMessage();
  },
  { connection }
);

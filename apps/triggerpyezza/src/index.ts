import dotenv from "dotenv";
dotenv.config();
import { CronJob } from "cron";


function pushMessages(){

}

const job = new CronJob(
  "* * * * * *", // cronTime
  function () {
    console.log("You will see this message every second");
  }, // onTick
  null, // onComplete
  true, // start
  "America/Los_Angeles" // timeZone
);

import * as dotenv from "dotenv";

dotenv.config();

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

// ---------- you can edit values below this line ----------

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

// interval (in minutes) between fetching new clips:
const clipsFetchInterval = "* */1 * * * *";

// interval (in hours) between refreshing Twitch token
const tokenFetchInterval = "* * */4 * * *";

// amount of clips fetched every %clipFetchInterval%:
const clipsAmount = 100;

// max-age (in hours) of clips that we want to fetch:
const clipsTime = 12;


// channel (numeric id) to get clips from:
// get it from https://www.streamweasels.com/tools/convert-twitch-username-%20to-user-id/
const broadcasterId = 98811770;

export {
  TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET,
  DISCORD_TOKEN,
  DISCORD_CHANNEL_ID,
  clipsFetchInterval,
  clipsAmount,
  clipsTime,
  tokenFetchInterval,
  broadcasterId
};

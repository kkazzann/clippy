import { scheduleJob } from "node-schedule";
import { getRecentClips, getTwitchToken } from "./twitch.js";
import { setAccessToken } from "../index.js";
import { clipsFetchInterval, tokenFetchInterval } from "../config/index.js";
import { postClipsToDiscord } from "./discord.js";
import { logInfo } from "../utils/logger.js";

logInfo(`TokenFetchInterval: ${tokenFetchInterval}, ClipsFetchInterval: ${clipsFetchInterval}`);

scheduleJob(tokenFetchInterval, async () => {
  logInfo("Twitch Token scheduler running!");

  const newToken = await getTwitchToken();
  setAccessToken(newToken);
});

scheduleJob(clipsFetchInterval, async () => {
  logInfo("Clips scheduler running!");

  const clips = await getRecentClips();
  await postClipsToDiscord(clips);
});

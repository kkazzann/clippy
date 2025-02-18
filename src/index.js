import "./config/index.js";
import { getRecentClips, getTwitchToken } from "./services/twitch.js";
import { postClipsToDiscord } from "./services/discord.js";
import "./services/scheduler.js";

let accessToken;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(newToken) {
  return (accessToken = newToken);
}

setAccessToken(await getTwitchToken());

await getRecentClips().then(async (clips) => {
  await postClipsToDiscord(clips);
});

import { Client, Events, GatewayIntentBits } from "discord.js";
import { logInfo } from "../utils/logger.js";
import { DISCORD_CHANNEL_ID, DISCORD_TOKEN } from "../config/index.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

await client.login(DISCORD_TOKEN);
await client.once(Events.ClientReady, (readyClient) => {
  logInfo(`Bot successfully logged in as ${readyClient.user.tag}.`);
});

export const clips_forum = await client.channels.fetch(DISCORD_CHANNEL_ID);

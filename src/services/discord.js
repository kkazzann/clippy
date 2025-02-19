import { getGameData } from "./twitch.js";
import { logError, logInfo } from "../utils/logger.js";
import { clips_forum } from "../workers/discord-worker.js";
import { clipExistsInDb, saveClipToDb, saveGameThreadInDb } from "../utils/database.js";

export async function postClipsToDiscord(clips) {
  if (!clips) return;

  logInfo("Starting to post clips to Discord...");

  if (!clips_forum) {
    logError("Clips channel not found. Stopped processing new clips.");
    return;
  }

  const games_cache = new Map();

  for (const clip of clips) {
    if (clipExistsInDb(clip.id)) {
      logInfo(`Clip ${clip.id} already exists in the database. Skipping...`);
      continue;
    }

    let game;

    let gameCached = games_cache.get(clip.game_id);

    if (gameCached) {
      logError(`Using data from cache, game ${clip.game_id}`);
      game = gameCached;
    } else {
      game = await getGameData(clip.game_id);
      games_cache.set(clip.game_id, game);
      logInfo(`Caching game ${clip.game_id}`);
    }

    const thread_name = `[#${game.id}] - ${game.name}`;
    logInfo(`📷 NEW CLIP: ${thread_name} | ${clip.id}`);

    let thread = await clips_forum.threads.cache.find((x) =>
      x.name.includes(`[#${game.id}] `)
    );

    if (!thread) {
      logInfo(`Creating new thread for ${game.name}`);

      thread = await clips_forum.threads.create({
        name: thread_name,
        message: {
          content: `_ _\n 🤖  Posty tworzone automatycznie przez Clippy (gra: ${game.name})\n${game.url}\n_ _\nDowiedz się więcej o [Clippy](https://kznlabs.com/clippy)\n_ _`
        }
      });

      saveGameThreadInDb(thread.id, game.id, game.name);
    }

    await thread.send({
      content: `🎯  Na kanale twitch.tv/partyycja dostępny jest nowy klip!\n\n${clip.url}\n_ _`
    });

    await thread.send({
      embeds: [
        {
          color: 6570405,
          footer: {
            text: `👀 ${clip.view_count} wyświetleń | ${clip.duration}s | ${game.name}`
          },
          timestamp: clip.created_at
        }
      ]
    });

    await thread.send({
      content: "\n_ _"
    });

    saveClipToDb(
      clip.id,
      game.id,
      clip.url,
      clip.view_count,
      clip.duration,
      clip.created_at
    );
  }

  logInfo("----------------------");
  logInfo("  Posted all clips!");
  logInfo("----------------------");
}

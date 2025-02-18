import axios from "axios";
import { logError, logInfo } from "../utils/logger.js";
import { broadcasterId, clipsAmount, clipsTime, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } from "../config/index.js";
import { getAccessToken } from "../index.js";
import moment from "moment";

export async function getTwitchToken() {
  try {
    const { data } = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      null,
      {
        params: {
          client_id: TWITCH_CLIENT_ID,
          client_secret: TWITCH_CLIENT_SECRET,
          grant_type: "client_credentials"
        }
      }
    );

    if (!data || !data.access_token) {
      const errorMessage = "Access token not found.";
      logError(errorMessage);
      return null;
    }

    logInfo("New Twitch access token acquired.");
    return data.access_token;
  } catch (error) {
    const errorMessage = `Error fetching Twitch token: ${error.message}`;
    logError(errorMessage);
    throw new Error(errorMessage);
  }
}

export async function getRecentClips() {
  logInfo("Fetching recent clips...");
  const {
    data: { data: response }
  } = await axios.get("https://api.twitch.tv/helix/clips", {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Client-Id": TWITCH_CLIENT_ID
    },
    params: {
      broadcaster_id: broadcasterId,
      first: clipsAmount,
      started_at: moment().subtract(clipsTime, "hours").toISOString()
    }
  });

  const sortedClips = response.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  return response.length === 0 ? null : sortedClips;
}

export async function getGameData(id) {
  logInfo(`Fetching game #${id} data...`);
  const {
    data: {
      data: [game]
    }
  } = await axios.get("https://api.twitch.tv/helix/games", {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Client-Id": TWITCH_CLIENT_ID
    },
    params: { id }
  });

  game.url = `https://www.twitch.tv/directory/game/${encodeURIComponent(game.name)}`;

  return game;
}

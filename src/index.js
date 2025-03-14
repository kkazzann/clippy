import "./config/index.js";
import "./services/scheduler.js";

let accessToken;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(newToken) {
  return (accessToken = newToken);
}

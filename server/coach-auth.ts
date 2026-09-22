import { createHmac, timingSafeEqual } from "node:crypto";

export const COACH_SESSION_COOKIE = "cobra_coach_session";
const FALLBACK_USERNAME = "theCPU";
const FALLBACK_PASSWORD = "theVRJ8";

function configuredUsername() {
  return process.env.COACH_USERNAME || FALLBACK_USERNAME;
}

function configuredPassword() {
  return process.env.COACH_PASSWORD || FALLBACK_PASSWORD;
}

function sessionSecret() {
  return process.env.JWT_SECRET || "cobra-coach-session-secret";
}

export function validateCoachCredentials(username: string, password: string) {
  return username === configuredUsername() && password === configuredPassword();
}

function signature(username: string) {
  return createHmac("sha256", sessionSecret()).update(`coach:${username}`).digest("hex");
}

export function createCoachSession(username = configuredUsername()) {
  return `${username}.${signature(username)}`;
}

export function isValidCoachSession(value?: string) {
  if (!value) return false;
  const separator = value.lastIndexOf(".");
  if (separator < 1) return false;
  const username = value.slice(0, separator);
  const received = value.slice(separator + 1);
  const expected = signature(username);
  if (received.length !== expected.length) return false;
  try { return timingSafeEqual(Buffer.from(received), Buffer.from(expected)) && username === configuredUsername(); } catch { return false; }
}

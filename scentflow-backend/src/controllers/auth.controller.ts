import { Request, Response } from "express";
import {
  getUser,
  refreshSession,
  signIn,
  signOut,
  signUp,
} from "../services/auth.service";

const ACCESS_COOKIE = "scentflow_access_token";
const REFRESH_COOKIE = "scentflow_refresh_token";

function cookieOptions(maxAge: number) {
  return [
    "HttpOnly",
    "Path=/",
    `Max-Age=${maxAge}`,
    `SameSite=${process.env.NODE_ENV === "production" ? "None" : "Lax"}`,
    ...(process.env.NODE_ENV === "production" ? ["Secure"] : []),
  ].join("; ");
}

function setSessionCookies(res: Response, accessToken: string, refreshToken: string) {
  res.setHeader("Set-Cookie", [
    `${ACCESS_COOKIE}=${encodeURIComponent(accessToken)}; ${cookieOptions(3600)}`,
    `${REFRESH_COOKIE}=${encodeURIComponent(refreshToken)}; ${cookieOptions(60 * 60 * 24 * 30)}`,
  ]);
}

function clearSessionCookies(res: Response) {
  res.setHeader("Set-Cookie", [
    `${ACCESS_COOKIE}=; ${cookieOptions(0)}`,
    `${REFRESH_COOKIE}=; ${cookieOptions(0)}`,
  ]);
}

function parseCookies(req: Request) {
  const header = req.headers.cookie ?? "";
  return header.split(";").reduce<Record<string, string>>((cookies, item) => {
    const index = item.indexOf("=");
    if (index === -1) return cookies;
    const key = item.slice(0, index).trim();
    const value = item.slice(index + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
    return cookies;
  }, {});
}

export async function registerController(req: Request, res: Response) {
  const data = await signUp(req.body);

  if (data.session) {
    setSessionCookies(res, data.session.access_token, data.session.refresh_token);
  }

  res.status(201).json({
    user: data.user,
    session: data.session
      ? { expires_at: data.session.expires_at }
      : null,
    requiresEmailConfirmation: !data.session,
  });
}

export async function loginController(req: Request, res: Response) {
  const data = await signIn(req.body);

  setSessionCookies(res, data.session.access_token, data.session.refresh_token);

  res.json({
    user: data.user,
    session: { expires_at: data.session.expires_at },
  });
}

export async function meController(req: Request, res: Response) {
  const cookies = parseCookies(req);
  const user = await getUser(cookies[ACCESS_COOKIE]);

  res.json({ user });
}

export async function refreshController(req: Request, res: Response) {
  const cookies = parseCookies(req);
  const refreshToken = cookies[REFRESH_COOKIE];

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh session tidak ditemukan" });
    return;
  }

  const data = await refreshSession(refreshToken);
  if (!data.session) {
    res.status(401).json({ message: "Session tidak dapat diperbarui" });
    return;
  }

  setSessionCookies(res, data.session.access_token, data.session.refresh_token);
  res.json({ session: { expires_at: data.session.expires_at } });
}

export async function logoutController(req: Request, res: Response) {
  const cookies = parseCookies(req);
  const accessToken = cookies[ACCESS_COOKIE];

  if (accessToken) {
    try {
      await signOut(accessToken);
    } catch {
      // The local session is cleared even if the remote revoke already expired.
    }
  }

  clearSessionCookies(res);
  res.status(204).send();
}

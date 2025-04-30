import { NextResponse } from "next/server";

import { pagePath } from "./constants";
import { verifyOrthrosJwt } from "./lib/verifyJwt";
import { api } from "./share/api";

import type { NextRequest } from "next/server";

import { logEndForOther, logStartForOther } from "@/constants/log";
import { loggerMWInfo } from "@/lib/logger";

const redirectUrl = process.env.get_session_redirect_url;

export async function middleware(req: NextRequest) {
  loggerMWInfo(logStartForOther("middleware"));
  const res = NextResponse.next();
  const url = req.nextUrl;
  loggerMWInfo(`access path ${url.pathname}`);

  if (url.pathname === pagePath.login.error || url.pathname === api.v1.logout) {
    loggerMWInfo(logEndForOther(`middleware access path ${pagePath.login.error}`));
    return res;
  }
  const session_cookie = req.cookies.get("session_cookie");

  if (!session_cookie) {
    if (url.pathname == api.v1.badge.status_list) {
      loggerMWInfo(`no session_cookie! returning 401 Unauthorized`);
      return new NextResponse("Unauthorized", { status: 401 });
    }
    loggerMWInfo(`no session_cookie! redirect to ${redirectUrl}`);
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  const verify = await verifyOrthrosJwt(session_cookie.value);

  if (!verify) {
    loggerMWInfo(`invalid access! redirect ${pagePath.login.error}`);
    return NextResponse.redirect(new URL(pagePath.login.error, req.url));
  }

  loggerMWInfo(logEndForOther("middleware"));
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico).*)"],
};

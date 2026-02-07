 import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

const authRoutes = ["/auth/login", "/auth/sign-in", "/auth/signup"];
const protectedPagePrefixes = ["/app"];
const protectedApiPrefixes = [
  "/api/blueprint-requests",
  "/api/build-guide-requests",
  "/api/decision-matrix-requests",
  "/api/projects",
  "/api/user",
  "/api/pdf",
];

function isProtectedPage(pathname: string) {
  return protectedPagePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isProtectedApi(pathname: string) {
  return protectedApiPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

const handler = auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  if (isAuthenticated && authRoutes.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/app";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (!isAuthenticated) {
      // if (isProtectedApi(pathname)) {
      //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      // }

    if (isProtectedPage(pathname)) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set(
        "callbackUrl",
        req.nextUrl.pathname + req.nextUrl.search
      );
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const proxy = handler;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)).*)",
  ],
};

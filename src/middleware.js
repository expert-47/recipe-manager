import { NextResponse } from "next/server";

export default function middleware(req) {
  const { origin, pathname } = req.nextUrl;

  const verify = req.cookies.get("id");
  const url = req.url;

  if (pathname === "/signup") {
    return NextResponse.next();
  } else if (!verify) {
    return NextResponse.redirect(new URL("/", origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next).*)(.+)"],
};

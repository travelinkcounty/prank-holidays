import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if maintenance mode is enabled
  if (process.env.MAINTENANCE_MODE === "true") {
    // Allow access to maintenance page
    if (pathname == "/maintenance") {
      return NextResponse.next();
    }
    // Redirect all other routes to maintenance page
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

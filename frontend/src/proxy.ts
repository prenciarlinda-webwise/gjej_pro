import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// gjejpro.com (apex, no "www.") is the canonical host — it's what the
// sitemap and every canonical tag declare. Without this, www.gjejpro.com
// serves the exact same content unredirected, which Search Console reports
// as duplicate pages with no user-selected canonical.
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.slice(4);
    url.protocol = "https";
    return NextResponse.redirect(url, 308);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

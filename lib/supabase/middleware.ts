import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Hardcoded whitelist or pulled from env. Adjust as needed.
const ADMIN_EMAILS = [
  "hks126040@gmail.com",
  process.env.ADMIN_EMAIL || "", // Set your email in .env.local like ADMIN_EMAIL=me@gmail.com
].filter(Boolean);

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (isAdminRoute) {
    if (!user) {
      if (!isLoginRoute) {
        // Not logged in -> redirect to login
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
    } else {
      // User is logged in
      const isAuthorizedAdmin = ADMIN_EMAILS.includes(user.email || "");

      if (!isAuthorizedAdmin) {
        // Logged in but not an admin -> show a simple access denied or home
        // We can just redirect them to home, or a dedicated /access-denied
        if (!request.nextUrl.pathname.startsWith("/access-denied")) {
          const url = request.nextUrl.clone();
          url.pathname = "/access-denied";
          return NextResponse.redirect(url);
        }
      } else {
        // Valid Admin
        if (isLoginRoute) {
          // Already logged in, no need to be on login page
          const url = request.nextUrl.clone();
          url.pathname = "/admin";
          return NextResponse.redirect(url);
        }
      }
    }
  }

  return response;
}

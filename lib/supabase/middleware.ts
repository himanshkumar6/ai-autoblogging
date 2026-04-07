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
          // Update request cookies for downstream use
          request.cookies.set({
            name,
            value,
            ...options,
          });
          // Synchronize with response object to ensure cookies are sent back to browser
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // Update request cookies for downstream use
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          // Synchronize with response object
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    },
  );

  // Use getUser() as it is more secure than getSession() for server-side checks.
  // It validates the session with the Supabase Auth server.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  // CRITICAL: Logic to prevent loops and handle authorized access
  if (isAdminRoute) {
    if (!user || error) {
      // Not authenticated -> Redirect to login (unless already there)
      if (!isLoginRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        // Ensure we don't carry over search params that might cause loops
        url.search = ""; 
        return NextResponse.redirect(url);
      }
    } else {
      // Authenticated -> Check authorization
      const userEmail = typeof user === 'object' && user !== null ? user.email : null;
      const isAuthorizedAdmin = userEmail && ADMIN_EMAILS.includes(userEmail);

      if (!isAuthorizedAdmin) {
        // Logged in but NOT an authorized admin
        if (!pathname.startsWith("/access-denied")) {
          const url = request.nextUrl.clone();
          url.pathname = "/access-denied";
          return NextResponse.redirect(url);
        }
      } else {
        // Logged in and IS an authorized admin
        if (isLoginRoute) {
          // Already logged in, redirect away from login to dashboard
          const url = request.nextUrl.clone();
          url.pathname = "/admin";
          return NextResponse.redirect(url);
        }
      }
    }
  }

  return response;
}


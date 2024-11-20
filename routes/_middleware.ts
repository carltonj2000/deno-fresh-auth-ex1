import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";
import { decode } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { FreshContext } from "$fresh/server.ts";

export async function handler(req: Request, ctx: FreshContext) {
    const cookieName = "auth";
    const cookies = getCookies(req.headers);
    const token = cookies[cookieName];
    const url = new URL(req.url);
    if (token) {
        const verifyToken: any = await decode(token);
        if (verifyToken) {
            ctx.state.userData = verifyToken[1].payload;
            const nonProtected = ["/login", "/register"];
            if (nonProtected.includes(url.pathname)) {
                url.pathname = "/";
                return Response.redirect(url);
            }
        }
    } else {
        const protectedRoute = ["/"];
        if (protectedRoute.includes(url.pathname)) {
            url.pathname = "/login";
            return Response.redirect(url);
        }
    }
    return await ctx.next();
}

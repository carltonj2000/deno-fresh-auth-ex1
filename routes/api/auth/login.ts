import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { db } from "../../../utils/DBConnection.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { create } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { setCookie } from "https://deno.land/std@0.224.0/http/cookie.ts";

interface Users {
    _id?: string;
    username: string;
    email: string;
    password: string;
}
const loginCollection = db?.collection<Users>("users");

async function generateJwtToken(user: Users) {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 30 * 24 * 60 * 60; // 30 days
    const payload = { id: user._id, username: user.username, iat, exp };
    const key = await crypto.subtle.generateKey(
        { name: "HMAC", hash: "SHA-512" },
        true,
        ["sign", "verify"],
    );
    const jwt = await create({ alg: "HS512", type: "JWT" }, { payload }, key);
    return jwt;
}

export const handler: Handlers = {
    async POST(req, _) {
        try {
            const { email, password } = await req.json();
            if (!loginCollection) {
                return new Response(
                    JSON.stringify({ error: "DB not ready" }),
                    { status: STATUS_CODE.ServiceUnavailable },
                );
            }
            const existingUser = await loginCollection.findOne({ email });
            if (!existingUser) {
                return new Response(
                    JSON.stringify({ error: "No such users" }),
                    { status: STATUS_CODE.NotFound },
                );
            } else {
                const match = await bcrypt.compare(
                    password,
                    existingUser.password,
                );
                if (!match) {
                    return new Response(
                        JSON.stringify({ error: "Incorrect password!" }),
                        { status: STATUS_CODE.Unauthorized },
                    );
                } else {
                    const token = await generateJwtToken(existingUser);
                    const headers = new Headers();
                    headers.set("Location", "/");
                    headers.set("Content-Type", "application/json");
                    const url = new URL(req.url);
                    setCookie(headers, {
                        name: "auth",
                        value: token,
                        maxAge: 30 * 24 * 60 * 60, // 30 days
                        sameSite: "Lax",
                        domain: url.hostname,
                        path: "/",
                        secure: true,
                        httpOnly: true,
                    });
                    return new Response(
                        JSON.stringify({
                            message: "Logged In successfully",
                            token: token,
                        }),
                        { status: 200, headers: headers },
                    );
                }
            }
        } catch (error) {
            return new Response(error);
        }
    },
};

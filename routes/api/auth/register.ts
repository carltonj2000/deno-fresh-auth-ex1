import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { db } from "../../../utils/DBConnection.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

interface Users {
    username: string;
    email: string;
    password: string;
}
const loginCollection = db?.collection<Users>("users");

export const handler: Handlers = {
    async POST(req, _) {
        try {
            const { username, email, password } = await req.json();
            if (!loginCollection) {
                return new Response(
                    JSON.stringify({
                        status: STATUS_CODE.ServiceUnavailable,
                        statusText: "DB not ready",
                    }),
                );
            }
            const existingUser = await loginCollection.findOne({ username });
            if (existingUser) {
                return new Response(
                    JSON.stringify({
                        status: STATUS_CODE.Forbidden,
                        statusText:
                            "Username already being used, select another username.",
                    }),
                );
            } else {
                const salt = await bcrypt.genSalt(8);
                const hash = await bcrypt.hash(password, salt);
                await loginCollection?.insertOne({
                    username,
                    email,
                    password: hash,
                });
                return new Response(null, {
                    status: STATUS_CODE.Created,
                    statusText: "Registered successfully",
                });
            }
        } catch (error) {
            return new Response(error);
        }
    },
};

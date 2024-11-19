import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { db } from "../../../utils/DBConnection.ts";

const loginCollection = db?.collection("users");

export const handler: Handlers = {
    async POST(req, _) {
        try {
            const { username, email, password } = await req.json();
            const existingUser = await loginCollection?.findOne({ username });
            if (existingUser) {
                return new Response(
                    JSON.stringify({
                        status: STATUS_CODE.Forbidden,
                        statusText:
                            "Username already being used, select another username.",
                    }),
                );
            } else {
                await loginCollection?.insertOne({ username, email, password });
            }
            return new Response(null, {
                status: STATUS_CODE.Created,
                statusText: "Registered successfully",
            });
        } catch (error) {
            return new Response(error);
        }
    },
};

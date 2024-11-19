import {
    Database,
    MongoClient,
} from "https://deno.land/x/mongo@v0.33.0/mod.ts";

import { MONGODB_CONNECTION_STRING } from "./envConfig.ts";

async function createMongoDBConnection() {
    try {
        const client = new MongoClient();
        await client.connect(MONGODB_CONNECTION_STRING);
        console.log("Connected To MongoDB");
        return client.database("auth");
    } catch (error) {
        console.error(error);
    }
}

let db = await createMongoDBConnection();

export { createMongoDBConnection, db };

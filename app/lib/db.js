import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.DB_URI) {
    throw new Error("Mongo DB not found")
}

const client = new MongoClient(process.env.DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function getDB(dbName) {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        console.log("connected to DB")
        return client.db(dbName)
    } catch (err) {
        console.error(err)
    }
}

export async function getCollection(collectionName) {
    const db = await getDB("next_blog_db")
    if (db) {
        return db.collection(collectionName)
    }
}
import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();
  const users = await db.collection("users").find().toArray();
  client.close();

  res.status(200).json(users);
}
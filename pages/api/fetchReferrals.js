import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    // Fetch all referrals from the "referrals" collection
    const referrals = await db.collection("referrals").find().toArray();

    client.close();

    // Return the referrals as JSON
    res.status(200).json(referrals);
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
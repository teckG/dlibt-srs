import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Email is required" });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db();

  try {
    const referrals = await db
      .collection("referrals")
      .find({ referrerEmail: email })
      .toArray();

    res.status(200).json(referrals);
  } catch (error) {
    console.error("Error fetching referrals:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    client.close();
  }
}
import { MongoClient, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId } = req.query;
  const { role } = req.body;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (!role || typeof role !== "string") {
    return res.status(400).json({ message: "Invalid role" });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db();

  try {
    // Update the user's role in MongoDB
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) }, // Convert userId to ObjectId
      { $set: { role } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    client.close();
  }

  
}



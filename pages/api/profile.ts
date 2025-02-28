import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db();

  try {
    const { email } = req.query;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }

    if (req.method === "GET") {
      // Fetch user profile
      const user = await db.collection("users").findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      });
    } else if (req.method === "PUT") {
      // Update user profile
      const { fullName, password } = req.body;

      const updateData: { fullName?: string; password?: string } = {};

      if (fullName) {
        updateData.fullName = fullName;
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }

      const result = await db.collection("users").updateOne(
        { email },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Profile updated successfully" });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    client.close();
  }
}
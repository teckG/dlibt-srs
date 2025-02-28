import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  const { email } = req.query; // Get the logged-in user's email

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    // Fetch notifications for the logged-in user
    const notifications = await db
      .collection("notifications")
      .find({ referrerEmail: email }) // Filter by referrer's email
      .toArray();

    client.close();
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
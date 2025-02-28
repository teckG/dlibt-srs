import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  const { id } = req.query; // Get the notification ID

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    // Mark the notification as read
    const result = await db
      .collection("notifications")
      .updateOne({ _id: id }, { $set: { isRead: true } });

    client.close();

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json({ message: "Notification marked as read." });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
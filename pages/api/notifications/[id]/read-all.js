import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  const { email } = req.query; // Get the logged-in user's email

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    // Mark all notifications as read for the logged-in user
    const result = await db
      .collection("notifications")
      .updateMany({ referrerEmail: email }, { $set: { isRead: true } });

      console.log(result)
    client.close();

    res.status(200).json({ message: "All notifications marked as read." });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid"; // For generating UUIDs

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      referrerName,
      referrerEmail,
      referrerPhone,
      referrerRelationship,
      studentName,
      studentPhone,
      studentEmail,
      admissionDetails,
      referralDate,
      referralStatus,
    } = req.body;

    // Validate form data
    if (
      !referrerName ||
      !referrerEmail ||
      !referrerPhone ||
      !referrerRelationship ||
      !studentName ||
      !studentPhone ||
      !studentEmail ||
      !admissionDetails ||
      !referralDate ||
      !referralStatus
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      // Connect to MongoDB
      const client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db();

      // Generate a unique referral ID (UUID)
      const referralId = uuidv4();

      // Insert referral data into the "referrals" collection
      const result = await db.collection("referrals").insertOne({
        referralId, // Store the UUID
        referrerName,
        referrerPhone,
        referrerEmail,
        referrerRelationship,
        studentName,
        studentPhone,
        studentEmail,
        admissionDetails,
        referralDate,
        referralStatus,
        createdAt: new Date(),
      });

      client.close();

      // Return success response with the referral link
      const referralLink = `${process.env.BASE_URL}/referral/${referralId}`;
      res.status(201).json({
        message: "Referral created!",
        referralId: result.insertedId,
        referralLink, // Send the link back to the frontend
      });
    } catch (error) {
      console.error("Error connecting to MongoDB or inserting data:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
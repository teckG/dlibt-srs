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
  } else if (req.method === "GET") {
    const { status } = req.query; // Get the status from the query parameters

    try {
      const client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db();

      // Fetch referrals based on the status filter
      const referrals = await db
        .collection("referrals")
        .find(status ? { referralStatus: status } : {}) // Filter by status if provided
        .toArray();

      client.close();

      // Return the filtered referrals
      res.status(200).json(referrals);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  } else if (req.method === "PUT") {
    const { referralId, paymentStatus, paymentDate, paymentMode, transactionDetails } = req.body;
  
    // Validate payment data
    if (!referralId || !paymentStatus || !paymentDate || !paymentMode) {
      return res.status(400).json({ message: "Referral ID, payment status, payment date, and payment mode are required." });
    }
  
    try {
      const client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db();
  
      // Generate a unique payment key
      const paymentKey = uuidv4();
  
      // Update the referral with payment details
      const result = await db.collection("referrals").updateOne(
        { referralId }, // Find the referral by referralId
        {
          $set: {
            paymentStatus,
            paymentDate,
            paymentKey, // Store the unique payment key
            paymentMode, // Store the payment mode
            transactionDetails: transactionDetails || "", // Store transaction details (optional)
          },
        }
      );
  
      client.close();
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Referral not found." });
      }
  
      // Return success response with the payment key
      res.status(200).json({
        message: "Payment details updated successfully!",
        paymentKey, // Send the payment key back to the frontend
      });
    } catch (error) {
      console.error("Error updating payment details:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
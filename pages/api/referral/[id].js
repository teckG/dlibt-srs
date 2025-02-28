import { MongoClient } from "mongodb";


export default async function handler(req, res) {
  const { id } = req.query; // Get the referral ID (referralId) from the URL

  if (req.method === "GET") {
    // Handle GET request to fetch referral data
    try {
      // Connect to MongoDB
      const client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db();

      // Find the referral by referralId
      const referral = await db.collection("referrals").findOne({ referralId: id });

      client.close();

      if (!referral) {
        return res.status(404).json({ message: "Referral not found." });
      }

      // Return the referral data
      res.status(200).json(referral);
    } catch (error) {
      console.error("Error connecting to MongoDB or fetching data:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  } else if (req.method === "POST") {
    // Handle POST request to update student data
    const {
      title,
      fullName,
      address,
      contact,
      program,
      session,
      mode,
      dob,
      gender,
      nationality,
      maritalStatus,
    } = req.body;

    // Validate form data
    if (!fullName || !address || !contact || !program) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      // Connect to MongoDB
      const client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db();

      // Update the referral using the referralId
      const result = await db.collection("referrals").updateOne(
        { referralId: id }, // Find the referral by referralId
        {
          $set: {
            studentData: {
              title,
              fullName,
              address,
              contact,
              program,
              session,
              mode,
              dob,
              gender,
              nationality,
              maritalStatus,
            },
          },
        } // Add student data
      );

      // createFormCompletionNotification(referralId, fullName);
      
      client.close();

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Referral not found." });
      }

      // Return success response
      res.status(200).json({ message: "Data submitted successfully!" });
    } catch (error) {
      console.error("Error connecting to MongoDB or updating data:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  } else if (req.method === "PUT") {
    const { status } = req.body; // Get the new status from the request body

    try {
      // Connect to MongoDB
      const client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db();

      // Update the referral using the referralId
      const result = await db.collection("referrals").updateOne(
        { referralId: id }, // Find the referral by referralId
        { $set: { referralStatus: status } } // Update the status
      );

      client.close();

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Referral not found." });
      }

      res.status(200).json({ message: "Status updated successfully!" });
    } catch (error) {
      console.error("Error updating referral status:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
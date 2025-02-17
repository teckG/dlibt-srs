import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.query; // Get the referral ID (UUID) from the URL
    const {title,
        fullName,
        address,
        contact,
        program,
        session,
        mode,
        dob,
        gender,
        nationality,
        maritalStatus, } = req.body;

    // Validate form data
    if (!fullName || !address || !contact || !program) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      // Connect to MongoDB
      const client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db();

      // Update the referral using the UUID
      const result = await db.collection("referrals").updateOne(
        { referralId: id }, // Find the referral by UUID
        { $set: { studentData: {
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
            maritalStatus, } } } // Add student data
      );

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
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}


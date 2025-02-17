import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    // Find the user by email
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      client.close();
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      client.close();
      return res.status(400).json({ message: "Invalid email or password." });
    }

    client.close();

    // Return success response with user data (excluding password)
    const {  ...userData } = user; // Exclude password from the response
    res.status(200).json({ message: "Login successful!", user: userData });
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
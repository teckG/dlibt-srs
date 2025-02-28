import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import validator from "validator";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { fullName, email, password, confirmPassword } = req.body;

  // Validate input fields
  if (!fullName || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address." });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  // Enforce strong password policy
  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({
      message: "Password is not strong enough.",
      suggestion: "Use at least 8 characters, including uppercase, lowercase, numbers, and symbols.",
    });
  }

  let client;
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Connect to MongoDB
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    // Check if the email already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Insert the new user into the "users" collection
    const result = await db.collection("users").insertOne({
      fullName,
      email,
      password: hashedPassword,
      role: "Student", // Default role
      createdAt: new Date(),
    });

    // Return success response
    res.status(201).json({ message: "User created successfully!", userId: result.insertedId });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  } finally {
    // Close the MongoDB connection
    if (client) {
      await client.close();
    }
  }
}
import { useState, useEffect } from "react";
import { useAuth } from "@/pages/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { userEmail } = useAuth(); // Get userEmail from AuthContext
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    role: "",
  });
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile?email=${userEmail}`);
        const data = await response.json();

        if (response.ok) {
          setProfile(data);
          setNewName(data.fullName); // Initialize the name field
        } else {
          setMessage(data.message || "Failed to fetch profile data.");
        }
      } catch (error) {
        setMessage(error +" An error occurred. Please try again.");
      }
    };

    if (userEmail) {
      fetchProfile();
    }
  }, [userEmail]);

  // Handle profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/profile?email=${userEmail}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: newName,
          password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Profile updated successfully!");
        setProfile((prev) => ({ ...prev, fullName: newName })); // Update local state
      } else {
        setMessage(data.message || "Failed to update profile.");
      }
    } catch (error) {
      setMessage(error +" An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Profile
        </h1>

        {/* Display profile information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <Input
              type="email"
              value={profile.email}
              readOnly
              className="mt-1 bg-gray-100 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Role
            </label>
            <Input
              type="text"
              value={profile.role}
              readOnly
              className="mt-1 bg-gray-100 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              New Password
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1"
              placeholder="Leave blank to keep current password"
            />
          </div>
        </div>

        {/* Update button */}
        <Button onClick={handleUpdateProfile} className="mt-6">
          Update Profile
        </Button>

        {/* Message */}
        {message && (
          <p className="mt-4 text-sm text-green-600 dark:text-green-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
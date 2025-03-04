import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react"; // Import icons for loading

export default function ReferralPage() {
  const router = useRouter();
  const { id } = router.query; // Get the referral ID (UUID) from the URL

  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    address: "",
    contact: "",
    program: "",
    session: "",
    mode: "",
    dob: "",
    gender: "",
    nationality: "",
    maritalStatus: "",
  });

  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [referralData, setReferralData] = useState(null); // Store fetched referral data

  // Fetch referral data when the component mounts or the ID changes
  useEffect(() => {
    if (!id) return; // Ensure the ID is available

    const fetchReferralData = async () => {
      try {
        const response = await fetch(`/api/referral/${id}`);
        if (response.ok) {
          const data = await response.json();
          setReferralData(data); // Store the fetched data

          // If studentData exists, pre-fill the form
          if (data.studentData) {
            setFormData(data.studentData);
          }
        } else {
          console.error("Failed to fetch referral data.");
        }
      } catch (error) {
        console.error("Error fetching referral data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchReferralData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send the form data to the backend
      const response = await fetch(`/api/referral/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Data submitted successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to submit data: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    ); // Show loading state
  }

  if (!referralData) {
    return <div className="p-6 text-center">Referral not found.</div>; // Handle case where referral data is not found
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        {/* Left Column - Form */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Student Referral Form</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <Select
                value={formData.title}
                onValueChange={(value) => handleSelectChange("title", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr">Mr</SelectItem>
                  <SelectItem value="Mrs">Mrs</SelectItem>
                  <SelectItem value="Dr">Dr</SelectItem>
                  <SelectItem value="Ms">Ms</SelectItem>
                  <SelectItem value="Prof">Prof</SelectItem>
                  <SelectItem value="Rev">Rev</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Full Name */}
            <Input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            {/* Address */}
            <Input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            {/* Contact Details */}
            <Input
              type="text"
              name="contact"
              placeholder="Contact Details"
              value={formData.contact}
              onChange={handleChange}
              required
            />

            {/* Program */}
            <div>
              <label htmlFor="program" className="block text-sm font-medium mb-2">
                Program
              </label>
              <Select
                value={formData.program}
                onValueChange={(value) => handleSelectChange("program", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bsc Accounting">Bsc Accounting</SelectItem>
                  <SelectItem value="Bsc Marketing">Bsc Marketing</SelectItem>
                  <SelectItem value="Bsc Human Resource Management">Bsc Human Resource Management</SelectItem>
                  <SelectItem value="Bsc Computer Science">Bsc Computer Science</SelectItem>
                  <SelectItem value="Bsc Information & Communication Technology">Bsc Information & Communication Technology</SelectItem>
                  <SelectItem value="Mphil Strategic Management">Mphil Strategic Management</SelectItem>
                  <SelectItem value="Msc Strategic Management">Msc Strategic Management</SelectItem>
                  <SelectItem value="Msc Accounting & Finance">Msc Accounting & Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Session */}
            <div>
              <label htmlFor="session" className="block text-sm font-medium mb-2">
                Session
              </label>
              <Select
                value={formData.session}
                onValueChange={(value) => handleSelectChange("session", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Evening">Evening</SelectItem>
                  <SelectItem value="Weekend">Weekend</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mode */}
            <div>
              <label htmlFor="mode" className="block text-sm font-medium mb-2">
                Mode
              </label>
              <Select
                value={formData.mode}
                onValueChange={(value) => handleSelectChange("mode", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Diploma">Diploma</SelectItem>
                  <SelectItem value="HND">HND</SelectItem>
                  <SelectItem value="WASSCE">WASSCE</SelectItem>
                  <SelectItem value="SSSCE">SSSCE</SelectItem>
                  <SelectItem value="GBCE">GBCE</SelectItem>
                  <SelectItem value="ABCE">ABCE</SelectItem>
                  <SelectItem value="Degree">Degree</SelectItem>
                  <SelectItem value="Mature">Mature</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date of Birth */}
            <label htmlFor="dob" className="block text-sm font-medium mb-2">
              Date of Birth
            </label>
            <Input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium mb-2">
                Gender
              </label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Nationality */}
            <label htmlFor="nationality" className="block text-sm font-medium mb-2">
              Nationality
            </label>
            <Input
              type="text"
              name="nationality"
              placeholder="Nationality"
              value={formData.nationality}
              onChange={handleChange}
              required
            />

            {/* Marital Status */}
            <div>
              <label htmlFor="maritalStatus" className="block text-sm font-medium mb-2">
                Marital Status
              </label>
              <Select
                value={formData.maritalStatus}
                onValueChange={(value) => handleSelectChange("maritalStatus", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Marital Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Divorced">Divorced</SelectItem>
                  <SelectItem value="Widowed">Widowed</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Submit
            </Button>
          </form>
        </div>

        {/* Right Column - Preview Card */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full md:w-1/2">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Preview</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Title</h3>
              <p>{formData.title}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Full Name</h3>
              <p>{formData.fullName}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Address</h3>
              <p>{formData.address}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Contact Details</h3>
              <p>{formData.contact}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Program Applied For</h3>
              <p>{formData.program}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Session</h3>
              <p>{formData.session}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Mode</h3>
              <p>{formData.mode}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Date of Birth</h3>
              <p>{formData.dob}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Gender</h3>
              <p>{formData.gender}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Nationality</h3>
              <p>{formData.nationality}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Marital Status</h3>
              <p>{formData.maritalStatus}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
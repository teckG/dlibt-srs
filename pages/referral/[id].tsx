import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState } from "react";

interface Referral {
  _id: string;
  referrerName: string;
  referrerPhone: string;
  referrerEmail: string;
  referrerRelationship: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  admissionDetails: string;
  referralDate: string;
  referralStatus: string;
  createdAt: string;
}

export default function Referrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    // Fetch referral data from the API
    const fetchData = async () => {
      try {
        const response = await fetch("/api/fetchReferrals");
        if (response.ok) {
          const data = await response.json();
          setReferrals(data);
        } else {
          console.error("Failed to fetch referrals.");
        }
      } catch (error) {
        console.error("Error fetching referrals:", error);
      }
    };

    fetchData();
  }, []);

  const [formData, setFormData] = useState({
    referrerName: "",
    referrerEmail: "",
    referrerPhone: "",
    referrerRelationship: "",
    referrerRelationshipOther: "", // For "Other" option
    studentName: "",
    studentEmail: "",
    studentPhone: "",
    admissionDetails: "",
    referralDate: "",
    referralStatus: "pending", // Default status
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRelationshipChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      referrerRelationship: value,
      referrerRelationshipOther:
        value === "other" ? prev.referrerRelationshipOther : "", // Clear "Other" field if not selected
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare final relationship value
    const finalRelationship =
      formData.referrerRelationship === "other"
        ? formData.referrerRelationshipOther
        : formData.referrerRelationship;

    const referralData = {
      referrerName: formData.referrerName,
      referrerEmail: formData.referrerEmail,
      referrerPhone: formData.referrerPhone,
      referrerRelationship: finalRelationship,
      studentName: formData.studentName,
      studentPhone: formData.studentPhone,
      studentEmail: formData.studentEmail,
      admissionDetails: formData.admissionDetails,
      referralDate: formData.referralDate,
      referralStatus: formData.referralStatus,
    };

    try {
      // Send form data to the API endpoint
      const response = await fetch("/api/referrals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(referralData),
      });

      if (response.ok) {
        console.log("Referral submitted successfully!");
        alert("Referral submitted successfully!");
      } else {
        const errorResponse = await response.json(); // Log the error response
        console.error("Failed to submit referral:", errorResponse);
        alert(`Failed to submit referral: ${errorResponse.message}`); // Use errorResponse here
      }
    } catch (error) {
      console.error("Error submitting referral:", error);
      alert("Error submitting referral.");
    }
  };

  return (
    <div className="p-6 min-h-screen dark:bg-gray-900 flex flex-col lg:flex-row gap-8 px-4 sm:px-8">
      {/* Form Section */}
      <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Referral Management</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Referrer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="referrerName" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Referrer&apos;s Name
              </label>
              <Input
                type="text"
                id="referrerName"
                name="referrerName"
                value={formData.referrerName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="referrerPhone" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Referrer&apos;s Phone
              </label>
              <Input
                type="text"
                id="referrerPhone"
                name="referrerPhone"
                value={formData.referrerPhone}
                onChange={handleChange}
                placeholder="05421789561"
                className="w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="referrerEmail" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Referrer&apos;s Email
              </label>
              <Input
                type="email"
                id="referrerEmail"
                name="referrerEmail"
                value={formData.referrerEmail}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                className="w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="referrerRelationship" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Relationship to Student
              </label>
              <Select
                value={formData.referrerRelationship}
                onValueChange={handleRelationshipChange}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              {formData.referrerRelationship === "other" && (
                <div className="mt-2">
                  <Input
                    type="text"
                    id="referrerRelationshipOther"
                    name="referrerRelationshipOther"
                    value={formData.referrerRelationshipOther}
                    onChange={handleChange}
                    placeholder="Specify relationship"
                    className="w-full"
                    required
                  />
                </div>
              )}
            </div>
          </div>

          {/* Student Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="studentName" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Student Name
              </label>
              <Input
                type="text"
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Jane Smith"
                className="w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="studentEmail" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Student Email
              </label>
              <Input
                type="email"
                id="studentEmail"
                name="studentEmail"
                value={formData.studentEmail}
                onChange={handleChange}
                placeholder="tsatsuc@gmail.com"
                className="w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="studentPhone" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Student Phone
              </label>
              <Input
                type="text"
                id="studentPhone"
                name="studentPhone"
                value={formData.studentPhone}
                onChange={handleChange}
                placeholder="0542178896"
                className="w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="admissionDetails" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Admission Details
              </label>
              <Input
                type="text"
                id="admissionDetails"
                name="admissionDetails"
                value={formData.admissionDetails}
                onChange={handleChange}
                placeholder="e.g., Applied for Computer Science"
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Referral Date */}
          <div>
            <label htmlFor="referralDate" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Referral Date
            </label>
            <Input
              type="date"
              id="referralDate"
              name="referralDate"
              value={formData.referralDate}
              onChange={handleChange}
              className="w-full"
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" 
           className="w-full p-5 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-700 dark:text-white">
            Submit Referral
          </Button>
        </form>
      </div>

      {/* Table Section */}
      <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">History</h1>

        <div className="overflow-x-auto">
          <Table>
            <TableCaption className="text-gray-500 dark:text-gray-400">A list of recent referrals.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Referrer Name</TableHead>
                <TableHead className="text-right">Referral Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral, index) => (
                <TableRow key={referral._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <TableCell className="font-medium">SRS{index + 1}</TableCell>
                  <TableCell>{referral.referralStatus}</TableCell>
                  <TableCell>{referral.studentName}</TableCell>
                  <TableCell>{referral.referrerName}</TableCell>
                  <TableCell className="text-right">
                    {new Date(referral.referralDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
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
import { useAuth } from "@/pages/context/AuthContext"; // Import useAuth
import { Loader2, CheckCircle, XCircle } from "lucide-react"; // Import icons for status

interface Referral {
  _id: string;
  referralId: string;
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
  referralLink?: string;
  paymentKey?: string;
  paymentStatus?: string;
  paymentDate?: string;
}

export default function Referrals() {
  const { userEmail } = useAuth(); // Get the logged-in user's email
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [formData, setFormData] = useState({
    referrerName: "",
    referrerEmail: userEmail || "",
    referrerPhone: "",
    referrerRelationship: "",
    referrerRelationshipOther: "",
    studentName: "",
    studentEmail: "",
    studentPhone: "",
    admissionDetails: "",
    referralDate: new Date().toISOString().split("T")[0], // Autofill with current date
    referralStatus: "pending",
  });
  const [referralLink, setReferralLink] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch referral data for the logged-in user
  useEffect(() => {
    const fetchData = async () => {
      if (!userEmail) return; // Only fetch if userEmail is available

      setIsLoading(true);
      try {
        const response = await fetch(`/api/fetchReferrals?email=${userEmail}`);
        if (response.ok) {
          const data = await response.json();
          setReferrals(data);
        } else {
          console.error("Failed to fetch referrals.");
        }
      } catch (error) {
        console.error("Error fetching referrals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

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
      referrerRelationshipOther: value === "other" ? prev.referrerRelationshipOther : "",
    }));
  };

  const handleAdmissionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      admissionDetails: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setReferralLink("");
    setIsLoading(true);

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
      const response = await fetch("/api/referrals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(referralData),
      });

      const data = await response.json();

      if (response.ok) {
        setReferralLink(data.referralLink);
        // Refetch referral data to update the table
        const fetchData = async () => {
          try {
            const response = await fetch(`/api/fetchReferrals?email=${userEmail}`);
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
      } else {
        setError(data.message || "Failed to submit referral.");
      }
    } catch (error) {
      console.error("Error submitting referral:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen dark:bg-gray-900 flex flex-col lg:flex-row gap-8 px-4 sm:px-8">
      {/* Form Section */}
      <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Referral Management
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        {referralLink && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-800 rounded-lg">
            <p className="text-green-700 dark:text-green-200">
              Referral created! Share this link with the student:{" "}
              <a
                href={referralLink}
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {referralLink}
              </a>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Referrer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="referrerName"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
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
              <label
                htmlFor="referrerPhone"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
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
              <label
                htmlFor="referrerEmail"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
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
                disabled // Disable the email field as it's autofilled
              />
            </div>

            <div>
              <label
                htmlFor="referrerRelationship"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
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
              <label
                htmlFor="studentName"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
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
              <label
                htmlFor="studentEmail"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
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
              <label
                htmlFor="studentPhone"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
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
              <label
                htmlFor="admissionDetails"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                Admission Details
              </label>
              <Select
                value={formData.admissionDetails}
                onValueChange={handleAdmissionChange}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Accounting">Accounting</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Human Resource Management">Human Resource Management</SelectItem>
                  <SelectItem value="Bsc Computer Science">Bsc Computer Science</SelectItem>
                  <SelectItem value="Bsc Information & Communication Technology">Bsc Information & Communication Technology</SelectItem>
                  <SelectItem value="Mphil Strategic Management">Mphil Strategic Management</SelectItem>
                  <SelectItem value="Msc Strategic Management">Msc Strategic Management</SelectItem>
                  <SelectItem value="Msc Accounting & Finance">Msc Accounting & Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Referral Date */}
          <div>
            <label
              htmlFor="referralDate"
              className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
            >
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
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Submit Referral"
            )}
          </Button>
        </form>
      </div>

      {/* Table Section */}
      <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Referral History
        </h1>

        <div className="overflow-x-auto">
          <Table>
            <TableCaption className="text-gray-500 dark:text-gray-400">
              A list of recent referrals.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Referral Link</TableHead>
                <TableHead>Referrer Name</TableHead>
                <TableHead>Referral Date</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Payment Key</TableHead>
                <TableHead>Payment Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral, index) => (
                <TableRow
                  key={referral._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <TableCell className="font-medium">SRS{index + 1}</TableCell>
                  <TableCell>
                    {referral.referralStatus === "admitted" ? (
                      <CheckCircle className="text-green-500" />
                    ) : (
                      <XCircle className="text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>{referral.studentName}</TableCell>
                  <TableCell>
                    <a
                      href={`http://localhost:3000/referral/${referral?.referralId}` || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {referral.referralId?.substring(0, 10)}...
                    </a>
                  </TableCell>
                  <TableCell>{referral.referrerName}</TableCell>
                  <TableCell>
                    {new Date(referral.referralDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{referral.paymentStatus || "Unpaid"}</TableCell>
                  <TableCell className="break-all">
                    {referral.paymentKey || "N/A"}
                  </TableCell>
                  <TableCell>
                    {referral.paymentDate
                      ? new Date(referral.paymentDate).toLocaleDateString()
                      : "N/A"}
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
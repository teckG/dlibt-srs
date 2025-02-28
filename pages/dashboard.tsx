import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User2Icon, UserCheck } from "lucide-react";

// Define the type for a referral
interface Referral {
  referralId: string;
  studentName: string;
  referralStatus: string;
  referrerName: string;
  studentPhone: string;
  studentEmail: string;
  studentData?: {
    gender: string;
    program: string;
    fullName: string;
    contact: string;
    address: string;
  };
}

export default function DashboardPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]); // State to store referrals
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  // Fetch referrals data from MongoDB
  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await fetch("/api/referrals"); // API endpoint to fetch referrals
        if (response.ok) {
          const data = await response.json();
          setReferrals(data); // Set the fetched data
        } else {
          setError("Failed to fetch referrals.");
        }
      } catch (error) {
        setError("An error occurred while fetching referrals.");
        console.error("Error fetching referrals:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchReferrals();
  }, []);

  // Calculate breakdowns
  const admitted = referrals.filter((referral) => referral.referralStatus === "admitted").length;
  const totalReferrals = referrals.length;
  const femaleReferrals = referrals.filter(
    (referral) => referral.studentData?.gender === "female"
  ).length;
  const maleReferrals = referrals.filter(
    (referral) => referral.studentData?.gender === "male"
  ).length;

  // Group referrals by program
  const programCounts = referrals.reduce((acc, referral) => {
    const program = referral.studentData?.program || "Unknown";
    acc[program] = (acc[program] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert program counts to chart data
  const programData = Object.entries(programCounts).map(([program, count]) => ({
    program,
    count,
  }));

  // Separate referrals into registered and unregistered
  const registeredReferrals = referrals.filter((referral) => referral.studentData);
  const unregisteredReferrals = referrals.filter((referral) => !referral.studentData);

  if (loading) {
    return <div className="p-6">Loading...</div>; // Show loading state
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>; // Show error message
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="bg-green-400">
          <CardHeader className="flex flex-row gap-2">
           <User2Icon /> <CardTitle>Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalReferrals}</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-400">
        <CardHeader className="flex flex-row gap-2">
           <UserCheck /> <CardTitle>Total Admitted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{admitted}</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-300">
          <CardHeader>
            <CardTitle>Female Referrals - (Registered)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{femaleReferrals}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-400">
          <CardHeader>
            <CardTitle>Male Referrals - (Registered)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{maleReferrals}</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-300">
          <CardHeader>
            <CardTitle>Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Object.keys(programCounts).length - 1}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Program Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Referrals by Program</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={programData}>
                <XAxis dataKey="program" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gender Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Referrals by Gender</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={[
                  { gender: "Female", count: femaleReferrals },
                  { gender: "Male", count: maleReferrals },
                ]}
              >
                <XAxis dataKey="gender" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Registered Students Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Registered Students</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>List of students who have registered with their details.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registeredReferrals.map((referral) => (
                <TableRow key={referral.referralId}>
                  <TableCell>{referral.studentData?.fullName}</TableCell>
                  <TableCell>{referral.studentData?.contact}</TableCell>
                  <TableCell>{referral.studentData?.address}</TableCell>
                  <TableCell>{referral.studentData?.gender}</TableCell>
                  <TableCell>{referral.studentData?.program}</TableCell>
                  <TableCell>{referral.referralStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Unregistered Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Unregistered Students</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>List of students who have not yet registered.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Referrer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Student&apos;s Phone</TableHead>
                <TableHead>Student&apos;s Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unregisteredReferrals.map((referral) => (
                <TableRow key={referral.referralId}>
                  <TableCell>{referral.studentName}</TableCell>
                  <TableCell>{referral.referrerName}</TableCell>
                  <TableCell>{referral.referralStatus}</TableCell>
                  <TableCell>{referral.studentPhone}</TableCell>
                  <TableCell>{referral.studentEmail}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
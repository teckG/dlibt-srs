import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";


import { Input } from "@/components/ui/input"; // For filter input

// Define the type for a referral
interface Referral {
  referralId: string;
  referrerName: string;
  studentName: string;
  referralStatus: string;
  studentData?: {
    title: string;
    fullName: string;
    address: string;
    contact: string;
    program: string;
    session: string;
    mode: string;
    dob: string;
    gender: string;
    nationality: string;
    maritalStatus: string;
  };
  [key: string]: any; 
}





export default function RegistrarDashboard() {
  const [referrals, setReferrals] = useState<Referral[]>([]); // State to store referrals
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState(0); // Items per page
  const [filter, setFilter] = useState(""); // Filter state
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null); // Sort state

  
  // Fetch referrals data from MongoDB
  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await fetch("/api/referrals"); // API endpoint to fetch referrals
        if (response.ok) {
          const data = await response.json();
          setReferrals(data); // Set the fetched data
          setItemsPerPage(5);
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

  // Function to handle status change
  const handleStatusChange = async (referralId: string, newStatus: string) => {
    try {
      // Update status in MongoDB
      const response = await fetch(`/api/referral/${referralId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update the local state if the API call succeeds
        setReferrals((prev) =>
          prev.map((referral) =>
            referral.referralId === referralId
              ? { ...referral, referralStatus: newStatus }
              : referral
          )
        );
      } else {
        setError("Failed to update status.");
      }
    } catch (error) {
      setError("An error occurred while updating status.");
      console.error("Error updating status:", error);
    }
  };

  // Function to handle sorting
  const handleSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Function to handle filtering
  const filteredReferrals = referrals.filter((referral) =>
    referral.studentName.toLowerCase().includes(filter.toLowerCase())
  );

  // Function to handle sorting
  const sortedReferrals = filteredReferrals.sort((a, b) => {
    if (sortConfig) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReferrals = sortedReferrals.slice(indexOfFirstItem, indexOfLastItem);

  // Function to change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="p-6">Loading...</div>; // Show loading state
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>; // Show error message
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Registrar Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* Pending Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Pending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {referrals.filter((r) => r.referralStatus === "pending").length}
          </p>
        </CardContent>
      </Card>

      {/* In Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            In Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {referrals.filter((r) => r.referralStatus === "inProgress").length}
          </p>
        </CardContent>
      </Card>

      {/* Admitted Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Admitted
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {referrals.filter((r) => r.referralStatus === "admitted").length}
          </p>
        </CardContent>
      </Card>
    </div>


      {/* Filter and Sort Section */}
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Filter by student name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-1/2"
        />
        <Button onClick={() => handleSort("studentName")}>
          Sort by Student Name {sortConfig?.direction === "ascending" ? "↑" : "↓"}
        </Button>
      </div>

      {/* Referrals Table */}
      <Table>
        <TableCaption>List of Referrals</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Referrer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentReferrals.map((referral) => (
            <TableRow key={referral.referralId}>
              <TableCell>{referral.studentName}</TableCell>
              <TableCell>{referral.referrerName}</TableCell>
              <TableCell>
                {/* Status with styling */}
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    referral.referralStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : referral.referralStatus === "inProgress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {referral.referralStatus}
                </span>
              </TableCell>
              <TableCell>
                {/* Dropdown to change status */}
                <Select
                  value={referral.referralStatus}
                  onValueChange={(value) => handleStatusChange(referral.referralId, value)}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="admitted">Admitted</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {/* Button to view referral details */}
                <Button
                  variant="outline"
                  onClick={() => {
                    // Navigate to referral details page
                    window.location.href = `/referral/${referral.referralId}`;
                  }}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        {Array.from({ length: Math.ceil(sortedReferrals.length / itemsPerPage) }, (_, i) => (
          <Button
            key={i + 1}
            variant={currentPage === i + 1 ? "default" : "outline"}
            onClick={() => paginate(i + 1)}
            className="mx-1"
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}
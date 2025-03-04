import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
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
import { withAuth } from "./hoc/withAuth";
import { Loader2, ArrowUpDown, Search, CheckCircle, XCircle } from "lucide-react"; // Import icons
import { Card } from "@/components/ui/card";

// Define the type for a referral
interface Referral {
  referralId: string;
  studentName: string;
  referralStatus: string;
  referrerName: string;
  referrerEmail: string;
  referrerPhone: string;
  paymentStatus?: string;
  paymentDate?: string;
  paymentKey?: string;
  paymentMode?: string;
  transactionDetails?: string;
}

function FinanceDashboard() {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [admittedReferrals, setAdmittedReferrals] = useState<Referral[]>([]); // State to store admitted referrals
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [paymentStatus, setPaymentStatus] = useState(""); // State for payment status
  const [paymentDate, setPaymentDate] = useState(""); // State for payment date
  const [paymentMode, setPaymentMode] = useState(""); // State for payment mode
  const [transactionDetails, setTransactionDetails] = useState(""); // State for transaction details
  const [selectedReferralId, setSelectedReferralId] = useState(""); // State for selected referral ID
  const [sortBy, setSortBy] = useState("studentName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [itemsPerPage, setItemsPerPage] = useState(10); // State for items per page

  // Fetch admitted referrals data from MongoDB
  useEffect(() => {
    const fetchAdmittedReferrals = async () => {
      try {
        const response = await fetch("/api/referrals?status=admitted"); // Fetch only admitted referrals
        if (response.ok) {
          const data = await response.json();
          setAdmittedReferrals(data); // Set the fetched data
        } else {
          setError("Failed to fetch admitted referrals.");
        }
      } catch (error) {
        setError("An error occurred while fetching admitted referrals.");
        console.error("Error fetching admitted referrals:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchAdmittedReferrals();
  }, []);

  // Sorting function
  const sortedReferrals = [...admittedReferrals].sort((a, b) => {
    const valueA = a[sortBy as keyof Referral] || "";
    const valueB = b[sortBy as keyof Referral] || "";
    return sortOrder === "asc"
      ? String(valueA).localeCompare(String(valueB))
      : String(valueB).localeCompare(String(valueA));
  });

  // Filtering and Searching
  const filteredReferrals = sortedReferrals.filter((referral) => {
    const matchesSearch =
      referral.studentName.toLowerCase().includes(searchQuery.toLowerCase());
  
    const matchesStatus =
      filterStatus === "" || // If no filter is selected, include all
      (filterStatus === "Paid" && referral.paymentStatus === "Paid") || // Match "Paid"
      (filterStatus === "Unpaid" && (!referral.paymentStatus || referral.paymentStatus === "Unpaid")); // Match "Unpaid" or null/undefined
  
    return matchesSearch && matchesStatus;
  });

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    if (!selectedReferralId || !paymentStatus || !paymentDate || !paymentMode) {
      setError("Please fill in all payment details.");
      return;
    }

    try {
      const response = await fetch("/api/referrals", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referralId: selectedReferralId,
          paymentStatus,
          paymentDate,
          paymentMode,
          transactionDetails,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Payment details updated successfully! Payment Key: ${data.paymentKey}`);

        // Refresh the list of admitted referrals
        const updatedResponse = await fetch("/api/referrals?status=admitted");
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setAdmittedReferrals(updatedData);
        }
      } else {
        setError("Failed to update payment details.");
      }
    } catch (error) {
      setError("An error occurred while updating payment details.");
      console.error("Error updating payment details:", error);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReferrals.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    ); // Show loading state
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>; // Show error message
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Finance Dashboard</h1>

      {/* Search and Filter Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by student name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
        name="filterStatus"
        title="Filter by Payment Status"
  value={filterStatus}
  onChange={(e) => setFilterStatus(e.target.value)}
  className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
>
  <option value="">All</option>
  <option value="Paid">Paid</option>
  <option value="Unpaid">Unpaid</option>
</select>
        <Button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="flex items-center gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          Sort by {sortBy === "studentName" ? "Student Name" : "Payment Status"}
        </Button>
      </div>

      {/* Admitted Referrals Table */}
      <Card className="mb-6 p-6">
        <Table>
          <TableCaption>List of Admitted Students and Their Referrers</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Referrer Name</TableHead>
              <TableHead>Referrer Email</TableHead>
              <TableHead>Referrer Phone</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Payment Key</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((referral) => (
              <TableRow key={referral.referralId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <TableCell>{referral.studentName}</TableCell>
                <TableCell>{referral.referrerName}</TableCell>
                <TableCell>{referral.referrerEmail}</TableCell>
                <TableCell>{referral.referrerPhone}</TableCell>
                <TableCell>
                  {referral.paymentStatus === "Paid" ? (
                    <CheckCircle className="text-green-500" />
                  ) : (
                    <XCircle className="text-red-500" />
                  )}
                </TableCell>
                <TableCell>{referral.paymentKey || "N/A"}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => setSelectedReferralId(referral.referralId)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Update Payment
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: Math.ceil(filteredReferrals.length / itemsPerPage) }).map((_, index) => (
          <Button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            variant={currentPage === index + 1 ? "default" : "outline"}
          >
            {index + 1}
          </Button>
        ))}
      </div>

      {/* Payment Form */}
      {selectedReferralId && (
        <Card className="mt-6 p-6">
          <h2 className="text-xl font-bold mb-4">Update Payment Details</h2>
          <div className="space-y-4">
            {/* Payment Status Dropdown */}
            <div className="space-y-2">
              <label className="block font-medium">Payment Status</label>
              <select
              title="Select Payment Status"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select Payment Status</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            {/* Payment Date Input */}
            <Input
              type="date"
              placeholder="Payment Date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />

            {/* Payment Mode Dropdown */}
            <div className="space-y-2">
              <label className="block font-medium">Payment Mode</label>
              <select
              title="Select Payment Mode"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select Payment Mode</option>
                <option value="Mobile Money">Mobile Money</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            {/* Transactional Details Input */}
            {paymentMode === "Mobile Money" && (
              <Input
                type="text"
                placeholder="Mobile Money Number"
                value={transactionDetails}
                onChange={(e) => setTransactionDetails(e.target.value)}
              />
            )}
            {paymentMode === "Cheque" && (
              <Input
                type="text"
                placeholder="Check Number"
                value={transactionDetails}
                onChange={(e) => setTransactionDetails(e.target.value)}
              />
            )}
            {paymentMode === "Cash" && (
              <Input
                type="text"
                placeholder="Cash Receipt Details"
                value={transactionDetails}
                onChange={(e) => setTransactionDetails(e.target.value)}
              />
            )}

            {/* Submit Button */}
            <Button onClick={handlePaymentSubmit} className="w-full bg-green-600 hover:bg-green-700">
              Submit Payment
            </Button>
          </div>
        </Card>
      )}

      {/* Finance History Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Finance History</h2>
        <Card className="p-6">
          <Table>
            <TableCaption>Payment Transactions</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Referrer Name</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Transaction Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admittedReferrals
                .filter((referral) => referral.paymentStatus === "Paid") // Show only paid referrals
                .map((referral) => (
                  <TableRow key={referral.referralId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <TableCell>{referral.referrerName}</TableCell>
                    <TableCell>{referral.studentName}</TableCell>
                    <TableCell>
                      <CheckCircle className="text-green-500" />
                    </TableCell>
                    <TableCell>{referral.paymentDate}</TableCell>
                    <TableCell>{referral.paymentMode}</TableCell>
                    <TableCell>{referral.transactionDetails}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
      </section>
    </div>
  );
}

export default withAuth(FinanceDashboard, ["Admin", "Finance"]);
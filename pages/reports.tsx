import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as XLSX from "xlsx"; // For Excel export
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"; // For PDF export
import {  FileText, FileSpreadsheet, Loader2 } from "lucide-react"; // Import icons

// Define the type for a referral
interface Referral {
  referralId: string;
  studentName: string;
  referralStatus: string;
  studentData?: {
    gender: string;
    program: string;
  };
}

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
    flex: 1,
  },
});

// Create a PDF document
const MyDocument = ({ referrals }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Student Name</Text>
          <Text style={styles.tableCell}>Status</Text>
          <Text style={styles.tableCell}>Gender</Text>
          <Text style={styles.tableCell}>Program</Text>
        </View>
        {referrals.map((referral) => (
          <View style={styles.tableRow} key={referral.referralId}>
            <Text style={styles.tableCell}>{referral.studentName}</Text>
            <Text style={styles.tableCell}>{referral.referralStatus}</Text>
            <Text style={styles.tableCell}>{referral.studentData?.gender || "N/A"}</Text>
            <Text style={styles.tableCell}>{referral.studentData?.program || "N/A"}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default function Reports() {
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

  // Generate Excel file
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(referrals);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Referrals");
    XLSX.writeFile(workbook, "referrals.xlsx");
  };

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
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Reports Dashboard</h1>

      {/* Download Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Button onClick={exportToExcel} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
          <FileSpreadsheet className="h-4 w-4" />
          Download as Excel
        </Button>
        <PDFDownloadLink
          document={<MyDocument referrals={referrals} />}
          fileName="referrals.pdf"
        >
          {({ loading }) => (
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700" disabled={loading}>
              <FileText className="h-4 w-4" />
              {loading ? "Generating PDF..." : "Download as PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      {/* Reports Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Referrals Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Table id="reports-table">
            <TableCaption>List of referrals.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Program</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral) => (
                <TableRow key={referral.referralId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <TableCell>{referral.studentName}</TableCell>
                  <TableCell>{referral.referralStatus}</TableCell>
                  <TableCell>{referral.studentData?.gender || "N/A"}</TableCell>
                  <TableCell>{referral.studentData?.program || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Additional Reports */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Referrals by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Referrals by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {["pending", "inProgress", "admitted"].map((status) => (
                  <TableRow key={status}>
                    <TableCell>{status}</TableCell>
                    <TableCell>
                      {referrals.filter((r) => r.referralStatus === status).length}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Referrals by Gender */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Referrals by Gender</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gender</TableHead>
                  <TableHead>Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {["male", "female"].map((gender) => (
                  <TableRow key={gender}>
                    <TableCell>{gender}</TableCell>
                    <TableCell>
                      {referrals.filter((r) => r.studentData?.gender === gender).length}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Referrals by Program */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Referrals by Program</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from(
                  new Set(referrals.map((r) => r.studentData?.program || "Unknown"))
                ).map((program) => (
                  <TableRow key={program}>
                    <TableCell>{program}</TableCell>
                    <TableCell>
                      {referrals.filter((r) => r.studentData?.program === program).length}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
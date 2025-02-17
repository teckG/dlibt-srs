import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function FinanceDashboard() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const referrals = [
    { id: 1, studentName: "John Doe", source: "Registrar", status: "Admitted" },
    { id: 2, studentName: "Jane Smith", source: "Student", status: "Pending" },
  ];

  const filteredReferrals = referrals.filter(
    (referral) =>
      (filterStatus === "all" || referral.status === filterStatus) &&
      referral.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Finance Dashboard</h1>

      {/* Filters and Search */}
      <div className="flex gap-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
          title="status"
        >
          <option value="all">All</option>
          <option value="Admitted">Admitted</option>
          <option value="Pending">Pending</option>
        </select>
        <Input
          type="text"
          placeholder="Search by student name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
      </div>

      {/* Referrals Table */}
      <Table>
        <TableCaption>List of Referrals</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReferrals.map((referral) => (
            <TableRow key={referral.id}>
              <TableCell>{referral.studentName}</TableCell>
              <TableCell>{referral.source}</TableCell>
              <TableCell>{referral.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
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

export default function RegistrarDashboard() {
  const referrals = [
    { id: 1, studentName: "John Doe", referrer: "Parent", status: "Pending" },
    { id: 2, studentName: "Jane Smith", referrer: "Teacher", status: "Admitted" },
  ];

  const summary = {
    pending: referrals.filter((r) => r.status === "Pending").length,
    inProgress: referrals.filter((r) => r.status === "In Progress").length,
    admitted: referrals.filter((r) => r.status === "Admitted").length,
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Registrar Dashboard</h1>

      {/* Summary Section */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-100 rounded">
          <h3 className="font-bold">Pending</h3>
          <p>{summary.pending}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded">
          <h3 className="font-bold">In Progress</h3>
          <p>{summary.inProgress}</p>
        </div>
        <div className="p-4 bg-green-100 rounded">
          <h3 className="font-bold">Admitted</h3>
          <p>{summary.admitted}</p>
        </div>
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals.map((referral) => (
            <TableRow key={referral.id}>
              <TableCell>{referral.studentName}</TableCell>
              <TableCell>{referral.referrer}</TableCell>
              <TableCell>{referral.status}</TableCell>
              <TableCell>
                <Button variant="outline">Follow Up</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
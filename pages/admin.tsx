import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { withAuth } from "./hoc/withAuth";

// Define the User type
type User = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
};

 function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState("");

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle role update confirmation
  const handleRoleUpdateConfirmation = (user: User, role: string) => {
    setSelectedUser(user);
    setNewRole(role);
    setIsModalOpen(true);
  };

  // Perform the role update
  const handleRoleUpdate = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/users/${selectedUser._id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json(); // Parse the response

      if (!response.ok) {
        throw new Error(data.message || "Failed to update role");
      }

      // Update the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? { ...user, role: newRole } : user
        )
      );

      // Close the modal
      setIsModalOpen(false);

      console.log("Role updated successfully:", data);
    } catch (error) {
      console.error("Error updating role:", error);
      alert(`Error updating role: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  // Normalize role values
  const normalizeRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  // Filter users based on search query and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      selectedRole === "All" ||
      normalizeRole(user.role) === normalizeRole(selectedRole);

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Admin Dashboard</h1>

      {/* Quick Links */}
      <div className="flex gap-4 mb-6">
        <Link href="/finance">
          <Button variant="link" className="text-blue-500 hover:underline">
            Finance Dashboard
          </Button>
        </Link>
        <Link href="/registrar">
          <Button variant="link" className="text-blue-500 hover:underline">
            Registrar Dashboard
          </Button>
        </Link>
      </div>

      {/* User Management */}
      <Card >
        <CardHeader>
          <CardTitle className="text-xl font-bold">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Roles</SelectItem>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Registrar">Registrar</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={normalizeRole(user.role)}
                      onValueChange={(value) => handleRoleUpdateConfirmation(user, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Registrar">Registrar</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    
                    <Button variant="ghost" className="text-red-500" onClick={() => console.log("Delete user:", user._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Active Users: {users.length}</p>
          <p className="text-sm">Recent Activity: 5 minutes ago</p>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle>Confirm Role Update</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Are you sure you want to change {selectedUser.fullName}&apos;s role to {newRole}?
              </p>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button onClick={handleRoleUpdate}>Confirm</Button>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

export default withAuth(AdminDashboard, ["Admin"]);
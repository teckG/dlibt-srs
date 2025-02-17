import Link from "next/link";

export default function AdminDashboard() {
  const users = [
    { id: 1, name: "John Doe", role: "Registrar" },
    { id: 2, name: "Jane Smith", role: "Finance" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Quick Links */}
      <div className="flex gap-4 mb-6">
        <Link href="/finance" className="text-blue-500 hover:underline">
          Finance Dashboard
        </Link>
        <Link href="/registrar" className="text-blue-500 hover:underline">
          Registrar Dashboard
        </Link>
      </div>

      {/* User Management */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">User Management</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id} className="mb-2">
              {user.name} - {user.role}
            </li>
          ))}
        </ul>
      </div>

      {/* System Health */}
      <div>
        <h2 className="text-xl font-bold mb-4">System Health</h2>
        <p>Active Users: 10</p>
        <p>Recent Activity: 5 minutes ago</p>
      </div>
    </div>
  );
}
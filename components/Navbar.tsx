import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex gap-2 items-center">
          <Image
            src="/datalinklogo.png"
            alt="App Logo"
            width={40}
            height={40}
            className="dark:invert"
          />{" "}
          DLIBT SRS
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/referrals">Referrals</Link>
          <Link href="/notifications">Notifications</Link>
          <Link href="/reports">Reports</Link>
          <Link href="/finance">finance</Link>
          <Link href="/student">student</Link>
          <Link href="/admin">admin</Link>
          <Link href="/signup">Signup</Link>
          <Link href="/login">Login</Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "@/pages/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, Menu, X } from "lucide-react"; // Import icons
import { useState, useEffect, useRef } from "react";

export function Navbar() {
  const router = useRouter();
  const { userRole, isLoading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // Ref for the menu

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Close the menu when a link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Show a loading indicator while initializing
  if (isLoading) {
    return (
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900 shadow-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold flex gap-2 items-center text-white">
            <Image
              src="/datalinklogo.png"
              alt="App Logo"
              width={40}
              height={40}
              className="dark:invert"
            />
            DLIBT SRS
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white">Loading...</span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900 shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and text hidden on small screens, visible on medium and larger */}
        <Link
          href="/home"
          className="hidden lg:flex text-xl font-bold gap-2 items-center text-white hover:text-gray-200 transition-colors"
        >
          <Image
            src="/datalinklogo.png"
            alt="App Logo"
            width={40}
            height={40}
            className="dark:invert"
          />
          DLIBT SRS
        </Link>

        {/* Hamburger button visible on small and medium screens */}
        <button
          className="lg:hidden text-white hover:text-gray-200 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Navigation links */}
        <div
          ref={menuRef} // Attach ref to the menu
          className={`${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-64 lg:w-auto bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900 shadow-lg lg:shadow-none lg:bg-transparent p-4 lg:p-0 transition-transform duration-300 ease-in-out z-50`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4 space-y-2 lg:space-y-0">
            {/* Public Links */}
            <Link
              href="/home"
              className="block px-2 py-2 lg:p-0 text-white hover:text-gray-200 transition-colors"
              onClick={handleLinkClick}
            >
              🏠 Home
            </Link>

            {/* Role-Based Links */}
            {userRole === "Admin" && (
              <>
                <Link
                  href="/dashboard"
                  className="block px-2 py-2 lg:p-0 text-white hover:text-gray-200 transition-colors"
                  onClick={handleLinkClick}
                >
                  📊 Dashboard
                </Link>
                <Link
                  href="/referrals"
                  className="block px-2 py-2 lg:p-0 text-white hover:text-gray-200 transition-colors"
                  onClick={handleLinkClick}
                >
                  🔗 Referrals
                </Link>
                <Link
                  href="/reports"
                  className="block px-2 py-2 lg:p-0 text-white hover:text-gray-200 transition-colors"
                  onClick={handleLinkClick}
                >
                  📈 Reports
                </Link>
                <Link
                  href="/admin"
                  className="block px-2 py-2 lg:p-0 text-white hover:text-gray-200 transition-colors"
                  onClick={handleLinkClick}
                >
                  🛠️ Admin
                </Link>
                <Link
                  href="/registrar"
                  className="block px-2 py-2 lg:p-0 text-white hover:text-gray-200 transition-colors"
                  onClick={handleLinkClick}
                >
                  📚 Registrar
                </Link>
              </>
            )}

            {userRole === "Registrar" && (
              <Link
                href="/registrar"
                className="block px-2 py-2 lg:p-0 text-white hover:text-gray-200 transition-colors"
                onClick={handleLinkClick}
              >
                📚 Registrar
              </Link>
            )}

            {(userRole === "Admin" || userRole === "Finance") && (
              <Link
                href="/finance"
                className="block px-2 py-2 lg:p-0 text-white hover:text-gray-200 transition-colors"
                onClick={handleLinkClick}
              >
                💰 Finance
              </Link>
            )}

            {userRole === "Student" && (
              <Link
                href="/referrals"
                className="block px-2 py-2 lg:p-0 text-white hover:text-gray-200 transition-colors"
                onClick={handleLinkClick}
              >
                🔗 Referrals
              </Link>
            )}

            {/* Notifications Link (Visible to all authenticated users) */}
            {userRole && (
              <Link
                href="/notifications"
                className="block px-2 py-2 lg:p-0 text-white hover:text-gray-200 transition-colors"
                onClick={handleLinkClick}
              >
                🔔 Notifications
              </Link>
            )}

            {/* Authentication Links */}
            {!userRole ? (
              <>
                <Link
                  href="/signup"
                  className="block px-2 py-2 lg:p-0 text-white hover:text-gray-200 transition-colors"
                  onClick={handleLinkClick}
                >
                  ✍️ Signup
                </Link>
                <Link
                  href="/login"
                  className="block px-2 py-2 lg:p-0 text-white hover:text-gray-200 transition-colors"
                  onClick={handleLinkClick}
                >
                  🔐 Login
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-white hover:text-gray-200 transition-colors"
                  >
                    <User className="h-5 w-5" /> {/* User icon */}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white dark:bg-gray-800"
                >
                  <DropdownMenuItem>
                    <Link
                      href="/profile"
                      className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      👤 Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    🚪 Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
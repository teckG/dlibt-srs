import { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  userRole: string | null;
  userEmail: string | null; // Add userEmail
  isLoading: boolean;
  login: (role: string, email: string) => void; // Accept email
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  userRole: null,
  userEmail: null, // Initialize userEmail
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null); // Add userEmail state
  const [isLoading, setIsLoading] = useState(true);

  // Initialize userRole and userEmail from localStorage on component mount
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");
    if (role && email) {
      setUserRole(role);
      setUserEmail(email);
    }
    setIsLoading(false);
  }, []);

  const login = (role: string, email: string) => {
    localStorage.setItem("userRole", role);
    localStorage.setItem("userEmail", email); // Store email
    setUserRole(role);
    setUserEmail(email); // Update state
  };

  const logout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail"); // Clear email
    setUserRole(null);
    setUserEmail(null); // Clear state
  };

  return (
    <AuthContext.Provider value={{ userRole, userEmail, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
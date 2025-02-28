import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Navbar } from "@/components/Navbar"; // Import the Navbar
import "../styles/globals.css";
import { AuthProvider } from "./context/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
      {/* Add the Navbar here */}
      <Navbar />
      {/* Render the page component */}
      <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
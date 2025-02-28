import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  // Redirect to the login page when the home page loads
  useEffect(() => {
    router.push("/login");
  }, []);

  return null; // Render nothing since we're redirecting
}
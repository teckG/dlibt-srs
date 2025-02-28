import { useEffect } from "react";
import { useRouter } from "next/router";

export function withAuth(Component: React.ComponentType, allowedRoles: string[]) {
return function ProtectedRoute(props: React.ComponentProps<typeof Component>) {
    const router = useRouter();

    useEffect(() => {
      const role = localStorage.getItem("userRole");

      // Redirect to login if the user is not authenticated
      if (!role) {
        router.push("/login");
        return;
      }

      // Redirect to home if the user's role is not allowed
      if (!allowedRoles.includes(role)) {
        router.push("/home");
      }
    }, []);

    return <Component {...props} />;
  };
}
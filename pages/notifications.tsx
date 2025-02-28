import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/pages/context/AuthContext"; // Import useAuth to get the logged-in user

// Define the type for a notification
interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export default function Notifications() {
  const { userEmail } = useAuth(); // Get the logged-in user's email
  const [notifications, setNotifications] = useState<Notification[]>([]); // State to store notifications
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  // Fetch notifications from the database
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/notifications?email=${userEmail}`); // Fetch notifications for the logged-in user
        if (response.ok) {
          const data = await response.json();
          setNotifications(data); // Set the fetched data
        } else {
          setError("Failed to fetch notifications.");
        }
      } catch (error) {
        setError("An error occurred while fetching notifications.");
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (userEmail) {
      fetchNotifications();
    }
  }, [userEmail]);

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
      });

      if (response.ok) {
        // Update the local state
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id
              ? { ...notification, isRead: true }
              : notification
          )
        );
      } else {
        setError("Failed to mark notification as read.");
      }
    } catch (error) {
      setError("An error occurred while marking notification as read.");
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch(`/api/notifications/read-all?email=${userEmail}`, {
        method: "PUT",
      });

      if (response.ok) {
        // Update the local state
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, isRead: true }))
        );
      } else {
        setError("Failed to mark all notifications as read.");
      }
    } catch (error) {
      setError("An error occurred while marking all notifications as read.");
      console.error("Error marking all notifications as read:", error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading notifications...</div>; // Show loading state
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>; // Show error message
  }

  return (
    <div className="p-6 min-h-screen dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Notifications
      </h1>

      {/* Mark All as Read Button */}
      <div className="mb-6">
        <Button onClick={markAllAsRead}>Mark All as Read</Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`${
              notification.isRead
                ? "bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-700"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{notification.title}</span>
                {!notification.isRead && (
                  <Badge variant="secondary">New</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                {notification.message}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {new Date(notification.timestamp).toLocaleString()}
              </p>
              {!notification.isRead && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as Read
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
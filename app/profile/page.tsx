"use client";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p className="mb-4">You need to sign in to view your profile.</p>
        <Link href="/" className="underline text-orange-600">
          Return home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hi, {user.name}</h1>
        <p className="text-gray-600">Welcome to your dashboard.</p>
      </div>
      <div className="grid gap-4">
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h2 className="font-semibold mb-2 text-lg">Account Info</h2>
          <ul className="text-sm space-y-1">
            <li>
              <span className="font-medium">Email:</span> {user.email}
            </li>
            {user.phone && (
              <li>
                <span className="font-medium">Phone:</span> {user.phone}
              </li>
            )}
            {user.city && (
              <li>
                <span className="font-medium">City:</span> {user.city}
              </li>
            )}
            {user.country && (
              <li>
                <span className="font-medium">Country:</span> {user.country}
              </li>
            )}
            {user.pincode && (
              <li>
                <span className="font-medium">Pincode:</span> {user.pincode}
              </li>
            )}
            <li>
              <span className="font-medium">Role:</span> {user.role}
            </li>
            {user.userType && (
              <li>
                <span className="font-medium">User Type:</span>{" "}
                {user.userType.join(", ")}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

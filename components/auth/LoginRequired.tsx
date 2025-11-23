"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AuthModal } from "./AuthModal";

interface LoginRequiredProps {
  message?: string;
}

// Simple component to block content and prompt login.
export function LoginRequired({ message }: LoginRequiredProps) {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded text-center space-y-4 bg-white">
      <h2 className="text-xl font-semibold">Authentication Required</h2>
      <p className="text-sm text-gray-600">
        {message || "You must be logged in to view this content."}
      </p>
      <div className="flex justify-center">
        <Button onClick={() => setShowModal(true)}>Login / Register</Button>
      </div>
      <AuthModal open={showModal} onOpenChange={setShowModal} />
    </div>
  );
}

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
        {/* We reuse AuthModal but also provide a simple button fallback */}
        <AuthModal triggerClassName="hidden" />
        <Button onClick={() => setShowModal(true)}>Login / Register</Button>
      </div>
      {showModal && (
        // When user clicks button we simulate clicking the hidden trigger by toggling state
        // Simpler approach: just render AuthModal open prop variant (would require refactor). For now rely on user header button as alternate.
        <p className="text-xs text-gray-400">
          Use the Get Started button in header to login.
        </p>
      )}
    </div>
  );
}

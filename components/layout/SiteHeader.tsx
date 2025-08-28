"use client";
import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";
import Link from "next/link";

export function SiteHeader() {
  return (
    <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <PawPrint className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">PetSetu</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/#features"
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Features
            </Link>
            {/* <Link
              href="/#search"
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Search
            </Link> */}
            <Link
              href="/#care"
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Pet Care
            </Link>
            <Link
              href="/search"
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Browse Pets
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden sm:inline-flex">
              Sign In
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

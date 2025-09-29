"use client";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { LogOut, PawPrint } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SiteHeader() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out", description: "See you soon!" });
    router.push("/");
  };
  return (
    <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <PawPrint className="h-8 w-8 text-orange-500" />
              <span className="text-2xl  text-gray-900">
                <span className="text-orange-500 font-bold">Pet</span>Setu
              </span>
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
          <div className="flex items-center space-x-3">
            {/* Login/Signup - text-like button on the left */}
            {!user && (
              <AuthModal
                triggerClassName="hidden sm:inline-flex bg-transparent hover:bg-transparent px-0 h-auto shadow-none text-gray-700 hover:text-orange-600 underline-offset-4 hover:underline"
                triggerLabel="Login/Signup"
              />
            )}

            {/* Place Free Ad - prominent CTA on the right */}
            {!user ? (
              // If not logged in, clicking this should open auth modal
              <AuthModal
                triggerClassName="hidden sm:inline-flex bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md shadow-orange-200"
                triggerLabel="Place Free Ad"
              />
            ) : (
              // If logged in, navigate to profile (placeholder for ad creation)
              <Button
                className="hidden sm:inline-flex bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md shadow-orange-200"
                onClick={() => router.push("/profile")}
              >
                Place Free Ad
              </Button>
            )}

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <span className="inline-block h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-semibold">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </span>
                    <span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">
                      {user.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1 text-xs text-gray-500">
                    Signed in as
                  </div>
                  <div className="px-2 pb-2 text-sm font-medium truncate">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

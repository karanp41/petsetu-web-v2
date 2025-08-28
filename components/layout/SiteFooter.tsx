import { PawPrint } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <PawPrint className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold text-white">PetSetu</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Connecting loving families with pets in need of forever homes.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">For Pet Lovers</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/search"
                  className="hover:text-orange-400 transition-colors"
                >
                  Browse Pets
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="hover:text-orange-400 transition-colors"
                >
                  Adoption Process
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="hover:text-orange-400 transition-colors"
                >
                  Pet Care Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">For Pet Owners</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#"
                  className="hover:text-orange-400 transition-colors"
                >
                  List Your Pet
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="hover:text-orange-400 transition-colors"
                >
                  Breeder Registration
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="hover:text-orange-400 transition-colors"
                >
                  Safety Tips
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#"
                  className="hover:text-orange-400 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="hover:text-orange-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="hover:text-orange-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} PetSetu. All rights reserved. Made with
            ❤️ for pets and their families.
          </p>
        </div>
      </div>
    </footer>
  );
}

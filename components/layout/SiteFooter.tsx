import { Facebook, Instagram, Linkedin, PawPrint } from "lucide-react";
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
            {/* Social links */}
            <div className="flex items-center gap-4 mt-5">
              <Link
                href="https://www.facebook.com/petsetu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PetSetu on Facebook"
                className="text-gray-400 hover:text-orange-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 rounded"
              >
                <Facebook className="h-6 w-6" />
              </Link>
              <Link
                href="https://www.instagram.com/petsetu/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PetSetu on Instagram"
                className="text-gray-400 hover:text-orange-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 rounded"
              >
                <Instagram className="h-6 w-6" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/petsetu/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PetSetu on LinkedIn"
                className="text-gray-400 hover:text-orange-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 rounded"
              >
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
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
                  href="mailto:petsetu@gmail.com"
                  className="hover:text-orange-400 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-orange-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
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

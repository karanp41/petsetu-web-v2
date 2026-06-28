import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Community Guidelines",
    description:
        "Read the Community Guidelines that define safe, ethical, and respectful behavior for PetSetu users.",
};

export default function CommunityGuidelinesPage() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        PetSetu Community Guidelines
                    </h1>
                    <p className="text-gray-600 mt-3">
                        These guidelines are designed to keep the PetSetu community safe,
                        trustworthy, and welcoming for pet owners, adopters, breeders,
                        shelters, NGOs, and pet enthusiasts.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Version 1.0.0 · Effective Date: 28th June, 2026 · Last Updated: 28th
                        June, 2026
                    </p>
                </header>

                <div className="space-y-10">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900">Introduction</h2>
                        <p className="text-gray-700 mt-3">
                            Welcome to the PetSetu community. By using PetSetu, you agree to
                            follow these guidelines and help maintain a safe and positive
                            experience for everyone.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
                        <p className="text-gray-700 mt-3">
                            PetSetu aims to build a responsible ecosystem for pet adoption,
                            ethical breeding, pet care awareness, community engagement, and
                            safe, transparent pet listings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900">Respectful Behavior</h2>
                        <p className="text-gray-700 mt-3">
                            All users must treat others with respect, communicate honestly,
                            avoid harassment or threats, and refrain from discriminatory or
                            abusive conduct.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900">Animal Welfare Standards</h2>
                        <p className="text-gray-700 mt-3">
                            PetSetu is committed to animal welfare. Users must provide humane
                            care, accurate health information, and follow applicable animal
                            welfare laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900">Responsible Breeding</h2>
                        <p className="text-gray-700 mt-3">
                            Breeders must follow ethical practices, avoid overbreeding,
                            disclose medical and lineage details, and comply with local
                            regulations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900">Adoption & Rehoming</h2>
                        <p className="text-gray-700 mt-3">
                            Adoption and rehoming listings must be truthful, disclose known
                            health conditions, and prioritize the pet’s welfare over profit.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900">Prohibited Content</h2>
                        <p className="text-gray-700 mt-3">
                            The following content is prohibited: illegal wildlife trade,
                            cruelty, fake listings, scams, explicit material, hate speech,
                            threats, misrepresentation, and malicious links.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900">Fraud and Scams</h2>
                        <p className="text-gray-700 mt-3">
                            Users must not request money fraudulently, misrepresent pets or
                            services, create fake listings, or impersonate others.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900">User Accounts & Identity</h2>
                        <p className="text-gray-700 mt-3">
                            Users must provide accurate profile information, avoid duplicate
                            accounts, and keep login credentials confidential.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900">Content Ownership & Responsibility</h2>
                        <p className="text-gray-700 mt-3">
                            Users are responsible for all uploaded content and must own the
                            rights to it, not violate laws or third-party rights, and avoid
                            misleading information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900">Media Guidelines</h2>
                        <p className="text-gray-700 mt-3">
                            Images and videos must be relevant, appropriate, and not misleading
                            or copyrighted without permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900">Communication & Chat</h2>
                        <p className="text-gray-700 mt-3">
                            Users should communicate respectfully, avoid spam, and not share
                            harmful or phishing links.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900">Reviews and Feedback</h2>
                        <p className="text-gray-700 mt-3">
                            Reviews must be honest and fair. Fake reviews, personal attacks,
                            and irrelevant comments are prohibited.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900">Reporting Violations</h2>
                        <p className="text-gray-700 mt-3">
                            Users are encouraged to report suspicious listings, fraud, abuse,
                            fake profiles, and harassment so PetSetu can take appropriate
                            action.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900">Enforcement Actions</h2>
                        <p className="text-gray-700 mt-3">
                            Violations may result in content removal, warnings, suspension,
                            account termination, or reporting to authorities where required.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900">Appeals</h2>
                        <p className="text-gray-700 mt-3">
                            If you believe an action was taken in error, contact support for a
                            review. Final decisions remain at PetSetu’s discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900">Safety Recommendations</h2>
                        <p className="text-gray-700 mt-3">
                            Meet in safe public places, verify details before transactions,
                            avoid oversharing sensitive information, and use secure payment
                            methods when applicable.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900">Updates to Guidelines</h2>
                        <p className="text-gray-700 mt-3">
                            PetSetu may update these guidelines periodically. Continued use
                            of the platform implies acceptance of any changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900">Contact Us</h2>
                        <p className="text-gray-700 mt-3">
                            If you have questions or need to report an issue, email us at
                            petsetu@gmail.com.
                        </p>
                    </section>
                </div>
            </div>
        </section>
    );
}

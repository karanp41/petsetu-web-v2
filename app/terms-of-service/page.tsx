import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Read the PetSetu Terms and Conditions governing use of the platform, accounts, listings, and your responsibilities.",
};

export default function TermsAndConditionsPage() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            PetSetu Terms and Conditions
          </h1>
          <p className="text-gray-600 mt-3">
            These Terms of Service govern your access to and use of the PetSetu
            website, mobile applications, and related services.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Version 1.0.0 · Effective Date: 28th June, 2026 · Last Updated: 28th June,
            2026
          </p>
        </header>

        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Introduction</h2>
            <p className="text-gray-700 mt-3">
              Welcome to PetSetu. By creating an account or using the Platform,
              you agree to be bound by these Terms. If you do not agree with
              these Terms, please do not use PetSetu.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">About PetSetu</h2>
            <p className="text-gray-700 mt-3">
              PetSetu is an online platform that connects pet owners, adopters,
              breeders, kennels, shelters, NGOs, and pet enthusiasts. The
              Platform provides tools that allow users to create pet profiles,
              list pets for adoption, rehoming, or breeding, connect with pet
              owners and breeders, maintain pet information, participate in the
              community, and use additional pet-related services.
            </p>
            <p className="text-gray-700 mt-3">
              PetSetu is a technology platform only and is not the owner,
              breeder, seller, buyer, transporter, veterinarian, or legal
              representative of any pet listed on the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Eligibility</h2>
            <p className="text-gray-700 mt-3">
              To use PetSetu, you must be at least 18 years of age, or use the
              Platform under the supervision of a parent or legal guardian. You
              must be legally capable of entering into a binding agreement,
              provide accurate and complete registration information, and comply
              with all applicable laws.
            </p>
            <p className="text-gray-700 mt-3">
              PetSetu reserves the right to suspend or terminate accounts that
              fail to meet these requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Account Registration</h2>
            <p className="text-gray-700 mt-3">
              You are responsible for maintaining accurate account information,
              protecting your login credentials, keeping your phone number and
              email address updated, and all activities performed through your
              account.
            </p>
            <p className="text-gray-700 mt-3">
              You must immediately notify PetSetu if you suspect unauthorized
              access to your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">User Responsibilities</h2>
            <p className="text-gray-700 mt-3">
              You agree to provide truthful information, upload genuine pet
              information, respect other users, use the Platform responsibly,
              follow applicable animal welfare laws, and cooperate during any
              verification or KYC processes when requested.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Listings</h2>
            <p className="text-gray-700 mt-3">
              Users may create listings for pet adoption, pet rehoming,
              responsible breeding, pet services, pet events, and other
              categories introduced by PetSetu. Users are solely responsible for
              the accuracy of their listings, and PetSetu may remove any listing
              that violates these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Responsible Pet Ownership</h2>
            <p className="text-gray-700 mt-3">
              Users agree to treat animals humanely, avoid neglect or abuse,
              provide accurate health information, disclose known medical
              conditions, follow applicable vaccination and licensing
              requirements, and avoid misleading buyers or adopters.
            </p>
            <p className="text-gray-700 mt-3">
              PetSetu encourages ethical and responsible pet ownership at all
              times.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Prohibited Activities</h2>
            <p className="text-gray-700 mt-3">
              You must not upload false information, impersonate another
              individual, create fake accounts, post illegal or prohibited
              animals, promote animal cruelty, use the Platform for scams or
              fraud, harass or threaten other users, upload offensive or illegal
              content, distribute malware or harmful software, or attempt to
              access other user accounts.
            </p>
            <p className="text-gray-700 mt-3">
              Violation of these rules may result in permanent account
              suspension.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Marketplace Disclaimer</h2>
            <p className="text-gray-700 mt-3">
              PetSetu acts solely as a technology platform connecting users. It
              does not own pets listed, verify every listing, guarantee pet
              health, guarantee user identity, participate in transactions, or
              guarantee successful adoption or breeding arrangements.
            </p>
            <p className="text-gray-700 mt-3">
              Users are responsible for conducting their own due diligence before
              entering into any transaction or agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">KYC & Verification</h2>
            <p className="text-gray-700 mt-3">
              Certain features may require identity verification. By submitting
              KYC documents, you confirm that the information is accurate, the
              documents belong to you or your organization, and you authorize
              PetSetu to verify the submitted information.
            </p>
            <p className="text-gray-700 mt-3">
              Submission of documents does not guarantee approval.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Payments</h2>
            <p className="text-gray-700 mt-3">
              If paid features or subscriptions are introduced, pricing will be
              displayed before purchase, payments will be processed through
              authorized payment providers, and applicable taxes may apply.
            </p>
            <p className="text-gray-700 mt-3">
              Refund eligibility will follow the applicable refund policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">User Content</h2>
            <p className="text-gray-700 mt-3">
              Users retain ownership of the content they upload. By uploading
              content, you grant PetSetu a non-exclusive, worldwide,
              royalty-free license to display, store, process, resize, publish,
              and promote such content solely for operating and improving the
              Platform.
            </p>
            <p className="text-gray-700 mt-3">
              You represent that you own or have permission to use all uploaded
              content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Intellectual Property</h2>
            <p className="text-gray-700 mt-3">
              All Platform software, branding, logos, graphics, and designs are
              owned by PetSetu or its licensors.
            </p>
            <p className="text-gray-700 mt-3">
              Users may not copy, modify, reverse engineer, redistribute, sell,
              or reproduce any part of the Platform without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Privacy</h2>
            <p className="text-gray-700 mt-3">
              Your use of PetSetu is also governed by our Privacy Policy. By
              using the Platform, you consent to the collection and processing
              of your information as described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">AI Features</h2>
            <p className="text-gray-700 mt-3">
              PetSetu may offer AI-powered recommendations, suggestions, or
              informational content. AI-generated responses are provided for
              informational purposes only and should not replace professional
              veterinary, legal, or medical advice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Third-Party Services</h2>
            <p className="text-gray-700 mt-3">
              The Platform may integrate with third-party services such as maps,
              payment gateways, analytics providers, notification services, and
              authentication providers. PetSetu is not responsible for the
              availability or policies of third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Account Suspension</h2>
            <p className="text-gray-700 mt-3">
              PetSetu may suspend or terminate accounts without prior notice if
              users violate these Terms, submit fraudulent information, abuse
              other users, engage in illegal activities, or attempt to compromise
              Platform security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Limitation of Liability</h2>
            <p className="text-gray-700 mt-3">
              To the maximum extent permitted by law, PetSetu shall not be
              liable for loss arising from user interactions, pet health issues,
              fraud committed by other users, financial losses, indirect or
              consequential damages, service interruptions, or data loss beyond
              reasonable control.
            </p>
            <p className="text-gray-700 mt-3">
              Use of the Platform is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Indemnification</h2>
            <p className="text-gray-700 mt-3">
              You agree to indemnify and hold harmless PetSetu, its employees,
              directors, partners, and affiliates from any claims, liabilities,
              damages, losses, or expenses arising from your use of the Platform,
              your violation of these Terms, your violation of applicable laws,
              or your interactions with other users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Changes to the Platform</h2>
            <p className="text-gray-700 mt-3">
              PetSetu may modify features, add new services, remove existing
              functionality, or update these Terms. Where legally required,
              users will be asked to accept updated Terms before continuing to
              use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Termination</h2>
            <p className="text-gray-700 mt-3">
              You may delete your account at any time. PetSetu may retain certain
              information where required by law, fraud prevention, dispute
              resolution, or regulatory compliance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Governing Law</h2>
            <p className="text-gray-700 mt-3">
              These Terms shall be governed by the laws of India, without regard
              to conflict of law principles. Any disputes shall be subject to the
              jurisdiction of the competent courts located in [Your City,
              India], unless otherwise required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Contact Us</h2>
            <p className="text-gray-700 mt-3">
              For any questions regarding these Terms, please contact:
            </p>
            <p className="text-gray-700 mt-3">
              Email: <a href="mailto:petsetu@gmail.com" className="underline text-orange-600">petsetu@gmail.com</a>
            </p>
            <p className="text-gray-700 mt-3">
              Website: <a href="https://petsetu.com" target="_blank" rel="noreferrer" className="underline text-orange-600">https://petsetu.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Acceptance</h2>
            <p className="text-gray-700 mt-3">
              By creating an account, logging in, or continuing to use PetSetu,
              you acknowledge that you have read and understood these Terms,
              agree to be legally bound by them, and consent to the collection and
              processing of your information as described in the Privacy Policy.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}

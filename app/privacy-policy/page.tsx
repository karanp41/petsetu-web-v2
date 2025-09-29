import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how PetSetu collects, uses, shares, and protects your information, including details about advertising partners like Google AdMob.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Privacy Policy
          </h1>
          <p className="text-gray-600 mt-3">
            This Privacy Policy explains how we collect, use, disclose, and
            protect your information when you use PetSetu websites and services.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: September 30, 2025
          </p>
        </header>

        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              Information We Collect
            </h2>
            <p className="text-gray-700 mt-3">
              You may provide information about yourself such as your name,
              address, email, phone number, date of birth, and other details.
              When you register or sign in using social networks, we may collect
              your email, name, and social network ID. When you interact with us
              to avail our services, we may also collect and store geolocation
              information (latitude and longitude).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              How We Use Your Information
            </h2>
            <p className="text-gray-700 mt-3">
              We use personal information to fulfill your requests for services,
              improve our offerings, and provide other users with relevant
              information to help ascertain compatibility. You agree that we may
              send notifications of activity to the email address you provide,
              in accordance with your applicable privacy settings. We may also
              use your email address to send newsletters, feature updates, new
              services, event information, or other relevant messages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              How We Share Your Information
            </h2>
            <p className="text-gray-700 mt-3">
              As a matter of policy, we do not sell or rent information about
              you and we do not disclose information about you in a manner
              inconsistent with this Privacy Policy, except as required by law
              or government regulation. We will not share your personal
              information with any third party for marketing their own services
              unless you explicitly approve.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              How We Protect Your Information
            </h2>
            <p className="text-gray-700 mt-3">
              We are committed to safeguarding the confidentiality of your
              personally identifiable information and employ administrative,
              physical, and technical measures designed to protect it from
              unauthorized access. We use commercially reasonable safeguards to
              preserve the integrity and security of your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              Advertising and AdMob
            </h2>
            <p className="text-gray-700 mt-3">
              AdMob is Google’s mobile app advertising platform designed for app
              developers. To understand Google’s use of data, please consult
              Google’s partner policy.
            </p>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Personal Data
              </h3>
              <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                <li>Online identifiers, including cookie identifiers</li>
                <li>IP addresses</li>
                <li>Device identifiers</li>
                <li>Client identifiers</li>
                <li>
                  Unique device identifiers for advertising (e.g., Google
                  Advertiser ID or IDFA)
                </li>
                <li>Usage data</li>
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900">Retention</h3>
              <p className="text-gray-700 mt-2">
                Google anonymizes log data by removing part of the IP address
                (after 9 months) and cookie information (after 18 months).
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Online Resources
              </h3>
              <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-2">
                <li>
                  Privacy Policy:{" "}
                  <a
                    href="https://www.google.com/policies/technologies/ads/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 underline"
                  >
                    https://www.google.com/policies/technologies/ads/
                  </a>
                </li>
                <li>
                  Opt out:{" "}
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 underline"
                  >
                    https://www.google.com/settings/ads
                  </a>
                </li>
                <li>
                  Service Information:{" "}
                  <a
                    href="https://privacy.google.com/businesses/adsservices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 underline"
                  >
                    https://privacy.google.com/businesses/adsservices/
                  </a>
                </li>
                <li>
                  Partner policy:{" "}
                  <a
                    href="https://policies.google.com/technologies/partner-sites"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 underline"
                  >
                    https://policies.google.com/technologies/partner-sites
                  </a>
                </li>
                <li>
                  Ad technology providers:{" "}
                  <a
                    href="https://support.google.com/admob/answer/9012903"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 underline"
                  >
                    https://support.google.com/admob/answer/9012903
                  </a>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Security</h2>
            <p className="text-gray-700 mt-3">
              We strive to use commercially acceptable means to protect your
              information. However, no method of transmission over the internet
              or electronic storage is 100% secure, and we cannot guarantee
              absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              Children’s Privacy
            </h2>
            <p className="text-gray-700 mt-3">
              Our services do not address anyone under the age of 16. We do not
              knowingly collect personally identifiable information from
              children under 16. If we discover that a child under 16 has
              provided personal information, we will promptly delete it. If you
              are a parent or guardian and become aware that your child has
              provided personal information, please contact us so we can take
              appropriate action.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              Distribution
            </h2>
            <p className="text-gray-700 mt-3">
              The only official channel for distribution of the PetSetu app is
              the Google Play Store:{" "}
              <a
                href="https://play.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 underline"
              >
                https://play.google.com/
              </a>
              . Any other mode of distribution is not official and is not
              maintained by the developer. This Privacy Policy applies only to
              distribution via official channels.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 mt-3">
              We may update this policy from time to time. We encourage you to
              review this page periodically for any changes.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}

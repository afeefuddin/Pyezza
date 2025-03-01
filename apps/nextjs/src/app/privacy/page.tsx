import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/landing/footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-[#FF7A29]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="text-gray-300 space-y-6">
          <p className="text-sm text-gray-400">Last Updated: March 1, 2025</p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              1. Introduction
            </h2>
            <p>
              Welcome to Pyezza ("we," "our," or "us"). We respect your privacy
              and are committed to protecting your personal data. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you use our workplace social bot service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              2. Information We Collect
            </h2>
            <p>
              We collect information that you provide directly to us when you
              use Pyezza, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Account information (name, email address, workplace details)
              </li>
              <li>
                Profile information (display name, profile picture, job title)
              </li>
              <li>
                Content you share through our platform (messages, responses to
                activities)
              </li>
              <li>
                Usage data (interactions with the bot, participation in team
                activities)
              </li>
              <li>
                Information from integrations with workplace platforms (with
                your permission)
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              3. How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Personalize your experience and deliver relevant content</li>
              <li>Facilitate team engagement and social interactions</li>
              <li>
                Generate anonymized, aggregated insights about workplace
                engagement
              </li>
              <li>Send you service-related notifications and updates</li>
              <li>
                Respond to your comments, questions, and customer service
                requests
              </li>
              <li>
                Protect against, identify, and prevent fraud and other harmful
                activity
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              4. Data Sharing and Disclosure
            </h2>
            <p>We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                With your workplace team members as part of the intended
                functionality
              </li>
              <li>
                With third-party service providers who perform services on our
                behalf
              </li>
              <li>
                With integration partners when you connect Pyezza to other
                workplace tools
              </li>
              <li>When required by law or to protect our rights and safety</li>
              <li>
                In connection with a business transaction such as a merger or
                acquisition
              </li>
            </ul>
            <p>
              We do not sell your personal information to advertisers or other
              third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              5. Data Security
            </h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information. However, no method of
              transmission over the Internet or electronic storage is 100%
              secure, so we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              6. Data Retention
            </h2>
            <p>
              We retain your information for as long as your account is active
              or as needed to provide you services. We may retain certain
              information for legitimate business purposes or as required by
              law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              7. Your Rights and Choices
            </h2>
            <p>
              Depending on your location, you may have certain rights regarding
              your personal information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Accessing, correcting, or deleting your personal information
              </li>
              <li>Restricting or objecting to our use of your data</li>
              <li>Requesting portability of your data</li>
              <li>Withdrawing consent where processing is based on consent</li>
            </ul>
            <p>
              To exercise these rights, please contact us at privacy@pyezza.com.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              8. International Data Transfers
            </h2>
            <p>
              Your information may be transferred to, and processed in,
              countries other than the country in which you reside. These
              countries may have data protection laws that are different from
              the laws of your country. We ensure appropriate safeguards are in
              place to protect your information when transferred
              internationally.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              9. Children's Privacy
            </h2>
            <p>
              Our services are not intended for individuals under the age of 16.
              We do not knowingly collect personal information from children
              under 16. If we learn we have collected personal information from
              a child under 16, we will delete that information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              10. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last Updated" date. You are advised to
              review this Privacy Policy periodically for any changes.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/landing/footer";

export default function TermsOfService() {
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
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="text-gray-300 space-y-6">
          <p className="text-sm text-gray-400">Last Updated: September 14, 2025</p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              1. Introduction
            </h2>
            <p>
              Welcome to Pyezza ("we," "our," or "us"). Pyezza is an open-source
              Slack bot that sends fun and quirky scheduled messages to
              integrated Slack channels to spark conversation. By installing and
              using the Pyezza bot in your Slack workspace, you agree to be
              bound by these Terms of Service ("Terms").
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              2. License and Open Source
            </h2>
            <p>
              Pyezza is provided to you free of charge under the{" "}
              <a
                href="https://opensource.org/licenses/MIT"
                className="text-[#FF7A29] hover:underline"
              >
                MIT License
              </a>
              . This means you are free to use, modify, and distribute the
              Pyezza software. These Terms apply to your use of the bot as a
              service and do not override the rights granted to you under the
              MIT License for the underlying code.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              3. No Data Collection
            </h2>
            <p>
              Pyezza is designed to be a simple, non-intrusive service. We do
              not collect, store, or process any personal data from you or your
              team members. We just store the Team Members Id without
              identifying them for better spotlight experience. The bot's
              functionality is limited to sending messages to your designated
              Slack channels. For more information, please review our{" "}
              <Link
                href="/privacy-policy"
                className="text-[#FF7A29] hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              4. User Responsibilities and Conduct
            </h2>
            <p>
              By installing the Pyezza bot, you agree to use it in a manner
              consistent with Slack's Terms of Service and acceptable use
              policies. You are responsible for any content or interactions
              facilitated by the bot in your workspace.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              5. Disclaimer of Warranties
            </h2>
            <p>
              Pyezza is provided "as is" and "as available" without any
              warranties of any kind, either express or implied, including, but
              not limited to, implied warranties of merchantability, fitness for
              a particular purpose, or non-infringement. We do not guarantee
              that the bot will be uninterrupted, error-free, or reliable. Your
              use of Pyezza is at your sole risk.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              6. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, in no event shall we be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, or any loss of profits or revenues, whether
              incurred directly or indirectly, or any loss of data, use,
              goodwill, or other intangible losses, resulting from (a) your
              access to or use of or inability to access or use the bot; (b) any
              conduct or content of any third party on the bot; or (c)
              unauthorized access, use, or alteration of your transmissions or
              content.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              7. Termination
            </h2>
            <p>
              We reserve the right to modify or terminate the bot's service at
              any time for any reason, without notice. You can uninstall the
              Pyezza bot from your Slack workspace at any time to terminate
              these Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              8. General Provisions
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Entire Agreement:</strong> These Terms constitute the
                entire agreement between you and us regarding the use of Pyezza.
              </li>
              <li>
                <strong>Governing Law:</strong> These Terms shall be governed by
                and construed in accordance with the laws of India, without
                regard to its conflict of law provisions.
              </li>
              <li>
                <strong>Severability:</strong> If any provision of these Terms
                is found to be invalid, the remaining provisions will continue
                to be in effect.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              9. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a
                href="mailto:support@pyezza.live"
                className="text-[#FF7A29] hover:underline"
              >
                support@pyezza.live
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

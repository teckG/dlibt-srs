import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 sm:p-12 font-[family-name:var(--font-geist-sans)]`}
    >
      

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto text-center">
        <h1 className="text-2xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Student Referral System
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
          Datalink Institute of Business & Technology is a leading institution in Ghana. In a quest to 
          reward students for their loyalty and commitment to the institution, we have developed a
          referral system that allows students to refer their friends and family to the institution. 
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors"
          >
            Login
          </Link>
          <a
            href="#"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            Learn More
          </a>
        </div>
      </main>

      {/* Features Section */}
      <section className="mt-24 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Why Choose DataLink?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Real-Time Tracking
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor referrals in real-time and stay updated on their status.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-4">💸</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Automated Rewards
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Automatically reward referrers when their referrals are admitted.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Detailed Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Gain insights into referral performance with comprehensive reports.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 text-center text-gray-600 dark:text-gray-400">
        <p className="mb-4">
          © {new Date().getFullYear()} DataLink. All rights reserved.
        </p>
        <div className="flex justify-center gap-4">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
}
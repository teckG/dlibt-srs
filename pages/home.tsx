import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { useState } from "react"; // Import useState for interactive elements

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [showDetails, setShowDetails] = useState(false); // State to toggle reward details

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 sm:p-12 font-[family-name:var(--font-geist-sans)]`}
    >
      {/* Hero Section */}
      <main className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
          Student Referral System
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 animate-fade-in-up">
          Datalink Institute of Business & Technology is a leading institution
          in Ghana. In a quest to reward students for their loyalty and
          commitment to the institution, we have developed a referral system
          that allows students to refer their friends and family to the
          institution.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex gap-4 justify-center animate-fade-in-up">
          <Link
            href="https://www.datalink.edu.gh"
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all transform hover:scale-105"
          >
            DLIBT
          </Link>
          <a
            href="#"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-all transform hover:scale-105"
          >
            Learn More
          </a>
        </div>
      </main>

      {/* Referral Rewards Ad Section */}
      <section className="mt-24 max-w-4xl mx-auto bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-lg shadow-lg text-white animate-fade-in-up">
        <h2 className="text-3xl font-bold mb-4">Earn Big with Referrals!</h2>
        <p className="text-lg mb-6">
          Refer a friend to Datalink and get rewarded! Earn{" "}
          <strong>GHC 250</strong> for every undergraduate referral and{" "}
          <strong>GHC 500</strong> for graduate and MPhil referrals.
        </p>

        {/* Interactive Toggle for More Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>

        {showDetails && (
          <div className="mt-6 text-left animate-fade-in">
            <h3 className="text-xl font-semibold mb-2">How It Works:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Refer a friend using your unique referral link.</li>
              <li>Your friend applies and gets admitted to Datalink.</li>
              <li>
                Once they complete their first semester, you receive your
                reward!
              </li>
            </ul>
            <p className="mt-4 font-semibold">
              Start referring today and earn rewards effortlessly! 
            </p>
              <Link
                href="/referrals"
                className="bg-white inline-block mt-4 text-blue-600 px-6 py-2  rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                Refer Now!
              </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="mt-24 max-w-6xl mx-auto animate-fade-in-up">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Why Choose DataLink?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Real-Time Tracking
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor referrals in real-time and stay updated on their status.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">
            <div className="text-4xl mb-4">💸</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Automated Rewards
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Automatically reward referrers when their referrals are admitted.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Detailed Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Gain insights into referral performance with comprehensive
              reports.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 text-center text-gray-600 dark:text-gray-400 animate-fade-in-up">
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
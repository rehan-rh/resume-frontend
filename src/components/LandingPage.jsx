import { Link } from "react-router-dom";
import { CheckCircle, FileText, Shield, Lightbulb, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <header className="text-center py-20 bg-gradient-to-r from-blue-700 to-blue-500 text-white">
        <h1 className="text-5xl font-bold leading-tight">AI-Powered Resume Analyzer</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          Unlock the secrets to a perfect resume with AI-driven insights! Optimize your CV and boost your job prospects.
        </p>
      </header>

      {/* Features Section */}
      <section className="py-16 px-8 text-center">
        <h2 className="text-3xl font-semibold">Why Choose Resume Analyzer?</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <CheckCircle className="text-blue-600 w-12 h-12 mx-auto" />
            <h3 className="text-xl font-bold mt-4">Instant AI Analysis</h3>
            <p className="mt-2 text-gray-600">Receive real-time feedback on resume strengths and weaknesses.</p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <FileText className="text-blue-600 w-12 h-12 mx-auto" />
            <h3 className="text-xl font-bold mt-4">ATS Optimization</h3>
            <p className="mt-2 text-gray-600">Ensure your resume is fully optimized for job application systems.</p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <Lightbulb className="text-blue-600 w-12 h-12 mx-auto" />
            <h3 className="text-xl font-bold mt-4">Actionable Insights</h3>
            <p className="mt-2 text-gray-600">Get clear suggestions to make your resume stand out to recruiters.</p>
          </div>
        </div>
      </section>

      {/* Who is this for? */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-semibold">Who is this for?</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <Users className="text-blue-600 w-12 h-12 mx-auto" />
            <h3 className="text-xl font-bold mt-4">Job Seekers</h3>
            <p className="mt-2 text-gray-600">Optimize your resume to land interviews faster.</p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <Shield className="text-blue-600 w-12 h-12 mx-auto" />
            <h3 className="text-xl font-bold mt-4">Fresh Graduates</h3>
            <p className="mt-2 text-gray-600">Ensure your first resume is structured and impactful.</p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <Lightbulb className="text-blue-600 w-12 h-12 mx-auto" />
            <h3 className="text-xl font-bold mt-4">Career Changers</h3>
            <p className="mt-2 text-gray-600">Highlight transferable skills effectively in your resume.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-semibold">How It Works</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-8">
          <div className="p-6">
            <span className="text-4xl font-bold text-blue-600">1</span>
            <h3 className="text-xl font-bold mt-2">Upload Your Resume</h3>
            <p className="mt-2 text-gray-600">Simply drag and drop your resume for analysis.</p>
          </div>
          <div className="p-6">
            <span className="text-4xl font-bold text-blue-600">2</span>
            <h3 className="text-xl font-bold mt-2">AI-Powered Review</h3>
            <p className="mt-2 text-gray-600">Our AI scans and provides data-driven insights.</p>
          </div>
          <div className="p-6">
            <span className="text-4xl font-bold text-blue-600">3</span>
            <h3 className="text-xl font-bold mt-2">Get Your Report</h3>
            <p className="mt-2 text-gray-600">Receive an easy-to-understand improvement plan.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-semibold">What People Are Saying</h2>
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <p className="italic text-gray-700">"This tool helped me fix my resume and land interviews in top companies!"</p>
            <h4 className="mt-4 font-semibold">- Sarah L., Software Engineer</h4>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <p className="italic text-gray-700">"As a fresh graduate, I wasn’t sure how to structure my resume. This made it super easy!"</p>
            <h4 className="mt-4 font-semibold">- Alex P., Data Analyst</h4>
          </div>
        </div>
      </section>

      {/* Call-To-Action */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-semibold">Ready to Improve Your Resume?</h2>
        <p className="mt-4 text-lg text-gray-600">Get started with our AI-powered resume analyzer today.</p>
        <Link to="/signup">
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
            Get Started
          </button>
        </Link>
      </section>

      {/* Footer */}
      {/* <footer className="py-8 text-center bg-blue-700 text-white">
        <p>&copy; {new Date().getFullYear()} Resume Analyzer. All rights reserved.</p>
        <div className="mt-4">
          <Link to="/privacy-policy" className="mx-2 hover:underline">Privacy Policy</Link>
          <Link to="/terms-of-service" className="mx-2 hover:underline">Terms of Service</Link>
        </div>
      </footer> */}
    </div>
  );
}

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="bg-slate-50 font-sans text-slate-800 min-h-screen">
      {/* Header */}
      <header className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-4">Privacy Policy</h1>
          <p className="text-slate-400">Last Updated: October 26, 2026</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
            <p>
              Demandio ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website <strong>demandio.cloud</strong> and use our services, including the Subsidy Finder and VSME Reporting tools.
            </p>
            <p className="mt-4">
              We process personal data in accordance with the General Data Protection Regulation (GDPR) and applicable Dutch laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Data Controller</h2>
            <p>The data controller responsible for your information is:</p>
            <address className="mt-4 not-italic bg-slate-50 p-4 rounded-lg border border-slate-100">
              <strong>Demandio</strong><br />
              Fluwelen Burgwal 58<br />
              2511CJ Den Haag<br />
              The Netherlands<br /><br />
              <strong>Email:</strong> <a href="mailto:mike@demandio.cloud" className="text-blue-600 hover:underline">mike@demandio.cloud</a>
            </address>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Data We Collect</h2>
            <p>We collect information you provide directly to us via our online forms and tools:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Identity Data:</strong> Full name, job role.</li>
              <li><strong>Contact Data:</strong> Work email address, company location (city).</li>
              <li><strong>Business Data:</strong> Company name, operational data entered into the VSME or Subsidy tools (e.g., turnover, employee count, energy usage).</li>
              <li><strong>Technical Data:</strong> IP address, browser type, and usage data collected automatically for security and analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. How We Use Your Data</h2>
            <p>We use your data for the following purposes:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>To provide and generate the reports you request (Subsidy Checks, VSME Reports).</li>
              <li>To communicate with you regarding your results or platform updates (if opted-in).</li>
              <li>To improve our digital ecosystem and tools.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Storage & Security</h2>
            <p>
              Your data is stored securely within the European Union. We utilize <strong>Supabase</strong> as our database provider, which is hosted on AWS servers located in Frankfurt, Germany (eu-central-1), ensuring full compliance with EU data sovereignty requirements.
            </p>
            <p className="mt-4">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Sharing of Data</h2>
            <p>We do not sell your personal data. We may share data with:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Service Providers:</strong> IT and system administration services (e.g., Supabase, Hosting Providers).</li>
              <li><strong>Legal Authorities:</strong> If required by law or to protect our rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Your Rights</h2>
            <p>Under the GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Access your personal data.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request erasure of your data ("Right to be forgotten").</li>
              <li>Object to processing of your data.</li>
              <li>Request restriction of processing.</li>
              <li>Data portability.</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us at <a href="mailto:mike@demandio.cloud" className="text-blue-600 hover:underline">mike@demandio.cloud</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Cookies</h2>
            <p>
              We use essential cookies to ensure the website functions correctly. We may use analytical cookies to understand website usage, but these are anonymized where possible. You can manage cookie preferences through your browser settings.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center mt-12">
        <p>&copy; 2026 Demandio Netherlands. All rights reserved.</p>
      </footer>
    </div>
  );
}

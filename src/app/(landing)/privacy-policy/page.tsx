'use client';

import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-black-600 to-cyan-600 pt-40 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-9xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-blue-100">Last Updated: April 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">1. Introduction</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Welcome to Empire of Forex ("we," "us," "our," or the "Company"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our trading platform, and interact with our services.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our service. Your continued use of our service indicates your acceptance of this Privacy Policy.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">2. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold text-blue-300 mb-3 mt-6">2.1 Personal Information You Provide</h3>
          <ul className="text-slate-300 leading-relaxed space-y-2 mb-4 list-disc list-inside">
            <li><strong>Account Registration:</strong> Name, email address, phone number, date of birth, and password</li>
            <li><strong>Financial Information:</strong> Bank account details, payment card information, investment amounts, and transaction history</li>
            <li><strong>Identity Verification:</strong> Government-issued ID, proof of address, and facial recognition data</li>
            <li><strong>Profile Information:</strong> Profile picture, bio, investment preferences, and risk tolerance</li>
            <li><strong>Communication Data:</strong> Messages, support tickets, feedback, and inquiries you send to us</li>
          </ul>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">2.2 Information Collected Automatically</h3>
          <ul className="text-slate-300 leading-relaxed space-y-2 mb-4 list-disc list-inside">
            <li><strong>Device Information:</strong> Device type, operating system, browser type, and unique device identifiers</li>
            <li><strong>Usage Data:</strong> Pages visited, links clicked, time spent on pages, and interaction patterns</li>
            <li><strong>Location Data:</strong> IP address, general geographic location (country/region level)</li>
            <li><strong>Cookies & Tracking:</strong> Session cookies, persistent cookies, and similar tracking technologies</li>
            <li><strong>Log Data:</strong> Server logs containing request details, error logs, and access times</li>
          </ul>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">2.3 Third-Party Information</h3>
          <p className="text-slate-300 leading-relaxed">
            We may receive information about you from third parties, including:
          </p>
          <ul className="text-slate-300 leading-relaxed space-y-2 mb-4 list-disc list-inside mt-2">
            <li>Payment processors and financial institutions</li>
            <li>Verification and identity services</li>
            <li>Credit reporting agencies (with your consent)</li>
            <li>Social media platforms (if you link your accounts)</li>
            <li>Fraud prevention and security services</li>
          </ul>
        </section>

        {/* How We Use Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">3. How We Use Your Information</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            We use the information we collect for the following purposes:
          </p>
          <ul className="text-slate-300 leading-relaxed space-y-2 mb-4 list-disc list-inside">
            <li>Providing and maintaining our trading platform and services</li>
            <li>Processing transactions and sending related information</li>
            <li>Sending promotional emails, newsletters, and marketing communications</li>
            <li>Responding to your inquiries and customer support requests</li>
            <li>Verifying your identity and preventing fraudulent activity</li>
            <li>Complying with legal obligations and regulations</li>
            <li>Analyzing usage patterns to improve our services</li>
            <li>Personalizing your experience and content recommendations</li>
            <li>Conducting security audits and monitoring system integrity</li>
            <li>Enforcing our Terms of Service and other agreements</li>
            <li>Conducting research and developing new features</li>
          </ul>
        </section>

        {/* Information Sharing */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">4. How We Share Your Information</h2>
          
          <h3 className="text-xl font-semibold text-blue-300 mb-3">4.1 Third-Party Service Providers</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            We share information with service providers who assist us in operating our website, conducting our business, and providing services on our behalf, including payment processors, hosting providers, analytics services, and customer support platforms.
          </p>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">4.2 Legal Requirements</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            We may disclose your information when required by law or when we believe in good faith that disclosure is necessary to:
          </p>
          <ul className="text-slate-300 leading-relaxed space-y-2 mb-4 list-disc list-inside">
            <li>Comply with court orders or governmental requests</li>
            <li>Enforce our Terms of Service and other agreements</li>
            <li>Protect our rights, privacy, safety, or property</li>
            <li>Prevent or investigate possible wrongdoing</li>
          </ul>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">4.3 Business Transfers</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            If we are involved in a merger, acquisition, bankruptcy, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change and any choices you may have.
          </p>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">4.4 With Your Consent</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            We may share your information with third parties when you explicitly consent to such sharing.
          </p>
        </section>

        {/* Data Security */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">5. Data Security</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul className="text-slate-300 leading-relaxed space-y-2 mb-4 list-disc list-inside">
            <li>SSL/TLS encryption for data in transit</li>
            <li>Encryption of sensitive data at rest</li>
            <li>Secure access controls and authentication mechanisms</li>
            <li>Regular security assessments and penetration testing</li>
            <li>Employee training on data protection and privacy</li>
            <li>Incident response procedures and breach notification protocols</li>
          </ul>
          <p className="text-slate-300 leading-relaxed bg-blue-900 bg-opacity-30 p-4 rounded border border-blue-500">
            <strong>Note:</strong> While we strive to protect your information, no method of transmission over the internet or electronic storage is completely secure. We cannot guarantee absolute security, and you use our service at your own risk.
          </p>
        </section>

        {/* Your Rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">6. Your Privacy Rights</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Depending on your location, you may have the following rights regarding your personal information:
          </p>
          <ul className="text-slate-300 leading-relaxed space-y-2 mb-4 list-disc list-inside">
            <li><strong>Right to Access:</strong> You can request a copy of the personal information we hold about you</li>
            <li><strong>Right to Rectification:</strong> You can request that we correct or update inaccurate information</li>
            <li><strong>Right to Erasure:</strong> You can request deletion of your personal information, subject to certain exceptions</li>
            <li><strong>Right to Restrict Processing:</strong> You can request that we limit how we use your information</li>
            <li><strong>Right to Data Portability:</strong> You can request your data in a portable format</li>
            <li><strong>Right to Object:</strong> You can object to certain processing activities</li>
            <li><strong>Right to Withdraw Consent:</strong> You can withdraw previously provided consent</li>
          </ul>
          <p className="text-slate-300 leading-relaxed">
            To exercise any of these rights, please contact us at privacy@empireofforex.com with details of your request. We will respond within 30 days.
          </p>
        </section>

        {/* Cookies */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">7. Cookies and Tracking Technologies</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies are small files stored on your device that help us remember your preferences and understand how you use our service.
          </p>
          <h3 className="text-xl font-semibold text-blue-300 mb-3">7.1 Types of Cookies We Use</h3>
          <ul className="text-slate-300 leading-relaxed space-y-2 mb-4 list-disc list-inside">
            <li><strong>Essential Cookies:</strong> Required for platform functionality and security</li>
            <li><strong>Performance Cookies:</strong> Help us understand how you use our platform</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
            <li><strong>Marketing Cookies:</strong> Track your interactions for marketing purposes</li>
          </ul>
          <p className="text-slate-300 leading-relaxed">
            You can control cookie settings through your browser preferences. Please note that disabling essential cookies may affect platform functionality.
          </p>
        </section>

        {/* Data Retention */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">8. Data Retention</h2>
          <p className="text-slate-300 leading-relaxed">
            We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. The retention period may vary depending on the purpose and context. Generally:
          </p>
          <ul className="text-slate-300 leading-relaxed space-y-2 mb-4 list-disc list-inside mt-2">
            <li>Account information is retained while your account is active</li>
            <li>Transaction records are retained for at least 7 years for regulatory compliance</li>
            <li>Marketing data is retained until you opt out</li>
            <li>Log data is typically retained for 1-2 years</li>
          </ul>
        </section>

        {/* International Transfers */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">9. International Data Transfers</h2>
          <p className="text-slate-300 leading-relaxed">
            Your information may be transferred to, stored in, and processed in countries other than your country of residence, including countries that may not have the same data protection laws. By using our service, you consent to such transfers. We will implement appropriate safeguards to protect your information, including standard contractual clauses and adequacy decisions where applicable.
          </p>
        </section>

        {/* Children's Privacy */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">10. Children's Privacy</h2>
          <p className="text-slate-300 leading-relaxed">
            Our service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we learn that we have collected personal information from a child under 18, we will delete such information promptly. If you believe we have collected information from a child, please contact us immediately.
          </p>
        </section>

        {/* Third-Party Links */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">11. Third-Party Links</h2>
          <p className="text-slate-300 leading-relaxed">
            Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
          </p>
        </section>

        {/* Contact Us */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">12. Contact Us</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            If you have questions about this Privacy Policy or our privacy practices, please contact us:
          </p>
          <div className="bg-slate-800 border border-slate-700 rounded p-6 text-slate-300">
            <p><strong>Empire of Forex</strong></p>
            <p>Email: privacy@empireofforex.com</p>
            <p>Support: support@empireofforex.com</p>
            <p>Address: [Your Company Address]</p>
            <p>Phone: [Your Company Phone]</p>
          </div>
        </section>

        {/* Changes to Policy */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">13. Changes to This Privacy Policy</h2>
          <p className="text-slate-300 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of our service after changes have been made constitutes your acceptance of the updated Privacy Policy.
          </p>
        </section>
      </div>
    </div>
  );
}

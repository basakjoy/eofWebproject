'use client';

import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-black-600 to-cyan-600 pt-40 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-9xl font-bold mb-4">Terms of Service</h1>
          <p className="text-blue-100">Last Updated: April 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">1. Agreement to Terms</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            These Terms of Service ("Terms," "Agreement") constitute a binding agreement between you ("User," "you," "your") and Empire of Forex ("Company," "we," "us," "our"). By accessing and using our website, mobile application, trading platform, and related services (collectively, the "Service"), you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Service.
          </p>
          <p className="text-slate-300 leading-relaxed">
            The Company reserves the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Service following the posting of revised Terms means that you accept and agree to the changes.
          </p>
        </section>

        {/* Eligibility */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">2. Eligibility</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            To use our Service, you must:
          </p>
          <ul className="text-slate-300 leading-relaxed space-y-2 mb-4 list-disc list-inside">
            <li>Be at least 18 years of age or the age of majority in your jurisdiction</li>
            <li>Not be a resident of countries with restrictions on forex trading</li>
            <li>Have the legal authority to enter into this Agreement</li>
            <li>Not be prohibited by law from using our Service</li>
            <li>Reside in a jurisdiction where forex trading is legal</li>
            <li>Provide accurate, truthful, and complete information during registration</li>
          </ul>
          <p className="text-slate-300 leading-relaxed">
            The Company reserves the right to refuse service or terminate accounts of users who do not meet these requirements.
          </p>
        </section>

        {/* User Accounts */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">3. User Accounts and Registration</h2>
          
          <h3 className="text-xl font-semibold text-blue-300 mb-3">3.1 Account Creation</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            You are responsible for maintaining the confidentiality of your account credentials, including your username, password, and any security tokens. You agree to accept responsibility for all activities that occur under your account, whether authorized by you or not. If you discover unauthorized access to your account, you must notify us immediately.
          </p>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">3.2 Account Information</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            You agree to provide accurate, current, and complete information during registration and keep this information updated. Providing false information or impersonating others is strictly prohibited and may result in immediate account termination and legal action.
          </p>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">3.3 Single Account Per User</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            You agree to maintain only one active account. Creating multiple accounts to exploit promotions or manipulate the system is prohibited and may result in account closure and forfeiture of funds.
          </p>
        </section>

        {/* Investment Risk Disclaimer */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">4. Investment Risk Disclaimer</h2>
          
          <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded p-4 mb-4">
            <p className="text-red-200 font-semibold mb-2">⚠️ IMPORTANT DISCLAIMER</p>
            <p className="text-slate-300 leading-relaxed">
              Forex trading and investments carry substantial risk of loss. Not all investors are suited for trading forex or investing in financial instruments. Past performance does not guarantee future results.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">4.1 Risks of Forex Trading</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            You acknowledge and understand that:
          </p>
          <ul className="text-slate-300 leading-relaxed space-y-2 mb-4 list-disc list-inside">
            <li>Forex trading involves substantial risk and you may lose all invested capital</li>
            <li>Leverage can magnify both profits and losses exponentially</li>
            <li>Market conditions are volatile and unpredictable</li>
            <li>Economic and political events can cause rapid market movements</li>
            <li>Technical analysis and trading signals are not guaranteed to be accurate</li>
            <li>Past performance does not indicate future results</li>
            <li>The Company makes no warranties regarding profitability or investment outcomes</li>
          </ul>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">4.2 No Financial Advice</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            The Company does not provide financial, investment, or legal advice. Information on our platform is for educational purposes only. Trading signals and market analysis represent opinions and should not be considered as investment recommendations. You are solely responsible for your investment decisions.
          </p>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">4.3 Investment Decisions</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            You acknowledge that you make all investment decisions independently based on your own research and analysis. The Company is not liable for any losses resulting from your investment decisions or reliance on information provided through our Service.
          </p>
        </section>

        {/* Trading Rules */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">5. Trading Rules and Conduct</h2>
          
          <h3 className="text-xl font-semibold text-blue-300 mb-3">5.1 Permitted Use</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree not to:
          </p>
          <ul className="text-slate-300 leading-relaxed space-y-2 mb-4 list-disc list-inside">
            <li>Use the Service for illegal activities or in violation of any laws</li>
            <li>Engage in market manipulation, including wash trading, spoofing, or layering</li>
            <li>Provide false or misleading information about market conditions</li>
            <li>Use automated bots or scripts without explicit authorization</li>
            <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
            <li>Engage in harassment, fraud, or deception</li>
            <li>Infringe on intellectual property rights</li>
            <li>Reverse engineer or attempt to discover source code</li>
          </ul>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">5.2 Order Execution</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            The Company will execute orders in accordance with its Order Execution Policy. We do not guarantee specific execution prices or speeds, and orders may be executed at different prices than displayed due to market conditions.
          </p>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">5.3 Trading Restrictions</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            The Company reserves the right to:
          </p>
          <ul className="text-slate-300 leading-relaxed space-y-2 mb-4 list-disc list-inside">
            <li>Restrict, cancel, or modify orders</li>
            <li>Suspend or close accounts engaged in prohibited activities</li>
            <li>Implement trading restrictions during significant market events</li>
            <li>Reset account values if suspicious activity is detected</li>
            <li>Require additional verification or documentation</li>
          </ul>
        </section>

        {/* Fees and Payments */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">6. Fees and Payments</h2>
          
          <h3 className="text-xl font-semibold text-blue-300 mb-3">6.1 Payment Responsibility</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            You are responsible for all fees and charges incurred through your account. The Company may charge fees for deposits, withdrawals, trades, and other services. A detailed fee schedule is available on our website.
          </p>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">6.2 Payment Methods</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            We accept various payment methods including credit cards, bank transfers, and digital wallets. Payment processors' terms apply to all transactions. The Company is not responsible for payment processor errors or delays.
          </p>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">6.3 Refund Policy</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            Deposits are generally non-refundable once invested. Refunds for deposits not yet invested may be subject to processing fees. Profits generated through trading may be withdrawn subject to our withdrawal policies and applicable regulations.
          </p>
        </section>

        {/* Withdrawals */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">7. Withdrawals</h2>
          
          <h3 className="text-xl font-semibold text-blue-300 mb-3">7.1 Withdrawal Process</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            Withdrawal requests are processed within 5-10 business days. Processing times may vary based on payment method and bank processing times. The Company is not responsible for delays caused by financial institutions.
          </p>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">7.2 Withdrawal Restrictions</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            The Company may restrict or delay withdrawals if:
          </p>
          <ul className="text-slate-300 leading-relaxed space-y-2 mb-4 list-disc list-inside">
            <li>We suspect fraudulent or illegal activity</li>
            <li>Your account has unusual trading patterns</li>
            <li>Compliance verification is pending</li>
            <li>Legal disputes or investigations are ongoing</li>
            <li>Account security issues are detected</li>
          </ul>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">7.3 Withdrawal Fees</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            Withdrawals may be subject to fees. Current fee information is available in your account dashboard. Bank transfer fees and currency conversion fees may apply and are typically deducted from the withdrawal amount.
          </p>
        </section>

        {/* Intellectual Property */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">8. Intellectual Property Rights</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            All content on our platform, including text, graphics, logos, images, videos, software, and trademarks, is the property of Empire of Forex or its content suppliers and is protected by international copyright and intellectual property laws. You may not reproduce, distribute, transmit, or display any content without our prior written permission.
          </p>
          <p className="text-slate-300 leading-relaxed">
            You may view and print portions of the Service for your personal, non-commercial use only. Any other use is prohibited. If you violate our intellectual property rights, we may pursue legal action.
          </p>
        </section>

        {/* Liability Limitation */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">9. Limitation of Liability</h2>
          
          <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded p-4 mb-4">
            <p className="text-yellow-200 font-semibold mb-2">LIABILITY DISCLAIMER</p>
          </div>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">9.1 No Warranties</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Company makes no warranties, express or implied, regarding the Service, including implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
          </p>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">9.2 Limitation of Damages</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            To the maximum extent permitted by law, the Company shall not be liable for:
          </p>
          <ul className="text-slate-300 leading-relaxed space-y-2 mb-4 list-disc list-inside">
            <li>Any indirect, incidental, special, consequential, or punitive damages</li>
            <li>Lost profits, revenues, data, or goodwill</li>
            <li>Trading losses or investment losses</li>
            <li>Business interruptions or system downtime</li>
            <li>Damages arising from third-party products or services</li>
          </ul>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">9.3 Maximum Liability</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            In no event shall the Company's total liability exceed the amount you have deposited into your account during the past 12 months.
          </p>
        </section>

        {/* Indemnification */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">10. Indemnification</h2>
          <p className="text-slate-300 leading-relaxed">
            You agree to indemnify, defend, and hold harmless the Company, its officers, directors, employees, agents, and partners from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from or related to:
          </p>
          <ul className="text-slate-300 leading-relaxed space-y-2 mb-4 list-disc list-inside mt-2">
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any applicable laws</li>
            <li>Your investment decisions or trading activities</li>
            <li>Infringement of third-party rights through your actions</li>
          </ul>
        </section>

        {/* Service Availability */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">11. Service Availability and Maintenance</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            While we strive to maintain 24/7 service availability, we do not guarantee uninterrupted access. The Service may be unavailable due to:
          </p>
          <ul className="text-slate-300 leading-relaxed space-y-2 mb-4 list-disc list-inside">
            <li>Scheduled maintenance and updates</li>
            <li>System failures or technical issues</li>
            <li>Network issues or internet outages</li>
            <li>Security incidents or cyberattacks</li>
            <li>Acts of God or events beyond our control</li>
          </ul>
          <p className="text-slate-300 leading-relaxed">
            We will attempt to provide advance notice of scheduled maintenance, but emergency maintenance may be performed without notice. The Company is not liable for losses incurred due to service interruptions.
          </p>
        </section>

        {/* Termination */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">12. Termination</h2>
          
          <h3 className="text-xl font-semibold text-blue-300 mb-3">12.1 Termination by User</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            You may terminate your account at any time by submitting a request through your account dashboard or contacting customer support. Upon termination, you will lose access to your account and all associated services.
          </p>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">12.2 Termination by Company</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            The Company may terminate or suspend your account immediately, without notice, if:
          </p>
          <ul className="text-slate-300 leading-relaxed space-y-2 mb-4 list-disc list-inside">
            <li>You violate these Terms or applicable laws</li>
            <li>We detect fraudulent or suspicious activity</li>
            <li>We are required by law or regulation to do so</li>
            <li>You engage in abusive or harassing conduct</li>
            <li>We determine your account poses a risk to our platform</li>
          </ul>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">12.3 Effect of Termination</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            Upon termination, all licenses and permissions granted under these Terms are revoked. You remain liable for all outstanding fees, trades, and obligations. The Company may retain your data as required by law.
          </p>
        </section>

        {/* Governing Law */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">13. Governing Law and Disputes</h2>
          
          <h3 className="text-xl font-semibold text-blue-300 mb-3">13.1 Governing Law</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles.
          </p>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">13.2 Dispute Resolution</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            Any dispute arising from these Terms or your use of the Service shall be resolved through:
          </p>
          <ul className="text-slate-300 leading-relaxed space-y-2 mb-4 list-disc list-inside">
            <li>Good-faith negotiation between the parties</li>
            <li>Mediation if negotiation fails</li>
            <li>Binding arbitration or court proceedings as a last resort</li>
          </ul>

          <h3 className="text-xl font-semibold text-blue-300 mb-3">13.3 Waiver of Class Action</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            To the extent permitted by law, you and the Company agree that any dispute will be resolved on an individual basis only, and not as part of any class or representative action.
          </p>
        </section>

        {/* Compliance */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">14. Regulatory Compliance</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            You agree to comply with all applicable laws, regulations, and rules governing forex trading and financial services in your jurisdiction. The Company complies with relevant financial regulations and may request documentation to verify your identity and source of funds.
          </p>
          <p className="text-slate-300 leading-relaxed">
            You understand that forex trading may be restricted or prohibited in certain jurisdictions. It is your responsibility to ensure that your use of the Service is legal in your country of residence.
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">15. Changes to Terms</h2>
          <p className="text-slate-300 leading-relaxed">
            The Company reserves the right to modify these Terms at any time. Material changes will be communicated to you via email or prominent notice on our website. Your continued use of the Service after changes constitutes acceptance of the updated Terms. If you do not agree with any changes, you should stop using the Service.
          </p>
        </section>

        {/* Contact Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">16. Contact Us</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            For questions about these Terms of Service, please contact us:
          </p>
          <div className="bg-slate-800 border border-slate-700 rounded p-6 text-slate-300">
            <p><strong>Empire of Forex</strong></p>
            <p>Email: legal@empireofforex.com</p>
            <p>Support: support@empireofforex.com</p>
            <p>Address: [Your Company Address]</p>
            <p>Phone: [Your Company Phone]</p>
          </div>
        </section>

        {/* Entire Agreement */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">17. Entire Agreement</h2>
          <p className="text-slate-300 leading-relaxed">
            These Terms of Service, together with our Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and the Company regarding your use of the Service and supersede all prior agreements, understandings, and negotiations.
          </p>
        </section>
      </div>
    </div>
  );
}

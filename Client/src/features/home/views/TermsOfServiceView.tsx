import React from "react";
import { layoutStyles, textStyles } from "@common/styles/components.ts";

function TermsOfServiceView() {
    return (
        <div className="min-h-screen bg-background text-white">
            <div className={layoutStyles.contentSection}>
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">Terms of Service</h1>
                <p className="text-xl text-secondary mb-8">Last updated: February 08, 2025</p>
                <p className="text-xl text-secondary mb-8">
                    Welcome to SECWatch! These Terms of Service ("Terms") govern your use of our website, services, and applications (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, you may not use the Service.
                </p>

                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">1. Acceptance of Terms</h2>
                <p className="text-xl text-secondary mb-8">
                    By using the Service, you confirm that you are at least 18 years old and have the legal capacity to enter into these Terms. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
                </p>

                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">2. Description of Service</h2>
                <p className="text-xl text-secondary mb-8">
                    SECWatch provides real-time SEC alerts, search capabilities, note-taking tools, and access to historical financial data from the Securities and Exchange Commission. The Service is intended for informational purposes only and does not constitute financial, legal, or professional advice.
                </p>

                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">3. User Responsibilities</h2>
                <p className="text-xl text-secondary mb-8">
                    You agree to use the Service in compliance with all applicable laws and regulations. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must not:
                </p>
                <ul className="list-disc list-inside text-xl text-secondary mb-8">
                    <li>Use the Service for any illegal or unauthorized purpose.</li>
                    <li>Attempt to gain unauthorized access to the Service or its related systems.</li>
                    <li>Interfere with or disrupt the integrity or performance of the Service.</li>
                    <li>Engage in any activity that could harm or exploit minors.</li>
                </ul>

                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">4. Intellectual Property</h2>
                <p className="text-xl text-secondary mb-8">
                    All content, features, and functionality on the Service, including but not limited to text, graphics, logos, and software, are the property of SECWatch or its licensors and are protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from any part of the Service without our prior written consent.
                </p>

                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">5. User-Generated Content</h2>
                <p className="text-xl text-secondary mb-8">
                    If you submit or post any content on the Service, you grant SECWatch a non-exclusive, royalty-free, worldwide license to use, reproduce, modify, and distribute such content. You represent and warrant that you own or have the necessary rights to grant this license.
                </p>

                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">6. Termination</h2>
                <p className="text-xl text-secondary mb-8">
                    We reserve the right to suspend or terminate your access to the Service at any time, with or without notice, for any reason, including but not limited to a violation of these Terms. Upon termination, your right to use the Service will immediately cease.
                </p>

                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">7. Limitation of Liability</h2>
                <p className="text-xl text-secondary mb-8">
                    To the fullest extent permitted by law, SECWatch shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or related to your use of the Service.
                </p>

                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">8. Disclaimer of Warranties</h2>
                <p className="text-xl text-secondary mb-8">
                    The Service is provided "as is" and "as available" without any warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. SECWatch does not guarantee that the Service will be error-free or uninterrupted.
                </p>

                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">9. Governing Law</h2>
                <p className="text-xl text-secondary mb-8">
                    These Terms shall be governed by and construed in accordance with the laws of the State of Colorado, United States, without regard to its conflict of law principles. Any disputes arising under these Terms shall be resolved exclusively in the state or federal courts located in Colorado.
                </p>

                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">10. Changes to Terms</h2>
                <p className="text-xl text-secondary mb-8">
                    We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after any changes constitutes your acceptance of the revised Terms.
                </p>

                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">11. Contact Us</h2>
                <p className="text-xl text-secondary mb-8">
                    If you have any questions about these Terms, please contact us at:
                </p>
                <ul className="list-disc list-inside text-xl text-secondary mb-8">
                    <li>By email: <a href="mailto:info@changeware.net" className="text-info hover:underline">info@changeware.net</a></li>
                </ul>
            </div>
        </div>
    );
}

export default TermsOfServiceView;
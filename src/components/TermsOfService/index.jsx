import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './index.css';

const TermsOfService = () => {
    const { t } = useTranslation();

    return (
        <div className="terms-page">
            <div className="container">
                <nav className="breadcrumb">
                    <Link to="/">Home</Link> / Terms of Service
                </nav>

                <div className="content">
                    <h1>Terms of Service</h1>
                    <p className="last-updated">Last updated: December 2024</p>

                    <section>
                        <h2>1. Acceptance of Terms</h2>
                        <p>By accessing and using DermaCare ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
                    </section>

                    <section>
                        <h2>2. Description of Service</h2>
                        <p>DermaCare is a telemedicine platform that connects patients with certified dermatologists for online consultations, including:</p>
                        <ul>
                            <li>Voice consultations</li>
                            <li>Chat-based consultations</li>
                            <li>Video consultations</li>
                            <li>Emergency consultations</li>
                            <li>Appointment scheduling</li>
                            <li>Prescription management</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. User Accounts</h2>
                        <p>To access certain features of the Platform, you must create an account. You agree to:</p>
                        <ul>
                            <li>Provide accurate and complete information</li>
                            <li>Maintain the security of your account credentials</li>
                            <li>Notify us immediately of any unauthorized use</li>
                            <li>Accept responsibility for all activities under your account</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Medical Disclaimer</h2>
                        <p><strong>Important:</strong> DermaCare is not a substitute for emergency medical care. In case of medical emergencies, please call your local emergency services immediately.</p>
                        <ul>
                            <li>Consultations are for non-emergency dermatological conditions</li>
                            <li>Dermatologists may recommend in-person visits when necessary</li>
                            <li>We do not guarantee specific treatment outcomes</li>
                            <li>Users should follow their dermatologist's advice</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Payment Terms</h2>
                        <ul>
                            <li>Consultation fees are charged per session</li>
                            <li>Emergency consultations may have higher fees</li>
                            <li>All payments are processed securely through PhonePe</li>
                            <li>Refunds are subject to our Refund Policy</li>
                            <li>Prices may change with prior notice</li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Privacy and Data Protection</h2>
                        <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.</p>
                        <ul>
                            <li>All consultations are confidential</li>
                            <li>Medical data is stored securely and encrypted</li>
                            <li>We comply with HIPAA and other relevant regulations</li>
                            <li>You control your data and can request deletion</li>
                        </ul>
                    </section>

                    <section>
                        <h2>7. Prohibited Activities</h2>
                        <p>You agree not to:</p>
                        <ul>
                            <li>Use the service for non-medical purposes</li>
                            <li>Share account credentials with others</li>
                            <li>Attempt to access other users' accounts</li>
                            <li>Upload malicious content or software</li>
                            <li>Violate any applicable laws or regulations</li>
                            <li>Harass or abuse healthcare providers</li>
                        </ul>
                    </section>

                    <section>
                        <h2>8. Intellectual Property</h2>
                        <p>All content on the Platform, including text, graphics, logos, and software, is the property of DermaCare and is protected by copyright and other intellectual property laws.</p>
                    </section>

                    <section>
                        <h2>9. Limitation of Liability</h2>
                        <p>DermaCare shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.</p>
                    </section>

                    <section>
                        <h2>10. Termination</h2>
                        <p>We may terminate or suspend your account at any time for violations of these terms. You may also terminate your account at any time by contacting support.</p>
                    </section>

                    <section>
                        <h2>11. Changes to Terms</h2>
                        <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the service constitutes acceptance of new terms.</p>
                    </section>

                    <section>
                        <h2>12. Contact Information</h2>
                        <p>For questions about these Terms of Service, please contact us:</p>
                        <ul>
                            <li>Contact Person: Jagatkari Nikhil</li>
                            <li>Email: nikhiljagatkari@gmail.com</li>
                            <li>Phone: +91 7569382457</li>
                            <li>Address: 25-5-226/B/A/1, Venkateshwara Colony, Beside Almas Function, Jadcherla Mahabubnagar, Telangana-509301</li>
                        </ul>
                    </section>

                    <div className="actions">
                        <Link to="/" className="btn-back">Back to Home</Link>
                        <Link to="/contact" className="btn-contact">Contact Us</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
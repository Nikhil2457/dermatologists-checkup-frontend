import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-page">
            <div className="container">
                <nav className="breadcrumb">
                    <Link to="/">Home</Link> / Privacy Policy
                </nav>

                <div className="content">
                    <h1>Privacy Policy</h1>
                    <p className="last-updated">Last updated: December 2024</p>

                    <section>
                        <h2>1. Information We Collect</h2>
                        <h3>Personal Information</h3>
                        <ul>
                            <li>Name, email address, and phone number</li>
                            <li>Date of birth and gender</li>
                            <li>Medical history and health information</li>
                            <li>Payment information (processed securely by PhonePe)</li>
                            <li>Location data for finding nearby dermatologists</li>
                        </ul>

                        <h3>Usage Information</h3>
                        <ul>
                            <li>Consultation history and preferences</li>
                            <li>Device information and IP address</li>
                            <li>App usage patterns and interactions</li>
                            <li>Communication logs with healthcare providers</li>
                        </ul>
                    </section>

                    <section>
                        <h2>2. How We Use Your Information</h2>
                        <ul>
                            <li>Provide telemedicine services and consultations</li>
                            <li>Connect you with appropriate dermatologists</li>
                            <li>Process payments and manage billing</li>
                            <li>Send appointment reminders and notifications</li>
                            <li>Improve our services and user experience</li>
                            <li>Comply with legal and regulatory requirements</li>
                            <li>Provide customer support and resolve issues</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Information Sharing</h2>
                        <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                        
                        <h3>With Healthcare Providers</h3>
                        <ul>
                            <li>Dermatologists you choose to consult with</li>
                            <li>Medical information necessary for treatment</li>
                            <li>Consultation history and notes</li>
                        </ul>

                        <h3>With Service Providers</h3>
                        <ul>
                            <li>Payment processors (PhonePe) for secure transactions</li>
                            <li>Cloud storage providers for data hosting</li>
                            <li>Communication services for notifications</li>
                        </ul>

                        <h3>Legal Requirements</h3>
                        <ul>
                            <li>When required by law or court order</li>
                            <li>To protect our rights and safety</li>
                            <li>To prevent fraud or security threats</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Data Security</h2>
                        <p>We implement industry-standard security measures to protect your information:</p>
                        <ul>
                            <li>End-to-end encryption for all communications</li>
                            <li>Secure data centers with physical and digital security</li>
                            <li>Regular security audits and updates</li>
                            <li>HIPAA compliance for medical data</li>
                            <li>Access controls and authentication</li>
                            <li>Regular backups and disaster recovery</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Your Rights</h2>
                        <p>You have the following rights regarding your personal information:</p>
                        <ul>
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                            <li><strong>Portability:</strong> Export your data in a standard format</li>
                            <li><strong>Restriction:</strong> Limit how we use your information</li>
                            <li><strong>Objection:</strong> Object to certain processing activities</li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Cookies and Tracking</h2>
                        <p>We use cookies and similar technologies to:</p>
                        <ul>
                            <li>Remember your preferences and settings</li>
                            <li>Analyze website usage and performance</li>
                            <li>Provide personalized content and recommendations</li>
                            <li>Ensure security and prevent fraud</li>
                        </ul>
                        <p>You can control cookie settings through your browser preferences.</p>
                    </section>

                    <section>
                        <h2>7. Children's Privacy</h2>
                        <p>Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.</p>
                    </section>

                    <section>
                        <h2>8. International Data Transfers</h2>
                        <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.</p>
                    </section>

                    <section>
                        <h2>9. Data Retention</h2>
                        <p>We retain your information for as long as necessary to:</p>
                        <ul>
                            <li>Provide our services</li>
                            <li>Comply with legal obligations</li>
                            <li>Resolve disputes and enforce agreements</li>
                            <li>Maintain medical records as required by law</li>
                        </ul>
                        <p>You may request deletion of your account and data at any time.</p>
                    </section>

                    <section>
                        <h2>10. Changes to This Policy</h2>
                        <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
                        <ul>
                            <li>Posting the updated policy on our website</li>
                            <li>Sending email notifications to registered users</li>
                            <li>Displaying in-app notifications</li>
                        </ul>
                        <p>Continued use of our service after changes constitutes acceptance of the updated policy.</p>
                    </section>

                    <section>
                        <h2>11. Contact Us</h2>
                        <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
                        <ul>
                            <li>Email: privacy@dermacare.com</li>
                            <li>Phone: +1 (555) 123-4567</li>
                            <li>Address: [Your Business Address]</li>
                            <li>Data Protection Officer: dpo@dermacare.com</li>
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

export default PrivacyPolicy;
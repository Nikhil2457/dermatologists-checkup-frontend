import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const RefundPolicy = () => {
    return (
        <div className="refund-page">
            <div className="container">
                <nav className="breadcrumb">
                    <Link to="/">Home</Link> / Refund Policy
                </nav>

                <div className="content">
                    <h1>Refund Policy</h1>
                    <p className="last-updated">Last updated: December 2024</p>

                    <section>
                        <h2>1. Overview</h2>
                        <p>At DermaCare, we strive to provide the highest quality telemedicine services. This refund policy outlines the circumstances under which refunds may be provided for our consultation services.</p>
                    </section>

                    <section>
                        <h2>2. Consultation Refunds</h2>
                        
                        <h3>Eligible for Full Refund</h3>
                        <ul>
                            <li><strong>Technical Issues:</strong> If the consultation cannot be completed due to platform technical problems</li>
                            <li><strong>Provider No-Show:</strong> If the dermatologist fails to join the consultation within 15 minutes of the scheduled time</li>
                            <li><strong>Service Unavailability:</strong> If we cannot provide the requested service</li>
                            <li><strong>Platform Errors:</strong> If payment is charged but consultation is not initiated</li>
                        </ul>

                        <h3>Partial Refund (50%)</h3>
                        <ul>
                            <li><strong>Early Termination:</strong> If consultation ends before 10 minutes due to technical issues</li>
                            <li><strong>Provider Issues:</strong> If dermatologist cannot provide adequate consultation due to their technical problems</li>
                        </ul>

                        <h3>Not Eligible for Refund</h3>
                        <ul>
                            <li>Completed consultations with satisfactory service</li>
                            <li>Patient no-show or late arrival (more than 10 minutes)</li>
                            <li>Patient-initiated cancellations within 2 hours of appointment</li>
                            <li>Disagreement with medical advice or diagnosis</li>
                            <li>Patient technical issues (internet, device problems)</li>
                            <li>Emergency consultations (higher fees are non-refundable)</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Refund Process</h2>
                        <h3>How to Request a Refund</h3>
                        <ol>
                            <li>Contact our support team within 24 hours of the consultation</li>
                            <li>Provide your order ID and consultation details</li>
                            <li>Explain the reason for the refund request</li>
                            <li>Include any relevant screenshots or evidence</li>
                        </ol>

                        <h3>Refund Timeline</h3>
                        <ul>
                            <li><strong>Review Period:</strong> 2-3 business days for refund evaluation</li>
                            <li><strong>Processing Time:</strong> 5-7 business days for approved refunds</li>
                            <li><strong>Payment Method:</strong> Refunds will be processed to the original payment method</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Emergency Consultation Refunds</h2>
                        <p>Emergency consultations have higher fees due to priority access and immediate availability. These fees are generally non-refundable except in cases of:</p>
                        <ul>
                            <li>Platform technical failures</li>
                            <li>Provider unavailability despite payment</li>
                            <li>Service cancellation by DermaCare</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Cancellation Policy</h2>
                        <h3>Free Cancellation</h3>
                        <ul>
                            <li>More than 24 hours before appointment</li>
                            <li>Full refund provided</li>
                        </ul>

                        <h3>Late Cancellation (2-24 hours)</h3>
                        <ul>
                            <li>50% refund provided</li>
                            <li>50% cancellation fee applies</li>
                        </ul>

                        <h3>No-Show (Less than 2 hours)</h3>
                        <ul>
                            <li>No refund provided</li>
                            <li>Full consultation fee charged</li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Dispute Resolution</h2>
                        <p>If you disagree with a refund decision:</p>
                        <ol>
                            <li>Contact our customer support team</li>
                            <li>Provide additional evidence or clarification</li>
                            <li>Request escalation to a senior representative</li>
                            <li>If still unresolved, we may offer alternative solutions</li>
                        </ol>
                    </section>

                    <section>
                        <h2>7. Payment Processing</h2>
                        <ul>
                            <li>All payments are processed securely through PhonePe</li>
                            <li>Refunds will be credited to the original payment method with 7- 10 working days</li>
                            <li>Bank processing times may vary (3-10 business days)</li>
                            <li>You will receive email confirmation when refund is processed</li>
                        </ul>
                    </section>

                    <section>
                        <h2>8. Contact Information</h2>
                        <p>For refund requests or questions about this policy:</p>
                        <ul>
                            <li>Contact Person: Jagatkari Nikhil</li>
                            <li>Email: nikhiljagatkari@gmail.com</li>
                            <li>Phone: +91 7569382457</li>
                            <li>Address: 25-5-226/B/A/1, Venkateshwara Colony, Beside Almas Function, Jadcherla Mahabubnagar, Telangana-509301</li>
                            <li>Support Hours: 24/7</li>
                            <li>Response Time: Within 24 hours</li>
                        </ul>
                    </section>

                    <section>
                        <h2>9. Policy Updates</h2>
                        <p>This refund policy may be updated periodically. Users will be notified of significant changes via email or in-app notifications. Continued use of our services constitutes acceptance of the updated policy.</p>
                    </section>

                    <div className="actions">
                        <Link to="/" className="btn-back">Back to Home</Link>
                        <Link to="/contact" className="btn-contact">Contact Support</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy; 
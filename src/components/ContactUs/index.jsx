import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        contactMethod: 'email'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                contactMethod: 'email'
            });
        }, 2000);
    };

    const contactMethods = [
        {
            icon: '📧',
            title: 'Email Support',
            description: 'Get detailed responses within 24 hours',
            contact: 'nikhiljagatkari@gmail.com',
            response: '24 hours'
        },
        {
            icon: '📞',
            title: 'Phone Support',
            description: 'Speak directly with our support team',
            contact: '+91 7569382457',
            response: 'Immediate'
        },
        {
            icon: '💬',
            title: 'Live Chat',
            description: 'Real-time chat support during business hours',
            contact: 'Available 9 AM - 6 PM IST',
            response: 'Real-time'
        },
        {
            icon: '🚨',
            title: 'Emergency Support',
            description: 'For urgent medical or technical issues',
            contact: '+91 7569382457',
            response: 'Immediate'
        }
    ];

    const faqs = [
        {
            question: 'How do I book an appointment?',
            answer: 'You can book an appointment through our platform by selecting a dermatologist, choosing an available time slot, and completing the payment process.'
        },
        {
            question: 'What if I need to cancel my appointment?',
            answer: 'You can cancel appointments up to 24 hours before the scheduled time for a full refund. Late cancellations may incur fees.'
        },
        {
            question: 'Is my medical information secure?',
            answer: 'Yes, we use industry-standard encryption and comply with HIPAA regulations to ensure your medical data is completely secure.'
        },
        {
            question: 'Can I get a prescription through online consultation?',
            answer: 'Yes, dermatologists can prescribe medications when appropriate. Prescriptions are sent directly to your preferred pharmacy.'
        }
    ];

    return (
        <div className="contact-page">
            <div className="container">
                <nav className="breadcrumb">
                    <Link to="/">Home</Link> / Contact Us
                </nav>

                <div className="contact-header">
                    <h1>Contact Us</h1>
                    <p>We're here to help! Get in touch with us through any of the methods below.</p>
                </div>

                {/* Contact Methods */}
                <div className="contact-methods">
                    {contactMethods.map((method, index) => (
                        <div key={index} className="contact-method-card">
                            <div className="method-icon">{method.icon}</div>
                            <h3>{method.title}</h3>
                            <p>{method.description}</p>
                            <div className="contact-info">
                                <strong>{method.contact}</strong>
                                <span className="response-time">Response: {method.response}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="contact-content">
                    <div className="contact-form-section">
                        <h2>Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contactMethod">Preferred Contact Method</label>
                                    <select
                                        id="contactMethod"
                                        name="contactMethod"
                                        value={formData.contactMethod}
                                        onChange={handleInputChange}
                                    >
                                        <option value="email">Email</option>
                                        <option value="phone">Phone</option>
                                        <option value="both">Both</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject *</label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select a subject</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="technical">Technical Support</option>
                                    <option value="billing">Billing & Payment</option>
                                    <option value="appointment">Appointment Issues</option>
                                    <option value="refund">Refund Request</option>
                                    <option value="feedback">Feedback & Suggestions</option>
                                    <option value="emergency">Emergency Support</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows="6"
                                    placeholder="Please describe your issue or question in detail..."
                                    required
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className="submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>

                            {submitStatus === 'success' && (
                                <div className="success-message">
                                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="contact-info-section">
                        <h2>Frequently Asked Questions</h2>
                        <div className="faq-list">
                            {faqs.map((faq, index) => (
                                <div key={index} className="faq-item">
                                    <h4>{faq.question}</h4>
                                    <p>{faq.answer}</p>
                                </div>
                            ))}
                        </div>

                        <div className="office-info">
                            <h2>Office Information</h2>
                            <div className="info-item">
                                <strong>Contact Person:</strong>
                                <p>Jagatkari Nikhil</p>
                            </div>
                            <div className="info-item">
                                <strong>Business Hours:</strong>
                                <p>Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                                Saturday: 10:00 AM - 4:00 PM IST<br />
                                Sunday: Emergency Support Only</p>
                            </div>
                            <div className="info-item">
                                <strong>Address:</strong>
                                <p>25-5-226/B/A/1, Venkateshwara Colony<br />
                                Beside Almas Function, Jadcherla<br />
                                Mahabubnagar, Telangana-509301<br />
                                India</p>
                            </div>
                            <div className="info-item">
                                <strong>Phone:</strong>
                                <p>+91 7569382457</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="actions">
                    <Link to="/" className="btn-back">Back to Home</Link>
                    <Link to="/terms" className="btn-terms">Terms of Service</Link>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
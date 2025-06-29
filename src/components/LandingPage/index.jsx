import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './index.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [isScrolled, setIsScrolled] = useState(false);

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
        { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'zh', name: '中文', flag: '🇨🇳' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const changeLanguage = (languageCode) => {
        setCurrentLanguage(languageCode);
        i18n.changeLanguage(languageCode);
    };

    const handleAuthNavigation = (type) => {
        navigate('/auth', { state: { authType: type } });
    };

    return (
        <div className="landing-page">
            {/* Header */}
            <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="header-content">
                    <div className="logo">
                    <img src="/logo.jpg" alt="Insta-Appointment Logo" className="logo-img" />
                    <span className="logo-text">DERMA CARE</span>
                    </div>
                    
                    <div className="language-selector">
                        <select 
                            value={currentLanguage} 
                            onChange={(e) => changeLanguage(e.target.value)}
                            className="language-dropdown"
                        >
                            {languages.map(lang => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.flag} {lang.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="auth-buttons">
                        <button 
                            className="btn-signin"
                            onClick={() => handleAuthNavigation('signin')}
                        >
                            {t('Sign In')}
                        </button>
                        <button 
                            className="btn-signup"
                            onClick={() => handleAuthNavigation('signup')}
                        >
                            {t('Sign Up')}
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            {t('Expert Dermatology Care')}
                            <span className="highlight"> {t('at Your Fingertips')}</span>
                        </h1>
                        <p className="hero-subtitle">
                            {t('One Stop Software For all Dermatologists appointments and checkups')}
                        </p>
                        <div className="hero-buttons">
                            <h2 className="software-provider-text">
                                {t('Best Software provider for Dermatologist')}
                            </h2>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="three-d-card">
                            <div className="card-content">
                                <div className="doctor-avatar">👨‍⚕️</div>
                                <div className="patient-avatar">👤</div>
                                <div className="connection-line"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-section">
                <div className="container">
                    <h2 className="section-title">{t('Why Choose DermaCare?')}</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">📍</div>
                            <h3>{t('Location-Based Matching')}</h3>
                            <p>{t('Find dermatologists and hospitals near you based on your location for convenient in-person visits when needed.')}</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⏰</div>
                            <h3>{t('24/7 Availability')}</h3>
                            <p>{t('Access dermatological care anytime, anywhere. Emergency consultations available with priority support.')}</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💰</div>
                            <h3>{t('Affordable Care')}</h3>
                            <p>{t('Minimal consultation fees with transparent pricing. No hidden costs or surprise bills.')}</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3>{t('Smart Scheduling')}</h3>
                            <p>{t('Book appointments when doctors are available. Real-time availability tracking and instant confirmations.')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="services-section">
                <div className="container">
                    <h2 className="section-title">{t('Our Services')}</h2>
                    <div className="services-grid">
                        <div className="service-card">
                            <div className="service-icon">📞</div>
                            <h3>{t('Voice Consultation')}</h3>
                            <p>{t('Clear audio consultations with dermatologists for initial assessments and follow-ups.')}</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">💬</div>
                            <h3>{t('Chat Support')}</h3>
                            <p>{t('Text-based consultations with image sharing for quick questions and prescription renewals.')}</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">📹</div>
                            <h3>{t('Video Consultation')}</h3>
                            <p>{t('Face-to-face video consultations for comprehensive skin examinations and detailed discussions.')}</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">🚨</div>
                            <h3>{t('Emergency Care')}</h3>
                            <p>{t('Priority access for serious skin conditions with immediate specialist attention and higher consultation fees.')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Payment & Pricing */}
            <section className="payment-section">
                <div className="container">
                    <h2 className="section-title">{t('Payment & Pricing')}</h2>
                    <div className="payment-options">
                        <div className="payment-card">
                            <div className="payment-title">{t('Per Appointment')}</div>
                            <div className="payment-price">₹199</div>
                            <div className="payment-desc">{t('Pay only when you book an appointment. No hidden fees!')}</div>
                            <ul className="payment-features">
                                <li>✔️ {t('One-on-one consultation')}</li>
                                <li>✔️ {t('Includes chat, call, or video')}</li>
                                <li>✔️ {t('Digital prescription')}</li>
                                <li>✔️ {t('24/7 support')}</li>
                            </ul>
                            <button className="payment-btn" onClick={() => navigate('/auth')}>{t('Book Now')}</button>
                        </div>
                        <div className="payment-card">
                            <div className="payment-title">{t('Monthly Subscription')}</div>
                            <div className="payment-price">₹999</div>
                            <div className="payment-desc">{t('Unlimited appointments for a month. Best for ongoing care!')}</div>
                            <ul className="payment-features">
                                <li>✔️ {t('Unlimited consultations')}</li>
                                <li>✔️ {t('Priority booking')}</li>
                                <li>✔️ {t('Free follow-ups')}</li>
                                <li>✔️ {t('Exclusive health tips')}</li>
                            </ul>
                            <button className="payment-btn" onClick={() => navigate('/auth')}>{t('Subscribe Now')}</button>
                        </div>
                    </div>
                    <p style={{marginTop: '2rem', color: '#888', fontSize: '1rem'}}>
                        {t('All payments are processed securely. You can choose to pay per appointment or subscribe monthly for extra savings and benefits!')}
                    </p>
                </div>
            </section>

            {/* Benefits */}
            <section className="benefits-section">
                <div className="container">
                    <h2 className="section-title">{t('Benefits')}</h2>
                    <div className="benefits-list">
                        <div className="benefit-item">
                            <div className="benefit-number">01</div>
                            <div className="benefit-content">
                                <h3>{t('Convenience')}</h3>
                                <p>{t('No travel time, no waiting rooms. Get expert care from anywhere with internet access.')}</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-number">02</div>
                            <div className="benefit-content">
                                <h3>{t('Cost-Effective')}</h3>
                                <p>{t('Save on travel costs and time. Affordable consultation fees with transparent pricing.')}</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-number">03</div>
                            <div className="benefit-content">
                                <h3>{t('Expert Care')}</h3>
                                <p>{t('Access to certified dermatologists with verified credentials and proven track records.')}</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-number">04</div>
                            <div className="benefit-content">
                                <h3>{t('Privacy & Security')}</h3>
                                <p>{t('HIPAA-compliant platform with secure data encryption and patient confidentiality.')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Future Vision */}
            <section className="future-section">
                <div className="container">
                    <h2 className="section-title">{t('Future Vision')}</h2>
                    <div className="vision-grid">
                        <div className="vision-card">
                            <div className="vision-icon">🤖</div>
                            <h3>{t('AI-Powered Diagnosis')}</h3>
                            <p>{t('Advanced AI algorithms for preliminary skin condition analysis and treatment recommendations.')}</p>
                        </div>
                        <div className="vision-card">
                            <div className="vision-icon">📱</div>
                            <h3>{t('Mobile App')}</h3>
                            <p>{t('Dedicated mobile applications for iOS and Android with enhanced features and offline capabilities.')}</p>
                        </div>
                        <div className="vision-card">
                            <div className="vision-icon">🏥</div>
                            <h3>{t('Hospital Integration')}</h3>
                            <p>{t('Seamless integration with local hospitals for referrals and coordinated care management.')}</p>
                        </div>
                        <div className="vision-card">
                            <div className="vision-icon">📊</div>
                            <h3>{t('Health Analytics')}</h3>
                            <p>{t('Personalized health insights and progress tracking with data-driven treatment recommendations.')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3>DermaCare</h3>
                            <p>{t('Your trusted partner for dermatological care. Professional, convenient, and affordable skin health solutions.')}</p>
                        </div>
                        <div className="footer-section">
                            <h3>{t('Quick Links')}</h3>
                            <ul>
                                <li><Link to="/terms">{t('Terms of Service')}</Link></li>
                                <li><Link to="/privacy">{t('Privacy Policy')}</Link></li>
                                <li><Link to="/refund">{t('Refund Policy')}</Link></li>
                                <li><Link to="/contact">{t('Contact Us')}</Link></li>
                                </ul>
                        </div>
                        <div className="footer-section">
                            <h3>{t('Contact Info')}</h3>
                            <ul>
                                <li>📧 nikhiljagatkari@gmail.com</li>
                                <li>📞 +91 7569382457</li>
                                <li>📍 25-5-226/B/A/1, Venkateshwara Colony, Beside Almas Function, Jadcherla Mahabubnagar, Telangana-509301</li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h3>{t('Follow Us')}</h3>
                            <div className="social-links">
                                <Link to="#" className="social-link">📘</Link>
                                <Link to="#" className="social-link">📷</Link>
                                <Link to="#" className="social-link">🐦</Link>
                                <Link to="#" className="social-link">💼</Link>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 DermaCare. {t('All rights reserved.')}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage; 
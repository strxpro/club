import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../LanguageContext';

export default function Contact() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <section id="contatti" className="relative bg-navy-dark z-[45]" style={{ paddingTop: '160px', paddingBottom: '100px' }}>

            {/* ── Title Header ── */}
            <div style={{ textAlign: 'center', marginBottom: '56px', padding: '0 24px' }}>
                <motion.span
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    style={{
                        display: 'inline-block',
                        padding: '6px 18px',
                        borderRadius: '999px',
                        background: 'rgba(200,36,35,0.1)',
                        color: '#c82423',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        marginBottom: '16px',
                        border: '1px solid rgba(200,36,35,0.2)',
                    }}
                >
                    {t('contact_title')}
                </motion.span>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    style={{
                        fontSize: 'clamp(32px, 5vw, 64px)',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        color: '#fff',
                        lineHeight: 1.1,
                        marginBottom: '16px',
                    }}
                >
                    {t('contact_badge')}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '17px',
                        fontWeight: 300,
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: 1.6,
                    }}
                >
                    {t('contact_subtitle')}
                </motion.p>
            </div>

            {/* ── Contact Card ── */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
                    viewport={{ once: true, amount: 0.1 }}
                    style={{
                        background: '#0c1020',
                        borderRadius: '18px',
                        overflow: 'hidden',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.06)',
                    }}
                >
                    {/* Map strip — bright/normal colors */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        viewport={{ once: true }}
                        style={{ width: '100%', height: '220px', position: 'relative' }}
                    >
                        <iframe
                            title="Club Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2979.7915332612745!2d9.1868305!3d41.242409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d90d8dfeb9e8ed%3A0x6bba46c5a3d0ec42!2sVia%20del%20Porto%2C%2015%2C%2007028%20Santa%20Teresa%20Gallura%20SS%2C%20Italy!5e0!3m2!1sen!2sus!4v1710352520000!5m2!1sen!2sus"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        />
                    </motion.div>

                    {/* Contact Card Body */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        padding: '48px 40px',
                        gap: '40px',
                    }}>
                        {/* LEFT — Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                            style={{ flex: '1 1 280px', minWidth: '240px' }}
                        >
                            <h3 style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontSize: '32px',
                                fontWeight: 400,
                                color: '#ffffff',
                                marginBottom: '36px',
                                lineHeight: 1.15,
                            }}>
                                {t('contact_title')}
                            </h3>

                            {/* Email */}
                            <div style={{ marginBottom: '22px' }}>
                                <span style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px', letterSpacing: '0.03em' }}>{t('contact_email')}:</span>
                                <a href="mailto:info@ccgigirivastg.it" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>
                                    info@ccgigirivastg.it
                                </a>
                            </div>

                            {/* Phone */}
                            <div style={{ marginBottom: '22px' }}>
                                <span style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px', letterSpacing: '0.03em' }}>{t('contact_phone_label')}:</span>
                                <a href="tel:+39078975xxxx" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>
                                    +39 0789 75X XXX
                                </a>
                            </div>

                            {/* Address */}
                            <div style={{ marginBottom: '28px' }}>
                                <span style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px', letterSpacing: '0.03em' }}>{t('contact_address_label')}:</span>
                                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', fontWeight: 500, lineHeight: 1.55 }}>
                                    Via del Porto, 15<br />
                                    07028 Santa Teresa Gallura<br />
                                    Province of Gallura, North-East Sardinia
                                </span>
                            </div>

                            {/* Social — Facebook + Instagram only */}
                            <div>
                                <span style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '10px', letterSpacing: '0.03em' }}>Social</span>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <SocialIcon href="https://facebook.com" label="Facebook">
                                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                    </SocialIcon>
                                    <SocialIcon href="https://instagram.com" label="Instagram">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                    </SocialIcon>
                                </div>
                            </div>
                        </motion.div>

                        {/* RIGHT — Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                            style={{ flex: '1.2 1 300px', minWidth: '280px' }}
                        >
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                    <div style={{ flex: '1 1 180px' }}>
                                        <label style={labelStyle}>{t('contact_name')}</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            style={inputStyle}
                                            placeholder={t('contact_name')}
                                            required
                                        />
                                    </div>
                                    <div style={{ flex: '1 1 180px' }}>
                                        <label style={labelStyle}>{t('contact_email')}</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            style={inputStyle}
                                            placeholder={t('contact_email')}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>{t('contact_message')}</label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        style={{ ...inputStyle, minHeight: '160px', resize: 'none' }}
                                        placeholder={t('contact_message')}
                                        required
                                    />
                                </div>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        width: '100%',
                                        padding: '14px 24px',
                                        background: '#c82423',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'background 0.25s ease',
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase',
                                        marginTop: '4px',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#d63031'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#c82423'}
                                >
                                    {submitted ? '✓  Inviato!' : t('contact_send')}
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: '6px',
};

const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
};

function SocialIcon({ href, label, children }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.08)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(200,36,35,0.2)'; e.currentTarget.style.borderColor = 'rgba(200,36,35,0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {children}
            </svg>
        </a>
    );
}

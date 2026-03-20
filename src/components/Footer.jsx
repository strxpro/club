import { useTranslation } from '../LanguageContext';

export default function Footer({ isCagliariPage }) {
    const { t } = useTranslation();
    const year = new Date().getFullYear();

    const scrollTo = (id) => {
        if (isCagliariPage) {
            window.location.href = `./index.html#${id}`;
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="bg-navy text-white relative z-[60]" style={{ boxShadow: '0 -20px 60px rgba(0,0,0,0.4)' }}>

            <div className="container-main" style={{ padding: '48px 24px 64px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', alignItems: 'start' }}>
                    {/* Logo & Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <img src="/images/t.png" alt="CC Gigi Riva STG" style={{ width: '180px', height: 'auto', objectFit: 'contain' }} />
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', lineHeight: 1.6 }}>
                            Cagliari Club Gigi Riva<br />Santa Teresa Gallura
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>{t('footer_links')}</span>
                        <button onClick={() => scrollTo('gigiriva')} style={linkStyle}>{t('nav_gigiriva')}</button>
                        <button onClick={() => scrollTo('storia')} style={linkStyle}>{t('nav_storia')}</button>
                        <button onClick={() => scrollTo('galleria')} style={linkStyle}>{t('nav_galleria')}</button>
                        <button onClick={() => scrollTo('contatti')} style={linkStyle}>{t('nav_contatti')}</button>
                    </div>

                    {/* Contact Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>{t('contact_title')}</span>
                        <a href="mailto:info@ccgigirivastg.it" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}>
                            info@ccgigirivastg.it
                        </a>
                        <a href="tel:+39078975xxxx" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}>
                            +39 0789 75X XXX
                        </a>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
                            Via del Porto, 15<br />
                            07028 Santa Teresa Gallura<br />
                            Sardegna, Italia
                        </p>
                    </div>
                </div>

                {/* Bottom */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '48px', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', margin: 0 }}>© {year} Cagliari Club Gigi Riva STG. {t('footer_rights')}.</p>
                    <a href="/privacy-policy" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textDecoration: 'underline', textUnderlineOffset: '3px' }}>{t('footer_privacy')}</a>
                </div>
            </div>
        </footer>
    );
}

const linkStyle = {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    padding: 0,
    transition: 'color 0.2s',
    fontFamily: 'inherit',
};

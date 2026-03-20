import React from 'react';
import { useTranslation } from '../LanguageContext';
import { ParallaxScrollSecond } from './ui/parallax-scroll';

const GALLERY_IMAGES = [
    { src: "/images/przerobione/038be84a-efc2-4b4b-a411-e021cc6a22f7_125852147.jpeg", alt: "Club foto 1" },
    { src: "/images/przerobione/15e8b4ae-eb9f-4b9d-84c8-034b04f99fdb_131134252.jpeg", alt: "Club foto 2" },
    { src: "/images/przerobione/1bbe7979-ddb7-4ed0-a4fc-ccd90fb91e64_13334534.jpeg", alt: "Club foto 3" },
    { src: "/images/przerobione/2ee611ac-8498-48dd-8316-a43c465fdf0e_123722361.png", alt: "Club foto 4" },
    { src: "/images/przerobione/5c6c6bde-e822-4cd4-85f8-e1a5a1e876ef_12504578.jpeg", alt: "Club foto 5" },
    { src: "/images/przerobione/668b360b-c79b-4c4a-a48a-d7f6de5f0b6d_13028377.jpeg", alt: "Club foto 6" },
    { src: "/images/przerobione/7cf2e33f-6ef9-47d7-b27c-8a0b284e95b2_125624639.jpeg", alt: "Club foto 7" },
    { src: "/images/przerobione/7d6dc7aa-f5cd-459f-a777-4c711bced1a3_124456249.png", alt: "Club foto 8" },
    { src: "/images/przerobione/97fe9755-49c2-4993-8993-d39a6e207a41_125414882.jpeg", alt: "Club foto 9" },
    { src: "/images/przerobione/ChatGPT Image 20 mar 2026, 05_26_55.png", alt: "Club foto 10" },
    { src: "/images/przerobione/ChatGPT Image 20 mar 2026, 05_30_14.png", alt: "Club foto 11" },
    { src: "/images/przerobione/Projekt bez nazwy (2).png", alt: "Club foto 12" },
    { src: "/images/przerobione/db93dac1-b8a2-4415-9cdf-1358a904f904_13523115.jpeg", alt: "Club foto 13" },
    { src: "/images/przerobione/ea1f1907-a358-4f4a-b3c5-8607872a4c8a_13949682.jpeg", alt: "Club foto 14" },
    { src: "/images/przerobione/gemini-2.5-flash-image_czy_moglbys_mi_poprawic_to_zdjecie_na_bardzeij_profesjonalne_odpowieni_color_gra-0.jpg", alt: "Club foto 15" }
];

export default function Gallery() {
    const { t } = useTranslation();

    return (
        <div id="galleria" className="relative z-30">
            {/* HEADER - card sliding up from bottom, overlapping Forza Cagliari */}
            <div className="relative bg-navy-dark pt-32 lg:pt-48 -mt-40 lg:-mt-56 z-30 rounded-t-[3rem] shadow-[0_-30px_80px_rgba(0,0,0,0.7)]">
                <div style={{ width: '100%', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '24px', paddingRight: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '32px', paddingBottom: '32px' }}>
                        <span style={{ marginTop: '8%' }} className="section-badge !bg-crimson/10 !text-crimson border border-crimson/20 px-6 py-2">
                            {t('gallery_header_1')}
                        </span>
                        <h2 className="text-4xl lg:text-7xl font-heading text-white tracking-normal leading-[1.4] mb-6 px-4 py-4" style={{ overflow: 'visible' }}>
                            {t('gallery_header_2').replace('calcio', '').replace('pi\u0142ka no\u017Cna', '').replace('football', '').replace('Fu\u00dfball', '').replace('f\u00FAtbol', '')} 
                            <span className="text-crimson italic">
                                {t('gallery_header_2').includes('calcio') ? 'calcio' : 
                                 t('gallery_header_2').includes('pi\u0142ka no\u017Cna') ? 'pi\u0142ka no\u017Cna' : 
                                 t('gallery_header_2').includes('football') ? 'football' : 
                                 t('gallery_header_2').includes('Fu\u00dfball') ? 'Fu\u00dfball' : 
                                 t('gallery_header_2').includes('f\u00FAtbol') ? 'f\u00FAtbol' : 'calcio'}
                            </span>
                        </h2>
                        <p className="text-white/60 text-lg lg:text-xl font-light max-w-2xl mx-auto text-center">
                            {t('gallery_desc')}
                        </p>
                    </div>
                </div>
            </div>

            {/* GALLERY GRID - NO overflow hidden, sticky works here */}
            <div className="relative bg-navy-dark z-20">
                <ParallaxScrollSecond images={GALLERY_IMAGES} />
                <div className="h-24 lg:h-40" />
            </div>
        </div>
    );
}


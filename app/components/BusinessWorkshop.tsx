import React, { useState, useEffect, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';

const BusinessWorkshop: React.FC = () => {
    const { t } = useTranslation();
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const animateShapes = () => {
            const shapes = document.querySelectorAll('.bw-animated-shape');
            shapes.forEach(shape => {
                const speed = Math.random() * 5 + 2; // Hızı artırdık
                const rotation = Math.random() * 360;
                const scale = Math.random() * 0.5 + 0.5;
                const duration = Math.random() * 10 + 5; // Süreyi azalttık

                // Başlangıç pozisyonunu rastgele belirleme
                const startX = Math.random() * 100;
                const startY = Math.random() * 100;

                (shape as HTMLElement).style.left = `${startX}%`;
                (shape as HTMLElement).style.top = `${startY}%`;

                (shape as HTMLElement).animate([
                    { transform: `translate(0, 0) rotate(0deg) scale(${scale})` },
                    { transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) rotate(${rotation}deg) scale(${scale})` }
                ], {
                    duration: duration * 1000,
                    iterations: Infinity,
                    direction: 'alternate',
                    easing: 'ease-in-out'
                });
            });
        };

        animateShapes();

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const decorations = document.querySelectorAll('.bw-decoration');
            decorations.forEach((decoration, index) => {
                const speed = 0.1 + (index * 0.05);
                (decoration as HTMLElement).style.transform = `translateY(${scrollY * speed}px)`;
            });
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScrollToCharacters = () => {
        const charactersSection = document.getElementById('characters');
        if (charactersSection) {
            charactersSection.scrollIntoView({ behavior: 'smooth' });
        }
    };


    return (
        <section className="bw-section">
            <div className="bw-animated-background">
                {[...Array(20)].map((_, index) => ( // Şekil sayısını artırdık
                    <div key={index} className={`bw-animated-shape bw-${['circle', 'square', 'triangle', 'cross', 'star', 'hexagon', 'diamond', 'rectangle'][index % 8]}`}></div>
                ))}
            </div>
            <div className="bw-container">
                <div className="bw-content">
                    <h1 className="bw-title">
                    <Trans i18nKey="children_workshop" />
                    </h1>
                    <h2 className="bw-subtitle">{t('coding_and_robotics')}</h2>
                    <p className="bw-description">
                    {t('bw_description')}
                    </p>
                    <div className="bw-buttons">
                        <button
                            ref={buttonRef}
                            className="bw-btn bw-btn-primary"
                            onClick={handleScrollToCharacters}
                        >
                            {t('start_now')} !
                        </button>
                        <a href="https://siberci.com/wp-content/uploads/2024/08/EN-Discover-Computer-Words-An-Easy-Guide-for-Young-Learners.pdf" target='_blank'  className="bw-btn bw-btn-primary" download>
                            {t('download_the_book')} !
                        </a>
                    </div>
                </div>
                <div className="bw-image-container">
                    <div className="bw-image-wrapper">
                        <img src="/images/logo.webp" alt="Kodlama öğrenen çocuklar" className="bw-main-image" />
                    </div>
                    <div className="bw-decoration bw-gear"></div>
                    <div className="bw-decoration bw-robot"></div>
                    <div className="bw-decoration bw-code"></div>
                    <div className="bw-decoration bw-lightbulb"></div>
                    <div className="bw-decoration bw-rocket"></div>
                </div>
            </div>
        </section>
    );
};

export default BusinessWorkshop;
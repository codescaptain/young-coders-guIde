import React from 'react';

const FunProjectSection: React.FC = () => {
  return (
    <section className="fun-project-section">
      <div className="parallax-bg"></div>
      <div className="container">
        <h2 className="project-title">Kodlama Macerası</h2>
        
        <div className="project-description top">
          <p>Bizimle birlikte teknolojinin renkli dünyasına adım at! "Çocuklar için Teknoloji Eğitimi" web sitemiz, 6-12 yaş arası çocuklara yönelik olarak tasarlanmıştır ve bilgisayar bilimi, programlama, robotik ve dijital tasarım gibi temel teknoloji konularını eğlenceli ve etkileşimli bir şekilde öğretmeyi amaçlar.</p>
          <p>Projemiz, çocukların teknolojiyi sadece kullanıcı olarak değil, aynı zamanda yaratıcı olarak da deneyimlemelerini sağlayacak şekilde kurgulanmıştır. Eğitim modüllerimiz, çocukların eleştirel düşünme, problem çözme ve yaratıcı becerilerini geliştirmeye odaklanırken, onlara bilgisayar dünyasının kapılarını aralar.</p>
        </div>

        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3 className="feature-title">Eğlenceli Öğrenme</h3>
            <p className="feature-description">Oyunlar ve interaktif görevlerle kodlamayı keyifle öğren!</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3 className="feature-title">Seviye Atlama</h3>
            <p className="feature-description">Başarılarınla seviye atla ve yeni zorluklarla karşılaş!</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">Kendi Robotunu Yap</h3>
            <p className="feature-description">Öğrendiklerinle kendi robotunu programla ve kontrol et!</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3 className="feature-title">Arkadaşlarınla Yarış</h3>
            <p className="feature-description">Çoklu oyuncu modunda arkadaşlarınla yarış ve eğlen!</p>
          </div>
        </div>

        <div className="project-description bottom">
          <p>Sitemiz, çocukların yeni şeyler öğrenirken eğlenmelerini ve aynı zamanda teknolojiyi güvenli bir şekilde kullanmayı öğrenmelerini sağlamak için tasarlanmıştır. Her ders, çocukların kendi hızlarında ilerleyebilecekleri şekilde yapılandırılmıştır, böylece her çocuk kendi ilgi ve yetenek düzeyine uygun deneyimler edinebilir.</p>
          <p><strong>Katılın ve Keşfedin!</strong> Çocuğunuzun teknoloji ile iç içe büyümesine ve onun büyülü dünyasında eğlenirken öğrenmesine şimdi başlayın. Projemize katılarak, çocuğunuzun yaratıcı potansiyelini keşfetmesine ve 21. yüzyıl becerilerini geliştirmesine yardımcı olun.</p>
        </div>

        <a href="#" className="cta-button">Hemen Başla!</a>
      </div>
    </section>
  );
};

export default FunProjectSection;
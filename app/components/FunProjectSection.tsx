import React, { useRef } from 'react'; import { useTranslation, Trans } from 'react-i18next';

const FunProjectSection: React.FC = () => {
  const { t } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleScrollToCharacters = () => {
    const charactersSection = document.getElementById('characters');
    if (charactersSection) {
      charactersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="fun-project-section">
      <div className="parallax-bg"></div>
      <div className="container">
        <h2 className="project-title">{t("young_coders_guide")}</h2>

        <div className="project-description top">
          <p>{t("project_description_top")}</p>
          <p>{t("project_description_top_2")}</p>
        </div>

        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3 className="feature-title">{t("feature_fun_learning_title")}</h3>
            <p className="feature-description">{t("feature_fun_learning_description")}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3 className="feature-title">{t("feature_level_up_title")}</h3>
            <p className="feature-description">{t("feature_level_up_description")}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">{t("feature_build_robot_title")}</h3>
            <p className="feature-description">{t("feature_build_robot_description")}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3 className="feature-title">{t("feature_compete_friends_title")}</h3>
            <p className="feature-description">{t("feature_compete_friends_description")}</p>
          </div>
        </div>

        <div className="project-description bottom">
          <p>{t("project_description_bottom")}</p>
          <p><Trans i18nKey="project_description_bottom_2" /></p>
        </div>

        <button
          className="cta-button"
          ref={buttonRef}
          onClick={handleScrollToCharacters}
        >
          {t('start_now')} !
        </button>
      </div>
    </section>
  );
};

export default FunProjectSection;

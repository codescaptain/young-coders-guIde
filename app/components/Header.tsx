import React from 'react';
import { Link } from '@remix-run/react';
import { useTranslation } from "react-i18next";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <img src="/images/without-bg.png" alt="Young Coder's Guide Logo" className="logo" />
          <Link to="/" className="header-title">
            {t("young_coders_guide")}
          </Link>
        </div>
        <div className="language-selector">
          <button onClick={() => changeLanguage('en')} className="flag-button" aria-label="Switch to English">
            🇺🇸
          </button>
          <button onClick={() => changeLanguage('tr')} className="flag-button" aria-label="Türkçe'ye geç">
            🇹🇷
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
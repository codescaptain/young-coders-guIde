import { LinksFunction } from '@remix-run/node';
import React from 'react';
import RobotBuilderGame from '~/components/RobotBuilderGame';
import styles from "~/styles/robotBuilderGame.css?url";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles},
];

const BusinessWorkshop: React.FC = () => {
  // ... (mevcut kod)

  return (
    <section className="bw-section">
      {/* ... (mevcut içerik) */}
      
      <div className="bw-robot-builder">
        <RobotBuilderGame />
      </div>
    </section>
  );
};

export default BusinessWorkshop;
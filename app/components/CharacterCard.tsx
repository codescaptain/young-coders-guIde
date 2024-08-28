import React from 'react';
import { Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import homepageCss from "~/styles/homepage.css?url";
import { LinksFunction } from '@remix-run/node';

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: homepageCss }];
};

type Chapter = {
    chapter_title: string;
    character_image_prefix: string;
    terms: [];
    character: {
        name: string;
        greet_message: string;
        description: string;
    }
};

interface CharacterCardProps {
    chapter: Chapter;
    index: string;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ chapter, index }) => {
    const { t } = useTranslation();


    return (
        <div key={index} className="character-card">
            <img
                src={`/images/${chapter.character_image_prefix}.png`}
                alt={`${chapter.character.name} character`}
            />
            <h3>{chapter.character.name}</h3>
            <p>{chapter.character.greet_message}</p>
            <p>{chapter.character.description}</p>
            <Link to={`/characters/${chapter.character.name.toLowerCase().replace(" ", "-")}`} className="characterButton">
                {t('learn_more_about', { name: chapter.character.name })}
            </Link>
        </div>
    )

};


export default CharacterCard;
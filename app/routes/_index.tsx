import type { LinksFunction, MetaFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import BusinessWorkshop from "~/components/BusinessWorkshop";
import CharacterCard from "~/components/CharacterCard";
import FunProjectSection from "~/components/FunProjectSection";
import youngCodersGuide from "~/data/young_coders_guide.json";
import homepageCss from "~/styles/homepage.css?url";
import businessWorkshop from "~/styles/businessWorkshop.css?url";
import characterCard from "~/styles/characterCard.css?url";
import allGames from "~/styles/allGames.css?url";
import AllGames from "~/components/AllGames";

export const meta: MetaFunction = () => {
  return [
    { title: "Tech Characters for Young Coders" },
    { name: "description", content: "Learn about our amazing tech characters!" },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/styles/main.css" },
  { rel: "stylesheet", href: homepageCss },
  { rel: "stylesheet", href: businessWorkshop },
  { rel: "stylesheet", href: characterCard },
  { rel: "stylesheet", href: allGames },
];

export const loader: LoaderFunction = async () => {
  return json(youngCodersGuide.chapters);
};

export default function Index() {
  const chapters = useLoaderData<typeof loader>();

  const character_name = (name: String): String => {
    return name.toLowerCase().replace(' ', '_');
  }

  const { t } = useTranslation(['common', 'term']);

  return (
    <>
      <BusinessWorkshop />
      <FunProjectSection />
      <AllGames />
      <div className="choose-character" id="characters">
        <div className="choose-character-content">
          <h2>Choose Your Character</h2>
          <div className="character-cards">
            {chapters.map((chapter: any, index: any) => (
              <>
                <CharacterCard key={index} chapter={chapter} index={index} />
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
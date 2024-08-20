import type { LinksFunction, MetaFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import youngCodersGuide from "~/data/young_coders_guide.json";

export const meta: MetaFunction = () => {
  return [
    { title: "Tech Characters for Young Coders" },
    { name: "description", content: "Learn about our amazing tech characters!" },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/styles/main.css" }
];

export const loader: LoaderFunction = async () => {
  return json(youngCodersGuide.chapters);
};

export default function Index() {
  const chapters = useLoaderData<typeof loader>();

  return (
    <div className="main">
      <div className="container">
        {chapters.map((chapter, index) => (
          <div key={index} className="mainItem">
            <div className="characterImage">
              <img 
                src={`/images/${chapter.character_image_prefix}.png`} 
                alt={`${chapter.character.name} character`}
              />
            </div>
            <div className="characterInfo">
              <h1>{chapter.character.name}</h1>
              <p className="greetMessage">{chapter.character.greet_message}</p>
              <p>{chapter.character.description}</p>
              <Link to={`/characters/${chapter.character.name.toLowerCase().replace(" ", "-")}`} className="characterButton">
                Learn More About {chapter.character.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
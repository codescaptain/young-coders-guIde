import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import youngCodersGuide from "~/data/young_coders_guide.json";

export const meta: MetaFunction = ({ data }) => {
  return [
    { title: `${data.character!.name} - Tech Character` },
    { name: "description", content: data.character.description },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const characterName = params.name.replace("-", " ");
  const chapter = youngCodersGuide.chapters.find(
    ch => ch.character.name.toLowerCase() === characterName
  );

  if (!chapter) {
    throw new Response("Not Found", { status: 404 });
  }

  return json(chapter);
};

export default function Character() {
  const chapter = useLoaderData<typeof loader>();
  const { character } = chapter;

  return (
    <div className="main">
      <div className="container">
        <div className="mainItem">
          <div className="characterInfo">
            <h1>{character.name}</h1>
            <p>{character.description}</p>
            <h2>Key Terms:</h2>
            <ul>
              {character.terms.map((term, index) => (
                <li key={index}>
                  <strong>{term.term}:</strong> {term.description}
                </li>
              ))}
            </ul>
            <Link to="/" className="characterButton">Back to Characters</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
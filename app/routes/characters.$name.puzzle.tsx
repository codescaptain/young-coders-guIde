import React, { useState, useEffect } from 'react';
import { useLoaderData, Link } from '@remix-run/react';
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import youngCodersGuide from "~/data/young_coders_guide.json";

export const loader: LoaderFunction = async ({ params }) => {
  const characterName = params.name?.replace("-", " ");
  const chapter = youngCodersGuide.chapters.find(
    ch => ch.character.name.toLowerCase() === characterName?.toLowerCase()
  );

  if (!chapter) {
    throw new Response("Not Found", { status: 404 });
  }

  return json(chapter);
};

export default function CharacterPuzzle() {
  const chapter = useLoaderData<typeof loader>();
  const { character } = chapter;
  const [pieces, setPieces] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    const initialPieces = Array.from({ length: 9 }, (_, i) => i);
    setPieces(shuffleArray(initialPieces));
  }, []);

  const shuffleArray = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handlePieceClick = (index: number) => {
    const newPieces = [...pieces];
    const emptyIndex = newPieces.indexOf(8);
    if (isAdjacent(index, emptyIndex)) {
      [newPieces[index], newPieces[emptyIndex]] = [newPieces[emptyIndex], newPieces[index]];
      setPieces(newPieces);
      checkCompletion(newPieces);
    }
  };

  const isAdjacent = (index1: number, index2: number) => {
    const row1 = Math.floor(index1 / 3);
    const col1 = index1 % 3;
    const row2 = Math.floor(index2 / 3);
    const col2 = index2 % 3;
    return (Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1);
  };

  const checkCompletion = (currentPieces: number[]) => {
    const isCompleted = currentPieces.every((piece, index) => piece === index);
    setCompleted(isCompleted);
    if (isCompleted) {
      setShowCompletion(true);
      setTimeout(() => setShowCompletion(false), 3000);
    }
  };

  return (
    <div className="puzzle-container">
      <h2>{character.name}'s Puzzle Challenge</h2>
      <div className="puzzle-grid">
        {pieces.map((piece, index) => (
          <div
            key={index}
            className={`puzzle-piece ${piece === 8 ? 'empty' : ''}`}
            onClick={() => handlePieceClick(index)}
            style={{
              backgroundImage: piece !== 8 ? `url(/images/${chapter.character_image_prefix}.png)` : 'none',
              backgroundPosition: `${-(piece % 3) * 100 / 2}% ${-Math.floor(piece / 3) * 100 / 2}%`,
            }}
          >
            {piece === 8 && '👆'}
          </div>
        ))}
      </div>
      {completed && showCompletion && (
        <div className="completion-message show">
          Woohoo! You solved the puzzle! 🎉
        </div>
      )}
      <Link to={`/characters/${character.name.toLowerCase().replace(" ", "-")}`} className="back-button">
        Back to {character.name}
      </Link>
    </div>
  );
}
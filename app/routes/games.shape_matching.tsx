import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import ShapeMatchingGame from "~/components/ShapeMatchingGame";
import styles from "~/styles/shapeGame.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];


export const meta: MetaFunction = () => {
  return [
    { title: "Labirent Çözme Oyunu" },
    { name: "description", content: "Çocuklar için eğlenceli bir labirent çözme oyunu!" },
  ];
};

export default function ShameMatching() {
    return (
            <>
            <ShapeMatchingGame />
            </>
    );
}
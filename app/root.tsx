import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import "./tailwind.css";
import { LinksFunction } from "@remix-run/node";
import Header from "./components/Header";
import headerStyle from "~/styles/header.css?url";
import globalCss from "~/styles/global.css?url";
import footerStyle from "~/styles/footer.css?url";
import { useChangeLanguage } from "remix-i18next/react";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";
import Footer from "./components/Footer";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: headerStyle},
  { rel: "stylesheet", href: globalCss},
  { rel: "stylesheet", href: footerStyle}
];

export async function loader({ request }: any) {
	let locale = await i18next.getLocale(request);
	return json({ locale });
}

export let handle = {
	i18n: "common",
};

export function Layout({ children }: { children: React.ReactNode }) {
  	// Get the locale from the loader
	let { locale } = useLoaderData<typeof loader>();

	let { i18n } = useTranslation();
	useChangeLanguage(locale);
  
  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
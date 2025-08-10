import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import "./tailwind.css";
import { getBrandFromPath } from "~/lib/brand-config";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
  },
  { rel: "icon", type: "image/png", href: "/logos/Talazarlogo.png" },
  { rel: "apple-touch-icon", href: "/logos/Talazarlogo.png" },
];

export const loader = ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const brand = getBrandFromPath(url.pathname);
  
  return json({ brand });
};

export default function App() {
  const { brand } = useLoaderData<typeof loader>();

  return (
    <html lang="en" style={brand ? brand.cssVariables : undefined}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {brand?.primaryColor && (
          <meta name="theme-color" content={brand.primaryColor} />
        )}
        {/* Brand-specific favicon override (optional) */}
        {brand?.logo && (
          <link rel="icon" type="image/png" href={brand.logo} />
        )}
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-gray-50">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

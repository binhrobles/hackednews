import type { MetaFunction } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

// https://remix.run/docs/en/main/future/vite#fix-up-css-imports
import './tailwind.css';

import Navbar from '~/components/Navbar';

export const meta: MetaFunction = () => {
  return [
    { title: 'Hacked News' },
    { name: 'description', content: 'Another Hacker News Remix' },
  ];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body className="container mx-auto px-2">
        <Navbar />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

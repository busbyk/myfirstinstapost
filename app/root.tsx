import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import './tailwind.css';
import { SpeedInsights } from '@vercel/speed-insights/remix';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="p-4">
        {children}
        <ScrollRestoration />
        {process.env.NODE_ENV === 'production' && (
          <script
            defer
            src="/stats/js/script.js"
            data-api="/stats/api/event"
            data-domain="myfirstinstapost.com"
          ></script>
        )}
        <Scripts />
        <SpeedInsights />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

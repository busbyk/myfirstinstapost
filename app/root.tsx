import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import './tailwind.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="manifest.json" />
        <Meta />
        <Links />
      </head>
      <body className="w-screen max-w-screen h-screen overflow-x-auto bg-theme-tan flex flex-col">
        <nav className="w-full flex justify-between items-center bg-theme-brown border-b border-b-theme-burgundy text-white shadow-sm py-3 px-4 sm:py-4">
          <Link to="/">
            <h1 className="text-2xl">MyFirstInstaPost</h1>
          </Link>
          <div className="flex flex-col text-sm">
            <Link to="/privacy-policy" className="hover:underline">
              Privacy
            </Link>
          </div>
        </nav>
        <div className="flex flex-col flex-grow w-full overflow-x-hidden max-w-full">
          <div className="w-full overflow-x-hidden max-w-full flex-grow">
            {children}
          </div>
          <footer className="w-full flex justify-center items-center bg-[#905942] border-t border-b-theme-burgundy text-white shadow-sm py-1 px-2 sm:py-2">
            <p className="text-sm">
              A silly website. Built with 🤘 by{' '}
              <a
                href="https://www.kellenbusbysoftware.com"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:no-underline underline"
              >
                Kellen Busby
              </a>
            </p>
          </footer>
        </div>
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
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

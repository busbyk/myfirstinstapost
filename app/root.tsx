import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react';
import '~/tailwind.css';
import { LinksFunction } from '@remix-run/node';

export const links: LinksFunction = () => [
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/icons/favicon-16x16.png',
  },
];

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Something has gone horribly wrong. Frick.</h1>
        <p>Error: {error.status}</p>
        <p>{error.data.message}</p>
      </div>
    );
  }

  let errorMessage = 'Unknown error';
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex flex-col flex-grow justify-center items-center pt-8 w-full">
      <h1 className="text-2xl font-bold">
        Something has gone horribly wrong. Frick.
      </h1>
      <p className="text-red-500">Error: {errorMessage}</p>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="manifest.json" />

        <title>MyFirstInstaPost</title>
        <meta name="description" content="Find your first Instagram post" />

        <meta property="og:url" content="https://myfirstinstapost.com" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="MyFirstInstaPost" />
        <meta
          property="og:description"
          content="Find your first Instagram post"
        />
        <meta
          property="og:image"
          content="https://myfirstinstapost.com/og-preview.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="myfirstinstapost.com" />
        <meta property="twitter:url" content="https://myfirstinstapost.com" />
        <meta name="twitter:title" content="MyFirstInstaPost" />
        <meta
          name="twitter:description"
          content="Find your first Instagram post"
        />
        <meta
          name="twitter:image"
          content="https://myfirstinstapost.com/og-preview.png"
        />

        <meta name="google-adsense-account" content="ca-pub-9888054958355394" />

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

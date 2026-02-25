import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GDPR Compliance Dashboard',
  description: 'Visual GDPR audit report for n8n workflows',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,600;6..72,700&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-sand-50 font-body text-gray-800 antialiased">
        {children}
      </body>
    </html>
  );
}

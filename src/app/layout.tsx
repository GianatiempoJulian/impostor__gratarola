import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { I18nProvider } from '@/context/i18n-context';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Impostor - Gratarola',
  description: 'The ultimate party game of deception and wit.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <I18nProvider>
          <main className="flex-grow flex flex-col">{children}</main>
        </I18nProvider>
        <Toaster />
        <footer className="text-center p-4 text-muted-foreground text-sm">
          Made with ❤️ by{' '}
          <Link href="https://www.linkedin.com/in/juliangianatiempo/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
            Julian Gianatiempo
          </Link>
        </footer>
      </body>
    </html>
  );
}
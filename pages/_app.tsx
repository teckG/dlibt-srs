import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { Navbar } from '@/components/Navbar'; // Import the Navbar
import '../styles/globals.css';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure the component is mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return nothing during server-side rendering
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* Add the Navbar here */}
      <Navbar />
      {/* Render the page component */}
      <Component {...pageProps} />
      
    </ThemeProvider>
  );
}

export default MyApp;
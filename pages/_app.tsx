import "@/styles.css";
import type { AppProps } from 'next/app';

export default function CanApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

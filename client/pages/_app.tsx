/*ONLY FOR CSS*/
import "@/styles/globals.css";
import "@/styles/searchStores.css";
import "@/styles/createStores.css";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

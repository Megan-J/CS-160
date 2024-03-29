/*ONLY FOR CSS*/
import "@/styles/globals.css";
import "@/pages/components/searchStores.css";
import "@/pages/components/createStores.css";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component { ...pageProps } />;
}

import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NEXT_PUBLIC_API_MOCKING } from "lib/env";

if (NEXT_PUBLIC_API_MOCKING) require("../mocks");

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;

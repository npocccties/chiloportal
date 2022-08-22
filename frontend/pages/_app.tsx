import "../styles/globals.css";
import type { AppProps } from "next/app";
import yn from "yn";

if (yn(process.env.NEXT_PUBLIC_API_MOCKING, { default: false })) {
  require("../mocks");
}

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;

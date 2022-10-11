import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "components/Layout";
import { NEXT_PUBLIC_API_MOCKING } from "lib/env";

if (NEXT_PUBLIC_API_MOCKING) require("../mocks");

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

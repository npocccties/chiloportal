import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "components/Layout";
import { NEXT_PUBLIC_API_MOCKING } from "lib/env";
import title from "lib/title";

if (NEXT_PUBLIC_API_MOCKING) require("../mocks");

function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <title>{title()}</title>
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}

export default App;

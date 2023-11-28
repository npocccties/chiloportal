import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "components/Layout";
import { NEXT_PUBLIC_API_MOCKING } from "lib/env";

if (NEXT_PUBLIC_API_MOCKING) require("../mocks");

function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <Component {...pageProps} />
      <style jsx global>
        {`
          html {
            scroll-behavior: smooth;
            scroll-padding-top: 4rem;
          }
        `}
      </style>
    </Layout>
  );
}

export default App;

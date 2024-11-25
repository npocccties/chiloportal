import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "components/Layout";
import {
  NEXT_PUBLIC_API_MOCKING,
  NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_GOOGLE_TAG_ID,
} from "lib/env";
import { useRouter } from "next/router";
import { GoogleAnalytics } from "@next/third-parties/google";

if (NEXT_PUBLIC_API_MOCKING) require("../mocks");

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <Layout>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={new URL(router.pathname, NEXT_PUBLIC_BASE_URL).href}
        />
        <meta
          property="og:image"
          content={new URL("/ogp.png", NEXT_PUBLIC_BASE_URL).href}
        />
      </Head>
      {NEXT_PUBLIC_GOOGLE_TAG_ID && (
        <GoogleAnalytics gaId={NEXT_PUBLIC_GOOGLE_TAG_ID} />
      )}
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

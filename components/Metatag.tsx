import Head from "next/head";
import React from "react";

export interface MetatagProps {
  title: string;
  description: string;
}

export const Metatag: React.VFC<MetatagProps> = ({ title, description }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

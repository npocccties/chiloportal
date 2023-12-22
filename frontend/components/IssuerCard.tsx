import clsx from "clsx";
import Link from "next/link";
import { Issuer } from "api/@types";
import { pagesPath } from "lib/$path";
import { getImageUrl } from "lib/issuer";
import { NEXT_PUBLIC_API_MOCKING } from "lib/env";

type Props = {
  className?: string;
  issuer: Issuer;
};

export default function IssuerCard({ issuer, className }: Props) {
  const url = getImageUrl(issuer.url);
  const issuerId = NEXT_PUBLIC_API_MOCKING ? 1 : issuer.issuer_id;
  return (
    <Link
      href={pagesPath.issuers._issuerId(issuerId).$url()}
      className={clsx(
        "inline-flex items-center gap-4 px-5 py-3 rounded-md hover:bg-gray-50",
        className,
      )}
    >
      {/* eslint-disable @next/next/no-img-element */}
      {/*
        NOTE: 事前に許可したホスト以外画像最適化の対象にできない
        See Also: https://nextjs.org/docs/messages/next-image-unconfigured-host
      */}
      {typeof url === "string" && (
        <img src={url} width={40} height={40} alt="" />
      )}
      <p className="text-sm font-bold text-gray-800">{issuer.name}</p>
    </Link>
  );
}

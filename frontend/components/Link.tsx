import Base, { LinkProps } from "next/link";

export type { LinkProps } from "next/link";

function Link(
  // NOTE: LinkPropsReal を参照 https://github.com/vercel/next.js/blob/canary/packages/next/client/link.tsx#L224
  props: React.PropsWithChildren<
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
      LinkProps
  >
) {
  return <Base scroll={false} {...props} />;
}

export default Link;

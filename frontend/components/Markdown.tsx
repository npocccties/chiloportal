import Image from "next/image";
import { MDXRemote } from "next-mdx-remote";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

type Props = MDXRemoteSerializeResult;
const components = {
  img: (props: Pick<React.ImgHTMLAttributes<HTMLImageElement>, "src">) => {
    /* eslint-disable @next/next/no-img-element */
    if (!props.src) return <img alt="" src="" />;
    try {
      new URL(props.src);
      /*
        NOTE: 事前に許可したホスト以外画像最適化の対象にできない
        See Also: https://nextjs.org/docs/messages/next-image-unconfigured-host
      */
      return <img alt="" {...props} />;
    } catch (_) {
      return <Image alt="" {...props} src={props.src} />;
    }
  },
};

export default function Markdown(props: Props) {
  return <MDXRemote {...props} components={components} />;
}

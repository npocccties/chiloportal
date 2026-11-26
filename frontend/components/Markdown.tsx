import Image from "next/image";
import { MDXRemote } from "next-mdx-remote";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

type Props = MDXRemoteSerializeResult;

const components = {
  img: (props: Pick<React.ImgHTMLAttributes<HTMLImageElement>, "src">) => {
    /* eslint-disable @next/next/no-img-element */
    // Markdown の画像の src は常に文字列（React 19 の型では Blob も許されるため除外する）
    if (typeof props.src !== "string" || !props.src)
      return <img alt="" src="" />;
    try {
      new URL(props.src);
      /*
        NOTE: 事前に許可したホスト以外画像最適化の対象にできない
        See Also: https://nextjs.org/docs/messages/next-image-unconfigured-host
      */
      return <img alt="" {...props} />;
    } catch {
      return <Image alt="" {...props} src={props.src} />;
    }
  },
};

export default function Markdown(props: Props) {
  return <MDXRemote {...props} components={components} />;
}

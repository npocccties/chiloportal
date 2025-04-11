import { imageSizeFromFile } from "image-size/fromFile";
import { visit } from "unist-util-visit";
import { Pluggable } from "unified";

/**
 * マークダウン内のイメージ要素の縦横サイズを取得し属性に渡す Rehype プラグイン
 * https://zenn.dev/elpnt/articles/c17727e9d254ef00ea60#%E5%AE%9F%E8%A3%85
 */
const rehypeImageSize: Pluggable = () => {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "img" && node.properties.src.startsWith("/")) {
        imageSizeFromFile("public" + node.properties.src).then(
          ({ width, height }) => {
            node.properties.width = width;
            node.properties.height = height;
          },
        );
      }
    });
  };
};

export default rehypeImageSize;

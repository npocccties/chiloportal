import Link from "next/link";
import clsx from "clsx";
import { Props } from "pages/discover";
import { pagesPath } from "lib/$path";
import AllBadge from "public/all-badge.svg";
import Issuer from "public/issuer.svg";
import Category from "public/category.svg";
import Framework from "public/framework.svg";

export default function DiscoverNav(
  props: Props & {
    onClick?(): void;
  },
) {
  return (
    <nav>
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            className={clsx(
              "inline-flex items-center gap-2 text-base font-bold -ml-3 pl-3 pr-5 py-1.5 rounded-full hover:bg-gray-100",
              props.type === "all" && "text-primary-700",
            )}
            href={pagesPath.discover.$url({ query: { by: "all" } })}
            onClick={props.onClick}
          >
            <AllBadge
              className={clsx(
                "size-[1.125rem]",
                props.type === "all" && "stroke-primary-700",
              )}
              src="/all-badge.svg"
              alt=""
            />
            すべてのバッジ
          </Link>
        </li>
        <li>
          <Link
            className="inline-flex items-center gap-2 text-base font-bold -ml-3 pl-3 pr-5 py-1.5 rounded-full hover:bg-gray-100"
            href={pagesPath.discover.$url({
              query: {
                by: "issuer",
                issuer_id: String(props.issuers[0].issuer_id),
              },
            })}
            onClick={props.onClick}
          >
            <Issuer className="size-[1.125rem]" src="/all-badge.svg" alt="" />
            発行元
          </Link>
          <ul className="flex flex-col">
            {props.issuers.map((issuer) => (
              <li key={issuer.issuer_id}>
                <Link
                  className={clsx(
                    "inline-flex text-sm text-gray-700 ml-4 pl-3 pr-5 py-1.5 rounded-full hover:bg-gray-100",
                    props.type === "issuer" &&
                      props.issuer.issuer_id === issuer.issuer_id &&
                      "text-primary-700 font-bold",
                  )}
                  href={pagesPath.discover.$url({
                    query: {
                      by: "issuer",
                      issuer_id: String(issuer.issuer_id),
                    },
                  })}
                  onClick={props.onClick}
                >
                  {issuer.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <Link
            className="inline-flex items-center gap-2 text-base font-bold -ml-3 pl-3 pr-5 py-1.5 rounded-full hover:bg-gray-100"
            href={pagesPath.discover.$url({
              query: {
                by: "category",
                portal_category_id: String(
                  props.portalCategories[0].portal_category_id,
                ),
              },
            })}
            onClick={props.onClick}
          >
            <Category className="size-[1.125rem]" src="/all-badge.svg" alt="" />
            カテゴリ
          </Link>
          <ul className="flex flex-col">
            {props.portalCategories.map((portalCategory) => (
              <li key={portalCategory.portal_category_id}>
                <Link
                  className={clsx(
                    "inline-flex text-sm text-gray-700 ml-4 pl-3 pr-5 py-1.5 rounded-full hover:bg-gray-100",
                    props.type === "category" &&
                      props.portalCategory.portal_category_id ===
                        portalCategory.portal_category_id &&
                      "text-primary-700 font-bold",
                  )}
                  href={pagesPath.discover.$url({
                    query: {
                      by: "category",
                      portal_category_id: String(
                        portalCategory.portal_category_id,
                      ),
                    },
                  })}
                  onClick={props.onClick}
                >
                  {portalCategory.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>
        <li
          className={clsx(
            props.type === "framework" &&
              [
                /* TODO 選択時の見た目を用意して */
              ],
          )}
        >
          <Link
            className="inline-flex items-center gap-2 text-base font-bold -ml-3 pl-3 pr-5 py-1.5 rounded-full hover:bg-gray-100"
            href={pagesPath.discover.$url({
              query: {
                by: "framework",
                consumer_id: String(props.consumers[0].consumer_id),
                framework_id: String(
                  props.frameworks[props.consumers[0].consumer_id][0]
                    .framework_id,
                ),
              },
            })}
            onClick={props.onClick}
          >
            <Framework
              className="size-[1.125rem]"
              src="/all-badge.svg"
              alt=""
            />
            教育委員会
          </Link>
          <ul className="flex flex-col">
            {props.consumers.map((consumer) => (
              <li key={consumer.consumer_id}>
                <h4 className="text-xs ml-7 mt-3 mb-1 text-gray-600 font-bold">
                  {consumer.name}
                </h4>
                <ul className="mb-2">
                  {props.frameworks[consumer.consumer_id].map((framework) => (
                    <li key={framework.framework_id}>
                      <Link
                        className={clsx(
                          "inline-flex text-sm text-gray-700 ml-4 pl-3 pr-5 py-1.5 rounded-full hover:bg-gray-100",
                          props.type === "framework" &&
                            props.consumer.consumer_id ===
                              consumer.consumer_id &&
                            props.framework.framework_id ===
                              framework.framework_id &&
                            "text-primary-700 font-bold",
                        )}
                        href={pagesPath.discover.$url({
                          query: {
                            by: "framework",
                            consumer_id: String(consumer.consumer_id),
                            framework_id: String(framework.framework_id),
                          },
                        })}
                        onClick={props.onClick}
                      >
                        {framework.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );
}

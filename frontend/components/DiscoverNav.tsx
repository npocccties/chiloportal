import { useState } from "react";
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
    className?: string;
  },
) {
  const [isFrameworkExpanded, setIsFrameworkExpanded] = useState(false);
  const [expandedConsumers, setExpandedConsumers] = useState<
    Record<string, boolean>
  >({});

  const toggleConsumer = (consumerId: string) => {
    setExpandedConsumers((prev) => ({
      ...prev,
      [consumerId]: !prev[consumerId],
    }));
  };

  return (
    <nav className={props.className}>
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
            <Issuer className="size-[1.125rem]" alt="" />
            コース提供者
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
            <Category className="size-[1.125rem]" alt="" />
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
          <div
            className="inline-flex items-center gap-2 text-base font-bold -ml-3 pl-3 pr-5 py-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
            onClick={() => setIsFrameworkExpanded(!isFrameworkExpanded)}
          >
            <span className="text-xs mr-1">
              {isFrameworkExpanded ? "▼" : "▶"}
            </span>
            <Framework className="size-[1.125rem]" alt="" />
            教員育成指標
          </div>
          {isFrameworkExpanded && (
            <ul className="flex flex-col">
              {props.consumers.map((consumer) => (
                <li key={consumer.consumer_id}>
                  <div
                    className="text-xs ml-7 mt-3 mb-1 text-gray-600 font-bold cursor-pointer hover:text-gray-800 inline-flex items-center"
                    onClick={() => toggleConsumer(String(consumer.consumer_id))}
                  >
                    <span className="mr-2 text-xs">
                      {expandedConsumers[consumer.consumer_id] ? "▼" : "▶"}
                    </span>
                    {consumer.name}
                  </div>
                  {expandedConsumers[consumer.consumer_id] && (
                    <ul className="mb-2">
                      {props.frameworks[consumer.consumer_id].map(
                        (framework) => (
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
                        ),
                      )}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}

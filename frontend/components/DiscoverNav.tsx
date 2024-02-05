import Link from "next/link";
import clsx from "clsx";
import { Props } from "pages/discover";
import { pagesPath } from "lib/$path";

export default function (props: Props) {
  return (
    <nav>
      <ul>
        <li
          className={clsx(
            props.type === "all" &&
              [
                /* TODO 選択時の見た目を用意して */
              ],
          )}
        >
          <Link href={pagesPath.discover.$url({ query: { by: "all" } })}>
            すべてのバッジ
          </Link>
        </li>
        <li
          className={clsx(
            props.type === "issuer" &&
              [
                /* TODO 選択時の見た目を用意して */
              ],
          )}
        >
          <Link
            href={pagesPath.discover.$url({
              query: {
                by: "issuer",
                issuer_id: String(props.issuers[0].issuer_id),
              },
            })}
          >
            発行元
          </Link>
          <ul>
            {props.issuers.map((issuer) => (
              <li key={issuer.issuer_id}>
                <Link
                  className={clsx(
                    props.type === "issuer" &&
                      props.issuer.issuer_id === issuer.issuer_id &&
                      [
                        /* TODO 選択時の見た目を用意して */
                      ],
                  )}
                  href={pagesPath.discover.$url({
                    query: {
                      by: "issuer",
                      issuer_id: String(issuer.issuer_id),
                    },
                  })}
                >
                  {issuer.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>
        <li
          className={clsx(
            props.type === "category" &&
              [
                /* TODO 選択時の見た目を用意して */
              ],
          )}
        >
          <Link
            href={pagesPath.discover.$url({
              query: {
                by: "category",
                portal_category_id: String(
                  props.portalCategories[0].portal_category_id,
                ),
              },
            })}
          >
            カテゴリ
          </Link>
          <ul>
            {props.portalCategories.map((portalCategory) => (
              <li key={portalCategory.portal_category_id}>
                <Link
                  className={clsx(
                    props.type === "category" &&
                      props.portalCategory.portal_category_id ===
                        portalCategory.portal_category_id &&
                      [
                        /* TODO 選択時の見た目を用意して */
                      ],
                  )}
                  href={pagesPath.discover.$url({
                    query: {
                      by: "category",
                      portal_category_id: String(
                        portalCategory.portal_category_id,
                      ),
                    },
                  })}
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
          >
            教育委員会
          </Link>
          <ul>
            {props.consumers.map((consumer) => (
              <li key={consumer.consumer_id}>
                {consumer.name}
                <ul>
                  {props.frameworks[consumer.consumer_id].map((framework) => (
                    <li key={framework.framework_id}>
                      <Link
                        className={clsx(
                          props.type === "framework" &&
                            props.consumer.consumer_id ===
                              consumer.consumer_id &&
                            props.framework.framework_id ===
                              framework.framework_id &&
                            [
                              /* TODO 選択時の見た目を用意して */
                            ],
                        )}
                        href={pagesPath.discover.$url({
                          query: {
                            by: "framework",
                            consumer_id: String(consumer.consumer_id),
                            framework_id: String(framework.framework_id),
                          },
                        })}
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

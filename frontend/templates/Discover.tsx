import { Fragment } from "react";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import {
  Props,
  AllBadges,
  IssuerBadges,
  CategoryBadges,
  FrameworkBadges,
} from "pages/discover";
import { pagesPath } from "lib/$path";
import Pagination from "components/Pagination";

function All(props: AllBadges) {
  const handleHref = (page: number) =>
    pagesPath.discover.$url({ query: { by: "all", p: String(page) } });
  return (
    <>
      <h2>すべてのバッジ</h2>
      <ul>
        {props.badges.badges.map((badge) => (
          <li key={badge.badges_id}>
            <Link
              href={pagesPath.wisdom_badges
                ._wisdomBadgesId(String(badge.badges_id))
                .$url()}
            >
              {badge.name}
            </Link>
          </li>
        ))}
      </ul>
      <Pagination
        totalCount={props.badges.total_count}
        start={props.badges.start}
        end={props.badges.end}
        handleHref={handleHref}
      />
    </>
  );
}

function Issuer(props: IssuerBadges) {
  const handleHref = (page: number) =>
    pagesPath.discover.$url({
      query: {
        by: "issuer",
        issuer_id: String(props.issuer.issuer_id),
        p: String(page),
      },
    });
  return (
    <>
      <header>
        <p>発行元</p>
        <h2>{props.issuer.name}</h2>
      </header>
      <Link
        href={pagesPath.issuers
          ._issuerId(String(props.issuer.issuer_id))
          .$url()}
      >
        {props.issuer.name}のページへ
      </Link>
      <ul>
        {props.badges.badges.map((badge) => (
          <li key={badge.badges_id}>
            <Link
              href={pagesPath.wisdom_badges
                ._wisdomBadgesId(String(badge.badges_id))
                .$url()}
            >
              {badge.name}
            </Link>
          </li>
        ))}
      </ul>
      <Pagination
        totalCount={props.badges.total_count}
        start={props.badges.start}
        end={props.badges.end}
        handleHref={handleHref}
      />
    </>
  );
}

function Category(props: CategoryBadges) {
  const handleHref = (page: number) =>
    pagesPath.discover.$url({
      query: {
        by: "category",
        portal_category_id: String(props.portalCategory.portal_category_id),
        p: String(page),
      },
    });
  return (
    <>
      <header>
        <p>カテゴリ</p>
        <h2>{props.portalCategory.name}</h2>
      </header>
      <ul>
        {props.badges.badges.map((badge) => (
          <li key={badge.badges_id}>
            <Link
              href={pagesPath.wisdom_badges
                ._wisdomBadgesId(String(badge.badges_id))
                .$url()}
            >
              {badge.name}
            </Link>
          </li>
        ))}
      </ul>
      <Pagination
        totalCount={props.badges.total_count}
        start={props.badges.start}
        end={props.badges.end}
        handleHref={handleHref}
      />
    </>
  );
}

function Framework(props: FrameworkBadges) {
  return (
    <>
      <header>
        <p>
          教育委員会<span aria-hidden>｜</span>
          {props.consumer.name}
        </p>
        <h2>{props.framework.name}</h2>
        <a href={props.framework.url} target="_blank" rel="noopener noreferrer">
          {props.consumer.name}教員育成指標（PDF・外部リンク）
        </a>
      </header>
      <ul>
        {props.stages.map((stage) => (
          <li key={stage.stage_id}>
            <Link
              href={pagesPath.discover.$url({
                query: {
                  by: "framework",
                  consumer_id: String(props.consumer.consumer_id),
                  framework_id: String(props.framework.framework_id),
                  stage_id: String(props.stage.stage_id),
                },
              })}
            >
              {stage.name}
            </Link>
          </li>
        ))}
      </ul>
      <div>
        {props.field.field1.map(({ field1_name, field2 }, field1Index) => (
          <Disclosure key={field1Index}>
            <Disclosure.Button className="block">
              {field1_name}
            </Disclosure.Button>
            <Disclosure.Panel>
              {field2.map(({ field2_name, field3 }, field2Index) => (
                <Fragment key={field2Index}>
                  <h3>{field2_name}</h3>
                  {field3.map(({ field_id, field3_name }) => (
                    <Fragment key={field_id}>
                      <h4>{field3_name}</h4>
                      <ul>
                        {props.badges[field_id].map((badge) => (
                          <li key={badge.badges_id}>
                            <Link
                              href={pagesPath.wisdom_badges
                                ._wisdomBadgesId(String(badge.badges_id))
                                .$url()}
                            >
                              {badge.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </Fragment>
                  ))}
                </Fragment>
              ))}
            </Disclosure.Panel>
          </Disclosure>
        ))}
      </div>
    </>
  );
}

export default function Discover({
  children,
  ...props
}: Props & { children: React.ReactNode }) {
  return (
    <Container>
      <Breadcrumbs
        className="mb-6"
        nodes={[{ name: "トップ", href: pagesPath.$url() }]}
        leaf="バッジを探す"
      />
      <h1 className="text-3xl font-bold">バッジを探す</h1>
      <div
        className="grid"
        style={{
          gridTemplate: `
    "aside article"
      `,
        }}
      >
        <aside style={{ gridArea: "aside" }}>{children}</aside>
        <article style={{ gridArea: "article" }}>
          {props.type === "all" && <All {...props} />}
          {props.type === "issuer" && <Issuer {...props} />}
          {props.type === "category" && <Category {...props} />}
          {props.type === "framework" && <Framework {...props} />}
        </article>
      </div>
    </Container>
  );
}

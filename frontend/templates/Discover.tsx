import { Fragment } from "react";
import clsx from "clsx";
import Link from "next/link";
import { Icon } from "@iconify/react";
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
import WisdomBadgesItem from "components/WisdomBadgesItem";

function All(props: AllBadges) {
  const handleHref = (page: number) =>
    pagesPath.discover.$url({ query: { by: "all", p: String(page) } });
  return (
    <>
      <h2 className="text-2xl font-bold mb-8">すべてのバッジ</h2>
      <ul className="mb-10">
        {props.badges.badges.map((badge) => (
          <li key={badge.badges_id}>
            <WisdomBadgesItem wisdomBadges={badge} />
          </li>
        ))}
      </ul>
      <Pagination
        className="justify-center"
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
      <header className="mb-2">
        <p className="text-sm mb-2">発行元</p>
        <h2 className="text-2xl font-bold">{props.issuer.name}</h2>
      </header>
      <Link
        className="jumpu-outlined-button mb-8"
        href={pagesPath.issuers
          ._issuerId(String(props.issuer.issuer_id))
          .$url()}
      >
        {props.issuer.name}のページへ
      </Link>
      <ul className="mb-10">
        {props.badges.badges.map((badge) => (
          <li key={badge.badges_id}>
            <WisdomBadgesItem wisdomBadges={badge} />
          </li>
        ))}
      </ul>
      <Pagination
        className="justify-center"
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
      <header className="mb-8">
        <p className="text-sm mb-2">カテゴリ</p>
        <h2 className="text-2xl font-bold">{props.portalCategory.name}</h2>
      </header>
      <ul className="mb-10">
        {props.badges.badges.map((badge) => (
          <li key={badge.badges_id}>
            <WisdomBadgesItem wisdomBadges={badge} />
          </li>
        ))}
      </ul>
      <Pagination
        className="justify-center"
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
      <header className="mb-2">
        <p className="text-sm mb-2">
          教員育成指標<span aria-hidden>｜</span>
          {props.consumer.name}
        </p>
        <h2 className="text-2xl font-bold">{props.framework.name}</h2>
        <a
          className="text-xs"
          href={props.framework.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="underline">{props.consumer.name}教員育成指標</span>
          （PDF・外部リンク）
        </a>
      </header>
      <nav className="jumpu-tabs text-sm mb-6 overflow-x-auto">
        {/* TODO: jumpu-tabs が navigation role に対応したら追従して */}
        <ul role="tablist">
          {props.stages.map((stage) => (
            <li
              role="tab"
              key={stage.stage_id}
              aria-selected={stage.stage_id === props.stage.stage_id}
              className={clsx({
                ["!text-black !border-black"]:
                  stage.stage_id === props.stage.stage_id,
              })}
            >
              <Link
                href={pagesPath.discover.$url({
                  query: {
                    by: "framework",
                    consumer_id: String(props.consumer.consumer_id),
                    framework_id: String(props.framework.framework_id),
                    stage_id: String(stage.stage_id),
                  },
                })}
              >
                {stage.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        {props.field.field1.map(({ field1_name, field2 }, field1Index) => (
          <Disclosure key={field1Index}>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={clsx(
                    "flex justify-between items-center w-full hover:bg-gray-100 p-4 border-gray-300",
                    !open && "border-b",
                  )}
                >
                  {field1_name}
                  <Icon
                    className={clsx("transition", open && "rotate-180")}
                    icon="fa6-solid:chevron-down"
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="pb-4 border-b border-gray-300">
                  {field2.map(({ field2_name, field3 }, field2Index) => (
                    <Fragment key={field2Index}>
                      <h3 className="text-sm mx-4 pt-4 pb-2 mb-4 border-b border-dashed border-gray-300">
                        {field2_name}
                      </h3>
                      {field3.map(({ field_id, field3_name }) => (
                        <Fragment key={field_id}>
                          <h4 className="text-xs font-bold px-4 my-4">
                            {field3_name}
                          </h4>
                          <ul className="px-2">
                            {props.badges[field_id].map((badge) => (
                              <li key={badge.badges_id}>
                                <WisdomBadgesItem wisdomBadges={badge} />
                              </li>
                            ))}
                          </ul>
                        </Fragment>
                      ))}
                    </Fragment>
                  ))}
                </Disclosure.Panel>
              </>
            )}
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
        leaf="学びを探す"
      />
      <h1 className="text-3xl font-bold hidden md:block mb-8 border-b border-gray-300 pb-2">
        学びを探す
      </h1>
      <div
        className="md:grid gap-2"
        style={{
          gridTemplateAreas: `
    "aside article"
      `,
          gridTemplateColumns: "300px minmax(0, 1fr)",
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

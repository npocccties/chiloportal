import { useState, useEffect, useRef, useId } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import TextareaAutosize from "react-textarea-autosize";
import Link from "components/Link";
import { client } from "lib/client";
import { pagesPath } from "lib/$path";
import useChats from "lib/use-chats";

function Wait() {
  return (
    <svg
      className="fill-gray-500"
      viewBox="0 0 40 12"
      width="40"
      height="16"
      role="img"
    >
      <circle className="animate-bounce" cx="4" cy="8" r="4" />
      <circle
        className="animate-bounce [animation-delay:0.3s]"
        cx="20"
        cy="8"
        r="4"
      />
      <circle
        className="animate-bounce [animation-delay:0.6s]"
        cx="36"
        cy="8"
        r="4"
      />
    </svg>
  );
}

const sleep = (timeout: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });

type Props = {
  className?: string;
};

function Chat({ className }: Props) {
  const { chats, pushChat, popChat } = useChats();
  const chatsRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (!chatsRef.current) return;
    chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
  }, [chats]);
  const id = useId();
  const [textarea, setTextarea] = useState("");
  const [expand, setExpand] = useState(false);
  const handleClose = () => {
    setExpand(false);
  };
  const { events } = useRouter();
  useEffect(() => {
    events.on("routeChangeStart", handleClose);
    return () => {
      events.off("routeChangeStart", handleClose);
    };
  });
  const handleClickExpand = async () => {
    setExpand(true);
    if (chats.length === 0) {
      pushChat({
        type: "bot",
        body: <Wait />,
      });
      await sleep(1000);
      popChat();
      pushChat({
        type: "bot",
        body: <p>こんにちは 👋 探したいキーワードを教えてください</p>,
      });
      await sleep(1000);
      pushChat({
        type: "bot",
        body: <Wait />,
      });
      await sleep(1000);
      popChat();
      pushChat({
        type: "bot",
        body: (
          <p>
            例えば「育成」とか「指導　人材」のような単語で聞いてみてください
          </p>
        ),
      });
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextarea(event.target.value);
  };
  const handleClickSend = async () => {
    const keyword = textarea;
    setTextarea("");
    pushChat({ type: "user", body: <p>{keyword}</p> });
    await sleep(1000);
    pushChat({
      type: "bot",
      body: <p>「{keyword}」ですね！探してみます 🚲</p>,
    });
    pushChat({
      type: "bot",
      body: <Wait />,
    });
    await sleep(500);
    try {
      const { badges: badgesList, total_count } =
        await client.wisdomBadges.list.keyword.$get({
          query: { keyword },
        });
      popChat();
      total_count === 0
        ? pushChat({
            type: "bot",
            body: (
              <p>
                すみません、「{keyword}」
                に関する能力バッジがみつかりませんでした。。
              </p>
            ),
          })
        : pushChat({
            type: "bot",
            body: (
              <>
                <p className="mb-4">
                  「{textarea}」に関する能力バッジが{total_count}
                  件見つかりました。
                </p>
                <ul className="pl-8 list-disc mb-4">
                  {badgesList.slice(0, 3).map((badges) => (
                    <li key={badges.badges_id}>
                      <Link
                        href={pagesPath.wisdom_badges
                          ._wisdomBadgesId(badges.badges_id)
                          .$url()}
                        className="underline text-primary-700"
                      >
                        {badges.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                {total_count > 3 && (
                  <p>
                    <Link
                      href={pagesPath.search.$url({ query: { q: textarea } })}
                      className="text-primary-700"
                    >
                      …他{total_count - badgesList.slice(0, 3).length}
                      件の検索結果を確認する
                    </Link>
                  </p>
                )}
              </>
            ),
          });
    } catch (_) {
      popChat();
      pushChat({
        type: "bot",
        body: (
          <p>
            すみません、探している間に問題が発生したようです。。しばらくしてからもう一度お試しください。
          </p>
        ),
      });
    }
  };
  return (
    <div className={clsx("", className)}>
      <button
        className="absolute bottom-0 right-0 p-4 rounded-full bg-primary-700 shadow-xl hover:bg-primary-600 mb-8"
        aria-controls={id}
        title="ボットと会話する"
        onClick={handleClickExpand}
      >
        <Icon className="text-white text-3xl" icon="fa-regular:comment-dots" />
      </button>
      <nav
        id={id}
        className={clsx(
          "absolute w-[80vw] sm:w-[24rem] bottom-0 right-0 bg-white shadow-xl transition-transform duration-150 ease-in-out",
          {
            ["-bottom-full translate-y-full"]: !expand,
          }
        )}
      >
        <button
          className="w-full flex items-center bg-primary-700 rounded-t-xl p-4 text-white hover:bg-primary-600"
          aria-label="閉じる"
          onClick={handleClose}
        >
          <span className="text-left font-bold flex-1">
            「学び」探しにお困りですか？
          </span>

          <Icon className="text-xl" icon="fa6-solid:chevron-down" />
        </button>
        <ul
          className="px-4 pt-4 min-h-[30vh] max-h-[50vh] overflow-y-scroll"
          ref={chatsRef}
        >
          {chats.map((chat, index) =>
            chat.type === "user" ? (
              <li key={index} className="ml-8 mb-4 flex justify-end">
                <div className="jumpu-balloon bg-primary-700 text-white">
                  {chat.body}
                </div>
              </li>
            ) : (
              <li
                key={index}
                className="jumpu-balloon mr-8 mb-4 bg-gray-50 text-gray-700"
              >
                {chat.body}
              </li>
            )
          )}
        </ul>
        <hr className="border-gray-300 mx-4" />
        <form className="relative px-2 py-4">
          <TextareaAutosize
            value={textarea}
            onChange={handleChange}
            className="w-full p-2 resize-none"
            minRows={2}
            maxRows={6}
            placeholder="メッセージを入力…"
          />
          <button
            type="button"
            className={clsx(
              "absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 p-3 rounded-full bg-primary-700 shadow-xl hover:bg-primary-600",
              textarea.trim().length === 0 && "bg-gray-500 hover:bg-gray-500"
            )}
            title="メッセージを送る"
            disabled={textarea.trim().length === 0}
            onClick={handleClickSend}
          >
            <Icon className="text-white text-3xl" icon="fe:paper-plane" />
          </button>
        </form>
      </nav>
    </div>
  );
}

export default Chat;

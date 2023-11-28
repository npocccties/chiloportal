import { atom } from "jotai";
import { useAtom, useAtomValue } from "jotai/react";

type Chat = {
  type: "bot" | "user";
  body: React.ReactNode;
};

const chatsAtom = atom<Chat[]>([]);

const pushChatAtom = atom(null, (get, set, chat: Chat) => {
  set(chatsAtom, [...get(chatsAtom), chat]);
});

const popChatAtom = atom(null, (get, set) => {
  const chats = get(chatsAtom);
  set(chatsAtom, chats.slice(0, chats.length - 1));
});

function useChats() {
  const chats = useAtomValue(chatsAtom);
  const [, pushChat] = useAtom(pushChatAtom);
  const [, popChat] = useAtom(popChatAtom);
  return { chats, pushChat, popChat };
}

export default useChats;

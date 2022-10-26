import { atom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";

type Chat = {
  type: "bot" | "user";
  body: React.ReactNode;
};

const chatsAtom = atom<Chat[]>([]);

const pushChatAtom = atom<null, Chat>(null, (get, set, chat) => {
  set(chatsAtom, [...get(chatsAtom), chat]);
});

const popChatAtom = atom<null, undefined>(null, (get, set) => {
  const chats = get(chatsAtom);
  set(chatsAtom, chats.slice(0, chats.length - 1));
});

function useChats() {
  const chats = useAtomValue(chatsAtom);
  const pushChat = useUpdateAtom(pushChatAtom);
  const popChat = useUpdateAtom(popChatAtom);
  return { chats, pushChat, popChat };
}

export default useChats;

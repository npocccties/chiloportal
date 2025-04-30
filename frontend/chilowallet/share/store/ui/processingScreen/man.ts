import { atom, useRecoilValue, useSetRecoilState } from "recoil";

import { RECOIL_ATOMS_KEYS } from "../../keys";

type ProcessingScreenGetters = {
  useProcessingScreen: () => boolean;
};

type ProcessingScreenActions = {
  useShowProcessingScreen: () => {
    showProcessingScreen: <T>(callback: () => Promise<any>) => Promise<T>;
  };
};

const processingScreenState = atom<boolean>({
  key: RECOIL_ATOMS_KEYS.LOADING_SCREEN_STATE,
  default: false,
});

const useProcessingScreen = () => {
  return useRecoilValue(processingScreenState);
};

export const processingScreenGetters: ProcessingScreenGetters = {
  useProcessingScreen,
};

const useShowProcessingScreen = () => {
  const setState = useSetRecoilState(processingScreenState);
  const processingTasks: Set<() => Promise<void>> = new Set();

  const showProcessiongScreen = async <T>(callback: () => Promise<any>): Promise<T> => {
    window.onbeforeunload = (event) => {
      event.preventDefault();
      event.returnValue = "Check";
    };

    history.pushState(null, null, location.href);
    const browsweBackHandler = () => {
      history.forward();
    };
    window.addEventListener("popstate", browsweBackHandler);
    let result;
    try {
      setState(true);
      result = await callback();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      processingTasks.delete(callback);
      if (processingTasks.size === 0) {
        window.onbeforeunload = null;
        window.removeEventListener("popstate", browsweBackHandler);
        setState(false);
      }
    }
    return result;
  };

  return { showProcessingScreen: showProcessiongScreen };
};

export const processingScreenActions: ProcessingScreenActions = {
  useShowProcessingScreen,
};

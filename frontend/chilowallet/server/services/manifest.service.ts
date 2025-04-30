import axios from "axios";

import { loggerError } from "@/lib/logger";
import { getManifestFromJWT } from "@/lib/utils";

export const getManifest = async (manifestURL: string) => {
  try {
    const manifestToken = await axios.get<{ token: string }>(manifestURL).then((res) => {
      return res.data.token;
    });
    return getManifestFromJWT(manifestToken);
  } catch (e) {
    loggerError("failed get manifest data", e);
  }
};

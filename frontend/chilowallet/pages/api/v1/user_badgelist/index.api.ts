import type { NextApiRequest, NextApiResponse } from "next";

import { logEndForApi, logStartForApi, logStatus } from "@/constants/log";
import { loggerError, loggerInfo } from "@/lib/logger";
import prisma from "@/lib/prisma";
import { getUserInfoFormJwt } from "@/lib/userInfo";
import { api } from "@/share/api";
import { UserBadgeList } from "@/types/api/user_badgelist";

const apiPath = api.v1.user_badgelist;
const ePortfolioUrl = process.env.NEXT_PUBLIC_E_PORTFOLIO_LINK;

//対象ユーザのの保持バッジリストを返す

export default async function handler(req: NextApiRequest, res: NextApiResponse<UserBadgeList | {}>) {
  loggerInfo(logStartForApi(apiPath));

  try {
    const session_cookie = req.cookies == null ? null : req.cookies.session_cookie;
    loggerInfo("-----session_cookie-----", session_cookie);

    const { eppn } = session_cookie == null ? { eppn: null } : getUserInfoFormJwt(session_cookie);
    loggerInfo("-----eppn-----", eppn);

    //eppnが取得できない場合
    if (session_cookie == null || eppn == null) {
      //ログ出力・リクエストエラー応答
      loggerError(`${logStatus.error} No eppn in session_cookie`);
      const msg = `ERROR: No eppn in session_cookie`;
      return res.status(400).json({ error: { errorMessage: msg } });
    }

    //walletsテーブルに対応するorthrosId(eppn)が登録されているかチェック
    const findWalletId = await prisma.wallet.findMany({
      where: {
        orthrosId: eppn,
      },
    });

    //対応するorthrosId(eppn)がない場合
    if (!findWalletId || findWalletId.length <= 0) {
      //ログ出力・リクエストエラー応答
      loggerError(`${logStatus.error} Bad request! Not found orthrosId in DB`);
      const msg = `ERROR: Bad request! Not found orthrosId in DB. eppn=${eppn}`;
      return res.status(400).json({ error: { errorMessage: msg } });
    }

    //badge_vcsテーブルからreqOrthrosIdに対応するバッジ情報を取得
    const findBadgeList = await prisma.badgeVc.findMany({
      select: {
        badgeClassId: true,
        badgeName: true,
      },
      where: {
        walletId: findWalletId[0].walletId,
      },
    });

    //バッジ情報取得結果を返す(正常)
    loggerInfo(`${logStatus.success} ${apiPath}`, findBadgeList);
    
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', ePortfolioUrl)
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

    return res.status(200).json(findBadgeList);
  } catch (e) {
    //例外発生時 ログ出力・サーバーエラー応答
    loggerError(`${logStatus.error} ${apiPath}`, e.message);
    return res.status(500).json({ error: { errorMessage: e.message, detail: e } });
  } finally {
    loggerInfo(logEndForApi(apiPath));
  }
}

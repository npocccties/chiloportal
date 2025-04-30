import axios from "axios";
import base64url from "base64url";
import { createTransport } from "nodemailer";

import { findCabinetUrl } from "../repository/badgeConsumer";
import { createSubmission, findConsumerAndBadgeVc } from "../repository/submissionBadge";

import { badgeCabinetRetryConfig, smtpMailRetryConfig } from "@/configs/retry";
import { submissionResult } from "@/constants";
import { logStatus } from "@/constants/log";
import { loggerError, loggerInfo } from "@/lib/logger";
import { retryRequest } from "@/lib/retryRequest";
import { cabinetApi } from "@/share/api";
import { SubmissionResponseStatus } from "@/types/status";

const smtpHost = process.env.smtp_mail_server_host;
const smtpPort = process.env.smtp_mail_server_port;
const mailFrom = process.env.mail_sender_address;

const createMailTemplate = (confirmCode: string, consumerName: string) => {
  const messageTemplate = `
下記の確認コードを入力して${consumerName} にバッジを提出してください。
───────────────────────────────────
■確認コード■
───────────────────────────────────
${confirmCode}
───────────────────────────────────



※このメールに心当たりの無い方は、本メールの破棄をお願いいたします。
※このメールはシステムより自動配信されています。返信は受付できませんので、ご了承ください。
`;

  return messageTemplate;
};

export const sendMail = async (email: string, confirmCode: string, consumerId: number) => {
  const { consumerName } = await findCabinetUrl({ consumerId });

  const options = {
    host: smtpHost,
    port: Number(smtpPort),
    secure: false,
    requireTLS: false,
    tls: {
      // MEMO: https://stackoverflow.com/questions/30720142/how-to-solve-cert-untrusted-error-in-nodemailers
      rejectUnauthorized: false,
    },
  };

  const mail = {
    from: `no-reply@${mailFrom}`,
    to: email,
    subject: "バッジ提出確認コード",
    text: createMailTemplate(confirmCode, consumerName),
  };

  try {
    const transport = createTransport(options);
    await retryRequest(() => {
      return transport.sendMail(mail);
    }, smtpMailRetryConfig);
  } catch (e) {
    loggerError("connect smtp server error!");

    throw new Error(e.message);
  }
};

type SubmissionResponse = {
  reason_code: number;
  reason_msg: string;
};

export const sendCabinetForVc = async ({
  badgeVcId,
  consumerId,
  walletId,
  email,
  externalLinkageId,
}: {
  badgeVcId: number;
  consumerId: number;
  walletId: number;
  email: string;
  externalLinkageId: string;
}): Promise<SubmissionResponseStatus> => {
  const { consumer, badgeVc } = await findConsumerAndBadgeVc({ badgeVcId, consumerId });

  const cabinetApiUrl = `${consumer.cabinetUrl}${cabinetApi.v1.submissionBadge}`;
  loggerInfo("request cabinetApiUrl", cabinetApiUrl);

  const { vcDataHeader, vcDataPayload } = badgeVc;

  const vcHeader = base64url(vcDataHeader);
  const vcPayload = base64url(vcDataPayload);

  const vcJwt = `${vcHeader}.${vcPayload}.${badgeVc.vcDataSignature}`;
  try {
    await retryRequest(() => {
      return axios.post<SubmissionResponse>(cabinetApiUrl, {
        user_email: email,
        badge_vc: vcJwt,
        user_id: externalLinkageId,
      });
    }, badgeCabinetRetryConfig);

    await createSubmission({ badgeVcId, walletId, email, consumerId, consumerName: consumer.consumerName });
    return "success";
  } catch (e) {
    const { badUserId, badReqestOther, verifyBadgeNG, verifyVcNG } = submissionResult;
    const { status, data } = e.response;
    loggerError(`status: ${status}, data: ${JSON.stringify(data)}`);

    if (status === 400) {
      loggerError(`${logStatus.error} submission badge error!`, data.reason_code);
      switch (data.reason_code) {
        case badUserId:
          return "invalid userId";
        case verifyBadgeNG:
        case verifyVcNG:
          return "verification failure";
        case badReqestOther:
          return "other errors";
        default:
          throw new Error("invalid api access error");
      }
    } else {
      loggerError(`${logStatus.error} submission An unexpected error!`);
      throw new Error(e.message);
    }
  }
};

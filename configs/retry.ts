import { RetryConfig } from "@/types/config";

export const moodleRetryConfig: RetryConfig = {
  count: Number(process.env.moodle_api_request_retry_count),
  time: Number(process.env.moodle_api_request_retry_time),
};

export const smtpMailRetryConfig: RetryConfig = {
  count: Number(process.env.smtp_mail_request_retry_count),
  time: Number(process.env.smtp_mail_request_retry_time),
};

export const openbadgeVerifyRetryConfig: RetryConfig = {
  count: Number(process.env.oepnbadge_verify_api_request_retry_count),
  time: Number(process.env.oepnbadge_verify_api_request_retry_time),
};

export const msEntraRetryConfig: RetryConfig = {
  count: Number(process.env.ms_entra_id_api_request_retry_count),
  time: Number(process.env.ms_entra_id_api_request_retry_time),
};

export const badgeCabinetRetryConfig: RetryConfig = {
  count: Number(process.env.badge_cabinet_api_request_retry_count),
  time: Number(process.env.badge_cabinet_api_request_retry_time),
};

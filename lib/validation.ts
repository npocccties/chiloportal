import { z } from "zod";

export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailPattern.test(email);
};

export const validateForbiddenCharacters = (value) => {
  // eslint-disable-next-line no-control-regex
  const forbiddenCharacters = /[\x00-\x1f\x22\x27\x2c\x5c\x60\x09\x0a\x0d]/;
  return !forbiddenCharacters.test(value);
};

export const formValidateForbiddenCharacters = (value) => {
  return validateForbiddenCharacters(value) || "使用禁止文字が含まれています。";
};

export const dateSchema = z.string().refine(
  (value) => {
    if (value === "") return true;

    const date = new Date(value);
    const minDate = new Date("1900-01-01");
    const maxDate = new Date("2099-12-31");
    return date >= minDate && date <= maxDate;
  },
  {
    message: "無効な日付です。日付は1900/01/01から2099/12/31の間で指定してください。",
  },
);

export const textBoxSchema = z.string().max(256, { message: "256文字以内で入力してください。" });

export const moodleUserNameSchema = z.string().regex(/^[a-z0-9_.@-]+$/, {
  message:
    "ユーザー名には半角英数小文字、アンダースコア (_)、ハイフン (-)、ピリオド (.) またはアットマーク (@) のみ含むことができます。",
});

export const sendEmailFormSchema = z.object({
  consumerId: z
    .string()
    .or(z.number())
    .refine((v) => v !== "", {
      message: "バッジ提出先を選択してください。",
    }),
  email: z
    .string()
    .min(1, { message: "メールアドレスを入力してください。" })
    .email({ message: "emailの入力形式が正しくありません。" })
    .max(256, { message: "256文字以内で入力してください。" }),
  externalLinkageId: z
    .string()
    .min(1, { message: "指定されたIDを入力してください。" })
    .max(256, { message: "256文字以内で入力してください。" })
    .refine((v) => validateForbiddenCharacters(v), {
      message: "使用禁止文字が含まれています。",
    }),
  confirmLinkageId: z
    .string()
    .min(1, { message: "確認用フォームは入力必須です。" })
    .max(256, { message: "256文字以内で入力してください。" })
    .refine((v) => validateForbiddenCharacters(v), {
      message: "使用禁止文字が含まれています。",
    }),
});

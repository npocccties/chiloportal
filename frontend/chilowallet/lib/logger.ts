import pino from "pino";

const pinoConfig = {
  level: process.env.LOG_LEVEL,
  formatters: {
    level: (label: string) => {
      return {
        level: label,
      };
    },
  },
  timestamp: () => `,"timestamp":"${new Date(Date.now()).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}"`,
  browser: {
    asObject: true,
  },
};

const logger = pino(pinoConfig);

export const loggerError = (message: string, ...args: any[]) => {
  return logger.error(args, message);
};

export const loggerWarn = (message: string, ...args: any[]) => {
  return logger.warn(args, message);
};

export const loggerInfo = (message: string, ...args: any[]) => {
  return logger.info(args, message);
};

export const loggerDebug = (message: string, ...args: any[]) => {
  return logger.debug(args, message);
};

// NOTE: https://github.com/vercel/next.js/discussions/33898
const loggerForMiddleware = pino({
  level: pinoConfig.level,
  formatters: pinoConfig.formatters,
  timestamp: () => `${new Date(Date.now()).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
  browser: {
    write(obj: { level: number; time: string; msg: string }) {
      try {
        let level = "";
        if (obj.level === 30) {
          level = "info";
        } else if (obj.level === 50) {
          level = "error";
        }

        const logObj = {
          level: level,
          timestamp: obj.time,
          msg: obj.msg,
        };

        console.log(JSON.stringify(logObj));
      } catch (err) {
        if (err instanceof Error) {
          // Without a `replacer` argument, stringify on Error results in `{}`
          console.log(JSON.stringify(err, ["name", "message", "stack"]));
        }

        console.log(JSON.stringify({ message: "Unknown error type" }));
      }
    },
  },
});

// middlleware用のログ出力
export const loggerMWInfo = (message: string, ...args: any[]) => {
  return loggerForMiddleware.info(args, message);
};

export const loggerMWError = (message: string, ...args: any[]) => {
  return loggerForMiddleware.error(args, message);
};

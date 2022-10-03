import { handlers } from "./handlers";

export const server = require("msw/node").setupServer(...handlers);

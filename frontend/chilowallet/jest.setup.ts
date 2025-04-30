import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

import { server } from "@/test-server/mocks/server";

Object.assign(global, { TextEncoder, TextDecoder });

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

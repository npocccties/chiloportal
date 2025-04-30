import { rest } from "msw";

import { mockBadgeMetaData, url, mockBadgeMetaDataForError, notFoundErrorUrl } from "./api/moodle/metadata";

export const handlers = [rest.get(url, mockBadgeMetaData), rest.get(notFoundErrorUrl, mockBadgeMetaDataForError)];

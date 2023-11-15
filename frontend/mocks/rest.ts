import { rest, ResponseResolver, RestRequest, RestContext } from "msw";
type A1<T> = T extends (a1: infer I) => unknown ? I : never;

type Method = {
  reqHeaders: any;
  query: any;
  status: number;
  resBody: any;
  reqBody: any;
};
type MethodNames = "get" | "post" | "put" | "patch" | "delete";
type Methods = { [K in MethodNames]: Method };

type Get = {
  get: (option: {
    body: Methods["get"]["reqBody"];
    query: Methods["get"]["reqBody"];
    config?: any;
  }) => Promise<Methods["get"]["resBody"]>;
  $path: () => string;
};

export function restGet<T extends Get>(
  api: T,
  resolver: ResponseResolver<
    RestRequest<A1<T["get"]>["body"]>,
    RestContext,
    Awaited<ReturnType<T["get"]>>["body"]
  >,
) {
  return rest.get(api.$path(), resolver);
}

type Post = {
  post: (option: {
    body: Methods["post"]["reqBody"];
    query: Methods["post"]["query"];
    config?: any;
  }) => Promise<Methods["post"]["resBody"]>;
  $path: () => string;
};

export function restPost<T extends Post>(
  api: T,
  resolver: ResponseResolver<
    RestRequest<A1<T["post"]>["body"]>,
    RestContext,
    Awaited<ReturnType<T["post"]>>["body"]
  >,
) {
  return rest.post(api.$path(), resolver);
}

type Put = {
  put: (option: {
    body: Methods["put"]["reqBody"];
    query: Methods["put"]["reqBody"];
    config?: any;
  }) => Promise<Methods["put"]["resBody"]>;
  $path: () => string;
};

export function restPut<T extends Put>(
  api: T,
  resolver: ResponseResolver<
    RestRequest<A1<T["put"]>["body"]>,
    RestContext,
    Awaited<ReturnType<T["put"]>>["body"]
  >,
) {
  return rest.put(api.$path(), resolver);
}

type Patch = {
  patch: (option: {
    body: Methods["patch"]["reqBody"];
    query: Methods["patch"]["reqBody"];
    config?: any;
  }) => Promise<Methods["patch"]["resBody"]>;
  $path: () => string;
};

export function restPatch<T extends Patch>(
  api: T,
  resolver: ResponseResolver<
    RestRequest<A1<T["patch"]>["body"]>,
    RestContext,
    Awaited<ReturnType<T["patch"]>>["body"]
  >,
) {
  return rest.patch(api.$path(), resolver);
}

type Delete = {
  delete: (option: {
    body: Methods["delete"]["reqBody"];
    query: Methods["delete"]["reqBody"];
    config?: any;
  }) => Promise<Methods["delete"]["resBody"]>;
  $path: () => string;
};

export function restDelete<T extends Delete>(
  api: T,
  resolver: ResponseResolver<
    RestRequest<A1<T["delete"]>["body"]>,
    RestContext,
    Awaited<ReturnType<T["delete"]>>["body"]
  >,
) {
  return rest.delete(api.$path(), resolver);
}

type Params = {
  [key: string]: string;
};

export function encodeReqestGetUrlParams(params: Params) {
  const query = Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&");

  return query;
}

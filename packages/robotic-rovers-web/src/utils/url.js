import { API_ENDPOINT } from "./constants";

export const getUrlFor = (path, queryStrings = [], service = API_ENDPOINT) => {
  const url = new URL(path, service);

  queryStrings.forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  return url.href;
};

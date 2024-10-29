import { DYNAMIC_DATA_FETCHING_OPTIONS } from "./constants";

export function getRequestOptions({ method = "GET", body = undefined } = {}) {
  const myHeaders = new Headers();

  if (body) {
    myHeaders.append("Content-Type", `application/json`);
    body = JSON.stringify(body);
  }

  return {
    ...DYNAMIC_DATA_FETCHING_OPTIONS,
    headers: myHeaders,
    method,
    body,
  };
}

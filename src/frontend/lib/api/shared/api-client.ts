import { getApiUrl } from "./api-url";

type RequestOptions = {
  params?: Record<string, string | number>;
  init?: RequestInit;
};

export async function getApiJson<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await fetch(getApiUrl(path, options.params), {
    method: "GET",
    ...options.init,
    headers: {
      "Content-Type": "application/json",
      ...(options.init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}
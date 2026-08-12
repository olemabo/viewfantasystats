// import "server-only";

/**
 * Builds an absolute API URL from a relative endpoint path and optional query parameters.
 *
 * The base URL is read from `NEXT_PUBLIC_API_URL`. If it is not set, the function
 * falls back to `http://127.0.0.1:8000`.
 *
 * Leading and trailing slashes are normalized so the resulting URL is well-formed.
 *
 * @param path Relative API path, for example `statistics/team-names-ids`.
 * @param params Optional query parameters to append to the URL.
 * @returns A fully qualified URL string that can be used in server-side fetch calls.
 */
export function getApiUrl(
  path: string,
  params?: Record<string, string | number>,
) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const url = new URL(
    `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`,
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, String(value)),
    );
  }

  return url.toString();
}
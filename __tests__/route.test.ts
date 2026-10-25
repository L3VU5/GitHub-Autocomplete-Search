/** @jest-environment node */
import { POST } from "../app/api/github/route";
import { SEARCH_QUERY } from "../app/lib/searchQuery";

const post = (body: unknown) =>
  POST(
    new Request("http://localhost/api/github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    })
  );

const validBody = { query: SEARCH_QUERY, variables: { query: "react" } };

describe("POST /api/github", () => {
  const originalEnv = process.env;
  const fetchMock = jest.fn();

  beforeEach(() => {
    process.env = { ...originalEnv, GITHUB_TOKEN: "test-token" };
    delete process.env.NEXT_PUBLIC_REACT_APP_GITHUB_API_KEY;
    global.fetch = fetchMock;
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ data: { ok: true } }), { status: 200 }));
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("answers 503 when no token is configured", async () => {
    delete process.env.GITHUB_TOKEN;

    const response = await post(validBody);

    expect(response.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("still accepts the legacy token variable", async () => {
    delete process.env.GITHUB_TOKEN;
    process.env.NEXT_PUBLIC_REACT_APP_GITHUB_API_KEY = "legacy-token";

    await post(validBody);

    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer legacy-token");
  });

  test("rejects a body that is not JSON", async () => {
    expect((await post("{nope")).status).toBe(400);
  });

  test("rejects any other GraphQL document", async () => {
    const response = await post({ query: "{ viewer { login } }", variables: { query: "react" } });

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("rejects an unparsable document", async () => {
    expect((await post({ query: "query {", variables: { query: "react" } })).status).toBe(400);
  });

  test.each([undefined, "", "ab", "  a ", 42, "x".repeat(101)])("rejects the search term %p", async (term) => {
    const response = await post({ query: SEARCH_QUERY, variables: { query: term } });

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("forwards the search with the server-side token", async () => {
    const response = await post(validBody);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ data: { ok: true } });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.github.com/graphql");
    expect(init.headers.Authorization).toBe("Bearer test-token");
    expect(JSON.parse(init.body)).toEqual({ query: SEARCH_QUERY, variables: { query: "react" } });
  });

  test("accepts the document with the __typename fields Apollo Client adds", async () => {
    const withTypename = SEARCH_QUERY.replaceAll("edges {", "__typename edges {");

    const response = await post({ query: withTypename, variables: { query: "react" } });

    expect(response.status).toBe(200);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).query).toBe(withTypename);
  });

  test("rejects a document that selects extra fields", async () => {
    const extra = SEARCH_QUERY.replace("login", "login email");

    expect((await post({ query: extra, variables: { query: "react" } })).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("accepts the same document with different formatting", async () => {
    // Comments run to the end of the line, so they have to go before the line breaks do.
    const reformatted = SEARCH_QUERY.replace(/#.*$/gm, "").replace(/\s+/g, " ");

    expect((await post({ query: reformatted, variables: { query: "react" } })).status).toBe(200);
  });

  test("passes GitHub error statuses through", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ message: "Bad credentials" }), { status: 401 }));

    const response = await post(validBody);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ message: "Bad credentials" });
  });
});

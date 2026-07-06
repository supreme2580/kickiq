const TAVILY_API = "https://api.tavily.com/search"
const WIKI_API = "https://en.wikipedia.org/w/api.php"
const DDG_HTML = "https://html.duckduckgo.com/html/"

let lastRequest = 0
const MIN_INTERVAL = 2000

async function rateLimitedFetch(url: string, options?: RequestInit): Promise<Response> {
  const now = Date.now()
  const elapsed = now - lastRequest
  if (elapsed < MIN_INTERVAL) {
    await new Promise((r) => setTimeout(r, MIN_INTERVAL - elapsed))
  }
  lastRequest = Date.now()
  return fetch(url, {
    ...options,
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      ...options?.headers,
    },
  })
}

interface SearchResult {
  title: string
  url: string
  snippet: string
}

interface TavilyResult {
  title: string
  url: string
  content: string
}

interface TavilyResponse {
  results?: TavilyResult[]
}

interface WikiSearchResult {
  title: string
  snippet: string
}

interface WikiQueryResponse {
  query?: {
    search?: WikiSearchResult[]
  }
}

async function searchTavily(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) return []

  try {
    const res = await fetch(TAVILY_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "basic",
        include_answer: false,
        max_results: 5,
      }),
    })
    if (!res.ok) return []
    const data: TavilyResponse = await res.json()
    return (data.results || []).map((r) => ({
      title: r.title,
      url: r.url,
      snippet: r.content,
    }))
  } catch {
    return []
  }
}

async function searchWikipedia(query: string): Promise<SearchResult[]> {
  const url = `${WIKI_API}?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=5&srprop=snippet`
  const res = await rateLimitedFetch(url)
  if (!res.ok) return []
  const data: WikiQueryResponse = await res.json()
  return (data.query?.search || []).map((r) => ({
    title: r.title,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(r.title.replace(/ /g, "_"))}`,
    snippet: r.snippet.replace(/<[^>]+>/g, ""),
  }))
}

async function searchDuckDuckGo(query: string): Promise<SearchResult[]> {
  try {
    const res = await rateLimitedFetch(`${DDG_HTML}?q=${encodeURIComponent(query)}`)
    const html = await res.text()
    if (html.includes("challenge-form") || html.includes("Please complete")) return []

    const results: SearchResult[] = []
    const linkRegex = /<a rel="nofollow" class="result__a" href="(.*?)".*?>(.*?)<\/a>/g
    const snippetRegex = /class="result__snippet"[^>]*>(.*?)<\//g

    const links: string[] = []
    const titles: string[] = []
    const snippets: string[] = []

    let m
    while ((m = linkRegex.exec(html)) !== null) {
      let url = m[1]
      if (url.includes("uddg=")) {
        try {
          url = decodeURIComponent(url.split("uddg=")[1].split("&")[0])
        } catch {}
      }
      links.push(url)
      titles.push(m[2].replace(/<[^>]+>/g, "").trim())
    }

    while ((m = snippetRegex.exec(html)) !== null) {
      snippets.push(m[1].replace(/<[^>]+>/g, "").trim())
    }

    for (let i = 0; i < links.length; i++) {
      results.push({
        title: titles[i] || `Result ${i + 1}`,
        url: links[i],
        snippet: snippets[i] || "",
      })
    }

    return results
  } catch {
    return []
  }
}

export async function webSearch(query: string): Promise<string> {
  const tavilyResults = await searchTavily(query)
  if (tavilyResults.length > 0) {
    return tavilyResults
      .map((r, i) => `${i + 1}. ${r.title}\n   URL: ${r.url}\n   ${r.snippet}`)
      .join("\n\n")
  }

  const wikiResults = await searchWikipedia(query)
  if (wikiResults.length > 0) {
    return wikiResults
      .map((r, i) => `${i + 1}. ${r.title}\n   URL: ${r.url}\n   ${r.snippet}`)
      .join("\n\n")
  }

  const ddgResults = await searchDuckDuckGo(query)
  if (ddgResults.length > 0) {
    return ddgResults
      .map((r, i) => `${i + 1}. ${r.title}\n   URL: ${r.url}\n   ${r.snippet}`)
      .join("\n\n")
  }

  return "Web search is currently unavailable. Try again later."
}

export async function fetchUrl(url: string): Promise<string> {
  try {
    const res = await rateLimitedFetch(url)
    const html = await res.text()
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
    return text.substring(0, 3000)
  } catch (e) {
    return `Failed to fetch URL: ${e}`
  }
}

export async function fetchRSS(feedUrl) {
  const encoded = encodeURIComponent(feedUrl);

  const res = await fetch(
    `http://127.0.0.1:8000/api/rss/?url=${encoded}`
  );

  const data = await res.json();
  return data.items;
}
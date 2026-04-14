export async function fetchRSS(feedUrl) {
  const encoded = encodeURIComponent(feedUrl);

  const res = await fetch(
    `https://healthysportmind-git-358530944608.us-south1.run.app/api/rss/?url=${encoded}`
  );

  const data = await res.json();
  return data.items;
}
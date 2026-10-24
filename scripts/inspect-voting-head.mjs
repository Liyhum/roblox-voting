async function getHtml() {
  const res = await fetch('https://trecblx.com/voting', { headers: { 'Cache-Control': 'no-cache' } });
  const html = await res.text();
  console.log('HTML length:', html.length);
  const headMatch = html.match(/<head[\s\S]*?<\/head>/);
  if (headMatch) {
    console.log('HEAD:', headMatch[0]);
  }
}

getHtml();

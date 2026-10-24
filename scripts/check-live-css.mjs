async function checkCss() {
  const res = await fetch('https://trecblx.com/voting');
  const html = await res.text();
  
  // Extract CSS link tags
  const cssLinks = html.match(/href="([^"]+\.css[^"]*)"/g) || [];
  console.log('Found CSS links:', cssLinks);

  for (const match of cssLinks) {
    const urlPath = match.replace(/href="([^"]+)"/, '$1');
    const fullUrl = urlPath.startsWith('http') ? urlPath : `https://trecblx.com${urlPath}`;
    try {
      const cssRes = await fetch(fullUrl);
      console.log(`CSS URL: ${fullUrl} -> Status: ${cssRes.status} (${cssRes.statusText}), Content-Type: ${cssRes.headers.get('content-type')}`);
    } catch (e) {
      console.error(`Failed to fetch ${fullUrl}:`, e.message);
    }
  }
}

checkCss();

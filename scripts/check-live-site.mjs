async function inspect() {
  const res = await fetch('https://trecblx.com/voting');
  const text = await res.text();
  
  // Find script tags
  const scripts = text.match(/src="([^"]+_next[^"]+)"/g) || [];
  console.log('Script tags on trecblx.com:', scripts);

  // Check if "FEMME" or "740188661" is present in HTML
  console.log('Has 740188661:', text.includes('740188661'));
  console.log('Has FEMME:', text.includes('FEMME'));

  // Check build ID
  const buildIdMatch = text.match(/"buildId":"([^"]+)"/);
  console.log('Live Build ID:', buildIdMatch ? buildIdMatch[1] : 'not found');
}

inspect();

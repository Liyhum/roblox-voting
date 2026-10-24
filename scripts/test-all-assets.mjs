async function testAllAssets() {
  const assets = [
    '/_next/static/media/797e433ab948586e-s.p.0r6juujl39pe6.woff2',
    '/_next/static/media/caa3a2e1cccd8315-s.p.0wgildi0cnwt9.woff2',
    '/trec-kl/icon.png',
    '/trec-kl/thumb1.png',
    '/_next/static/chunks/0m4lk93awlr0x.css',
    '/_next/static/chunks/2a40e66-oc2--.css',
    '/_next/static/chunks/1x6obpmlu1_c2.js',
    '/_next/static/chunks/2r4s4h5xul1n-.js',
    '/_next/static/chunks/01s_f_3qlcqtb.js',
    '/_next/static/chunks/27hi3s81pf0d4.js',
    '/_next/static/chunks/turbopack-3-ry682tkyiqk.js',
    '/_next/static/chunks/0umf92h1sb77c.js',
    '/_next/static/chunks/43y0wn1y6kpxp.js',
    '/_next/static/chunks/3awvt-fw3c1v0.js',
    '/_next/static/chunks/0cz1d0mv5g_q7.js'
  ];

  for (const path of assets) {
    const res = await fetch(`https://trecblx.com${path}`);
    console.log(`${path} -> ${res.status} (${res.statusText})`);
  }
}

testAllAssets();

async function inspectCssContent() {
  const css1 = await (await fetch('https://trecblx.com/_next/static/chunks/0m4lk93awlr0x.css')).text();
  const css2 = await (await fetch('https://trecblx.com/_next/static/chunks/2a40e66-oc2--.css')).text();
  
  console.log('0m4lk93awlr0x.css length:', css1.length, 'preview:', css1.slice(0, 100));
  console.log('2a40e66-oc2--.css length:', css2.length, 'preview:', css2.slice(0, 100));
}

inspectCssContent();

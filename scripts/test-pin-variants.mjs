const pins = [
  'Femme_Host99_Tr3c$2026',
  '"Femme_Host99_Tr3c$2026"',
  "'Femme_Host99_Tr3c$2026'",
  'Femme_Host99_Tr3c026',
  'Femme_Host99_Tr3c',
  'Femme_Host99_Tr3c$2026 ',
  'admin',
  '123456',
];

async function testPins() {
  for (const pin of pins) {
    const res = await fetch('https://trecblx.com/api/event-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'pause', pin })
    });
    const data = await res.json();
    console.log('Testing pin:', JSON.stringify(pin), '-> status:', res.status, data.message || data.success);
    if (res.status === 200) {
      console.log('>>> MATCH FOUND! PIN IS:', pin);
      break;
    }
  }
}
testPins();

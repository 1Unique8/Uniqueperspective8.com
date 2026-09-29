const https = require('https');
const { URL } = require('url');
function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error('Missing required env: ' + name);
  return value;
}
function request(urlString, headers) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.end();
  });
}
function redact(text) {
  return String(text || '')
    .replace(process.env.WP_PASSWORD || '___', '[redacted]')
    .replace(process.env.WP_ADMIN || '___', '[user]');
}
async function main() {
  const site = (process.env.WC_SITE_URL || 'https://shop.uniqueperspective8.com').replace(/\/$/, '');
  const user = requiredEnv('WP_ADMIN');
  const pass = requiredEnv('WP_PASSWORD');
  const token = Buffer.from(user + ':' + pass).toString('base64');
  const headers = {
    Authorization: 'Basic ' + token,
    Accept: 'application/json',
    'User-Agent': 'UP8-wp-probe'
  };
  const endpoints = [
    site + '/wp-json/wp/v2/users/me',
    site + '/wp-json/wp/v2/plugins'
  ];
  for (const endpoint of endpoints) {
    const result = await request(endpoint, headers);
    console.log(endpoint.replace(site, ''), result.status);
    if (result.status >= 400) {
      console.log(redact(result.body).slice(0, 400));
      continue;
    }
    let data;
    try { data = JSON.parse(result.body); } catch { console.log('not json'); continue; }
    if (Array.isArray(data) && endpoint.includes('/plugins')) {
      const amazon = data.filter((row) => {
        const blob = JSON.stringify(row).toLowerCase();
        return blob.includes('amazon') || blob.includes('cedcommerce') || blob.includes('aawp') || blob.includes('multichannel');
      });
      console.log('plugins_total', data.length);
      console.log('amazon_like', amazon.map((row) => ({ plugin: row.plugin, name: row.name, status: row.status })));
    } else if (data && data.slug) {
      console.log('authed_as', data.slug);
    } else {
      console.log('ok');
    }
  }
}
main().catch((error) => { console.error(error.message); process.exit(1); });

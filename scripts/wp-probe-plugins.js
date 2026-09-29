const https = require('https');
const { URL } = require('url');

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error('Missing required env: ' + name);
  return value;
}

function siteRoot() {
  const raw = (process.env.WC_SITE_URL || 'https://shop.uniqueperspective8.com').trim();
  let url;
  try { url = new URL(raw); } catch {
    throw new Error('WC_SITE_URL is not a URL');
  }
  if (!url.hostname.includes('shop.uniqueperspective8.com')) {
    console.log('hostname', url.hostname, '(expected shop.uniqueperspective8.com)');
  } else {
    console.log('hostname', url.hostname);
  }
  return url.origin;
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
      res.on('end', () => resolve({
        status: res.statusCode,
        type: res.headers['content-type'] || '',
        location: res.headers.location || '',
        body
      }));
    });
    req.on('error', reject);
    req.end();
  });
}

function redact(text) {
  return String(text || '')
    .replace(process.env.WP_PASSWORD || '___', '[redacted]')
    .replace(process.env.WP_ADMIN || '___', '[user]')
    .replace(/\s+/g, ' ')
    .slice(0, 180);
}

async function main() {
  const site = siteRoot();
  const user = requiredEnv('WP_ADMIN');
  const pass = requiredEnv('WP_PASSWORD');
  const token = Buffer.from(user + ':' + pass).toString('base64');
  const headers = {
    Authorization: 'Basic ' + token,
    Accept: 'application/json',
    'User-Agent': 'Mozilla/5.0 (compatible; UniquePerspective8/1.0; +https://uniqueperspective8.com/)'
  };
  console.log('admin_len', user.length);

  for (const path of ['/wp-json/wp/v2/users/me', '/wp-json/wp/v2/plugins?status=active']) {
    const result = await request(site + path, headers);
    console.log(path, result.status, result.type || 'no-type');
    if (result.location) console.log('location', result.location);
    if (result.status >= 400) {
      console.log(redact(result.body));
      continue;
    }
    try {
      const data = JSON.parse(result.body);
      if (Array.isArray(data)) {
        const amazon = data.filter((row) => {
          const blob = JSON.stringify(row).toLowerCase();
          return /amazon|cedcommerce|aawp|multichannel|affiliate/.test(blob);
        });
        console.log('plugins_total', data.length);
        console.log('amazon_like', amazon.map((row) => ({
          plugin: row.plugin,
          name: row.name,
          status: row.status
        })));
      } else if (data && data.slug) {
        console.log('authed_as', data.slug);
      } else {
        console.log('json_keys', Object.keys(data).slice(0, 8).join(','));
      }
    } catch {
      console.log('body', redact(result.body));
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

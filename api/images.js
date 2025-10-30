// Vercel Serverless Function: List ImageKit files in a folder with pagination
// Env vars required on Vercel:
// - IMAGEKIT_PRIVATE_KEY (server-side only)
// - IMAGEKIT_URL_ENDPOINT (e.g., https://ik.imagekit.io/t3aewf67s)
// Optional:
// - IMAGEKIT_PUBLIC_KEY (not needed for listing via server-side private key)

const https = require('https');

function listFiles({ folder = '/', limit = 20, skip = 0 }) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('IMAGEKIT_PRIVATE_KEY is not set');
  }

  const query = new URLSearchParams({
    path: folder,
    limit: String(limit),
    skip: String(skip),
    sort: 'ASC',
  }).toString();

  const options = {
    method: 'GET',
    hostname: 'api.imagekit.io',
    path: `/v1/files?${query}`,
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${privateKey}:`).toString('base64'),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

module.exports = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      res.statusCode = 405;
      res.setHeader('Allow', 'GET');
      return res.end('Method Not Allowed');
    }

    const { folder = '/', limit = '20', skip = '0' } = req.query || {};
    const lim = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skp = Math.max(parseInt(skip, 10) || 0, 0);

    const files = await listFiles({ folder, limit: lim, skip: skp });

    // Normalize to the shape expected by the client
    // ImageKit list returns an array; entries have .filePath or .filePath/.fileId etc.
    const normalized = (Array.isArray(files) ? files : []).map((f) => ({
      imagekitPath: f.filePath || f.file_path || f.name || '',
      width: f.width || undefined,
      height: f.height || undefined,
      src: f.url || undefined,
      thumb: f.thumbnail || undefined,
      id: f.fileId || f.file_id || f.name,
    }));

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ files: normalized }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'ImageKit list error', details: String(err && err.message || err) }));
  }
};

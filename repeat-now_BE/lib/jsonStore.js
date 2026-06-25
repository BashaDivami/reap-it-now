const fs = require('fs');
const path = require('path');

function storePath(version, resource) {
  return path.join(__dirname, '..', 'data', version, `${resource}.json`);
}

function read(version, resource) {
  const p = storePath(version, resource);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function write(version, resource, data) {
  const p = storePath(version, resource);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

module.exports = { read, write };

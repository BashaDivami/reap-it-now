const { v4: uuid } = require('uuid');
const { read, write } = require('./jsonStore');

/**
 * Returns a standard CRUD controller bound to a version + resource JSON file.
 * Controllers carry no business logic — they only read/write data/<version>/<resource>.json.
 *
 * @param {string} version  e.g. 'v1' | 'v2' | 'v3'
 * @param {string} resource e.g. 'users' | 'products'
 */
function problem(res, status, title, detail) {
  res.status(status).json({ title, status, detail });
}

function makeController(version, resource) {
  return {
    getAll(req, res) {
      const all = read(version, resource);
      const limit = Math.min(parseInt(req.query.limit) || 50, 200);
      const after = req.query.after ? parseInt(req.query.after) : 0;
      const items = all.slice(after, after + limit);
      const next = after + limit < all.length ? String(after + limit) : null;
      const prev = after > 0 ? String(Math.max(0, after - limit)) : null;
      res.json({ items, meta: { limit, next, prev, exactTotal: all.length } });
    },

    getOne(req, res) {
      const items = read(version, resource);
      const item = items.find((i) => String(i.id) === String(req.params.id));
      if (!item) return problem(res, 404, 'Not Found', `${resource} not found`);
      res.json(item);
    },

    create(req, res) {
      const items = read(version, resource);
      const newItem = { id: uuid(), ...req.body, createdAt: new Date().toISOString() };
      items.push(newItem);
      write(version, resource, items);
      res.status(201).json(newItem);
    },

    update(req, res) {
      const items = read(version, resource);
      const idx = items.findIndex((i) => String(i.id) === String(req.params.id));
      if (idx === -1) return problem(res, 404, 'Not Found', `${resource} not found`);
      items[idx] = { ...items[idx], ...req.body, updatedAt: new Date().toISOString() };
      write(version, resource, items);
      res.json(items[idx]);
    },

    remove(req, res) {
      const items = read(version, resource);
      const idx = items.findIndex((i) => String(i.id) === String(req.params.id));
      if (idx === -1) return problem(res, 404, 'Not Found', `${resource} not found`);
      items.splice(idx, 1);
      write(version, resource, items);
      res.status(204).send();
    },
  };
}

module.exports = makeController;

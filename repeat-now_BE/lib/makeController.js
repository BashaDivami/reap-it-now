const { v4: uuid } = require('uuid');
const { read, write } = require('./jsonStore');

/**
 * Returns a standard CRUD controller bound to a version + resource JSON file.
 * Controllers carry no business logic — they only read/write data/<version>/<resource>.json.
 *
 * @param {string} version  e.g. 'v1' | 'v2' | 'v3'
 * @param {string} resource e.g. 'users' | 'products'
 */
function makeController(version, resource) {
  return {
    getAll(req, res) {
      const items = read(version, resource);
      res.json({ data: items, total: items.length });
    },

    getOne(req, res) {
      const items = read(version, resource);
      const item = items.find((i) => String(i.id) === String(req.params.id));
      if (!item) return res.status(404).json({ message: `${resource} not found` });
      res.json({ data: item });
    },

    create(req, res) {
      const items = read(version, resource);
      const newItem = { id: uuid(), ...req.body, createdAt: new Date().toISOString() };
      items.push(newItem);
      write(version, resource, items);
      res.status(201).json({ data: newItem });
    },

    update(req, res) {
      const items = read(version, resource);
      const idx = items.findIndex((i) => String(i.id) === String(req.params.id));
      if (idx === -1) return res.status(404).json({ message: `${resource} not found` });
      items[idx] = { ...items[idx], ...req.body, updatedAt: new Date().toISOString() };
      write(version, resource, items);
      res.json({ data: items[idx] });
    },

    remove(req, res) {
      const items = read(version, resource);
      const idx = items.findIndex((i) => String(i.id) === String(req.params.id));
      if (idx === -1) return res.status(404).json({ message: `${resource} not found` });
      const [removed] = items.splice(idx, 1);
      write(version, resource, items);
      res.json({ data: removed, message: 'Deleted successfully' });
    },
  };
}

module.exports = makeController;

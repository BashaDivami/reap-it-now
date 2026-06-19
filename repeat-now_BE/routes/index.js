const router = require('express').Router();

router.use('/v1', require('./v1'));
router.use('/v2', require('./v2'));
router.use('/v3', require('./v3'));

// Health check
router.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

module.exports = router;

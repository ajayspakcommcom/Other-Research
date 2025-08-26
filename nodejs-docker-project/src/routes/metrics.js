const express = require('express');
const promClient = require('prom-client');

const router = express.Router();

// Metrics endpoint for Prometheus
router.get('/', async (req, res) => {
  try {
    const metrics = await promClient.register.metrics();
    res.set('Content-Type', promClient.register.contentType);
    res.send(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate metrics' });
  }
});

module.exports = router;

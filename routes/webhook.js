const express = require('express');
const router = express.Router();
const { upsertOpportunity } = require('../services/opportunityService');

module.exports = function(io) {
  router.post('/', (req, res) => {

    console.log('Webhook received opportunity:', req.body);
    upsertOpportunity(req.body, (err, result) => {
      if (err) {
        console.error('Webhook opportunity upsert error:', err.message);
        return res.status(500).json({ error: err.message });
      }

      console.log(`Webhook processed opportunity ${result.action} with id ${result.id}`);

      // Notify all connected clients to refresh
      io.emit('opportunitiesUpdated');

      res.json({ status: 'Webhook processed', action: result.action, id: result.id });
    });
  });

  return router;
};

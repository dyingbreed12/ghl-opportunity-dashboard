const express = require('express');
const router = express.Router();
const { upsertOpportunity, removeOpportunity } = require('../services/opportunityService');

module.exports = function(io) {
  router.post('/', (req, res) => {
    upsertOpportunity(req.body, (err, result) => {
      if (err) {
        console.error('Webhook opportunity upsert error:', err.message);
        return res.status(500).json({ error: err.message });
      }

      io.emit('opportunitiesUpdated'); // notify clients

      res.json({ status: 'Webhook processed', action: result.action, id: result.id });
    });
  });

  router.post('/removeopportunity', (req, res) => {

    //console.log(req.body);

    const { id } = req.body;  // or req.params, based on how you want to pass ID
    
    //console.log('Removing opportunity with ID:', id);
    if (!id) {
      return res.status(400).json({ error: 'Missing opportunity id' });
    }

    removeOpportunity(id, (err) => {
      if (err) {
        console.error('Error removing opportunity:', err.message);
        return res.status(500).json({ error: err.message });
      }

      io.emit('opportunitiesUpdated'); // notify clients of removal

      res.json({ status: 'Opportunity removed', id });
    });
  });

  return router;
};

const express = require('express');
const router = express.Router();
const { upsertOpportunity } = require('../services/opportunityService');

module.exports = function(io) {
  router.post('/', (req, res) => {
    upsertOpportunity(req.body, (err, result) => {
      if (err) {
        console.error('Opportunity upsert error:', err.message);
        return res.status(500).json({ error: err.message });
      }

      // Notify all connected clients to refresh
      io.emit('opportunitiesUpdated');

      res.json({
        //message: `${result.action} opportunity with id ${result.id}`,
        reloadDashboard: true
      });
    });
  });

  // You may want to also move GET / here for consistency:
  router.get('/', (req, res) => {
    const db = require('../database/sqlite');
    db.all('SELECT * FROM Opportunities', [], (err, rows) => {
      if (err) {
        console.error('Fetch error:', err.message);
        return res.status(500).json({ error: err.message });
      }

      const data = rows.map(row => ({
        ...row,
        OptionPeriodExpiration: row.OptionPeriodExpiration ? new Date(row.OptionPeriodExpiration) : null,
        ClosingDate: row.ClosingDate ? new Date(row.ClosingDate) : null
      }));

      res.json(data);
    });
  });

  return router;
};

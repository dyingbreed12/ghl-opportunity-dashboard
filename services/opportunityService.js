// services/opportunityService.js
const db = require('../database/sqlite');

function upsertOpportunity(opportunity, callback) {
  if (!opportunity || !opportunity.id || !opportunity.customData) {
    return callback(new Error('Opportunity payload is null or incomplete'));
  }

  const cd = opportunity.customData;

  const selectSql = `
    SELECT * FROM Opportunities 
    WHERE OpportunityId = ? AND PropertyAddress = ? AND PropertyType = ?
  `;

  db.get(selectSql, [opportunity.id, cd.property_address, cd.property_type], (err, row) => {
    if (err) return callback(err);

    if (row) {
      // Update existing
      const updateSql = `
        UPDATE Opportunities SET 
          DealType = ?, AskingPrice = ?, AssignmentFee = ?, ContractedPrice = ?, JVShare = ?,
          OptionPeriodExpiration = ?, ClosingDate = ?, Access = ?, LockboxCode = ?, ShowingTime = ?,
          Quality = ?, MarketingLink = ?, PicturesLink = ?, Wholesaler = ?, Notes = ?
        WHERE Id = ?
      `;

      db.run(updateSql, [
        cd.deal_type || '',
        cd.asking_price || 0,
        cd.assignment_fee || 0,
        cd.contracted_price || 0,
        cd.jv_share || '',
        cd.option_period_expiration ? new Date(cd.option_period_expiration).toISOString() : null,
        cd.closing_date ? new Date(cd.closing_date).toISOString() : null,
        cd.access || '',
        cd.lockbox_code || '',
        cd.showing_time || '',
        cd.quality || '',
        cd.marketing_link || '',
        cd.pictures_link || '',
        cd.wholesaler || '',
        cd.notes || '',
        row.Id
      ], function(updateErr) {
        if (updateErr) return callback(updateErr);
        callback(null, { action: 'updated', id: row.Id });
      });

    } else {
      // Insert new
      const insertSql = `
        INSERT INTO Opportunities (
          OpportunityId, PropertyAddress, PropertyType, DealType, AskingPrice, AssignmentFee,
          ContractedPrice, JVShare, OptionPeriodExpiration, ClosingDate, Access, LockboxCode,
          ShowingTime, Quality, MarketingLink, PicturesLink, Wholesaler, Notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(insertSql, [
        opportunity.id,
        cd.property_address || '',
        cd.property_type || '',
        cd.deal_type || '',
        cd.asking_price || 0,
        cd.assignment_fee || 0,
        cd.contracted_price || 0,
        cd.jv_share || '',
        cd.option_period_expiration ? new Date(cd.option_period_expiration).toISOString() : null,
        cd.closing_date ? new Date(cd.closing_date).toISOString() : null,
        cd.access || '',
        cd.lockbox_code || '',
        cd.showing_time || '',
        cd.quality || '',
        cd.marketing_link || '',
        cd.pictures_link || '',
        cd.wholesaler || '',
        cd.notes || ''
      ], function(insertErr) {
        if (insertErr) return callback(insertErr);
        callback(null, { action: 'inserted', id: this.lastID });
      });
    }
  });
}

module.exports = { upsertOpportunity };
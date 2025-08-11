// services/opportunityService.js
const db = require('../database/sqlite');


function calculateAssignmentFee(compensationType, askingPrice, contractedPrice, jvShare) {
  // Helper function to strip special characters and convert to number
  const sanitizeNumber = (value) => {
    if (value === null || value === undefined) return 0;
    return parseFloat(String(value).replace(/[^0-9.-]/g, "")) || 0;
  };

  // Clean the inputs
  // const cleanAskingPrice = sanitizeNumber(askingPrice);
  // const cleanContractedPrice = sanitizeNumber(contractedPrice);
  // const cleanJVShare = sanitizeNumber(jvShare);

  // Calculate based on compensation type
  if (compensationType === "Fee On Top") {
    return cleanAskingPrice - cleanContractedPrice;
  } else if (compensationType === "JV Split") {
    return (cleanAskingPrice - cleanContractedPrice) * (cleanJVShare / 100);
  } else {
    return null; // or 0 if you prefer
  }
}


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
          Quality = ?, MarketingLink = ?, PicturesLink = ?, Wholesaler = ?, Notes = ?, CompensationType = ?
        WHERE Id = ?
      `;

      var assignmentFee = calculateAssignmentFee(cd.compensation_type, cd.asking_price, cd.contracted_price, cd.jv_share);
      //console.log('Calculated Assignment Fee:', assignmentFee);
      //var assignmentFee = cd.assignment_fee;

      db.run(updateSql, [
        cd.deal_type || '',
        cd.asking_price || 0,
        assignmentFee || 0,
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
        cd.compensation_type || '',
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
          ShowingTime, Quality, MarketingLink, PicturesLink, Wholesaler, Notes, CompensationType
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      var assignmentFee = calculateAssignmentFee(cd.compensation_type, cd.asking_price, cd.contracted_price, cd.jv_share);
      //var assignmentFee = cd.assignment_fee;
      //console.log('Calculated Assignment Fee:', assignmentFee);

      db.run(insertSql, [
        opportunity.id,
        cd.property_address || '',
        cd.property_type || '',
        cd.deal_type || '',
        cd.asking_price || 0,
        assignmentFee || 0,
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
        cd.compensation_type || ''
      ], function(insertErr) {
        if (insertErr) return callback(insertErr);
        callback(null, { action: 'inserted', id: this.lastID });
      });
    }
  });
}

function removeOpportunity(id, callback) {
  // Your DB delete logic here, e.g.:
  db.run('DELETE FROM opportunities WHERE OpportunityId = ?', [id], function(err) {
    if (err) return callback(err);
    callback(null);
  });
}

module.exports = { upsertOpportunity, removeOpportunity };
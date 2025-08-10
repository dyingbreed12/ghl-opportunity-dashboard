// models/opportunity.js

class CustomData {
  constructor(data = {}) {
    this.property_address = data.property_address || '';
    this.property_type = data.property_type || '';
    this.deal_type = data.deal_type || '';
    this.compensation_type = data.compensation_type || '';
    this.asking_price = data.asking_price || 0;
    this.assignment_fee = data.assignment_fee || 0;
    this.contracted_price = data.contracted_price || 0;
    this.jv_share = data.jv_share || '';
    this.option_period_expiration = data.option_period_expiration ? new Date(data.option_period_expiration) : null;
    this.closing_date = data.closing_date ? new Date(data.closing_date) : null;
    this.access = data.access || '';
    this.lockbox_code = data.lockbox_code || '';
    this.showing_time = data.showing_time || '';
    this.quality = data.quality || '';
    this.marketing_link = data.marketing_link || '';
    this.pictures_link = data.pictures_link || '';
    this.wholesaler = data.wholesaler || '';
    this.notes = data.notes || '';
  }
}

class Opportunity {
  constructor(data = {}) {
    this.id = data.id || '';
    this.customData = new CustomData(data.customData);
  }
}

module.exports = { Opportunity, CustomData };

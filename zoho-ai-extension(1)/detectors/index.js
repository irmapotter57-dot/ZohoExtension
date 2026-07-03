// detectors/index.js
// Loops through all registered detectors in order and returns the first
// match. Returns null if no detector matches -- unrecognised pages degrade
// gracefully: the chat panel still works, just without record context.

const { detect: detectBooksInvoice } = require('./books-invoice');
const { detect: detectBooksCustomer } = require('./books-customer');
const { detect: detectCrmLead } = require('./crm-lead');
const { detect: detectCrmContact } = require('./crm-contact');
const { detect: detectCrmDeal } = require('./crm-deal');

const DETECTORS = [
  detectBooksInvoice,
  detectBooksCustomer,
  detectCrmLead,
  detectCrmContact,
  detectCrmDeal
];

function detectPageType(url) {
  for (const detect of DETECTORS) {
    const result = detect(url);
    if (result) return result;
  }
  return null;
}

module.exports = { detectPageType };

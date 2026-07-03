// detectors/crm-lead.js
// Matches: https://crm.zoho.com/crm/org926864613/tab/Leads/1234567890
// Returns: { pageType: 'crm-lead', crmOrgId, recordId }

const PATTERN = /crm\.zoho\.com\/crm\/org(\d+)\/tab\/Leads\/(\d+)/;

function detect(url) {
  const match = url.match(PATTERN);
  if (!match) return null;
  return {
    pageType: 'crm-lead',
    crmOrgId: match[1],
    recordId: match[2]
  };
}

module.exports = { detect };

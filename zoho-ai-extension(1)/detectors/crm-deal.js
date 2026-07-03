// detectors/crm-deal.js
// Matches: https://crm.zoho.com/crm/org926864613/tab/Potentials/1234567890
// Returns: { pageType: 'crm-deal', crmOrgId, recordId }

const PATTERN = /crm\.zoho\.com\/crm\/org(\d+)\/tab\/Potentials\/(\d+)/;

function detect(url) {
  const match = url.match(PATTERN);
  if (!match) return null;
  return {
    pageType: 'crm-deal',
    crmOrgId: match[1],
    recordId: match[2]
  };
}

module.exports = { detect };

// detectors/crm-contact.js
// Matches: https://crm.zoho.com/crm/org926864613/tab/Contacts/1234567890
// Returns: { pageType: 'crm-contact', crmOrgId, recordId }

const PATTERN = /crm\.zoho\.com\/crm\/org(\d+)\/tab\/Contacts\/(\d+)/;

function detect(url) {
  const match = url.match(PATTERN);
  if (!match) return null;
  return {
    pageType: 'crm-contact',
    crmOrgId: match[1],
    recordId: match[2]
  };
}

module.exports = { detect };

// detectors/books-customer.js
// Matches: https://books.zoho.com/app/927102662#/contacts/1234567890
// Returns: { pageType: 'books-customer', booksOrgId, recordId }

const PATTERN = /books\.zoho\.com\/app\/(\d+)#\/contacts\/(\d+)/;

function detect(url) {
  const match = url.match(PATTERN);
  if (!match) return null;
  return {
    pageType: 'books-customer',
    booksOrgId: match[1],
    recordId: match[2]
  };
}

module.exports = { detect };

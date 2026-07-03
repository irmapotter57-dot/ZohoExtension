// detectors/books-invoice.js
// Matches: https://books.zoho.com/app/927102662#/invoices/1234567890
// Returns: { pageType: 'books-invoice', booksOrgId, recordId }

const PATTERN = /books\.zoho\.com\/app\/(\d+)#\/invoices\/(\d+)/;

function detect(url) {
  const match = url.match(PATTERN);
  if (!match) return null;
  return {
    pageType: 'books-invoice',
    booksOrgId: match[1],
    recordId: match[2]
  };
}

module.exports = { detect };

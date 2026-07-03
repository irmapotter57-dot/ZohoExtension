// content.js -- Phase 5: URL detection wired in.
// NOTE: Chrome extensions don't support require() -- detector logic is
// inlined here directly rather than imported. The detector files in
// detectors/ serve as the source of truth and documentation; this file
// mirrors their patterns.

console.log('[Zoho AI] Loaded');

// --- Inline detectors (mirrored from detectors/*.js) ---
const DETECTORS = [
  function detectBooksInvoice(url) {
    const m = url.match(/books\.zoho\.com\/app\/(\d+)#\/invoices\/(\d+)/);
    if (!m) return null;
    return { pageType: 'books-invoice', booksOrgId: m[1], recordId: m[2] };
  },
  function detectBooksCustomer(url) {
    const m = url.match(/books\.zoho\.com\/app\/(\d+)#\/contacts\/(\d+)/);
    if (!m) return null;
    return { pageType: 'books-customer', booksOrgId: m[1], recordId: m[2] };
  },
  function detectCrmLead(url) {
    const m = url.match(/crm\.zoho\.com\/crm\/org(\d+)\/tab\/Leads\/(\d+)/);
    if (!m) return null;
    return { pageType: 'crm-lead', crmOrgId: m[1], recordId: m[2] };
  },
  function detectCrmContact(url) {
    const m = url.match(/crm\.zoho\.com\/crm\/org(\d+)\/tab\/Contacts\/(\d+)/);
    if (!m) return null;
    return { pageType: 'crm-contact', crmOrgId: m[1], recordId: m[2] };
  },
  function detectCrmDeal(url) {
    const m = url.match(/crm\.zoho\.com\/crm\/org(\d+)\/tab\/Potentials\/(\d+)/);
    if (!m) return null;
    return { pageType: 'crm-deal', crmOrgId: m[1], recordId: m[2] };
  }
];

function detectPageType(url) {
  for (const detect of DETECTORS) {
    const result = detect(url);
    if (result) return result;
  }
  return null;
}

// --- Context tracking ---
let currentContext = detectPageType(window.location.href);
console.log('[Zoho AI] Initial context:', currentContext);

function updateContext() {
  const ctx = detectPageType(window.location.href);
  if (JSON.stringify(ctx) !== JSON.stringify(currentContext)) {
    currentContext = ctx;
    console.log('[Zoho AI] Context changed:', currentContext);
  }
}

// Zoho apps are SPAs -- detect URL changes without full page reload
window.addEventListener('hashchange', updateContext);

const originalPushState = history.pushState.bind(history);
history.pushState = function (...args) {
  originalPushState(...args);
  updateContext();
};
window.addEventListener('popstate', updateContext);

// --- Panel ---
(async function main() {
  const cssUrl = chrome.runtime.getURL('panel/panel.css');
  const cssText = await fetch(cssUrl).then((r) => r.text());

  window.ZohoAIPanel.create(cssText, {
    title: 'Zoho AI Agent',
    greeting: "Hi! I'm the Zoho AI Agent. Ask me anything about this record.",
    onSend(text) {
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
          {
            type: 'FETCH_AGENT',
            message: text,
            context: currentContext
          },
          (response) => {
            if (!response) {
              reject(new Error('No response from background script'));
              return;
            }
            if (!response.ok) {
              reject(new Error(response.error || 'Unknown error'));
              return;
            }
            resolve(response.reply);
          }
        );
      });
    }
  });

  console.log('[Zoho AI] Panel injected');
})();

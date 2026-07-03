// background.js -- Phase 5: forwards context (pageType, recordId, orgId)
// along with the message to the Coordinator so it knows which record
// the user is looking at. context is null on unrecognised pages.

const COORDINATOR_URL = 'https://zohoaiagent-928670942.development.catalystserverless.com/server/coordinator/';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type !== 'FETCH_AGENT') return;

  (async () => {
    try {
      const res = await fetch(COORDINATOR_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: request.message,
          context: request.context || null
        })
      });

      const data = await res.json();
      sendResponse({ ok: true, reply: data.reply });
    } catch (err) {
      sendResponse({ ok: false, error: err.message });
    }
  })();

  return true;
});

// panel.js -- Phase 2: Shadow DOM panel, exposed as window.ZohoAIPanel.
// Builds the bubble + panel UI imperatively (no fetch of panel.html --
// CSS is passed in by content.js, which already fetched it via
// chrome.runtime.getURL). onSend is injected by the caller so this file
// has zero networking logic of its own; Phase 3 swaps the onSend
// implementation in content.js without touching this file.

window.ZohoAIPanel = (function () {
  function create(cssText, options) {
    const { title, subtitle, greeting, onSend } = options;

    const host = document.createElement('div');
    host.id = 'zoho-ai-host';
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = cssText;
    shadow.appendChild(style);

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div id="zoho-ai-bubble">AI</div>
      <div id="zoho-ai-panel" class="hidden">
        <div id="zoho-ai-header">
          <span>${title}</span>
          <button id="zoho-ai-close">&times;</button>
        </div>
        <div id="zoho-ai-messages"></div>
        <div id="zoho-ai-inputbar">
          <input id="zoho-ai-input" type="text" placeholder="Ask something..." />
          <button id="zoho-ai-send">Send</button>
        </div>
      </div>
    `;
    shadow.appendChild(wrapper);

    const bubble = shadow.getElementById('zoho-ai-bubble');
    const panel = shadow.getElementById('zoho-ai-panel');
    const closeBtn = shadow.getElementById('zoho-ai-close');
    const messages = shadow.getElementById('zoho-ai-messages');
    const input = shadow.getElementById('zoho-ai-input');
    const sendBtn = shadow.getElementById('zoho-ai-send');

    function addMessage(text, who) {
      const msg = document.createElement('div');
      msg.className = `zoho-ai-msg ${who}`;
      msg.textContent = text;
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
    }

    if (greeting) addMessage(greeting, 'agent');

    bubble.addEventListener('click', () => {
      panel.classList.toggle('hidden');
    });

    closeBtn.addEventListener('click', () => {
      panel.classList.add('hidden');
    });

    async function handleSend() {
      const text = input.value.trim();
      if (!text) return;

      addMessage(text, 'user');
      input.value = '';
      sendBtn.disabled = true;

      try {
        const reply = await onSend(text);
        addMessage(reply, 'agent');
      } catch (err) {
        addMessage('Error: could not get a reply.', 'agent');
      } finally {
        sendBtn.disabled = false;
      }
    }

    sendBtn.addEventListener('click', handleSend);

    // Prevent keyboard events from propagating to the Zoho page.
    ['keydown', 'keypress', 'keyup'].forEach((eventName) => {
      input.addEventListener(eventName, (event) => {
        event.stopPropagation();

        if (eventName === 'keydown' && event.key === 'Enter') {
          event.preventDefault();
          handleSend();
        }
      });
    });

    return { shadow, host };
  }

  return { create };
})();
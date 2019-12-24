const toggleIn = (tabId, value) => {
  chrome.storage.local.get("enabledIn", ({ enabledIn }) => {
    enabledIn = enabledIn || {};
    enabledIn[tabId] = value;
    chrome.storage.local.set({ enabledIn });
  });
};

const isEnabledIn = (tabId, cb) => {
  chrome.storage.local.get("enabledIn", ({ enabledIn }) => {
    cb(Boolean(enabledIn && enabledIn[tabId]));
  });
};

const disable = tabId => {
  toggleIn(tabId, false);

  chrome.tabs.sendMessage(tabId, { message: "baselinka/disable" });

  chrome.browserAction.setTitle({ title: "Show baselines", tabId });
  chrome.browserAction.setIcon({
    path: {
      "16": "icons/icon-disabled16.png",
      "24": "icons/icon-disabled24.png",
      "32": "icons/icon-disabled32.png",
      "64": "icons/icon-disabled64.png",
      "128": "icons/icon-disabled128.png"
    }
  });
};

const enable = tabId => {
  toggleIn(tabId, true);

  chrome.tabs.sendMessage(tabId, { message: "baselinka/enable" });
  chrome.browserAction.setTitle({ title: "Hide baselines", tabId });
  chrome.browserAction.setIcon({
    path: {
      "16": "icons/icon16.png",
      "24": "icons/icon24.png",
      "32": "icons/icon32.png",
      "64": "icons/icon64.png",
      "128": "icons/icon128.png"
    }
  });
};

chrome.browserAction.onClicked.addListener(function(tab) {
  isEnabledIn(tab.id, isEnabled => {
    if (isEnabled) disable(tab.id);
    else enable(tab.id);
  });
});

chrome.tabs.onCreated.addListener(tab => {
  disable(tab.id);
});

chrome.tabs.onUpdated.addListener(tabId => {
  isEnabledIn(tabId, isEnabled => {
    if (isEnabled) enable(tabId);
    else disable(tabId);
  });
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  isEnabledIn(tabId, isEnabled => {
    if (isEnabled) enable(tabId);
    else disable(tabId);
  });
});

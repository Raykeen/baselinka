const toggleIn = (tabId, value) => {
    chrome.storage.local.get("enabledIn", ({ enabledIn }) => {
        enabledIn = enabledIn || {};
        enabledIn[tabId] = value;
        chrome.storage.local.set({enabledIn});
    });
};

const isEnabledIn = (tabId, cb) => {
    chrome.storage.local.get("enabledIn", ({ enabledIn }) => {
        cb(Boolean(enabledIn && enabledIn[tabId]));
    });
};

const disable = (tabId) => {
    toggleIn(tabId, false);

    chrome.tabs.sendMessage(tabId, {message: "baselinka/disable"});

    chrome.browserAction.setTitle({ title:"Show baselines", tabId });
    chrome.browserAction.setBadgeText({ text:"OFF", tabId });
    chrome.browserAction.setBadgeBackgroundColor({ color:"#121212", tabId });
};

const enable = (tabId) => {
    toggleIn(tabId, true);

    chrome.tabs.sendMessage(tabId, {message: "baselinka/enable"});
    chrome.browserAction.setTitle({ title: "Hide baselines", tabId });
    chrome.browserAction.setBadgeText({ text:"ON", tabId });
    chrome.browserAction.setBadgeBackgroundColor({ color:"#A6E22E", tabId });
};

chrome.browserAction.onClicked.addListener(function(tab) {
    isEnabledIn(tab.id, (isEnabled) => {
        if (isEnabled)
            disable(tab.id);
        else
            enable(tab.id);
    })
});

chrome.tabs.onCreated.addListener((tab) => {
    disable(tab.id);
});

chrome.tabs.onUpdated.addListener((tabId) => {
    isEnabledIn(tabId, (isEnabled) => {
        if (isEnabled)
            enable(tabId);
        else
            disable(tabId);
    })
});
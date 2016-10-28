var tabStorage = [];

chrome.browserAction.onClicked.addListener(function(tab) {

	var code = 'copySimulation()';

	if (tab.url.match(/https:\/\/app.observepoint.com\/.*/)) {

		code = 'pasteSimulation()';
	}

	chrome.tabs.executeScript(
		{
			code: code
  	}
	);
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

    if(request.cmd == "save") {
      tabStorage[sender.tab.id] = request.data;
    }

    if(request.cmd == "load") {
      sendResponse(tabStorage[sender.tab.id]);
    }
});

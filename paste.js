var clone;

function getRequestBody(clone) {
	var pathArray = window.location.pathname.split('/')
	var newFolder = pathArray[3]
	var domainId = pathArray[5]

	var notificationEmails = function () {

		var emails = clone[0].NotificationEmails

		if (emails == "test@example.com") {
			var emailArr = []
		} else {
			var emailArr = emails.split('↵')
		}

		return emailArr
	}

	var location = function () {
		var nl = "mountain"
		var ol = clone[0].Location
		// if oldLocation is 1: "mountain"
		// if oldLocation is 2: "western"
		// if oldLocation is 4: "eastern"
		// if oldLocation is 5: "emea"
		// if oldLocation is 8: "apac"
		if (ol == 1) {
			nl = "mountain"
		}
		if (ol == 2) {
			nl = "western"
		}
		if (ol == 4) {
			nl = "eastern"
		}
		if (ol == 5) {
			nl = "emea"
		}
		if (ol == 8) {
			nl = "apac"
		}

		return nl

	}
// TODO:
	var getUserAgents = function () {
		var data = null;
		var key = JSON.parse(window.localStorage["op.authorization"]).token
		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;

		xhr.addEventListener("readystatechange", function () {
		  if (this.readyState === 4) {
				response = JSON.parse(this.responseText)

		  }
		});

		xhr.open("GET", "https://app.observepoint.com/api/user-agents", false);
		xhr.setRequestHeader("authorization", "Bearer " + key)
		xhr.setRequestHeader("cache-control", "no-cache");

		xhr.send(data);
		return response.data
	}

	var userAgent = function (oldUserAgentText) {
		
		return "Firefox(45.0.1) - Linux"
	}

	var browserWidth = function() {

		var oldWidth = clone[0].BrowserOverride
		var defaultWidth = 1366
		if (oldWidth == "") {
			return defaultWidth
		} else {
			return parseInt(oldWidth)
		}

	}

	var actions = function () {

		var convertActionType = function (action) {
			if (action == "1") {
				return "navto"
			}
			if (action == "4") {
				return "click"
			}
			if (action == "5") {
				return "input"
			}
			if (action == "6") {
				return "select"
			}
			if (action == "7") {
				return "check"
			}
			if (action == "8") {
				return "uncheck"
			}
			if (action == "9") {
				return "execute"
			}
			if (action == "10") {
				return "watch"
			}

		}

		var firstAction = {
			"ActionType": "1",
			"Identifier":"",
			"PreventNav":false,
			"Value":""
		}
		var oldActions = [firstAction].concat(clone[0].ActionSet)
		var naSet = new Array
		var na = jQuery.extend({}, naSet)
		for (i=0; i < oldActions.length; i++) {
				if (oldActions[i].ActionType == 9) {
					na = {
						"action": convertActionType(oldActions[i].ActionType),
						"sequence": i,
						"rules": [],
						"url": clone[0].Address,
						"preventNavigation": oldActions[i].PreventNav,
						"js": oldActions[i].Value
						}
			} else if (oldActions[i].ActionType == 1 && i > 0) {
					na = {
						"action": convertActionType(oldActions[i].ActionType),
						"sequence": i,
						"rules": [],
						"url": oldActions[i].Value,
						"preventNavigation": oldActions[i].PreventNav
						}
			} else {
					na = {
						"action": convertActionType(oldActions[i].ActionType),
						"sequence": i,
						"rules": [],
						"url": clone[0].Address,
						"identifier": oldActions[i].Identifier,
						"preventNavigation": oldActions[i].PreventNav,
						"value": oldActions[i].Value
						}
			}
			naSet.push(na)
		}
		return naSet
	}
	// for a migration from legacy "rules" will be empty
	// because step rules don't exist in legacy
	// global rules need to be migrated from legacy "Monitor" values
	var createGlobalRules = function () {
		// create rules from the Monitor feature (assuming their copied)
		// POST /rule-sets which requires
		// tagId, and variables, an array of {variable, matchType, value}

		// return array of ids of the rules
	}

	var setGlobalRules = function (simId, ruleIds) {
		// POST /web-sims/simId/rules
		// the payload is rules which is an array of ruleIds
	}

	var name = function () {
		var oldName = clone[0].Name
		var silentMode = clone[0].SilentMode
		var userAgent = clone[0].UserAgentText
		if (silentMode) {
			return oldName + " - " + userAgent + " (Silent Mode)"
		} else {
			return oldName + " - " + userAgent
		}
	}
// replaced notificationEmails() with empty array for safety :)
	var requestBody = JSON.stringify({
		"name":name(),
		"domainId": parseInt(domainId),
		"emails":[],
		"options":
			{
				"frequency":clone[0].FrequencyText.toLowerCase(),
				"location":location(),
				"userAgent":userAgent(clone[0].UserAgentText),
				"browserWidth":browserWidth(),
				"alerts":clone[0].SendAlerts,
				"reminders":clone[0].SendReminders,
				"loadFlash":clone[0].LoadVideos
			},
		"actions":actions()
	})

	return requestBody
}

// TODO pull this from localStorage
function getAccountId () {

	return parseInt(document.getElementById("loggedInAsAnotherBar").innerText.split('d:')[2])
}

function postJourney(requestBody, key) {
	var response;
	var data = requestBody;
	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
	  if (this.readyState === 4) {
			response = JSON.parse(this.responseText)
	  }
	});

	xhr.open("POST", "https://app.observepoint.com/api/web-sims", false);
	xhr.setRequestHeader("authorization", "Bearer " + key);
	xhr.setRequestHeader("content-type", "application/json");
	xhr.setRequestHeader("cache-control", "no-cache");

	xhr.send(data);

	if (!response) {
		console.log("Error: No response from API")
	} else {
		return response.data.id
	}
}

function pasteSimulation() {

	chrome.storage.sync.get("observePointClone", function (obj) {

    clone = JSON.parse(obj["observePointClone"]);
		customerKey = JSON.parse(window.localStorage["op.authorization"]).token
		rb = getRequestBody(clone)
		newJourneyId = postJourney(rb, customerKey)
		location.reload()
		console.log("requestBody: " + JSON.parse(rb))
		console.log("Success! Web Journey ID: " + newJourneyId)
	});
}

function copySimulation() {
	if (window.location.href.match(/https:\/\/my.observepoint.com\/simulation\/form\/.*?p=.*/) !== null) {
		chrome.storage.sync.set(
			{
				"observePointClone": doCopy()
			}
		);
		chrome.storage.sync.get("observePointClone", function(obj){
			console.log(JSON.parse(obj["observePointClone"])[0])

		}
		)

	}
}

function doCopy() {
	var act = new Array,
	    actList = new Array,
	    mySettings = new Array,
			action = jQuery(".action_row");

	for (i = 0; i < action.length; i++) {
	    var clonedobj = jQuery.extend({}, act);
	    clonedobj.ActionType = jQuery(action[i]).find("select").find(":selected").val();
	    clonedobj.PreventNav = jQuery(action[i]).find('input[type="checkbox"]')[0].checked;
	    clonedobj.Value = jQuery(action[i]).find("input[placeholder='value']").val();
	    clonedobj.Identifier = jQuery(action[i]).find("input[placeholder='identifier']").val();
	    actList.push(clonedobj);
	}

	var clonedobj = jQuery.extend({}, act);

	clonedobj.Name = jQuery("#flow_description").val();
	clonedobj.Address = jQuery("#flow_starting_url").val();
	clonedobj.Frequency = jQuery("#uniform-flow_monitor_frequency_in_minutes select").val();
	clonedobj.FrequencyText = jQuery("#uniform-flow_monitor_frequency_in_minutes")[0].innerText
	clonedobj.Location = jQuery("#flow_location_id").val();
	clonedobj.UserAgent = jQuery("#flow_user_agent_id").val();
	clonedobj.UserAgentText = jQuery("#flow_user_agent_id [selected='selected']").text();
	clonedobj.NotificationEmails = jQuery("#flow_notification_addresses").val();
	clonedobj.ActionSet = actList;
	clonedobj.SendAlerts = jQuery("#flow_send_alerts").prop("checked");
	clonedobj.SilentMode = jQuery("#flow_silent_mode").prop("checked");
	clonedobj.SendReminders = jQuery("#flow_send_reminders").prop("checked");
	clonedobj.LoadVideos = jQuery("#flow_load_videos").prop("checked");
	clonedobj.BrowserOverride = jQuery("#flow_browser_width").val();
	mySettings.push(clonedobj);

	return JSON.stringify(mySettings);
}

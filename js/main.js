var IS_LOCAL = true;

var SERVER_URL = null;
var SERVER_LOCAL = "server/action.php"

var GOOGLE_API_KEY = "AIzaSyBm2aZhHwkDvM-1K1N2v-TvwUGS2UnZlq0";
// for localhost
var CLIENT_ID = "969439793066.apps.googleusercontent.com";

var SECTION_SHOW = "show";
var SECTION_EDIT = "edit";
var SECTION_MANAGE = "manage";

var FILTER_TEAM = "Team";
var FILTER_DEV = "Dev";
var FILTER_DAY = "Day";
var FILTER_WEEK = "Week";
var FILTER_MONTH = "Month";
var FILTER_OVERVIEW = "Overview";

var _teamArr = [];
var _devNameArr = [];
var _devCalIdArr = [];

var _sitePHP = null;

var accessToken = null;
var calendarId = "dante@smashingboxes.com";

var _curSection = SECTION_SHOW;

var _isDevListReady = false;
var _isTeamListReady = false;

$(document).ready(function() {
	// hide schedule containers
	$('#section_select_container').addClass('hidden');
	$('#show_menu_container').addClass('hidden');
	$('#edit_menu_container').addClass('hidden');
	$('#manage_menu_container').addClass('hidden');
	$('#section_container').addClass('hidden');

	manage_setupDialogs();

	if(IS_LOCAL) {
		_sitePHP = SERVER_LOCAL;
	} else {
		_sitePHP = SERVER_URL;
	}
});

function auth() {
	var config = {
		'client_id': CLIENT_ID,
		'scope': 'https://www.googleapis.com/auth/calendar'

	};

	gapi.client.setApiKey(GOOGLE_API_KEY);

	gapi.auth.authorize(config, function() {
		console.log(gapi.auth.getToken());
		accessToken = gapi.auth.getToken().access_token;
		handleAuthSuccess();
	});
}

function handleAuthSuccess() {
	getTeamData();

	gapi.client.load('calendar','v3', function(){
		console.log('calendar api loaded');
		//populateFilters();
		getCalendarData();
	});

	// hide authorization container
	$('#auth_container').addClass('hidden');

	hideSection(SECTION_MANAGE);
	hideSection(SECTION_EDIT);

	// reveal schedule containers
	$('#section_select_container').removeClass('hidden');
	$('#show_menu_container').removeClass('hidden');
	$('#section_container').removeClass('hidden');

	// activate section select
	$('select[name="section"]').change(function() {
		onChange_sectionSelect($(this).val());
	});
	// activate manage select
	$('select[name="manage"]').change(function() {
		onChange_manageSelect($(this).val());
	});
}

function handleAuthFailure() {

}

function getCalendarData() {
	console.log('# getCalendarData');

	// get calendar list
	var request = gapi.client.calendar.calendarList.list({});
	request.execute(function(resp){
		var len = resp.items.length;

		// populate calendar id and dev arrays
		for(var i=0; i<len; i++) {
			_devCalIdArr.push(resp.items[i].id);
			_devNameArr.push((resp.items[i].summary.split('@'))[0]);
		}

		_isDevListReady = true;
		checkPreloadComplete();
	});
}

function getTeamData() {// populate which_sub
	console.log('# getTeamData');

	var params = {action: 'request_teams'};
	ajaxPost(_sitePHP, params, onSuccess_getTeams, onError_getTeams);
}

function checkPreloadComplete() {
	console.log('# checkPreloadComplete : '+_isDevListReady+' : '+_isTeamListReady);
	if(_isDevListReady && _isTeamListReady) {
		populateFilters();
		showInit();
		manageInit();
		editInit();
	}
}

function populateFilters() {
	console.log('# populateFilters');

	// populate which
	$('select[name="which"]').append('<option value="'+FILTER_TEAM+'">Team</option>');
	$('select[name="which"]').append('<option value="'+FILTER_DEV+'">Dev</option>');

	// populate which_sub
	$('select[name="which_sub"]').append('<option value="All">All</option>');
	var len = _teamArr.length;
	for(var i=1; i<len; i++) {
		$('select[name="which_sub"]').append('<option value="'+_teamArr[i].teamName+'">'+_teamArr[i].teamName+'</option>');
	}

	// populate when
	$('select[name="when"]').append('<option value="'+FILTER_OVERVIEW+'">Overview</option>');
	$('select[name="when"]').append('<option value="'+FILTER_DAY+'">Day</option>');
	$('select[name="when"]').append('<option value="'+FILTER_WEEK+'">Week</option>');
	$('select[name="when"]').append('<option value="'+FILTER_MONTH+'">Month</option>');

	updateFilters(FILTER_TEAM, _teamArr[0].teamName, FILTER_OVERVIEW);
}

function onSuccess_getTeams(data, status) {
	console.log('# onSuccess_getTeams');
	console.log(data);

	var team = new Object();
	team.teamName = 'All';
	_teamArr.push(team);

	var len = data.teamArr.length;
	for(var i=0; i<len; i++) {
		team = new Object();
		team.teamName = data.teamArr[i];
		_teamArr.push(team);
	}

	for(i=0; i<=len; i++) {
		console.log(_teamArr[i].teamName);
	}

	_isTeamListReady = true;
	checkPreloadComplete();
}

function onError_getTeams(xhr) {
	console.log('# onError_getTeams');
	alert('Database could not be reached.');
}

function updateFilters(whichStr, whichSubStr, whenStr) {
	console.log('# updateFilters : '+whichStr+' : '+whichSubStr+' : '+whenStr);


}

function onClick_filter() {
	updateFilters($('select[name="which"]').val(), $('select[name="which_sub"]').val(), $('select[name="when"]').val());
};

/**
* Retrieves, filters, sorts, and displays calendar data based on parameters.
* @ calendarIdStr - calendarId to request
* @ viewStr - time frame to display - day, week, month
*/
function populateSchedule(calendarIdStr, viewStr) {
	console.log('# populateSchedule : '+calendarIdStr+' : '+viewStr);
}

function onChange_sectionSelect(valStr) {
	console.log('# onChange_sectionSelect : '+valStr);

	if(valStr != _curSection) {

		hideSection(_curSection);
		showSection(valStr);

		_curSection = valStr;
	}
}

function hideSection(sectionToHideStr) {
	console.log('# hideSection : '+sectionToHideStr);
	
	$('#'+sectionToHideStr+'_menu_container').addClass('hidden');
	$('#'+sectionToHideStr+'_content').addClass('hidden');
}

function showSection(sectionToShowStr) {
	console.log('# showSection : '+sectionToShowStr);
	
	$('#'+sectionToShowStr+'_menu_container').removeClass('hidden');
	$('#'+sectionToShowStr+'_content').removeClass('hidden');


}

function ajaxPost(url, params, onSuccess, onError) {

	//$('#loader').show();

	$.ajax({
		type: "POST",
		url: url,
		data: params,
		dataType: "json",
		success: onSuccess,
		error: onError
	});
}

// OO section show begin OO //

function showInit() {

}

// XX section show begin XX //

// OO section manage begin //

var MANAGE_PANEL_DEVS = "manage_devs";
var MANAGE_PANEL_TEAMS = "manage_teams";

var _curManagePanel = MANAGE_PANEL_DEVS;
var _curSelectedTeamName = null;

function manageInit() {
	console.log('# manageInit');

	$('#manage_teams_container').addClass('hidden');
	$('#manage_teams_details').addClass('hidden');

	manage_populateDevList();
	manage_populateTeamList();
	//TEST
	//manage_subscribeToDevCalendar();

	// enable Add buttons
	$('button[name="add_dev_calendar"]').click(function() {
		onCick_manageButton('addDev');
	});
	$('button[name="add_team"]').click(function() {
		onClick_manageButton('addTeam');
	});
	$('button[name="remove_team"]').click(function() {
		onClick_manageButton('removeTeam');
	});
}

function onChange_manageSelect(valStr) {
	if(valStr != _curManagePanel) {
		hideManageSection(_curManagePanel);
		showManageSection(valStr);

		_curManagePanel = valStr;
	}
}

function onClick_manageButton(whichStr) {
	switch(whichStr) {
		case 'addDev':
		alert('Currently, dev calendars must be added through the standard Google Calendar interface.');
		break;

		case 'addTeam':
		$('#add_team_dialog').dialog('open');
		break;

		case 'removeDev':

		break;

		case 'removeTeam':
		manage_postRemoveTeam(_curSelectedTeamName);
		break;
	}
}

function showManageSection(sectionToShowStr) {
	$('#'+sectionToShowStr+'_container').removeClass('hidden');
}

function hideManageSection(sectionToHideStr) {
	$('#'+sectionToHideStr+'_container').addClass('hidden');
}

function manage_populateDevList() {
	console.log('# manage_populateDevList');

	$('#devs_ul').html('');

	var len = _devNameArr.length;
	for(var i=0; i<len; i++) {
		$('#devs_ul').append('<li>'+_devNameArr[i]+'</li>');
	}
}

function manage_populateTeamList() {
	console.log('# manage_populateTeamList');

	$('#teams_ul').html('');

	var len = _teamArr.length;
	for(var i=0; i<len; i++) {
		$('#teams_ul').append(manage_createTeamListItem(_teamArr[i].teamName));
	}

	$('#teams_ul li').click(function() {
		manage_openTeamDetails($(this).data('name'));
	});
}

function manage_createTeamListItem(teamNameStr) {
	var teamListItem = '<li data-name="'+teamNameStr+'">'+teamNameStr+'</li>';

	return teamListItem;
}

function manage_subscribeToDevCalendar() {
	console.log('# manage_subscribeToDevCalendar');
	
}

function manage_setupDialogs() {
	$('#add_team_dialog').dialog({
			autoOpen: false,
			height: 300,
			width: 350,
			modal: true,
			buttons: {
			    "Create team": function() {
			        	//TODO: validation
			        	// get team name
			        	manage_postAddTeam($('#add_team_input').val());
			        	// post team name to db
			            $(this).dialog("close");
			    },
			    Cancel: function() {
			        $(this).dialog("close");
			    }
			},
			close: function() {
			}
		});
}

function manage_postAddTeam(teamNameStr) {
	console.log('# manage_postAddTeam');

	var params = {action: 'add_team',
					team_name: teamNameStr};
	ajaxPost(_sitePHP, params, onSuccess_addTeam, onError_addTeam);
}

function onSuccess_addTeam(data, status) {
	console.log('# onSuccess_addTeam');
	console.log(data);

	if(data.isSuccess == 'yes') {
		var team = new Object();
		team.teamName = data.teamName;
		//TODO: add array of team members
		_teamArr.push(team);
		$('#add_team_input').val('');
		manage_populateTeamList();
	} else {
		alert('A team by that name already exists.');
	}
}

function onError_addTeam(xhr) {

}

function manage_openTeamDetails(teamNameStr) {
	console.log('# manage_openTeamDetails');

	_curSelectedTeamName = teamNameStr;

	$('#manage_teams_details').removeClass('hidden');

	// clear details
	$('#members_ul').html();
	$('#add_members').html();

	// populate details
}

function manage_postRemoveTeam(teamNameStr)  {
	var params = {action: 'remove_team',
					team_name: teamNameStr};
	ajaxPost(_sitePHP, params, onSuccess_removeTeam, onError_removeTeam);
}

function onSuccess_removeTeam(data, status) {
	if(data.isSuccess == 'yes') {
		var len = _teamArr.length;
		var index = -1;
		for(var i=0; i<len; i++) {
			if(_teamArr[i].teamName == data.teamName) {
				index = i;
			}
		}
		if(index > -1) {
			_teamArr.splice(index, 1);
			manage_populateTeamList();
		}
	} else {
		alert('Unable to delete team.');
	}
}

function onError_removeTeam(xhr) {
	console.log('# onError_removeTeam');
}

// XX section manage end //

// OO section edit begin OO //

function editInit() {

}

// XX section edit end XX //

function addEventTEST() {
	var name = 'okkkkk';
	var resource = {
		'summary': name,
		'location': 'Somewhere',
		'start': {
			'dateTime': '2012-12-25T10:00:00.000-07:00'
		},
		'end': {
			'dateTime': '2012-12-25T12:00:00.000-07:00'
		}
	};
	var request = gapi.client.calendar.events.insert({
		'calendarId': calendarId,
		'resource': resource
	});
	request.execute(function(resp) {
		console.log(resp);
	});
}

function getCalendarEventsTEST() {
	var request = gapi.client.calendar.events.list({
		'calendarId': calendarId
	});

	request.execute(function(resp) {
		for(var i=0; i<resp.items.length; i++) {
			console.log(resp.items[i].summary);
		}
	});
}
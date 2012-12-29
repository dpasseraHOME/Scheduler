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

var _teamNameArr = ['All'];
var _devNameArr = [];
var _devCalIdArr = [];

var _sitePHP = null;

var accessToken = null;
var calendarId = "dante@smashingboxes.com";

var _curSection = SECTION_SHOW;

$(document).ready(function() {
	// hide schedule containers
	$('#section_select_container').addClass('hidden');
	$('#show_menu_container').addClass('hidden');
	$('#edit_menu_container').addClass('hidden');
	$('#manage_menu_container').addClass('hidden');
	$('#section_container').addClass('hidden');

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
	// get calendar list
	var request = gapi.client.calendar.calendarList.list({});
	request.execute(function(resp){
		var len = resp.items.length;

		// populate calendar id and dev arrays
		for(var i=0; i<len; i++) {
			_devCalIdArr.push(resp.items[i].id);
			_devNameArr.push((resp.items[i].summary.split('@'))[0]);
		}

		populateFilters();
		showInit();
		manageInit();
		editInit();
	});
}

function populateFilters() {
	console.log('# populateFilters');

	// populate which
	$('select[name="which"]').append('<option value="'+FILTER_TEAM+'">Team</option>');
	$('select[name="which"]').append('<option value="'+FILTER_DEV+'">Dev</option>');

	// populate which_sub
	var params = {action: 'request_teams'};
	ajaxPost(_sitePHP, params, onSuccess_getTeams, onError_getTeams);

	// populate when
	$('select[name="when"]').append('<option value="'+FILTER_OVERVIEW+'">Overview</option>');
	$('select[name="when"]').append('<option value="'+FILTER_DAY+'">Day</option>');
	$('select[name="when"]').append('<option value="'+FILTER_WEEK+'">Week</option>');
	$('select[name="when"]').append('<option value="'+FILTER_MONTH+'">Month</option>');

	updateFilters(FILTER_TEAM, _teamNameArr[0], FILTER_OVERVIEW);	

	// initialize sections
	//showInit();
	//manageInit();
	//editInit();
}

function onSuccess_getTeams(data, status) {
	console.log('# onSuccess_getTeams');
	console.log(data);

	// populate which_sub
	$('select[name="which_sub"]').append('<option value="All">All</option>');

	var len = data.teamArr.length;
	for(var i=0; i<len; i++) {
		_teamNameArr.push(data.teamArr[i]);
		$('select[name="which_sub"]').append('<option value="'+_teamNameArr[i+1]+'">'+_teamNameArr[i+1]+'</option>');
	}
}

function onError_getTeams(xhr) {

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

function manageInit() {
	console.log('# manageInit');

	$('#manage_teams_container').addClass('hidden');

	manage_populateDevList();
	//TEST
	manage_subscribeToDevCalendar();
}

function onChange_manageSelect(valStr) {
	if(valStr != _curManagePanel) {
		hideManageSection(_curManagePanel);
		showManageSection(valStr);

		_curManagePanel = valStr;
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

	var len = _devNameArr.length;
	for(var i=0; i<len; i++) {
		$('#devs_ul').append('<li>'+_devNameArr[i]+'</li>');
	}
}

function manage_subscribeToDevCalendar() {
	console.log('# manage_subscribeToDevCalendar');
	
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
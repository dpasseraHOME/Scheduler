var IS_LOCAL = true;

var SERVER_URL = null;
var SERVER_LOCAL = "server/action.php"

var GOOGLE_API_KEY = "AIzaSyBm2aZhHwkDvM-1K1N2v-TvwUGS2UnZlq0";
// for localhost
var CLIENT_ID = "969439793066.apps.googleusercontent.com";

var FILTER_TEAM = "Team";
var FILTER_DEV = "Dev";
var FILTER_DAY = "Day";
var FILTER_WEEK = "Week";
var FILTER_MONTH = "Month";
var FILTER_OVERVIEW = "Overview";

var _filterTeamArr = ['All'];
var _filterDevArr = [];
var _filterCalendarIdArr = [];

var _sitePHP = null;

var accessToken = null;
var calendarId = "dante@smashingboxes.com";

$(document).ready(function() {
	// hide schedule containers
	$('#filter_container').addClass('hidden');
	$('#schedule_container').addClass('hidden');

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
		populateFilters();
	});

	// hide authorization container
	$('#auth_container').addClass('hidden');

	// reveal schedule containers
	$('#filter_container').removeClass('hidden');
	$('#schedule_container').removeClass('hidden');
}

function handleAuthFailure() {

}

function populateFilters() {
	console.log('# populateFilters');

	// populate which
	$('#which_select').append('<option value="'+FILTER_TEAM+'">Team</option>');
	$('#which_select').append('<option value="'+FILTER_DEV+'">Dev</option>');

	// get calendar list
	var request = gapi.client.calendar.calendarList.list({});
	request.execute(function(resp){
		var len = resp.items.length;

		// populate calendar id and dev arrays
		for(var i=0; i<len; i++) {
			_filterCalendarIdArr.push(resp.items[i].id);
			_filterDevArr.push((resp.items[i].summary.split('@'))[0]);
		}
	});

	// populate whichSub
	var params = {action: 'request_teams'};
	ajaxPost(_sitePHP, params, onSuccess_getTeams, onError_getTeams);
	/*
	var len = _filterTeamArr.length;
	for(var i=0; i<len; i++) {
		$('#whichSub_select').append('<option value="'+_filterTeamArr[i]+'">'+_filterTeamArr[i]+'</option>');
	}
	*/

	// populate when
	$('#when_select').append('<option value="'+FILTER_OVERVIEW+'">Overview</option>');
	$('#when_select').append('<option value="'+FILTER_DAY+'">Day</option>');
	$('#when_select').append('<option value="'+FILTER_WEEK+'">Week</option>');
	$('#when_select').append('<option value="'+FILTER_MONTH+'">Month</option>');

	updateFilters(FILTER_TEAM, _filterTeamArr[0], FILTER_OVERVIEW);
}

function onSuccess_getTeams(data, status) {
	console.log('# onSuccess_getTeams');
	console.log(data);

	// populate which
	$('#whichSub_select').append('<option value="All">All</option>');

	var len = data.teamArr.length;
	for(var i=0; i<len; i++) {
		_filterTeamArr.push(data.teamArr[i]);
		$('#whichSub_select').append('<option value="'+_filterTeamArr[i+1]+'">'+_filterTeamArr[i+1]+'</option>');
	}
}

function onError_getTeams(xhr) {

}

function updateFilters(whichStr, whichSubStr, whenStr) {
	console.log('# updateFilters : '+whichStr+' : '+whichSubStr+' : '+whenStr);


}

function onClick_filter() {
	updateFilters($('#which_select').val(), $('#whichSub_select').val(), $('#when_select').val());
};

/**
* Retrieves, filters, sorts, and displays calendar data based on parameters.
* @ calendarIdStr - calendarId to request
* @ viewStr - time frame to display - day, week, month
*/
function populateSchedule(calendarIdStr, viewStr) {
	console.log('# populateSchedule : '+calendarIdStr+' : '+viewStr);
}

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
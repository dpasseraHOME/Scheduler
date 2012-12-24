var GOOGLE_API_KEY = "AIzaSyBm2aZhHwkDvM-1K1N2v-TvwUGS2UnZlq0";
// for localhost
var CLIENT_ID = "969439793066.apps.googleusercontent.com";

var accessToken = null;

$(document).ready(function() {
	//gapi.client.setApiKey(GOOGLE_API_KEY);
	//auth();
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
	$('#auth_container').addClass('hidden');
	$('#get_events_container').removeClass('hidden');
	$('#add_event_container').removeClass('hidden');
}

function handleAuthFailure() {

}

function addEvent() {
	var name = $('#input_event_name').val();
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
		'calendarId': 'primary',
		'resource': resource
	});
	request.execute(function(resp) {
		console.log(resp);
	});
}

function getCalendarEvents() {
	gapi.client.load('calendar', 'v3', function() {
		var request = gapi.client.calendar.events.list({
			'calendarId': 'primary'
		})

		request.execute(function(resp) {
			for(var i=0; i<resp.items.length; i++) {
				console.log(resp.items[i].summary);
			}
		});
	});
}
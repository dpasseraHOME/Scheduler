var GOOGLE_API_KEY = "AIzaSyBm2aZhHwkDvM-1K1N2v-TvwUGS2UnZlq0";
// for localhost
var CLIENT_ID = "969439793066.apps.googleusercontent.com";

$(document).ready(function() {
	//gapi.client.setApiKey(GOOGLE_API_KEY);
	//auth();
});

function auth() {
	var config = {
		'client_id': CLIENT_ID,
		'scope': 'https://www.googleapis.com/auth/calendar'

	};
	gapi.auth.authorize(config, function() {
		console.log('login complete');
		console.log(gapi.auth.getToken());
	});
}
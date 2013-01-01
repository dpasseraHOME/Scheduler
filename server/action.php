<?php

session_start();

$salt = "!tiny**baby17MOUNTAIN";

$host = "localhost";
$user = "dpassera";
$pass = "password";
$database = "sbscheduler";

/*
$host = "dpassera.startlogicmysql.com";
$user = "insteadof00user";
$pass = "flashothy1717";
$database = "sbscheduler";
*/

$action = $_POST['action'];

switch($action) {

	case 'request_teams':
		request_teams($host, $user, $pass, $database);
		break;	

	case 'add_team':
		add_team($host, $user, $pass, $database, $_POST['team_name']);
		break;

	case 'remove_team':
		remove_team($host, $user, $pass, $database, $_POST['team_name']);
		break;

}

function request_teams($host, $user, $pass, $database) {
	$linkID = mysql_connect($host, $user, $pass) or die("Could not connect to host.");
	mysql_select_db($database, $linkID) or die("Could not find database.");	

	$query = "SELECT * FROM _teams";
	$result = mysql_query($query, $linkID) or die("SELECT _teams failed.");

	$teamArr = array();
	while($row = mysql_fetch_assoc($result)) {
		$teamArr[] = $row['name'];
	}

	$return['isSuccess'] = 'yes';
	$return['teamArr'] = $teamArr;

	echo json_encode($return);
}

function add_team($host, $user, $pass, $database, $teamName) {
	$linkID = mysql_connect($host, $user, $pass) or die("Could not connect to host.");
	mysql_select_db($database, $linkID) or die("Could not find database.");

	// check if team name exists in db
	$query = "SELECT * FROM _teams WHERE name='".$teamName."'";
	$result = mysql_query($query, $linkID) or die("SELECT _teams failed.");

	$numResults = mysql_num_rows($result);

	if($numResults > 0) {
		// team name exists
		$return['isSucces'] = 'no';
		$return['msg'] = 'duplicate team name';
	} else {
		// add team name
		$query = "INSERT INTO _teams (name, calendar_ids) VALUES ('".$teamName."', 'none')";
		$result = mysql_query($query, $linkID) or die("INSERT INTO _teams failed.");

		$return['isSuccess'] = 'yes';
		$return['msg'] = 'team added to db';
		$return['teamName'] = $teamName;
	}

	echo json_encode($return);
}

function remove_team($host, $user, $pass, $database, $teamName) {
	$linkID = mysql_connect($host, $user, $pass) or die("Could not connect to host.");
	mysql_select_db($database, $linkID) or die("Could not find database.");

	$query = "DELETE FROM _teams WHERE name='".$teamName."'";
	$result = mysql_query($query, $linkID) or die("DELETE _teams failed.");

	$return['isSuccess'] = 'yes';
	$return['msg'] = 'team removed from db';
	$return['teamName'] = $teamName;

	echo json_encode($return);
}

?>
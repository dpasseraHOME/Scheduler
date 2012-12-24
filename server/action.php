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

	$return['isSucces'] = 'yes';
	$return['teamArr'] = $teamArr;

	echo json_encode($return);
}

?>
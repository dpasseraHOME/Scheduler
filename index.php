<?php

?>

<!DOCTYPE html>
<html lang="en">

<head>
	
	<meta charset="utf-8" />
	<title>Smashing Boxes Scheduler</title>

	<link rel="stylesheet" href="css/style.css" />
	<link rel="stylesheet" href="css/normalize.min.css" />

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js" type="text/javascript"></script>
	<script src="https://apis.google.com/js/client.js" type="text/javascript"></script>
	<script src="js/main.js" type="text/javascript"></script>
	<!--[if IE]> <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]-->

</head>

<body>

	<?php
		include('header.php');
	?>

	<?php
		include('filter_bar.php');
	?>

	<?php
		include('auth_container.php');
	?>

	<?php
		include('schedule_container.php');
	?>

	<!--div id="get_events_container" class="hidden">
		<button onclick="getCalendarEvents();">Get events</button>
	</div>

	<div id="add_event_container" class="hidden">
		Event name:<input id="input_event_name" type="text">
		<button onclick="addEvent();">Add event</button>
	</div-->

</body>
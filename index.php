<?php

?>

<!DOCTYPE html>
<html lang="en">

<head>
	
	<meta charset="utf-8" />
	<title>Smashing Boxes Scheduler</title>

	<link rel="stylesheet" href="css/style.css" />
	<link rel="stylesheet" href="css/normalize.min.css" />
	<link rel="stylesheet" href="http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css" />

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js" type="text/javascript"></script>
    <script src="http://code.jquery.com/ui/1.9.2/jquery-ui.js"></script>
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

	<div id="section_container">
		<?php
			include('section_show.php');
			include('section_edit.php');
			include('section_manage.php');
		?>
	</div>

</body>
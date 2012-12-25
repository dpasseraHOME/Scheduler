<?php

?>

<div id="section_select_container">
	<select name="section">
		<option value="show">Show calendars</option>
		<option value="edit">Edit calendar</option>
		<option value="team">Manage teams</option>
	</select>
</div>

<div id="show_menu_container" class="menu-container">
	<select name="which">
		<!-- add which options -->
	</select>
	<select name="which_sub">
		<!-- add which_sub options -->
	</select>
	<select name="when">
		<!-- add when options -->
	</select>
	<button onclick="onClick_filter()">Okay</button>
</div>

<div id="edit_menu_container" class="menu-container">
	<select name="manage">
		<option value="devs">Devs</option>
		<option value="teams">Teams</option>
	</select>
</div>

<div id="team_menu_container" class="menu-container">

</div>
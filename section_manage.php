<?php

?>

<div id="manage_content">
	
	<div id="manage_devs_container">
		<div id="manage_devs_list" class="list-panel">
			<ul id="devs_ul">
				<!-- add devs here -->
			</ul>
			<div id="add_dev_calendar_container" class="add-item-container">
				<button name="add_dev_calendar">
					+ Add dev
				</button>
			</div>
		</div>

		<div id="manage_devs_details" class="details-panel">

		</div>
	</div>

	<div id="manage_teams_container">
		<div id="manage_teams_list" class="list-panel">
			<ul id="teams_ul">
				<!-- add teams here -->
			</ul>
			<div id="add_team_container" class="add-item-container">
				<button name="add_team">
					+ Add team
				</button>
			</div>
		</div>
		<div id="manage_teams_details" class="details-panel">
			<div id="details_team_name">
			</div>
			<div id="team_add_members">
				<ul id="members_ul">
					<!-- add team members -->
				</ul>
				<select name="add_members">
					<!-- add manage_devs options -->
				</select>
				<button name="add_member">
					Add member
				</button>
				<div id="remove_team_container" class="remove-item-container">
				<button name="remove_team">
					+ Remove team
				</button>
			</div>
			</div>
		</div>
	</div>

	<div id="add_team_dialog" title="Create new user">
		<p class="validateTips">All form fields are required.</p>

		<form>
			<fieldset>
				<label for="name">Team name</label>
				<input type="text" name="add_team" id="add_team_input" class="text ui-widget-content ui-corner-all" />
			</fieldset>
		</form>
	</div>


</div>
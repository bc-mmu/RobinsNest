<?php
function sanitiseString($var)
{
	if (get_magic_quotes_gpc())
	{
		$var = stripslashes($var);
	}
	$var = htmlentities($var);
	$var = strip_tags($var);
	return $var;
}

function sanitiseMySQL($var)
{
	$var = mysql_real_escape_string($var);
	$var = sanitiseString($var);
	return $var;
}
?>
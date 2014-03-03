<?php

if (isset($_GET['format']))
{
    $format = $_GET['format'];
    if (!preg_match('/json|xml/', $format))
    {
        if (!preg_match('/jsonp/', $format))
        {
            echo "Please choose a format: json, jsonp or xml";
            exit;
        }
        else
        {
            if (isset($_GET['callback']))
            {
                $callback = $_GET['callback'];
            }
            else
            {
                echo "No callback supplied for jsonp";
                exit;
            }
        }
    }
}
else
{
    echo "Please choose a format: json, jsonp or xml";
    exit;
}

$returnData = [];

// Get data from database.
include_once("dbinfo.php");
$dbserver = mysql_connect(localhost,$username,$password) or die('Unable to connect to the database: ' . mysql_error());
mysql_select_db($database) or die("Unable to select database");

$query = "";
if (isset($_GET['id']))
{
	$query = "SELECT * FROM rn_merchandise WHERE id = " . $_GET['id'];
}
else
{
	$query = "SELECT * FROM rn_merchandise ORDER BY id";
}

$result = mysql_query($query) or die ("Error in query: $query. " . mysql_error());

// Convert query results to JSON format.
$rows = array();
while($r = mysql_fetch_assoc($result))
{
	$rows[] = $r;
}
$returnData = $rows;
mysql_close($dbserver);

/* if (isset($_GET['id']))
{
	$id = $_GET['id'];
	$i = 0;
	$found = false;
	foreach ($returnData as $key => $value)
	{
		if ($value['id'] == $id)
		{
			//echo "$key = $value\n";
			$found = true;
			$returnData = $returnData[$i];
			break;
		}
		$i++;
	}
	
	if (!$found)
	{
		$returnData = null;
	}
} */

if ($format == "xml")
{
    // xml:
    $xml = new DOMDocument();
    $addressInfoElement = $xml->createElement("addressInformation");
    foreach ($returnData as $key => $value)
    {
        $xmlNode = $xml->createElement($key, $value);
        $addressInfoElement->appendChild($xmlNode);
    }
    $xml->appendChild($addressInfoElement);
    $output = $xml->saveXML();
    $header = "Content-Type:text/xml";
}
else
{
    // json or jsonp:
    $output = json_encode($returnData, JSON_NUMERIC_CHECK);
    $header = "Content-Type:application/json";
}

if ($format == "jsonp")
{
    // jsonp:
    $output = $callback . '(' . $output . ')';
    $header = "Content-Type:application/javascript";
}

header($header);
echo $output;

?>
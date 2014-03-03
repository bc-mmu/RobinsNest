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

$returnData = [
    [
        "title" => "Baseball Cap",
        "description" => "A stylish black baseball cap.",
        "price" => 9.99,
		"id" => 0
    ],
    [
        "title" => "Can Insulator",
        "description" => "A stylish white can insulator to keep your can chilled.",
        "price" => 3.99,
		"id" => 1
    ],
    [
        "title" => "Card Holder",
        "description" => "Store all your credit cards in this stylish white card holder.",
        "price" => 1.99,
		"id" => 2
    ],
	[
        "title" => "Car Flag",
        "description" => "A white flag that can be attached to a car.",
        "price" => 1.99,
		"id" => 3
    ],
	[
        "title" => "Cocktail Shaker",
        "description" => "A metallic cocktail shaker.",
        "price" => 9.99,
		"id" => 4
    ],
	[
        "title" => "Flask",
        "description" => "A metallic hip flask.",
        "price" => 3.99,
		"id" => 5
    ],
	[
        "title" => "Gym Bag",
        "description" => "A white gym bag.",
        "price" => 9.99,
		"id" => 6
    ],
	[
        "title" => "iPad Case",
        "description" => "A blue protective case for the iPad tablet.",
        "price" => 6.99,
		"id" => 7
    ],
	[
        "title" => "Journal",
        "description" => "A white bound journal for note taking.",
        "price" => 1.99,
		"id" => 8
    ],
	[
        "title" => "Key Chain",
        "description" => "A white plastic key chain.",
        "price" => 1.49,
		"id" => 9
    ],
	[
        "title" => "Key Hanger",
        "description" => "A white key holder with metal hooks to hang your keys from.",
        "price" => 2.49,
		"id" => 10
    ],
	[
        "title" => "Mouse Pad",
        "description" => "A white mousepad to provide a smooth surface for your mouse.",
        "price" => 2.99,
		"id" => 11
    ],
	[
        "title" => "Travel Mug",
        "description" => "A white travel mug made from insulated plastic to keep your drink warm.",
        "price" => 2.99,
		"id" => 12
    ],
	[
        "title" => "Trucker Hat",
        "description" => "A white and black trucker hat.",
        "price" => 2.99,
		"id" => 13
    ],
	[
        "title" => "T-Shirt",
        "description" => "A stylish white t-shirt.",
        "price" => 3.99,
		"id" => 14
    ],
	[
        "title" => "Wine Chiller",
        "description" => "A metallic wine chiller to keep your wine chilled.",
        "price" => 7.99,
		"id" => 15
    ]
];

if (isset($_GET['id']))
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
}

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
    $output = json_encode($returnData);
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
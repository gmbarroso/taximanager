<?php
header('Access-Control-Allow-Origin: *'); 
/*
if($_GET["q"] && $_GET["q"] == "autocomplete"){

	$url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyBt2Qh55dqMxFRIVV3ylCwyWuEW09P-y2c&input=" .urlencode($_GET["input"]);
}
elseif($_GET["q"] && $_GET["q"] == "details"){

	$url = "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyBt2Qh55dqMxFRIVV3ylCwyWuEW09P-y2c&placeid=" .urlencode($_GET["placeid"]);
}else{
	die("parametros invalidos");
}

	$ch = curl_init();

	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	curl_setopt($ch, CURLOPT_URL, $url);

	$result = curl_exec($ch);
	curl_close($ch);

	echo $result;*/

/*$url = "https://www.kayak.com/flights/RIO-SAO/2017-09-29/2017-10-03/Economy/1adults";

$ch = curl_init();

	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	curl_setopt($ch, CURLOPT_URL, $url);

	$result = curl_exec($ch);
	curl_close($ch);

	echo $result;*/

//$url["api"] = "http://estimate.taximanager.com.br/v1/estimates";
$url["api"] = "http://myfirstelasticbeanstalkapplication.g2xtaf7nbz.us-east-1.elasticbeanstalk.com/v1/estimates";
$auth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTAwMzM4MjU0fQ.B2Nch63Zu0IzJDepVTDXqq8ydbIVDiUmU6vV_7eQocw';
$auth = '65edc9b5-d134-4c8b-9be5-ee2c722f4a54';

$_POST['start'] = "avenida paulis";
$_POST['end'] = "rua da consola";


var_dump($_POST);
$url['start'] = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=".urlencode($_POST['start'])."&key=AIzaSyBt2Qh55dqMxFRIVV3ylCwyWuEW09P-y2c";
$url['end'] = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=".urlencode($_POST['end'])."&key=AIzaSyBt2Qh55dqMxFRIVV3ylCwyWuEW09P-y2c";


$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $url["start"]);
	$result = curl_exec($ch);
	curl_close($ch);

echo $result;

$start['place_id'] = json_decode($result)->results[0]->place_id;
$start['lat'] = json_decode($result)->results[0]->geometry->location->lat;
$start['lng'] = json_decode($result)->results[0]->geometry->location->lng;
$start['adress'] = json_decode($result)->results[0]->name;
var_dump($start);



$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $url["end"]);
	$result = curl_exec($ch);
	curl_close($ch);

$end['place_id'] = json_decode($result)->results[0]->place_id;
$end['lat'] = json_decode($result)->results[0]->geometry->location->lat;
$end['lng'] = json_decode($result)->results[0]->geometry->location->lng;
$end['adress'] = json_decode($result)->results[0]->name;
var_dump($end);


$url["distance"] = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=".$start["lat"].",".$start["lng"]."&destinations=".$end["lat"].",".$end["lng"]."&key=AIzaSyDaMueYa5V3V-KwlbAfqd5EfTh52fpybeE";

$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $url_api);
	$result = curl_exec($ch);
	curl_close($ch);

$result = json_decode($result);
$result;
$duration = $result->rows[0]->elements[0]->duration->value/60;
$distance = $result->rows[0]->elements[0]->distance->value/1000;


$data->start = $start;
$data->end = $end;
$data->duration = $duration;
$data->distance = $distance;

$json = json_encode($data);

echo "_____________________________<br><br>";
echo $json;
echo "_____________________________<br><br>";


$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_URL, $url["api"]);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "Content-Type: application/json",
    "Authorization: $auth"
    ));

	curl_setopt($ch, CURLOPT_POSTFIELDS, $json);

	$result = curl_exec($ch);
	curl_close($ch);


echo "---------------------------opcoes:";
var_dump($result);
?>

<?php

include_once'header.php';

if ($loggedin){ 

echo <<<_END

<script src="halmaArchive - original.js"></script>
<script src="jquery-1.10.2.min.js"></script> 
<script src="threejs/build/three.min.js"></script>
<script src="OrbitControls.js"></script>

<iframe src='boardgame.html' height=550 width=520 scrolling="no">

</iframe>

_END;

}else{
	echo ' please sign up and/or log in to join in.';
}
?>
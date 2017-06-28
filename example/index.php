<?php
	if($_POST){
		$a = $_POST;
		$_POST = '';
		$_POST['data'] = $a;
		exit(json_encode($_POST));
	}
?>
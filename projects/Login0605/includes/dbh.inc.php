<?php

$servername = "localhost";
$dBUsername = "root";
$dBPassword = "";
$dBname = "loginsystem_v1";

$conn = mysqli_connect($servername, $dBUsername, $dBPassword, $dBname);

if (!$conn) {
    echo('Database not created yet');
    die("Connection failed: ".mysqli_connect_error());
}
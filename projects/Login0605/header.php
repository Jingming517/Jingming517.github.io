<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name=viewport content="width=device-width, initial-scale=1">
		<title></title> 
		<link rel="stylesheet" type="text/css" href="style.css">
	</head>
	<body>
		<header>
			<nav class="">
				<div class="">
					<ul class="">
						<li class=""><a href="index.php">Home</a></li>
						<li class=""><a href="#">LeapEngine</a></li>
						<li class=""><a href="#">About</a></li>
						<li class=""><a href="#">Contact</a></li>
					</ul>
				</div>
			</nav>

			<div>
				<form action="includes/login.inc.php" method="post">
					<label>User Name</label>
					<input type="text" name="mailuid" placeholder="Username/Email...">
					<label>Password</label>
					<input type="password" name="pwd" placeholder="Password...">
					<button type="submit" name="login-submit">Login</button>					
				</form>
				<label id="account">Don't have an account?</label>
				<a class="su" href="signup.php">Signup here!</a>
				<form action="includes/logout.inc.php" method="post">
					<button type="submit" name="logout-submit">Logout</button>
				</form>
				</div>

			
		</header>























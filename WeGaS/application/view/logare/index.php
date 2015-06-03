	
	<section>

		<h2>TrioGate Studios: Logare</h2>

		<form action="<?php echo URL; ?>logare/doLogin" method="POST">

			<p>Email: <input type="text" maxlength="30" required autofocus name="email" /> </p>

			<p>Parolă: <input type="password" maxlength="30" required name="password" /> <p>
			
			<p><a href="#">V-ați uitat parola?</a></p>
		
			<p>
				<input type="submit" name="login" value="LOGIN" title="Apasati pentru a expedia datele spre server"/>
				<input type="button" name="register" value="Înregistrare" onclick="parent.location='<?php echo URL; ?>inregistrare'" title="Mergeti pe pagina de inregistrare"/>
			</p>

		</form>
	</section>
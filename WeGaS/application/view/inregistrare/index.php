

<section>
		
		<form action="<?php echo URL; ?>inregistrare/userRegister" method="POST">
		
			<p>Username: <input type="text" id="usn" pattern="[a-zA-Z0-9]{2,64}" maxlength="64" required autofocus name="username" /></p>

			<p>Email: <input type="email" id="email" maxlength="64" required name="email"  /></p>

			<p>Parola(>6 caractere): <input type="password" id="passwd" pattern=".{6,}" required name="password" /></p>

			<p>Confirmați parola: <input type="password" id="conpasswd" pattern=".{6,}" required name="conpassword" /></p>

			<p>
				<input type="submit" name="register" value="Înregistrare" onclick= />
				<input type="button" name="cancel" value="Anulați" onclick="parent.location='<?php echo URL; ?>logare'" />
			</p>
				
		</form>
</section>
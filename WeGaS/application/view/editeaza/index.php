
<section>
	<h2>TrioGate Studios: Editare Profil</h2>
	
	<form action="<?php echo URL; ?>editeaza/userEdit" method="POST">

		<h4>Editați datele profilului:</h4>

		<p>Username: <input type="text" id="usn" pattern="[a-zA-Z0-9]{2,64}" maxlength="64" required autofocus name="username" /></p>

		<p>Email: <input type="email" id="email" maxlength="64" required name="email"  /></p>

		<p>Parola: <input type="password" id="passwd" pattern=".{6,}" required name="password" /></p>

		<p>
			<input type="submit" name="edit" value="Confirmați Schimbările"/>
			<input type="button" name="cancel" value="Anulați" onclick="parent.location='<?php echo URL; ?>home'" />
		</p>
	</form>

	<form action="<?php echo URL; ?>editeaza/passwordEdit" method="POST">

		<h4>Editați parola:</h4>

		<p>Parola veche: <input type="password" id="oldpasswd" pattern=".{6,}" required name="oldpassword" /></p>

		<p>Parola noua: <input type="password" id="newpasswd" pattern=".{6,}" required name="newpassword" /></p>

		<p>
			<input type="submit" name="edit2" value="Confirmați Schimbările"/>
			<input type="button" name="cancel2" value="Anulați" onclick="parent.location='<?php echo URL; ?>home'" />
		</p>

	</form>
</section>
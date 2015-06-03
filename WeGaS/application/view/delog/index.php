<?php
    session_destroy();
    echo "Sunteti delogat. Veti fi redirectat in cateva secunde pe pagina Home.";
	header('refresh:5; url= ' . URL . 'home/index');
?>
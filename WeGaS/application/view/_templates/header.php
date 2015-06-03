<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="utf-8">
    <title>Strategic Warfare</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- JS -->
    <!-- please note: The JavaScript files are loaded in the footer to speed up page construction -->
    <!-- See more here: http://stackoverflow.com/q/2105327/1114320 -->

    <!-- CSS -->
    <link href="<?php echo URL; ?>css/style.css" rel="stylesheet" type="text/css" />
</head>
<body>
    <!-- logo -->

    <header>
        <h1>Strategic Warfare</h1>
        <h3>Nimiceste-ti adversarii!</h3>
    </header>

    <?php
        if(isset($_SESSION['username']))
        {
            require APP . 'view/_templates/user_header.php';
        }
    ?>

    <!-- navigation -->
    <nav>
        <a href="<?php echo URL; ?>home">Home</a><br>
        <a href="<?php echo URL; ?>logare">Logare</a>
        <a href="<?php echo URL; ?>faq">FAQ</a><br>
        <a href="<?php echo URL; ?>wiki">Wiki</a><br>
        <a href="<?php echo URL; ?>ghid">Ghid de utilizare</a><br>
        <a href="<?php echo URL; ?>contact">Contact</a><br><br>
    </nav>

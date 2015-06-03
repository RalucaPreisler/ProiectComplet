<?php

class Cauta extends Controller
{

    public function index()
    {
        // load views
        require APP . 'view/_templates/header.php';
        require APP . 'view/cauta/index.php';
        
        require APP . 'view/_templates/footer.php';
    }

}
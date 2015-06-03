<?php

class Wiki extends Controller
{

    public function index()
    {
        // load views
        require APP . 'view/_templates/header.php';
        require APP . 'view/wiki/index.php';
        require APP . 'view/_templates/footer.php';
    }

}
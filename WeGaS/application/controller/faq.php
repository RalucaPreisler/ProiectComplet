<?php

class FAQ extends Controller
{
    
    public function index()
    {
        // load views
        require APP . 'view/_templates/header.php';
        require APP . 'view/faq/index.php';
        require APP . 'view/_templates/footer.php';
    }

}
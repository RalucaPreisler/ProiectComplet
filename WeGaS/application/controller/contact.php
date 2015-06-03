<?php

class Contact extends Controller
{
    /**
     * PAGE: index
     * This method handles what happens when you move to http://yourproject/contact/index 
     */
    public function index()
    {
        // load views
        require APP . 'view/_templates/header.php';
        require APP . 'view/contact/index.php';
        require APP . 'view/_templates/footer.php';
    }
}

<?php

class Logare extends Controller
{
    
    public $errors = array();
    public $messages = array();

    public function index()
    {
        // load views
        require APP . 'view/_templates/header.php';
        require APP . 'view/logare/index.php';
        require APP . 'view/_templates/footer.php';
    }


    /*private function salt($pw) {
        $salt = "This comment should suffice as salt.";
        return sha1($salt.$pw);
    }*/

 public function doLogin()
    {
       // session_start();

        if (isset($_GET["logout"])) {
            $this->doLogout();
        }

        elseif (isset($_POST["login"])) {
            $this->dologinWithPostData();
        }
    }


    private function dologinWithPostData()
    {
        if (empty($_POST['email'])) {
            $this->errors[] = "Email field was empty.";
        } elseif (empty($_POST['password'])) {
            $this->errors[] = "Password field was empty.";
        } elseif (!empty($_POST['email']) && !empty($_POST['password'])) 
        {
            // stergem bitii null si tag-urile HTML/PHP
            $user_email = strip_tags($_POST['email'], ENT_QUOTES);

            //cautam userul, ii obtinem datele

            $result_row= $this->model->getUser2($user_email);
            
            //daca userul exista
            //if ($result_of_login_check->num_rows == 1) {
            if ($result_row) 
            {

                // folosim functia password_verify() pentru a verifica daca parola introdusa se potriveste 
                // cu hash-ul parolei userului respectiv

                if (password_verify($_POST['password'], $result_row->password)) 
                {
                    $_SESSION['userID'] = $result_row->userID;
                    $_SESSION['username'] = $result_row->username;
                    $_SESSION['email'] = $result_row->email;
                    $_SESSION['user_login_status'] = 1;

                    echo "<br>Logare reusita! Veti fi redirectat in cateva secunde pe pagina Home.";
                    header('refresh:5; url= ' . URL . 'home/index');  

                } else 
                {
                        $this->errors[] = "Parola gresita. Incercati din nou.";
                }
            
            } else 
            {
                $this->errors[] = "Utilizatorul nu exista.";
            }
           
        }

         if (count($this->errors)>0)
            {
                foreach ($this->errors as $value) {
                echo "<p>".$value."</p>";
            }

            echo "<br>Logare esuata, incercati din nou! <br><br>Veti fi redirectat pe pagina de logare in cateva secunde.";
            header('refresh:5; url= ' . URL . 'logare/index');   
                
            }
    }


    public function doLogout()
    {
        $_SESSION = array();
        session_destroy();
        $this->messages[] = "Ati fost delogat.";
    }


    public function isUserLoggedIn()
    {
        if (isset($_SESSION['user_login_status']) AND $_SESSION['user_login_status'] == 1) {
            return true;
        }
        return false;
    }
}

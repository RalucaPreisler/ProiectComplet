<?php


class Inregistrare extends Controller
{

    public $errors = array();
    public $messages = array();


    public function index()
    {
        // load views
        require APP . 'view/_templates/header.php';
        require APP . 'view/inregistrare/index.php';
        require APP . 'view/_templates/footer.php';
    }

  /*  private function randomSalt($len = 8) 
    {
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()-=_+';
        $l = strlen($chars) - 1;
        $str = '';
        for($i = 0; $i &lt; $len; ++$i)
        {
            $str .= $chars[rand(0, $l];
        }
    return $str;
    }*/

    public function registerSuccess()
    {
        require APP . 'view/_templates/header.php';
        echo "<br><br><div align=center>Inregistrare efectuata cu succes! Logati-va mai jos.</div>";
        require APP . 'view/logare/index.php';
        require APP . 'view/_templates/footer.php';
       
    }

    public function registerFail(){
        require APP . 'view/_templates/header.php';
        echo "<br><br><div align=center>Inregistrarea nu a reusit!</div>";
        require APP . 'view/inregistrare/index.php';
        require APP . 'view/_templates/footer.php';
    }

    public function userRegister()
    {
         if (empty($_POST['username'])) {
            $this->errors[] = "Nu ati introdus username-ul.";
        } elseif (empty($_POST['password']) || empty($_POST['conpassword'])) {
            $this->errors[] = "Nu ati introdus parola.";
        } elseif ($_POST['password'] !== $_POST['conpassword']) {
            $this->errors[] = "Cele doua parole nu se potrivesc.";
        } elseif (strlen($_POST['password']) < 6) {
            $this->errors[] = "Parola trebuie sa fie mai lunga de 6 caractere.";
        } elseif (strlen($_POST['username']) > 64 || strlen($_POST['username']) < 2) {
            $this->errors[] = "Username-ul trebuie sa aiba intre 2 si 64 de caractere.";
        } elseif (!preg_match('/^[a-z\d]{2,64}$/i', $_POST['username'])) {
            $this->errors[] = "Username invalid! Sunt permise doar numere si litere, intre 2 si 64 caractere.";
        } elseif (empty($_POST['email'])) {
            $this->errors[] = "Nu ati introdus adresa de email.";
        } elseif (strlen($_POST['email']) > 64) {
            $this->errors[] = "Email-ul nu poate depasi 64 caractere.";
        } elseif (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
            $this->errors[] = "Emailul dvs nu este valid.";
        } elseif (!empty($_POST['username'])
            && strlen($_POST['username']) <= 64
            && strlen($_POST['username']) >= 2
            && preg_match('/^[a-z\d]{2,64}$/i', $_POST['username'])
            && !empty($_POST['email'])
            && strlen($_POST['email']) <= 64
            && filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)
            && !empty($_POST['password'])
            && !empty($_POST['conpassword'])
            && ($_POST['password'] === $_POST['conpassword'])
        ) 
        {

            // stergem bitii null si tag-urile HTML/PHP
                $user_name = strip_tags($_POST['username'], ENT_QUOTES);
                $user_email = strip_tags($_POST['email'], ENT_QUOTES);

            // aplicam o functie hash asupra parolei
                $user_password = $_POST['password'];
                $user_password_hash = password_hash($user_password, PASSWORD_DEFAULT);

            // vericam daca mai exista un user cu acelasi username sau email

                $query_check_user_name = $this->model->getUser($user_name, $user_email);

                if ($query_check_user_name) {
                    $this->errors[] = "Username-ul sau email-ul exista deja in baza de date.";
                } else 
                {
                    $query_new_user_insert = $this->model->addUser($user_email, $user_name, $user_password_hash);

                    $this->messages[] = "Cont creat cu succes. Va puteti loga. ";
                    header('location: ' . URL . 'inregistrare/registerSuccess');

                   /* // daca a fost adaugat cu succes
                    if ($query_new_user_insert) {
                        $this->messages[] = "Your account has been created successfully. You can now log in.";
                        header('location: ' . URL . 'inregistrare/registerSuccess');
                    } else {
                        $this->errors[] = "Sorry, your registration failed. Please go back and try again.";
                        header('location: ' . URL . 'inregistrare/registerFail');

                    }*/
                }
           
        } else 
        {
            $this->errors[] = "A aparut o eroare neidentificata.";
            $this->messages[] = "Inregistrare nereusita!";          
        }

        if (count($this->errors)>0)
            {
                foreach ($this->errors as $value) 
                {
                    echo "<p>".$value."</p>";
                }

                echo "<br>Veti fi redirectat in cateva secunde";
                header('refresh:5; url= ' . URL . 'inregistrare/registerFail');   
                
            }

    }

}

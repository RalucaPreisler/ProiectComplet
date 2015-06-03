<?php

class Editeaza extends Controller
{
    public $errors = array();
    public $messages = array();

    public function index()
    {
        require APP . 'view/_templates/header.php';
        require APP . 'view/editeaza/index.php';
        require APP . 'view/_templates/footer.php';
    }

	public function editSuccess()
    {
        require APP . 'view/_templates/header.php';
        echo "<br><br><div align=center>Modificarile au fost efectuate cu succes! Logati-va mai jos.</div>";
        require APP . 'view/logare/index.php';
		require APP . 'view/_templates/footer.php';
       
    }

    public function editFail(){
        require APP . 'view/_templates/header.php';
        echo "<br><br><div align=center>Modificarea nu a reusit!</div>";
        require APP . 'view/editeaza/index.php';
        require APP . 'view/_templates/footer.php';
    }

	public function userEdit()
    {

		if (empty($_POST['username'])) {
			$this->errors[] = "Empty Username";
		} elseif (empty($_POST['password']) ) {
			$this->errors[] = "Empty Password";
        } elseif (strlen($_POST['username']) > 64 || strlen($_POST['username']) < 2) {
            $this->errors[] = "Username cannot be shorter than 2 or longer than 64 characters";
        } elseif (!preg_match('/^[a-z\d]{2,64}$/i', $_POST['username'])) {
            $this->errors[] = "Username does not fit the name scheme: only a-Z and numbers are allowed, 2 to 64 characters";
        } elseif (empty($_POST['email'])) {
            $this->errors[] = "Email cannot be empty";
        } elseif (strlen($_POST['email']) > 64) {
            $this->errors[] = "Email cannot be longer than 64 characters";
        } elseif (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
            $this->errors[] = "Your email address is not in a valid email format";
        } elseif (!empty($_POST['username'])
            && strlen($_POST['username']) <= 64
            && strlen($_POST['username']) >= 2
            && preg_match('/^[a-z\d]{2,64}$/i', $_POST['username'])
            && !empty($_POST['email'])
            && strlen($_POST['email']) <= 64
            && filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)

        ) {
        		echo "Pana aici e bine".
	//			$user_id = strip_tags($_POST['userID'], ENT_QUOTES);
				$user_name = strip_tags($_POST['username'], ENT_QUOTES);
				$user_email = strip_tags($_POST['email'], ENT_QUOTES);
				$user_password = $_POST['password'];
				//$user_password_hash = password_hash($user_password, PASSWORD_DEFAULT);

				$query_get_user = $this->model->getUser2($_SESSION['email']);

				 if (password_verify($user_password, $query_get_user->password)) 
	                {
	                	echo "Parolele se potrivesc.";
	                	$query_check_user_name = $this->model->checkUser($user_name, $_SESSION['userID']);
						if ($query_check_user_name) 
							{
	                 	   		$this->errors[] = "Username-ul exista deja in baza de date.";
	                 	   		//echo "Username-ul exista deja in baza de date.";
	               			} else
	               				{
		               				$query_check_user_email = $this->model->checkEmail($user_email, $_SESSION['userID']);
									if ($query_check_user_email )
										{
		                 	   				$this->errors[] = "Email-ul exista deja in baza de date.";
		                 	   				echo "Username-ul exista deja in baza de date.";
		               					} 
		               				else
		               					{
		               						$query_edit_user = $this->model->editProfile($_SESSION['userID'], $user_email, $user_name);
		               						
		                    						$this->messages[] = "Modificare efectuata cu succes.";
		                    						//echo "Modificare efectuata cu succes.";
		                    						header('location: ' . URL . 'editeaza/editSuccess');	 
		               						
			               				}
		              			}
						}
					
					else
						{
			                $this->errors[] = "Parola gresita. Incercati din nou.";
			                echo "Parola gresita. Incercati din nou.";
			            }


					if (count($this->errors)>0)
					{
						foreach ($this->errors as $value)
						{
							echo "<p>".$value."</p>";
						}

						echo "<br>Veti fi redirectat in cateva secunde";
						header('refresh:5; url= ' . URL . 'editeaza/editFail');   
					}

			}

			else{ echo "eroare";}
	}

	public function passwordEdit()
	{
		if (empty($_POST['oldpassword'])) {
			$this->errors[] = "Nu ati completat parola veche!";
		} elseif (empty($_POST['newpassword']) ) {
			$this->errors[] = "Nu ati completat parola noua!";
        } elseif (!empty($_POST['oldpassword'])
            && !empty($_POST['newpassword'])) 

        {
        	$user_password = $_POST['oldpassword'];
        	$user_newpassword = $_POST['newpassword'];
        	$query_get_user = $this->model->getUser2($_SESSION['email']);

        	if (password_verify($user_password, $query_get_user->password))
        	{

        		$changepass= $this->model->updatePassword($_SESSION['userID'],password_hash($_POST["newpassword"], PASSWORD_DEFAULT));
		
				header('location: ' . URL . 'editeaza/editSuccess');
			}

			else {
				header('location: ' . URL . 'editeaza/editFail');
			}

        }


	}

}

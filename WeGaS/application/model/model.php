<?php

class Model
{
    
    function __construct($db)
    {
        try {
            $this->db = $db;
        } catch (PDOException $e) {
            exit('Database connection could not be established.');
        }
    }

    public function getUser($user_name, $email_address)
    {
        $sql = "SELECT * FROM users WHERE email= :emailadd OR username= :usrname LIMIT 1";
        $query = $this->db->prepare($sql);
        $parameters = array(':emailadd' => $email_address, ':usrname' => $user_name);
        $query->execute($parameters);

        //echo Helper::debugPDO($sql, $parameters);

        return $query->fetch();
    }

    public function getUser2($email_address)
    {
        $sql = "SELECT * FROM users WHERE email= :emailadd LIMIT 1";
        $query = $this->db->prepare($sql);
        $parameters = array(':emailadd' => $email_address);
        $query->execute($parameters);

        //echo Helper::debugPDO($sql, $parameters);

        return $query->fetch();
    }


    public function addUser($email, $username, $password)
    {
        $sql = "INSERT INTO users (email, username, password) VALUES (:email, :username, :password)";
        $query = $this->db->prepare($sql);
        $parameters = array(':email' => $email, ':username' => $username, ':password' => $password);

        // useful for debugging: you can see the SQL behind above construction by using:
        // echo '[ PDO DEBUG ]: ' . Helper::debugPDO($sql, $parameters);  exit();

        $query->execute($parameters);
    }

    public function checkUser($user_name, $user_id)
    {
        $sql = "SELECT * FROM users WHERE username= :username AND userID <> :id LIMIT 1";
        $query = $this->db->prepare($sql);
        $parameters = array(':username' => $user_name, ':id' => $user_id);
        $query->execute($parameters);

        //echo Helper::debugPDO($sql, $parameters);

        return $query->fetch();
    }

    public function checkEmail($user_email, $user_id)
    {
        $sql= "SELECT * FROM users WHERE email= :email AND userID <> :id LIMIT 1";
        $query = $this->db->prepare($sql);
        $parameters = array(':email' => $user_email, ':id' => $user_id);
        $query->execute($parameters);

        //echo Helper::debugPDO($sql, $parameters);

        return $query->fetch();
    }

    public function editProfile($user_id, $user_email, $user_name)
    {
        $sql = "UPDATE users SET email = :email, username = :username WHERE userID = :id";
        $query = $this->db->prepare($sql);
        $parameters = array(':email' => $user_email, ':username' => $user_name, ':id' => $user_id);
        $query->execute($parameters);
    }

    public function updatePassword($user_id, $user_password)
    {
        $sql = "UPDATE users SET password = :pass where userID = :id";
        $query = $this->db->prepare($sql);
        $parameters = array(':pass' => $user_password, ':id' => $user_id);
        $query->execute($parameters);
    }
  
}

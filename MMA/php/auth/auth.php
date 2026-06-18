<?php
function istEingeloggt() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}
?>
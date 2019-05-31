<?php

if (isset($_POST['Image'])) {
    file_put_contents(dirname(__FILENAME__).'/image.png', $_POST['Image']);
    die('SUCCESS!');
}

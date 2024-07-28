<?php
// Directory where files will be uploaded
$uploadDirectory = 'uploads/';

// Ensure the upload directory exists, create it if it doesn't
if (!is_dir($uploadDirectory)) {
    mkdir($uploadDirectory, 0777, true);
}

// Check if files were uploaded
if ($_FILES) {
    $response = [];

    foreach ($_FILES['files']['name'] as $key => $name) {
        $fileTmpPath = $_FILES['files']['tmp_name'][$key];
        $fileName = $_FILES['files']['name'][$key];
        $fileSize = $_FILES['files']['size'][$key];
        $fileType = $_FILES['files']['type'][$key];

        $uploadPath = $uploadDirectory . basename($fileName);

        // Check if the file was moved to the target directory
        if (move_uploaded_file($fileTmpPath, $uploadPath)) {
            $response[] = [
                'name' => $fileName,
                'size' => $fileSize,
                'type' => $fileType,
                'path' => $uploadPath
            ];
        } else {
            $response[] = [
                'name' => $fileName,
                'error' => 'File could not be uploaded.'
            ];
        }
    }

    // Send the response as JSON
    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    echo json_encode(['error' => 'No files uploaded.']);
}

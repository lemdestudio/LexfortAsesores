<?php
header('Content-Type: application/json');

date_default_timezone_set('America/Lima'); 

function escribirLog($mensajeError) {
    $archivoLog = __DIR__ . '/errores_correo.log'; 
    $fecha = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'Desconocida';
    $linea = "[$fecha] [IP: $ip] ERROR: $mensajeError" . PHP_EOL;
    file_put_contents($archivoLog, $linea, FILE_APPEND);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $nombre  = strip_tags(trim($_POST["nombre"] ?? ''));
    $empresa = strip_tags(trim($_POST["empresa"] ?? '')); 
    $correo  = filter_var(trim($_POST["correo"] ?? ''), FILTER_SANITIZE_EMAIL);
    $mensaje = trim($_POST["mensaje"] ?? '');

    if (empty($nombre) || empty($correo) || empty($mensaje)) {
        $errorMsg = "Campos obligatorios incompletos.";
        escribirLog($errorMsg);
        echo json_encode(["ok" => false, "error" => "Por favor, completa los campos obligatorios."]);
        exit;
    }

    $tenantId     = 'TU_TENANT_ID';
    $clientId     = 'TU_CLIENT_ID';
    $clientSecret = 'TU_CLIENT_SECRET';
    
    $userPrincipalName = 'contacto@lexfortasesores.com'; 
    $destinoCorreo     = 'contacto@lexfortasesores.com'; 

    $tokenUrl = "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token";
    $tokenData = [
        'client_id'     => $clientId,
        'client_secret' => $clientSecret,
        'scope'         => 'https://graph.microsoft.com/.default',
        'grant_type'    => 'client_credentials'
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $tokenUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($tokenData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $tokenResponse = curl_exec($ch);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($tokenResponse === false) {
        escribirLog("Fallo la conexión cURL al pedir token: " . $curlError);
        echo json_encode(["ok" => false, "error" => "Error interno de conexión."]);
        exit;
    }

    $tokenJson = json_decode($tokenResponse);

    if (!isset($tokenJson->access_token)) {
        escribirLog("Fallo de autenticación OAuth. Respuesta MS: " . $tokenResponse);
        echo json_encode(["ok" => false, "error" => "No se pudo conectar con el servidor de correo."]);
        exit;
    }

    $accessToken = $tokenJson->access_token;

    $sendMailUrl = "https://graph.microsoft.com/v1.0/users/$userPrincipalName/sendMail";
    $textoEmpresa = !empty($empresa) ? $empresa : 'No especificada';

    $cuerpoHTML = "Tienes un nuevo mensaje desde tu página web:<br><br>
                   <strong>Nombre:</strong> $nombre <br>
                   <strong>Empresa:</strong> $textoEmpresa <br>
                   <strong>Correo:</strong> $correo <br><br>
                   <strong>Mensaje:</strong><br> " . nl2br(htmlspecialchars($mensaje));

    $emailData = [
        "message" => [
            "subject" => "Nuevo contacto web de: $nombre",
            "body" => [
                "contentType" => "HTML",
                "content" => $cuerpoHTML
            ],
            "toRecipients" => [
                [
                    "emailAddress" => [
                        "address" => $destinoCorreo
                    ]
                ]
            ],
            "replyTo" => [
                [
                    "emailAddress" => [
                        "address" => $correo,
                        "name" => $nombre
                    ]
                ]
            ]
        ],
        "saveToSentItems" => "false" 
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $sendMailUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($emailData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $accessToken",
        "Content-Type: application/json"
    ]);
    
    $sendResponse = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300) {
        echo json_encode(["ok" => true]);
    } else {
        escribirLog("Fallo al enviar correo. Código HTTP: $httpCode. Error cURL: $curlError. Respuesta MS: $sendResponse");
        echo json_encode(["ok" => false, "error" => "El mensaje no pudo enviarse. Inténtalo más tarde."]);
    }

} else {
    escribirLog("Intento de acceso con método no permitido (GET en lugar de POST).");
    echo json_encode(["ok" => false, "error" => "Método no permitido."]);
}
?>
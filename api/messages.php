<?php
/**
 * Message Board API
 * Handles message storage and retrieval using JSON file
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configuration
define('MESSAGES_FILE', __DIR__ . '/messages.json');
define('MAX_MESSAGE_LENGTH', 5000);
define('MAX_SUBJECT_LENGTH', 200);
define('MAX_NAME_LENGTH', 100);
define('MAX_EMAIL_LENGTH', 255);

// Initialize messages file if it doesn't exist
if (!file_exists(MESSAGES_FILE)) {
    file_put_contents(MESSAGES_FILE, json_encode(['messages' => []], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Get action
$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : 'get';

try {
    switch ($action) {
        case 'get':
            handleGetMessages();
            break;
        case 'add':
            handleAddMessage();
            break;
        case 'reply':
            handleAddReply();
            break;
        case 'edit':
            handleEditMessage();
            break;
        case 'delete':
            handleDeleteMessage();
            break;
        default:
            sendResponse(false, 'Invalid action');
    }
} catch (Exception $e) {
    sendResponse(false, 'Server error: ' . $e->getMessage());
}

/**
 * Get messages
 */
function handleGetMessages() {
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $perPage = isset($_GET['per_page']) ? max(1, min(50, intval($_GET['per_page']))) : 10;
    
    $data = loadMessages();
    $messages = $data['messages'];
    
    // Sort by timestamp (newest first)
    usort($messages, function($a, $b) {
        return strtotime($b['timestamp']) - strtotime($a['timestamp']);
    });
    
    // Paginate
    $total = count($messages);
    $offset = ($page - 1) * $perPage;
    $messages = array_slice($messages, $offset, $perPage);
    
    sendResponse(true, 'Messages retrieved', [
        'messages' => $messages,
        'page' => $page,
        'per_page' => $perPage,
        'total' => $total,
        'total_pages' => ceil($total / $perPage)
    ]);
}

/**
 * Add new message
 */
function handleAddMessage() {
    // Validate input
    $name = sanitizeInput($_POST['name'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $subject = sanitizeInput($_POST['subject'] ?? '');
    $message = sanitizeInput($_POST['message'] ?? '');
    $service = sanitizeInput($_POST['service'] ?? '');
    
    // Validation
    if (empty($name) || empty($email) || empty($message)) {
        sendResponse(false, 'Name, email, and message are required');
        return;
    }
    
    if (strlen($name) > MAX_NAME_LENGTH) {
        sendResponse(false, 'Name is too long');
        return;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, 'Invalid email address');
        return;
    }
    
    if (strlen($email) > MAX_EMAIL_LENGTH) {
        sendResponse(false, 'Email is too long');
        return;
    }
    
    if (strlen($subject) > MAX_SUBJECT_LENGTH) {
        sendResponse(false, 'Subject is too long');
        return;
    }
    
    if (strlen($message) > MAX_MESSAGE_LENGTH) {
        sendResponse(false, 'Message is too long');
        return;
    }
    
    // Load existing messages
    $data = loadMessages();
    
    // Create new message
    $newMessage = [
        'id' => 'msg_' . time() . '_' . uniqid(),
        'name' => $name,
        'email' => $email,
        'subject' => $subject,
        'message' => $message,
        'service' => $service,
        'timestamp' => date('c'), // ISO 8601 format
        'replies' => []
    ];
    
    // Add to messages array
    $data['messages'][] = $newMessage;
    
    // Save to file
    if (saveMessages($data)) {
        sendResponse(true, 'Message added successfully', ['message' => $newMessage]);
    } else {
        sendResponse(false, 'Failed to save message');
    }
}

/**
 * Add reply to message
 */
function handleAddReply() {
    $messageId = sanitizeInput($_POST['message_id'] ?? '');
    $replyMessage = sanitizeInput($_POST['message'] ?? '');
    $author = sanitizeInput($_POST['author'] ?? 'TAON Team');
    
    if (empty($messageId) || empty($replyMessage)) {
        sendResponse(false, 'Message ID and reply message are required');
        return;
    }
    
    if (strlen($replyMessage) > MAX_MESSAGE_LENGTH) {
        sendResponse(false, 'Reply message is too long');
        return;
    }
    
    // Load existing messages
    $data = loadMessages();
    
    // Find message
    $found = false;
    foreach ($data['messages'] as &$msg) {
        if ($msg['id'] === $messageId) {
            $found = true;
            
            // Add reply
            $reply = [
                'id' => 'reply_' . time() . '_' . uniqid(),
                'author' => $author,
                'message' => $replyMessage,
                'timestamp' => date('c')
            ];
            
            if (!isset($msg['replies'])) {
                $msg['replies'] = [];
            }
            $msg['replies'][] = $reply;
            break;
        }
    }
    
    if (!$found) {
        sendResponse(false, 'Message not found');
        return;
    }
    
    // Save to file
    if (saveMessages($data)) {
        sendResponse(true, 'Reply added successfully', ['reply' => $reply]);
    } else {
        sendResponse(false, 'Failed to save reply');
    }
}

/**
 * Load messages from file
 */
function loadMessages() {
    if (!file_exists(MESSAGES_FILE)) {
        return ['messages' => []];
    }
    
    $content = file_get_contents(MESSAGES_FILE);
    if ($content === false) {
        return ['messages' => []];
    }
    
    $data = json_decode($content, true);
    if ($data === null) {
        return ['messages' => []];
    }
    
    return $data;
}

/**
 * Save messages to file
 */
function saveMessages($data) {
    // Use file locking to prevent concurrent writes
    $fp = fopen(MESSAGES_FILE, 'c+');
    if (!$fp) {
        return false;
    }
    
    if (flock($fp, LOCK_EX)) {
        $result = file_put_contents(MESSAGES_FILE, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        flock($fp, LOCK_UN);
        fclose($fp);
        return $result !== false;
    }
    
    fclose($fp);
    return false;
}

/**
 * Sanitize input
 */
function sanitizeInput($input) {
    if (is_array($input)) {
        return array_map('sanitizeInput', $input);
    }
    
    // Remove null bytes
    $input = str_replace("\0", '', $input);
    
    // Trim whitespace
    $input = trim($input);
    
    // Remove HTML tags (but allow basic formatting if needed)
    // For security, we'll strip all HTML
    $input = strip_tags($input);
    
    return $input;
}

/**
 * Send JSON response
 */
function sendResponse($success, $message, $data = null) {
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response = array_merge($response, $data);
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

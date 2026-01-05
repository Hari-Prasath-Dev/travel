<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        <?php echo isset($pageTitle) ? $pageTitle . " - Trip Planner Pro" : "Trip Planner Pro"; ?>
    </title>

    <!-- Fonts -->
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet">

    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- External CSS -->
    <link rel="stylesheet" href="assets/css/style.css">

    <!-- External Libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
</head>

<body>
    <!-- Theme Selector -->
    <div class="theme-selector" id="themeSelector">
        <button class="theme-btn active" data-theme="1"></button>
        <button class="theme-btn" data-theme="2"></button>
        <button class="theme-btn" data-theme="3"></button>
        <button class="theme-btn" data-theme="4"></button>
        <button class="theme-btn" data-theme="5"></button>
    </div>

    <!-- Toast Container -->
    <div class="toast-container"></div>

    <!-- Dashboard Header (Shared) -->
    <div class="dashboard-header" id="mainHeader" style="display: none;">
        <div class="dashboard-logo">
            <div class="logo-icon">
                <i class="fas fa-plane-departure"></i>
            </div>
            <div class="logo-text">Trip Planner Pro</div>
        </div>
        <div class="user-menu">
            <div class="user-avatar" id="userInitial">U</div>
            <button class="btn btn-ghost" id="logoutBtn">
                <i class="fas fa-sign-out-alt"></i>
                Logout
            </button>
        </div>
    </div>
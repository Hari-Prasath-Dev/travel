<?php
$current_page = basename($_SERVER['PHP_SELF']);
?>
<div class="sidebar" id="mainSidebar" style="display: none;">
    <a href="index.php" class="menu-item <?php echo ($current_page == 'index.php') ? 'active' : ''; ?>">
        <span class="menu-icon"><i class="fas fa-plus-circle"></i></span>
        <span>New Trip Plan</span>
    </a>
    <a href="calculations.php" class="menu-item <?php echo ($current_page == 'calculations.php') ? 'active' : ''; ?>">
        <span class="menu-icon"><i class="fas fa-list-alt"></i></span>
        <span>All Calculations</span>
    </a>
    <!-- <div class="menu-item">
        <span class="menu-icon"><i class="fas fa-chart-bar"></i></span>
        <span>Analytics</span>
    </div> -->
    <div class="menu-item" id="settingsMenu">
        <span class="menu-icon"><i class="fas fa-cog"></i></span>
        <span>Settings</span>
    </div>
    <div class="menu-item">
        <span class="menu-icon"><i class="fas fa-question-circle"></i></span>
        <span>Help & Support</span>
    </div>
</div>
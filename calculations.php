<?php
$pageTitle = "Saved Calculations";
include 'inc/header.php';
?>

<div class="dashboard-content">
    <?php include 'inc/sidebar.php'; ?>

    <div class="main-content">
        <div class="page-header">
            <h1 class="page-title">Saved Calculations</h1>
            <p class="page-subtitle">View and manage all your previous trip plans and reports</p>
        </div>

        <!-- Quick Stats for reports -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-file-invoice-dollar"></i></div>
                <div class="stat-value" id="totalCalculations">0</div>
                <div class="stat-label">Total Reports</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
                <div class="stat-value" id="totalRevenue">₹0</div>
                <div class="stat-label">Total Revenue</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-clock"></i></div>
                <div class="stat-value" id="avgDays">0</div>
                <div class="stat-label">Avg. Trip Days</div>
            </div>
        </div>

        <div class="calculations-container">
            <div class="table-header">
                <div class="search-box" style="position: relative; flex: 1; max-width: 400px;">
                    <i class="fas fa-search"
                        style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-light);"></i>
                    <input type="text" id="searchInput" class="form-input" style="padding-left: 44px;"
                        placeholder="Search by name, phone or date...">
                </div>
                <button class="btn btn-ghost" id="filterBtn">
                    <i class="fas fa-filter"></i>
                    Filter
                </button>
            </div>

            <table class="data-table hidden" id="calculationsTable">
                <thead>
                    <tr>
                        <th>Date & Time</th>
                        <th>Customer Details</th>
                        <th>Duration</th>
                        <th>Items</th>
                        <th>Status</th>
                        <th>Total Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="calculationsList">
                    <!-- Loaded via JS -->
                </tbody>
            </table>

            <div id="emptyState" class="text-center p-4 hidden">
                <div style="font-size: 64px; color: var(--border); margin-bottom: 1.5rem;">
                    <i class="fas fa-folder-open"></i>
                </div>
                <h3 style="font-size: 1.5rem; color: var(--text); margin-bottom: 0.5rem;">No calculations yet</h3>
                <p style="color: var(--text-light); margin-bottom: 2rem;">Start creating trip plans to see them listed
                    here</p>
                <a href="index.php" class="btn btn-primary">
                    <i class="fas fa-plus"></i>
                    Create New Plan
                </a>
            </div>
        </div>
    </div>
</div>

<!-- Detail Modal -->
<div id="detailModal" class="modal">
    <div class="modal-content" style="max-width: 900px;">
        <div class="modal-header">
            <h2 class="modal-title" id="modalCustomerName">Customer Trip Details</h2>
            <button class="modal-close" id="closeModal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body" id="modalBody">
            <!-- Loaded via JS -->
        </div>
    </div>
</div>

<?php include 'inc/footer.php'; ?>
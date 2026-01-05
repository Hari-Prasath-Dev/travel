<?php
$pageTitle = "Day-Wise Trip Planner";
include 'inc/header.php';
?>

<div class="dashboard-content">
    <?php include 'inc/sidebar.php'; ?>

    <!-- Login Page -->
    <div id="loginPage" class="login-container">
        <div class="login-card">
            <div class="login-header">
                <div class="login-logo">
                    <i class="fas fa-plane-departure"></i>
                </div>
                <h1 class="login-title">Trip Planner Pro</h1>
                <p class="login-subtitle">Plan your perfect journey with precision</p>
            </div>
            <form id="loginForm">
                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <div class="input-group">
                        <i class="fas fa-envelope input-icon"></i>
                        <input type="email" class="form-input input-with-icon" placeholder="Enter your email" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <div class="input-group">
                        <i class="fas fa-lock input-icon"></i>
                        <input type="password" class="form-input input-with-icon" placeholder="Enter your password"
                            required>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary btn-lg">
                    <i class="fas fa-sign-in-alt"></i>
                    Sign In
                </button>
                <div class="text-center mt-4">
                    <p style="color: var(--text-light);">Demo: Use any email & password</p>
                </div>
            </form>
        </div>
    </div>

    <!-- Dashboard -->
    <div id="dashboard" class="dashboard">
        <div class="main-content">
            <!-- Trip Planning Page -->
            <div id="calculationFormPage" class="page-content active">

                <!-- Customer Information -->
                <div class="customer-info-section">
                    <div class="section-header">
                        <h2 class="section-title"><i class="fas fa-user-circle"></i> Customer Information</h2>
                        <button class="btn btn-ghost" id="clearFormBtn"><i class="fas fa-broom"></i> Clear Form</button>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Customer Name *</label>
                            <div class="input-group">
                                <i class="fas fa-user input-icon"></i>
                                <input type="text" class="form-input input-with-icon" id="customerName"
                                    placeholder="Enter customer name" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Phone Number *</label>
                            <div class="input-group">
                                <i class="fas fa-phone input-icon"></i>
                                <input type="tel" class="form-input input-with-icon" id="customerPhone"
                                    placeholder="Enter phone number" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Number of Days *</label>
                            <div class="input-group">
                                <i class="fas fa-calendar-alt input-icon"></i>
                                <select class="form-input input-with-icon" id="numDays" required>
                                    <option value="">Select Days</option>
                                    <?php for ($i = 1; $i <= 15; $i++): ?>
                                        <option value="<?php echo $i; ?>">
                                            <?php echo $i; ?> Day
                                            <?php echo $i > 1 ? 's' : ''; ?>
                                        </option>
                                    <?php endfor; ?>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Day Boxes Container -->
                <div id="dayBoxesGrid" class="day-boxes-grid">
                    <div class="text-center p-4" style="grid-column: 1 / -1;">
                        <div style="font-size: 48px; color: var(--border); margin-bottom: 16px;">
                            <i class="fas fa-calendar-plus"></i>
                        </div>
                        <h3 style="color: var(--text-light); margin-bottom: 8px;">No Days Selected</h3>
                        <p style="color: var(--gray-400);">Select number of days to start planning your trip</p>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="action-buttons centered mt-4">
                    <!-- <button class="btn btn-primary btn-lg" id="previewTripBtn"><i class="fas fa-eye"></i> Preview
                        Trip</button> -->
                    <button class="btn btn-success btn-lg" id="finishTripBtn"><i class="fas fa-check-circle"></i> Finish
                        & Save Trip</button>
                    <!-- <button class="btn btn-ghost btn-lg" id="exportPdfBtn"><i class="fas fa-file-pdf"></i> Export
                        PDF</button> -->
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Entry Modal -->
<div id="entryModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2 class="modal-title" id="entryModalTitle">Add Details for Day 1</h2>
            <button class="modal-close" onclick="closeEntryModal()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            <div class="form-tabs">
                <button class="form-tab active" data-tab="vehicle"><i class="fas fa-car"></i> Vehicle</button>
                <button class="form-tab" data-tab="hotel"><i class="fas fa-hotel"></i> Hotel</button>
                <button class="form-tab" data-tab="activity"><i class="fas fa-hiking"></i> Activities</button>
                <button class="form-tab" data-tab="cruise"><i class="fas fa-ship"></i> Cruise</button>
            </div>

            <!-- Forms (Simplified for structure) -->
            <div id="vehicleTab" class="tab-content active">
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">Location</label><input type="text"
                                class="form-input" name="location" placeholder="Enter location"></div>
                        <div class="form-group"><label class="form-label">Place</label><input type="text"
                                class="form-input" name="place" placeholder="Enter place"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">Number of Vehicles</label><input type="number"
                                class="form-input" name="numVehicles" min="1" value="1"></div>
                        <div class="form-group"><label class="form-label">Number of Persons</label><input type="number"
                                class="form-input" name="persons" min="1"></div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <button type="submit" class="btn btn-primary"><i class="fas fa-arrow-right"></i> Next</button>
                        <span id="vehicleCostDisplay" style="font-weight: 700; color: var(--primary); font-size: 14px;"></span>
                    </div>
            </div>

            <div id="hotelTab" class="tab-content">
                <form id="hotelForm">
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">Hotel with Type</label><input type="text"
                                class="form-input" name="hotelName" placeholder="Hotel name with type"></div>
                        <div class="form-group"><label class="form-label">Location</label><input type="text"
                                class="form-input" name="location" placeholder="Enter location"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">Number of Persons</label><input type="number"
                                class="form-input" name="persons" min="1"></div>
                        <div class="form-group"><label class="form-label">Room Type</label>
                            <select class="form-input" name="bedType">
                                <option value="">Select Room Type</option>
                                <option value="Single Bed">Single Bed</option>
                                <option value="Double Bed">Double Bed</option>
                                <option value="Suite">Suite</option>
                                <option value="Deluxe">Deluxe</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Season</label>
                            <div class="radio-group" style="display: flex; gap: 16px; padding: 10px;">
                                <label><input type="radio" name="season" value="Peak"> Peak</label>
                                <label><input type="radio" name="season" value="Super Peak"> Super Peak</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-row full">
                        <label class="form-label">Food (Select Options)</label>
                        <div class="checkbox-group">
                            <label class="checkbox-item"><input type="checkbox" name="food" value="CP"><span
                                    class="checkbox-label">CP</span></label>
                            <label class="checkbox-item"><input type="checkbox" name="food" value="MAP"><span
                                    class="checkbox-label">MAP</span></label>
                            <label class="checkbox-item"><input type="checkbox" name="food" value="AP"><span
                                    class="checkbox-label">AP</span></label>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <button type="submit" class="btn btn-primary"><i class="fas fa-arrow-right"></i> Next</button>
                        <span id="hotelCostDisplay" style="font-weight: 700; color: var(--primary); font-size: 14px;"></span>
                    </div>
                </form>
            </div>

            <div id="activityTab" class="tab-content">
                <form id="activityForm">
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">Activity Name</label><select
                                class="form-input" name="activityName">
                                <option value="">Select Activity</option>
                                <option value="Scuba Diving">Scuba Diving</option>
                                <option value="Snorkeling">Snorkeling</option>
                                <option value="City Tour">City Tour</option>
                                <option value="Museum Visit">Museum Visit</option>
                            </select></div>
                        <div class="form-group"><label class="form-label">Location</label><input type="text"
                                class="form-input" name="location" placeholder="Enter location"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">Adults</label><input type="number"
                                class="form-input" name="adults" min="1" value="1"></div>
                        <div class="form-group"><label class="form-label">Child (6-12)</label><input type="number"
                                class="form-input" name="child612" min="0" value="0"></div>
                        <div class="form-group"><label class="form-label">Child (2-5)</label><input type="number"
                                class="form-input" name="child25" min="0" value="0"></div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <button type="submit" class="btn btn-primary"><i class="fas fa-plus-circle"></i> Next</button>
                        <span id="activityCostDisplay"
                            style="font-weight: 700; color: var(--primary); font-size: 14px;"></span>
                    </div>
                </form>
            </div>

            <div id="cruiseTab" class="tab-content">
                <form id="cruiseForm">
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">Cruise Name</label><input type="text"
                                class="form-input" name="cruiseName"></div>
                        <div class="form-group">
                            <label class="form-label">Season</label>
                            <div class="radio-group" style="display: flex; gap: 16px; padding: 10px;">
                                <label><input type="radio" name="season" value="Peak"> Peak</label>
                                <label><input type="radio" name="season" value="Super Peak"> Super Peak</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">Service</label><input type="text"
                                class="form-input" name="service" placeholder="Enter service type"></div>
                        <div class="form-group"><label class="form-label">Duration (Mins)</label><input type="number"
                                class="form-input" name="duration" min="1"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">Adults</label><input type="number"
                                class="form-input" name="adults" min="1" value="1"></div>
                        <div class="form-group"><label class="form-label">Child (3-12)</label><input type="number"
                                class="form-input" name="child312" min="0" value="0"></div>
                        <div class="form-group"><label class="form-label">Child (1-2)</label><input type="number"
                                class="form-input" name="child12" min="0" value="0"></div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <button type="submit" class="btn btn-primary"><i class="fas fa-check"></i> Finish Day</button>
                        <span id="cruiseCostDisplay" style="font-weight: 700; color: var(--primary); font-size: 14px;"></span>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<?php include 'inc/footer.php'; ?>
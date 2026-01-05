// Trip Calculator Logic for index.php

let dayWiseData = {};
let currentDay = 1;
let savedCalculations = JSON.parse(localStorage.getItem('savedCalculations')) || [];

function initializeCalculator() {
    initializeEventListeners();
    checkLoginStatus();
    initRealTimeUpdates();

    // Check for edit mode
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (editId) {
        loadCalculationForEdit(editId);
    }
}

function initializeEventListeners() {
    // Number of Days Change
    const numDaysSelect = document.getElementById('numDays');
    if (numDaysSelect) {
        numDaysSelect.addEventListener('change', function () {
            const days = parseInt(this.value);
            if (!days) {
                resetDayBoxesGrid();
                updateStats(0, 0, 0);
                return;
            }

            // Initialize data for new days
            for (let i = 1; i <= days; i++) {
                if (!dayWiseData[i]) dayWiseData[i] = [];
            }
            updateDayBoxes();
            showToast(`Planning ${days} day${days > 1 ? 's' : ''} trip`, 'success');
        });
    }

    // Clear Form
    const clearBtn = document.getElementById('clearFormBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            if (confirm('Are you sure you want to clear all data?')) {
                dayWiseData = {};
                document.getElementById('customerName').value = '';
                document.getElementById('customerPhone').value = '';
                document.getElementById('numDays').value = '';
                updateDayBoxes();
                updateStats(0, 0, 0);
                showToast('Form cleared successfully', 'success');
            }
        });
    }

    // Modal Form Submissions
    const vehicleForm = document.getElementById('vehicleForm');
    if (vehicleForm) vehicleForm.addEventListener('submit', handleVehicleSubmit);

    const hotelForm = document.getElementById('hotelForm');
    if (hotelForm) hotelForm.addEventListener('submit', handleHotelSubmit);

    const activityForm = document.getElementById('activityForm');
    if (activityForm) activityForm.addEventListener('submit', handleActivitySubmit);

    const cruiseForm = document.getElementById('cruiseForm');
    if (cruiseForm) cruiseForm.addEventListener('submit', handleCruiseSubmit);

    // Page Buttons
    const previewBtn = document.getElementById('previewTripBtn');
    if (previewBtn) previewBtn.addEventListener('click', previewTrip);

    const finishBtn = document.getElementById('finishTripBtn');
    if (finishBtn) finishBtn.addEventListener('click', finishTrip);

    // Tab switching in modal
    document.querySelectorAll('.form-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            switchTab(this.getAttribute('data-tab'));
        });
    });
}

function resetDayBoxesGrid() {
    const grid = document.getElementById('dayBoxesGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="text-center p-4" style="grid-column: 1 / -1;">
                <div style="font-size: 48px; color: var(--border); margin-bottom: 16px;">
                    <i class="fas fa-calendar-plus"></i>
                </div>
                <h3 style="color: var(--text-light); margin-bottom: 8px;">No Days Selected</h3>
                <p style="color: var(--gray-400);">Select number of days to start planning your trip</p>
            </div>
        `;
    }
}

function updateDayBoxes() {
    const grid = document.getElementById('dayBoxesGrid');
    const daysSelect = document.getElementById('numDays');
    if (!grid || !daysSelect) return;

    const days = parseInt(daysSelect.value);
    if (!days) return;

    let html = '';
    let totalCost = 0;
    let totalItems = 0;

    for (let i = 1; i <= days; i++) {
        const items = dayWiseData[i] || [];
        const dayTotal = items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
        totalCost += dayTotal;
        totalItems += items.length;

        html += `
            <div class="day-box">
                <div class="day-header">
                    <h3 class="day-title"><i class="fas fa-calendar-day"></i> Day ${i}</h3>
                    <div class="day-cost">₹${dayTotal.toFixed(2)}</div>
                </div>
                <div class="day-progress">
                    <div class="day-progress-bar" style="width: ${(items.length / 10) * 100}%"></div>
                </div>
                <div class="day-items-list">
                    ${items.length === 0 ? `
                        <div class="text-center p-4">
                            <i class="fas fa-plus-circle" style="font-size: 32px; color: var(--border); margin-bottom: 8px;"></i>
                            <p style="color: var(--text-light);">No items added yet</p>
                        </div>
                    ` : items.map((item, idx) => `
                        <div class="day-item" onclick="editItem(${i}, ${idx})">
                            <div class="item-info">
                                <div class="item-icon">${getItemIcon(item.type)}</div>
                                <div class="item-details">
                                    <h4>${getItemTitle(item)}</h4>
                                    <p>${getItemSubtitle(item)}</p>
                                </div>
                            </div>
                            <div class="item-price">₹${item.total}</div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-primary" onclick="openEntryModal(${i})" style="width: 100%; margin-top: 16px;">
                    <i class="fas fa-plus"></i>
                    ${items.length > 0 ? 'Add More Items' : 'Add Trip Details'}
                </button>
            </div>
        `;
    }

    grid.innerHTML = html;
    updateStats(totalItems, totalCost, days);
}

function updateStats(items, cost, days) {
    const daysEl = document.getElementById('totalDays');
    const itemsEl = document.getElementById('totalItems');
    const costEl = document.getElementById('totalCost');
    const savingsEl = document.getElementById('savings');

    if (daysEl) daysEl.textContent = days;
    if (itemsEl) itemsEl.textContent = items;
    if (costEl) costEl.textContent = `₹${cost.toFixed(2)}`;
    if (savingsEl) savingsEl.textContent = `${Math.min(Math.floor(cost / 1000), 30)}%`;
}

// Modal functions
function openEntryModal(day, editIndex = -1) {
    currentDay = day;
    const title = document.getElementById('entryModalTitle');
    const modal = document.getElementById('entryModal');

    if (editIndex === -1) {
        isEditingItem = false;
        editingItemIndex = -1;
        if (title) title.textContent = `Add Details for Day ${day}`;
        document.querySelectorAll('#entryModal form').forEach(form => {
            form.reset();
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const type = form.id.replace('Form', '');
                submitBtn.innerHTML = `<i class="fas fa-plus-circle"></i> Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;
            }
        });
        document.querySelectorAll('[id$="CostDisplay"]').forEach(el => el.textContent = '');
    } else {
        if (title) title.textContent = `Edit Details for Day ${day}`;
    }

    if (modal) modal.classList.add('active');
    if (editIndex === -1) switchTab('vehicle');
}

function closeEntryModal() {
    const modal = document.getElementById('entryModal');
    if (modal) modal.classList.remove('active');
    isEditingItem = false;
    editingItemIndex = -1;
}

function switchTab(tabName) {
    document.querySelectorAll('.form-tab').forEach(t => {
        t.classList.toggle('active', t.getAttribute('data-tab') === tabName);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tabName + 'Tab');
    });
    updateModalTotal();
}

// Form Handlers
let isEditMode = false;
let editingId = null;

// Real-time total calculation for modal
function updateModalTotal() {
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;

    const form = activeTab.querySelector('form');
    const formData = new FormData(form);
    let total = 0;
    let type = '';

    switch (form.id) {
        case 'vehicleForm':
            const vCost = parseFloat(formData.get('cost')) || 0;
            const vNum = parseInt(formData.get('numVehicles')) || 0;
            const vDays = parseInt(formData.get('days')) || 0;
            total = vCost * vNum * vDays;
            type = 'vehicle';
            break;
        case 'hotelForm':
            const hCost = parseFloat(formData.get('cost')) || 0;
            const hNights = parseInt(formData.get('nights')) || 0;
            total = hCost * hNights;
            type = 'hotel';
            break;
        case 'activityForm':
            const aCost = parseFloat(formData.get('cost')) || 0;
            const adults = parseInt(formData.get('adults')) || 0;
            const c612 = parseInt(formData.get('child612')) || 0;
            const c25 = parseInt(formData.get('child25')) || 0;
            total = aCost * (adults + c612 + c25);
            type = 'activity';
            break;
        case 'cruiseForm':
            const crCost = parseFloat(formData.get('cost')) || 0;
            const crAdults = parseInt(formData.get('adults')) || 0;
            const cr312 = parseInt(formData.get('child312')) || 0;
            const cr12 = parseInt(formData.get('child12')) || 0;
            const crNights = parseInt(formData.get('nights')) || 0;
            total = crCost * (crAdults + cr312 + cr12) * crNights;
            type = 'cruise';
            break;
    }

    const totalEl = document.getElementById('modalCurrentTotal');
    if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;

    const tabCostEl = document.getElementById(`${type}CostDisplay`);
    if (tabCostEl) tabCostEl.textContent = total > 0 ? `${type.charAt(0).toUpperCase() + type.slice(1)} Cost: ₹${total.toFixed(2)}` : '';
}

// Add event listeners to all inputs for real-time updates
function initRealTimeUpdates() {
    document.querySelectorAll('#entryModal input, #entryModal select').forEach(input => {
        input.addEventListener('input', updateModalTotal);
    });
}

// Form Handlers
function handleVehicleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const vehicles = formData.getAll('vehicleType');
    if (vehicles.length === 0) {
        showToast('Please select at least one vehicle type', 'error');
        return;
    }
    const numVehicles = parseInt(formData.get('numVehicles')) || 1;
    const cost = parseFloat(formData.get('cost')) || 0;
    const days = parseInt(formData.get('days')) || 1;
    const data = {
        type: 'vehicle',
        vehicleType: vehicles.join(', '),
        location: formData.get('location'),
        place: formData.get('place'),
        numVehicles: numVehicles,
        persons: formData.get('persons'),
        cost: cost,
        days: days,
        total: cost * numVehicles * days
    };
    addItemToDay(data);
    this.reset();
    document.getElementById('vehicleCostDisplay').textContent = '';
    showToast('Vehicle added successfully!', 'success');
    switchTab('hotel');
}

function handleHotelSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const foods = formData.getAll('food');
    const cost = parseFloat(formData.get('cost')) || 0;
    const nights = parseInt(formData.get('nights')) || 1;
    const data = {
        type: 'hotel',
        hotelName: formData.get('hotelName'),
        location: formData.get('location'),
        persons: formData.get('persons'),
        bedType: formData.get('bedType'),
        season: formData.get('season'),
        food: foods.join(', '),
        cost: cost,
        nights: nights,
        total: cost * nights
    };
    addItemToDay(data);
    this.reset();
    document.getElementById('hotelCostDisplay').textContent = '';
    showToast('Hotel added successfully!', 'success');
    switchTab('activity');
}

function handleActivitySubmit(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const cost = parseFloat(formData.get('cost')) || 0;
    const adults = parseInt(formData.get('adults')) || 0;
    const c612 = parseInt(formData.get('child612')) || 0;
    const c25 = parseInt(formData.get('child25')) || 0;
    const totalPersons = adults + c612 + c25;

    const data = {
        type: 'activity',
        activityName: formData.get('activityName'),
        location: formData.get('location'),
        adults: adults,
        child612: c612,
        child25: c25,
        persons: totalPersons,
        cost: cost,
        duration: formData.get('duration'),
        date: formData.get('date'),
        total: cost * totalPersons
    };
    addItemToDay(data);
    this.reset();
    document.getElementById('activityCostDisplay').textContent = '';
    showToast('Activity added successfully!', 'success');
    switchTab('cruise');
}

function handleCruiseSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const cost = parseFloat(formData.get('cost')) || 0;
    const adults = parseInt(formData.get('adults')) || 0;
    const c312 = parseInt(formData.get('child312')) || 0;
    const c12 = parseInt(formData.get('child12')) || 0;
    const totalPersons = adults + c312 + c12;
    const nights = parseInt(formData.get('nights')) || 1;

    const data = {
        type: 'cruise',
        cruiseName: formData.get('cruiseName'),
        season: formData.get('season'),
        service: formData.get('service'),
        duration: formData.get('duration'),
        adults: adults,
        child312: c312,
        child12: c12,
        persons: totalPersons,
        cabinType: formData.get('cabinType'),
        cost: cost,
        nights: nights,
        total: cost * totalPersons * nights
    };
    addItemToDay(data);
    this.reset();
    document.getElementById('cruiseCostDisplay').textContent = '';
    showToast('Cruise added successfully!', 'success');
    closeEntryModal();
}

function addItemToDay(item) {
    if (!dayWiseData[currentDay]) dayWiseData[currentDay] = [];

    if (isEditingItem && editingItemIndex !== -1) {
        dayWiseData[currentDay][editingItemIndex] = item;
        showToast('Item updated successfully!', 'success');
    } else {
        dayWiseData[currentDay].push(item);
        showToast('Item added successfully!', 'success');
    }

    updateDayBoxes();
}

// Editing individual items
let isEditingItem = false;
let editingItemIndex = -1;

function editItem(day, index) {
    currentDay = day;
    const item = dayWiseData[day][index];
    if (!item) return;

    isEditingItem = true;
    editingItemIndex = index;

    openEntryModal(day, index);
    switchTab(item.type);

    // Populate the form based on item type
    const form = document.getElementById(`${item.type}Form`);
    if (!form) return;

    if (item.type === 'vehicle') {
        const checkboxes = form.querySelectorAll('input[name="vehicleType"]');
        const selectedVehicles = item.vehicleType.split(', ');
        checkboxes.forEach(cb => cb.checked = selectedVehicles.includes(cb.value));
        form.querySelector('input[name="location"]').value = item.location || '';
        form.querySelector('input[name="place"]').value = item.place || '';
        form.querySelector('input[name="numVehicles"]').value = item.numVehicles;
        form.querySelector('input[name="persons"]').value = item.persons;
        form.querySelector('input[name="cost"]').value = item.cost;
        form.querySelector('input[name="days"]').value = item.days;
    } else if (item.type === 'hotel') {
        form.querySelector('input[name="hotelName"]').value = item.hotelName;
        form.querySelector('input[name="location"]').value = item.location || '';
        form.querySelector('input[name="persons"]').value = item.persons;
        form.querySelector('select[name="bedType"]').value = item.bedType;
        if (item.season) form.querySelector(`input[name="season"][value="${item.season}"]`).checked = true;

        const foodCheckboxes = form.querySelectorAll('input[name="food"]');
        const selectedFoods = item.food.split(', ');
        foodCheckboxes.forEach(cb => cb.checked = selectedFoods.includes(cb.value));

        form.querySelector('input[name="cost"]').value = item.cost;
        form.querySelector('input[name="nights"]').value = item.nights;
    } else if (item.type === 'activity') {
        form.querySelector('select[name="activityName"]').value = item.activityName;
        form.querySelector('input[name="location"]').value = item.location || '';
        form.querySelector('input[name="adults"]').value = item.adults || item.persons;
        form.querySelector('input[name="child612"]').value = item.child612 || 0;
        form.querySelector('input[name="child25"]').value = item.child25 || 0;
        form.querySelector('input[name="cost"]').value = item.cost;
        form.querySelector('input[name="duration"]').value = item.duration;
        form.querySelector('input[name="date"]').value = item.date;
    } else if (item.type === 'cruise') {
        form.querySelector('input[name="cruiseName"]').value = item.cruiseName;
        if (item.season) form.querySelector(`input[name="season"][value="${item.season}"]`).checked = true;
        form.querySelector('input[name="service"]').value = item.service || '';
        form.querySelector('input[name="duration"]').value = item.duration || '';
        form.querySelector('input[name="adults"]').value = item.adults || item.persons;
        form.querySelector('input[name="child312"]').value = item.child312 || 0;
        form.querySelector('input[name="child12"]').value = item.child12 || 0;
        form.querySelector('select[name="cabinType"]').value = item.cabinType;
        form.querySelector('input[name="cost"]').value = item.cost;
        form.querySelector('input[name="nights"]').value = item.nights;
    }

    updateModalTotal();

    // Change button text to "Update"
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.innerHTML = `<i class="fas fa-save"></i> Update ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`;
}

function previewTrip() {
    const days = parseInt(document.getElementById('numDays').value);
    if (!days) {
        showToast('Please select number of days first', 'error');
        return;
    }
    let previewText = "Trip Preview:\n\n";
    let totalCost = 0;
    for (let i = 1; i <= days; i++) {
        const items = dayWiseData[i] || [];
        const dayTotal = items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
        totalCost += dayTotal;
        previewText += `Day ${i} (₹${dayTotal.toFixed(2)}):\n`;
        items.forEach(item => {
            previewText += `  • ${getItemTitle(item)}: ₹${item.total}\n`;
        });
        previewText += '\n';
    }
    previewText += `\nTotal Cost: ₹${totalCost.toFixed(2)}`;
    alert(previewText);
}

function finishTrip() {
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const numDays = document.getElementById('numDays').value;

    if (!customerName || !customerPhone || !numDays) {
        showToast('Please enter customer info and select number of days', 'error');
        return;
    }

    const incompleteDays = [];
    for (let i = 1; i <= parseInt(numDays); i++) {
        if (!dayWiseData[i] || dayWiseData[i].length === 0) incompleteDays.push(i);
    }
    if (incompleteDays.length > 0) {
        if (!confirm(`Days ${incompleteDays.join(', ')} have no details. Save anyway?`)) return;
    }

    let allItems = [];
    let totalCost = 0;
    for (const day in dayWiseData) {
        dayWiseData[day].forEach(item => {
            item.day = parseInt(day);
            allItems.push(item);
            totalCost += parseFloat(item.total);
        });
    }

    const calculation = {
        id: isEditMode ? editingId : Date.now(),
        customerName, customerPhone,
        numDays: parseInt(numDays),
        items: allItems,
        dayWiseData,
        date: isEditMode ? savedCalculations.find(c => String(c.id) === String(editingId))?.date : new Date().toLocaleString(),
        grandTotal: totalCost,
        theme: localStorage.getItem('selectedTheme') || '1'
    };

    if (isEditMode) {
        const index = savedCalculations.findIndex(c => String(c.id) === String(editingId));
        if (index !== -1) {
            savedCalculations[index] = calculation;
        }
    } else {
        savedCalculations.push(calculation);
    }

    localStorage.setItem('savedCalculations', JSON.stringify(savedCalculations));
    showToast(isEditMode ? 'Trip updated successfully!' : 'Trip saved successfully!', 'success');
    setTimeout(() => { window.location.href = 'calculations.php'; }, 1000);
}

function loadCalculationForEdit(id) {
    const calc = savedCalculations.find(c => String(c.id) === String(id));
    if (!calc) {
        showToast('Calculation not found for editing', 'error');
        return;
    }

    isEditMode = true;
    editingId = id;

    document.getElementById('customerName').value = calc.customerName;
    document.getElementById('customerPhone').value = calc.customerPhone;
    document.getElementById('numDays').value = calc.numDays;

    dayWiseData = JSON.parse(JSON.stringify(calc.dayWiseData));
    updateDayBoxes();

    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) pageTitle.innerHTML = `<i class="fas fa-edit"></i> Editing Trip: ${calc.customerName}`;

    showToast('Editing existing trip record', 'info');
}

// Helpers
function getItemIcon(type) {
    const icons = { vehicle: '🚗', hotel: '🏨', activity: '🎯', cruise: '🚢' };
    return icons[type] || '📝';
}

function getItemTitle(item) {
    switch (item.type) {
        case 'vehicle': return `${item.vehicleType} (${item.numVehicles}x)`;
        case 'hotel': return `${item.hotelName} (${item.season || 'Regular'})`;
        case 'activity': return item.activityName;
        case 'cruise': return `${item.cruiseName} (${item.season || 'Regular'})`;
        default: return 'Item';
    }
}

function getItemSubtitle(item) {
    switch (item.type) {
        case 'vehicle': return `${item.location || ''} • ${item.place || ''} • ${item.days} day(s)`;
        case 'hotel': return `${item.location || ''} • ${item.bedType} • ${item.food || ''}`;
        case 'activity': return `${item.location || ''} • ${item.adults || 0}A, ${(item.child612 || 0) + (item.child25 || 0)}C`;
        case 'cruise': return `${item.service || ''} • ${item.duration || ''}m • ${item.adults || 0}A, ${(item.child312 || 0) + (item.child12 || 0)}C`;
        default: return '';
    }
}

// Global modal background click
window.addEventListener('click', function (e) {
    const modal = document.getElementById('entryModal');
    if (e.target === modal) closeEntryModal();
});

document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === 's') { e.preventDefault(); finishTrip(); }
    if (e.key === 'Escape') closeEntryModal();
});

// Init if we are on the planner page
if (document.getElementById('calculationFormPage')) {
    document.addEventListener('DOMContentLoaded', initializeCalculator);
}

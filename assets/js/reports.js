// JS for calculations.php (Report View)

let savedCalculations = JSON.parse(localStorage.getItem('savedCalculations')) || [];

function initializeReports() {
    checkLoginStatus();
    renderCalculations();
    updateStats();
    initReportEventListeners();
}

function initReportEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            renderCalculations(e.target.value);
        });
    }

    const filterBtn = document.getElementById('filterBtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function () {
            showToast('Filter functionality coming soon!', 'info');
        });
    }

    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    const detailModal = document.getElementById('detailModal');
    if (detailModal) {
        detailModal.addEventListener('click', function (e) {
            if (e.target === this) closeModal();
        });
    }
}

function renderCalculations(filter = '') {
    const container = document.getElementById('calculationsList');
    const emptyState = document.getElementById('emptyState');
    const table = document.getElementById('calculationsTable');
    if (!container || !emptyState || !table) return;

    if (savedCalculations.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        table.classList.add('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    table.classList.remove('hidden');

    let filtered = savedCalculations;
    if (filter) {
        const searchTerm = filter.toLowerCase();
        filtered = savedCalculations.filter(calc =>
            calc.customerName.toLowerCase().includes(searchTerm) ||
            calc.customerPhone.includes(searchTerm) ||
            calc.date.toLowerCase().includes(searchTerm)
        );
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-light);">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <div style="font-size: 1.125rem; font-weight: 600;">No matching calculations found</div>
                </td>
            </tr>
        `;
        return;
    }

    container.innerHTML = filtered.map((calc, index) => {
        const dateObj = new Date(calc.date);
        const dateStr = dateObj.toLocaleDateString();
        const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const initial = calc.customerName.charAt(0).toUpperCase();

        return `
            <tr>
                <td>
                    <div style="font-weight: 600;">${dateStr}</div>
                    <div style="font-size: 12px; color: var(--text-light);">${timeStr}</div>
                </td>
                <td>
                    <div class="customer-cell">
                        <div class="customer-avatar">${initial}</div>
                        <div class="customer-info">
                            <div class="customer-name">${calc.customerName}</div>
                            <div class="customer-phone">${calc.customerPhone}</div>
                        </div>
                    </div>
                </td>
                <td><div style="font-weight: 600; color: var(--primary);">${calc.numDays || '-'} days</div></td>
                <td><div class="items-badge"><i class="fas fa-list"></i> ${calc.items?.length || 0} items</div></td>
                <td><span class="status-badge status-completed"><i class="fas fa-check-circle"></i> Completed</span></td>
                <td><div class="total-amount">₹${(calc.grandTotal || 0).toFixed(2)}</div></td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-primary btn-sm" onclick="viewCalculation('${calc.id || index}')" title="View Details"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-warning btn-sm" onclick="editCalculation('${calc.id || index}')" title="Edit Trip"><i class="fas fa-pencil-alt"></i></button>
                        <button class="btn btn-secondary btn-sm" onclick="downloadPDF('${calc.id || index}')" title="Download PDF"><i class="fas fa-download"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCalculation('${calc.id || index}')" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function updateStats() {
    const totalCalc = savedCalculations.length;
    const totalRev = savedCalculations.reduce((sum, c) => sum + (c.grandTotal || 0), 0);
    const totalDays = savedCalculations.reduce((sum, c) => sum + (c.numDays || 0), 0);
    const avgDays = totalCalc > 0 ? Math.round(totalDays / totalCalc) : 0;

    const elTotal = document.getElementById('totalCalculations');
    const elRevenue = document.getElementById('totalRevenue');
    const elAvgDays = document.getElementById('avgDays');
    if (elTotal) elTotal.textContent = totalCalc;
    if (elRevenue) elRevenue.textContent = `₹${totalRev.toFixed(2)}`;
    if (elAvgDays) elAvgDays.textContent = avgDays;
}

function viewCalculation(id) {
    const calc = savedCalculations.find(c => String(c.id) === String(id));
    if (!calc) {
        showToast('Calculation not found', 'error');
        return;
    }

    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    const title = document.getElementById('modalCustomerName');

    if (title) title.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <span>${calc.customerName}'s Trip Details</span>
            <button class="btn btn-warning btn-sm" onclick="editCalculation('${calc.id || id}')" style="margin-right: 40px;">
                <i class="fas fa-pencil-alt"></i> Edit Trip
            </button>
        </div>
    `;

    let html = `<div id="pdfContent">`;
    // ... Customer info and items summary (standardized)
    html += `
        <div style="background: var(--light); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 2rem; border: 1px solid var(--border);">
            <h3 style="margin-bottom: 1rem; color: var(--primary);"><i class="fas fa-user-circle"></i> Customer Info</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                <div><div style="font-size: 12px; color: var(--text-light);">Name</div><div style="font-weight: 600;">${calc.customerName}</div></div>
                <div><div style="font-size: 12px; color: var(--text-light);">Phone</div><div style="font-weight: 600;">${calc.customerPhone}</div></div>
                <div><div style="font-size: 12px; color: var(--text-light);">Duration</div><div style="font-weight: 600; color: var(--primary);">${calc.numDays} days</div></div>
                <div><div style="font-size: 12px; color: var(--text-light);">Date</div><div style="font-weight: 600;">${calc.date}</div></div>
            </div>
        </div>
    `;

    const itemsByDay = calc.dayWiseData || {};
    for (let day = 1; day <= (calc.numDays || 0); day++) {
        const items = itemsByDay[day] || [];
        if (items.length === 0) continue;
        const dayTotal = items.reduce((sum, i) => sum + parseFloat(i.total || 0), 0);

        html += `
            <div class="day-group">
                <div class="day-header"><div class="day-title">Day ${day}</div><div class="day-total">₹${dayTotal.toFixed(2)}</div></div>
                <table class="day-table">
                    <thead><tr><th>Type</th><th>Details</th><th style="text-align: right;">Amount</th></tr></thead>
                    <tbody>
                        ${items.map(item => `
                            <tr>
                                <td>${getItemIcon(item.type)} ${item.type}</td>
                                <td><div style="font-weight: 600;">${getItemTitle(item)}</div><div style="font-size: 12px; color: var(--text-light);">${getItemSubtitle(item)}</div></td>
                                <td style="text-align: right; font-weight: 700; color: var(--success);">₹${item.total}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    html += `<div class="grand-total"><div class="grand-total-label">Grand Total</div><div class="grand-total-value">₹${(calc.grandTotal || 0).toFixed(2)}</div></div></div>`;
    if (modalBody) modalBody.innerHTML = html;
    if (modal) modal.classList.add('active');
}

function downloadPDF(id) {
    const calc = savedCalculations.find(c => String(c.id) === String(id));
    if (!calc) {
        showToast('Calculation not found', 'error');
        return;
    }

    showToast('Generating PDF...', 'info');
    const tempDiv = document.createElement('div');
    tempDiv.style.padding = '20px';
    tempDiv.innerHTML = `
        <h1 style="color: #2563eb; text-align: center;">Trip Calculation Report</h1>
        <hr>
        <h3>Customer: ${calc.customerName} (${calc.customerPhone})</h3>
        <p>Date: ${calc.date} | Duration: ${calc.numDays} days</p>
        <hr>
        ${Object.entries(calc.dayWiseData || {}).map(([day, items]) => `
            <h4>Day ${day}</h4>
            <ul>${items.map(i => `<li>${getItemTitle(i)}: ₹${i.total}</li>`).join('')}</ul>
        `).join('')}
        <h2 style="text-align: right;">Grand Total: ₹${calc.grandTotal.toFixed(2)}</h2>
    `;

    const opt = { margin: 1, filename: `Trip_${calc.customerName}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
    html2pdf().set(opt).from(tempDiv).save().then(() => showToast('PDF Saved!', 'success'));
}

function deleteCalculation(id) {
    if (!confirm('Delete this record?')) return;
    savedCalculations = savedCalculations.filter(c => String(c.id) !== String(id));
    localStorage.setItem('savedCalculations', JSON.stringify(savedCalculations));
    renderCalculations();
    updateStats();
    showToast('Deleted', 'success');
}

function editCalculation(id) {
    window.location.href = `index.php?edit=${id}`;
}

function closeModal() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.classList.remove('active');
}

// Helpers from calculator.js used here too
function getItemIcon(type) { const icons = { vehicle: '🚗', hotel: '🏨', activity: '🎯', cruise: '🚢' }; return icons[type] || '📝'; }
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
        case 'activity': return `${item.location || ''} • ${item.adults || item.persons}A, ${(item.child612 || 0) + (item.child25 || 0)}C`;
        case 'cruise': return `${item.service || ''} • ${item.duration || ''}m • ${item.adults || item.persons}A, ${(item.child312 || 0) + (item.child12 || 0)}C`;
        default: return '';
    }
}

if (document.getElementById('calculationsList')) {
    document.addEventListener('DOMContentLoaded', initializeReports);
}

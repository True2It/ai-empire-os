// Monetize Empire OS - Command Center Logic

// Sample leads data (in production, this would come from the backend)
const leadsData = [
    {
        id: 1,
        title: "$149 for 2 hrs 2 Movers + Truck SameDay Moving",
        city: "Atlanta, GA",
        serviceType: "Moving",
        status: "new",
        url: "https://atlanta.craigslist.org/atl/lbs/d/atlanta-149for-hrs-moverstruck-sameday/7930713862.html"
    },
    {
        id: 2,
        title: "Low Cost Mechanic/Roadside/Diagnostics",
        city: "Atlanta, GA",
        serviceType: "Roadside",
        status: "contacted",
        url: "https://atlanta.craigslist.org/atl/aos/d/smyrna-low-cost-mechanic-roadside/7930712566.html"
    },
    {
        id: 3,
        title: "Professional Movers - Same Day Service Available",
        city: "Houston, TX",
        serviceType: "Moving",
        status: "new",
        url: "https://houston.craigslist.org/lbs/d/houston-professional-movers"
    },
    {
        id: 4,
        title: "24/7 Roadside Assistance & Towing",
        city: "Houston, TX",
        serviceType: "Roadside",
        status: "qualified",
        url: "https://houston.craigslist.org/aos/d/houston-24-7-roadside"
    },
    {
        id: 5,
        title: "Junk Removal & Furniture Delivery - Houston Area",
        city: "Houston, TX",
        serviceType: "Delivery",
        status: "new",
        url: "https://houston.craigslist.org/lbs/d/houston-junk-removal"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    populateLeadsTable();
    setupEventListeners();
    loadDashboard();
});

// Initialize navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link and corresponding section
            this.classList.add('active');
            const sectionId = this.getAttribute('href').substring(1);
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// Populate leads table
function populateLeadsTable() {
    const tbody = document.getElementById('leads-tbody');
    tbody.innerHTML = '';

    leadsData.forEach(lead => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="${lead.url}" target="_blank">${lead.title}</a></td>
            <td>${lead.city}</td>
            <td>${lead.serviceType}</td>
            <td><span class="status-badge status-${lead.status}">${lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</span></td>
            <td>
                <button class="btn btn-small" onclick="contactLead(${lead.id})">Contact</button>
                <button class="btn btn-small" onclick="updateStatus(${lead.id})">Update</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Contact lead function
function contactLead(leadId) {
    const lead = leadsData.find(l => l.id === leadId);
    if (lead) {
        console.log(`Contacting lead: ${lead.title}`);
        // Send automated email/SMS via backend
        alert(`Outreach message sent to: ${lead.title}`);
        lead.status = 'contacted';
        populateLeadsTable();
    }
}

// Update lead status
function updateStatus(leadId) {
    const lead = leadsData.find(l => l.id === leadId);
    if (lead) {
        const statuses = ['new', 'contacted', 'qualified', 'closed'];
        const currentIndex = statuses.indexOf(lead.status);
        lead.status = statuses[(currentIndex + 1) % statuses.length];
        populateLeadsTable();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Filter leads by city
    const cityFilter = document.getElementById('city-filter');
    if (cityFilter) {
        cityFilter.addEventListener('change', filterLeads);
    }

    // Filter leads by status
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterLeads);
    }

    // Quick action buttons
    const buttons = document.querySelectorAll('.quick-actions button');
    buttons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            handleQuickAction(index);
        });
    });
}

// Filter leads
function filterLeads() {
    const cityFilter = document.getElementById('city-filter').value;
    const statusFilter = document.getElementById('status-filter').value;

    const filteredLeads = leadsData.filter(lead => {
        const cityMatch = cityFilter === 'all' || 
                         (cityFilter === 'atlanta' && lead.city.includes('Atlanta')) ||
                         (cityFilter === 'houston' && lead.city.includes('Houston'));
        const statusMatch = statusFilter === 'all' || lead.status === statusFilter;
        return cityMatch && statusMatch;
    });

    const tbody = document.getElementById('leads-tbody');
    tbody.innerHTML = '';

    filteredLeads.forEach(lead => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="${lead.url}" target="_blank">${lead.title}</a></td>
            <td>${lead.city}</td>
            <td>${lead.serviceType}</td>
            <td><span class="status-badge status-${lead.status}">${lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</span></td>
            <td>
                <button class="btn btn-small" onclick="contactLead(${lead.id})">Contact</button>
                <button class="btn btn-small" onclick="updateStatus(${lead.id})">Update</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Handle quick actions
function handleQuickAction(index) {
    const actions = [
        'Generate New Leads',
        'Send Outreach',
        'Post Content',
        'View Reports'
    ];

    console.log(`Executing action: ${actions[index]}`);
    alert(`Action executed: ${actions[index]}`);

    // Simulate action execution
    if (index === 0) {
        // Generate new leads
        console.log('Generating new leads from Craigslist...');
    } else if (index === 1) {
        // Send outreach
        console.log('Sending automated outreach messages...');
    } else if (index === 2) {
        // Post content
        console.log('Posting viral content to social media...');
    } else if (index === 3) {
        // View reports
        console.log('Generating performance reports...');
    }
}

// Load dashboard data
function loadDashboard() {
    // Calculate metrics
    const totalLeads = leadsData.length;
    const atlantaLeads = leadsData.filter(l => l.city.includes('Atlanta')).length;
    const houstonLeads = leadsData.filter(l => l.city.includes('Houston')).length;

    console.log(`Dashboard loaded: ${totalLeads} total leads (Atlanta: ${atlantaLeads}, Houston: ${houstonLeads})`);
}

// Export functions for external use
window.contactLead = contactLead;
window.updateStatus = updateStatus;
window.handleQuickAction = handleQuickAction;

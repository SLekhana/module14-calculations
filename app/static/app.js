let token = localStorage.getItem('token');
let currentUser = null;

// DOM Elements
const authSection = document.getElementById('authSection');
const userSection = document.getElementById('userSection');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const calculationForm = document.getElementById('calculationForm');
const calculationsList = document.getElementById('calculationsList');
const messageDiv = document.getElementById('message');
const userInfoSpan = document.getElementById('userInfo');
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');
const logoutBtn = document.getElementById('logoutBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (token) {
        showUserSection();
        loadCalculations();
    } else {
        showAuthSection();
    }
});

// Show/Hide sections
function showAuthSection() {
    authSection.classList.remove('hidden');
    userSection.classList.add('hidden');
}

function showUserSection() {
    authSection.classList.add('hidden');
    userSection.classList.remove('hidden');
}

// Toggle between login and register
showRegisterBtn.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

showLoginBtn.addEventListener('click', () => {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Show message
function showMessage(message, isError = false) {
    messageDiv.textContent = message;
    messageDiv.className = isError ? 'alert alert-error' : 'alert alert-success';
    messageDiv.classList.remove('hidden');
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}

// Register
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Registration successful! Please login.');
            registerForm.reset();
            showLoginBtn.click();
        } else {
            showMessage(data.detail || 'Registration failed', true);
        }
    } catch (error) {
        showMessage('Network error occurred', true);
    }
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            token = data.access_token;
            localStorage.setItem('token', token);
            currentUser = username;
            userInfoSpan.textContent = username;
            showMessage('Login successful!');
            loginForm.reset();
            showUserSection();
            loadCalculations();
        } else {
            showMessage(data.detail || 'Login failed', true);
        }
    } catch (error) {
        showMessage('Network error occurred', true);
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    token = null;
    currentUser = null;
    localStorage.removeItem('token');
    calculationsList.innerHTML = '';
    showMessage('Logged out successfully');
    showAuthSection();
});

// Load calculations
async function loadCalculations() {
    try {
        const response = await fetch('/calculations', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const calculations = await response.json();
            displayCalculations(calculations);
        } else if (response.status === 401) {
            showMessage('Session expired. Please login again.', true);
            logoutBtn.click();
        } else {
            showMessage('Failed to load calculations', true);
        }
    } catch (error) {
        showMessage('Network error occurred', true);
    }
}

// Display calculations
function displayCalculations(calculations) {
    if (calculations.length === 0) {
        calculationsList.innerHTML = '<p style="text-align: center; color: #6c757d;">No calculations yet. Create your first one!</p>';
        return;
    }

    calculationsList.innerHTML = calculations.map(calc => `
        <div class="calculation-card" data-id="${calc.id}">
            <h3>${calc.operation.toUpperCase()}</h3>
            <div class="calculation-info">
                <strong>Expression:</strong> ${calc.operand1} ${getOperatorSymbol(calc.operation)} ${calc.operand2} = ${calc.result}
            </div>
            <div class="calculation-info">
                <strong>Date:</strong> ${new Date(calc.created_at).toLocaleString()}
            </div>
            <div class="calculation-actions">
                <button onclick="editCalculation(${calc.id})" class="secondary">Edit</button>
                <button onclick="deleteCalculation(${calc.id})" class="danger">Delete</button>
            </div>
        </div>
    `).join('');
}

function getOperatorSymbol(operation) {
    const symbols = {
        'add': '+',
        'subtract': '-',
        'multiply': '×',
        'divide': '÷'
    };
    return symbols[operation] || operation;
}

// Create calculation
calculationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const operation = document.getElementById('operation').value;
    const operand1 = parseFloat(document.getElementById('operand1').value);
    const operand2 = parseFloat(document.getElementById('operand2').value);

    if (operation === 'divide' && operand2 === 0) {
        showMessage('Cannot divide by zero!', true);
        return;
    }

    try {
        const response = await fetch('/calculations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ operation, operand1, operand2 })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Calculation created successfully!');
            calculationForm.reset();
            loadCalculations();
        } else {
            showMessage(data.detail || 'Failed to create calculation', true);
        }
    } catch (error) {
        showMessage('Network error occurred', true);
    }
});

// Edit calculation
async function editCalculation(id) {
    const newOperand1 = prompt('Enter new first operand:');
    const newOperand2 = prompt('Enter new second operand:');
    const newOperation = prompt('Enter new operation (add/subtract/multiply/divide):');

    if (!newOperand1 || !newOperand2 || !newOperation) {
        return;
    }

    try {
        const response = await fetch(`/calculations/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                operation: newOperation,
                operand1: parseFloat(newOperand1),
                operand2: parseFloat(newOperand2)
            })
        });

        if (response.ok) {
            showMessage('Calculation updated successfully!');
            loadCalculations();
        } else {
            const data = await response.json();
            showMessage(data.detail || 'Failed to update calculation', true);
        }
    } catch (error) {
        showMessage('Network error occurred', true);
    }
}

// Delete calculation
async function deleteCalculation(id) {
    if (!confirm('Are you sure you want to delete this calculation?')) {
        return;
    }

    try {
        const response = await fetch(`/calculations/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok || response.status === 204) {
            showMessage('Calculation deleted successfully!');
            loadCalculations();
        } else {
            showMessage('Failed to delete calculation', true);
        }
    } catch (error) {
        showMessage('Network error occurred', true);
    }
}

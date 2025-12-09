const { test, expect } = require('@playwright/test');

function generateUsername() {
    return `testuser_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

test.describe('Authentication Tests', () => {
    test('should register a new user successfully', async ({ page }) => {
        await page.goto('/');
        await page.click('#showRegister');
        
        const username = generateUsername();
        await page.fill('#regUsername', username);
        await page.fill('#regEmail', `${username}@test.com`);
        await page.fill('#regPassword', 'password123');
        await page.click('#registerForm button[type="submit"]');
        
        await expect(page.locator('.alert-success')).toBeVisible({ timeout: 5000 });
        await expect(page.locator('.alert-success')).toContainText('Registration successful');
    });

    test('should login successfully', async ({ page }) => {
        await page.goto('/');
        
        const username = generateUsername();
        await page.click('#showRegister');
        await page.fill('#regUsername', username);
        await page.fill('#regEmail', `${username}@test.com`);
        await page.fill('#regPassword', 'password123');
        await page.click('#registerForm button[type="submit"]');
        await expect(page.locator('.alert-success')).toBeVisible({ timeout: 5000 });
        
        await page.click('#showLogin');
        await page.fill('#loginUsername', username);
        await page.fill('#loginPassword', 'password123');
        await page.click('#loginForm button[type="submit"]');
        
        await expect(page.locator('.alert-success')).toContainText('Login successful');
        await expect(page.locator('#userInfo')).toContainText(username);
    });
});

test.describe('BREAD Operations Tests', () => {
    let username;

    test.beforeEach(async ({ page }) => {
        username = generateUsername();
        await page.goto('/');
        
        await page.click('#showRegister');
        await page.fill('#regUsername', username);
        await page.fill('#regEmail', `${username}@test.com`);
        await page.fill('#regPassword', 'password123');
        await page.click('#registerForm button[type="submit"]');
        await expect(page.locator('.alert-success')).toBeVisible({ timeout: 5000 });
        
        await page.click('#showLogin');
        await page.fill('#loginUsername', username);
        await page.fill('#loginPassword', 'password123');
        await page.click('#loginForm button[type="submit"]');
        await expect(page.locator('#userInfo')).toContainText(username);
    });

    test('should create a calculation (Add)', async ({ page }) => {
        await page.selectOption('#operation', 'add');
        await page.fill('#operand1', '10');
        await page.fill('#operand2', '5');
        await page.click('#calculationForm button[type="submit"]');
        
        await expect(page.locator('.alert-success')).toContainText('created successfully');
        await expect(page.locator('.calculation-card')).toBeVisible();
        await expect(page.locator('.calculation-card')).toContainText('10 + 5 = 15');
    });

    test('should delete a calculation', async ({ page }) => {
        await page.selectOption('#operation', 'add');
        await page.fill('#operand1', '10');
        await page.fill('#operand2', '5');
        await page.click('#calculationForm button[type="submit"]');
        await expect(page.locator('.calculation-card')).toBeVisible();
        
        page.on('dialog', dialog => dialog.accept());
        await page.click('.calculation-card button.danger');
        
        await expect(page.locator('.alert-success')).toContainText('deleted successfully');
    });
});

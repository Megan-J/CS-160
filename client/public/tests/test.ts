import { test, expect } from '@playwright/test';

test('basic loading', async ({ page }) => {
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await expect(page.getByText('Welcome')).toBeVisible();
  await expect(page.getByText('Home')).toBeVisible();
  await expect(page.getByText('Stores')).toBeVisible();
  await expect(page.getByText('Create account')).toBeVisible();
  await expect(page.getByText('Sign In')).toBeVisible();
  await expect(page.getByText('Discover new songs')).toBeVisible();
  await expect(page.getByText('Trending products')).toBeVisible();
});

test('unsuccessful login', async ({ page }) => {
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });

    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');

    await page.click('text=Login');

    expect(page.url()).toBe('http://localhost:3000/login');
});

test('successful login', async ({ page }) => {
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });

  await page.fill('input[name="email"]', 'tyler@example.com');
  await page.fill('input[name="password"]', 'password123');

  await page.click('text=Login');

  expect(page.url()).toBe('http://localhost:3000/');
});


import { test, expect } from '@playwright/test';

test('homepage navigation', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    await page.click('a[href="/stores"]');
    
    expect(page.url()).toBe('http://localhost:3000/stores');
});

test('homepage title', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const title = await page.title();
    expect(title).toBe('Welcome');
});

test('homepage content', async ({ page }) => {
    await page.goto('http://localhost:3000');
  
    expect(await page.isVisible('h1')).toBeTruthy();
    expect(await page.isVisible('p')).toBeTruthy();
    expect(await page.isVisible('button')).toBeTruthy();
});


test('successful sign up', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');

    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'password123');

    await page.click('text=Sign Up');

    await page.waitForNavigation();
    expect(page.url()).toBe('http://localhost:3000/dashboard');
});

test('invalid sign up (existing email)', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');

    await page.fill('input[name="username"]', 'existinguser');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');

    await page.click('text=Sign Up');

    const errorMessage = await page.textContent('.error-message');
    expect(errorMessage).toContain('Username already taken. Please try another.');
});

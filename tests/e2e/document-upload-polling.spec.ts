import { test, expect } from '@playwright/test'

test('Document upload polling shows “Verified”', async ({ page }) => {
  // Intercept upload to return a fake ID
  await page.route('**/api/documents/upload', route =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({ documentId: 'abcd-1234-efgh-5678', status: 'processing' }),
    })
  )

  // Intercept status endpoint: first "processing", then "verified"
  let calls = 0
  await page.route('**/api/documents/abcd-1234-efgh-5678', route => {
    calls += 1
    const status = calls > 1 ? 'verified' : 'processing'
    route.fulfill({
      status: 200,
      body: JSON.stringify({ documentId: 'abcd-1234-efgh-5678', status }),
    })
  })

  // Navigate to KYC page
  await page.goto('/kyc')

  // Upload sample PDF fixture
  await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample.pdf')

  // Click upload
  await page.click('button:has-text("Upload All")')

  // Expect Processing badge
  await expect(page.locator('text=Processing…')).toBeVisible()

  // Then expect Verified badge
  await expect(page.locator('text=Verified')).toBeVisible({ timeout: 6000 })
})

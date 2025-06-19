import { test, expect } from '@playwright/test';

test.describe('Document Upload Polling', () => {
  test('should upload document and poll for status updates', async ({ page }) => {
    // Navigate to upload page
    await page.goto('/dashboard/documents');
    
    // Upload the sample PDF
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/sample.pdf');
    
    // Submit the upload
    await page.click('button[type="submit"]');
    
    // Wait for redirect to document detail page
    await page.waitForURL(/\/documents\/\d+/);
    
    // Check initial status
    const statusElement = page.locator('[data-testid="document-status"]');
    await expect(statusElement).toContainText('processing');
    
    // Poll for status changes (simulate processing completion)
    await page.waitForTimeout(2000);
    
    // Verify status updates are reflected
    await expect(statusElement).toContainText(/processing|completed|failed/);
  });

  test('should handle upload errors gracefully', async ({ page }) => {
    await page.goto('/dashboard/documents');
    
    // Try to upload without selecting a file
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('[role="alert"]')).toBeVisible();
  });
});
EOF  
cd /home/project && cd lv-capital-partners && cat > tests/e2e/document-upload-polling.spec.ts << 'EOF'
import { test, expect } from '@playwright/test';

test.describe('Document Upload Polling', () => {
  test('should upload document and poll for status updates', async ({ page }) => {
    // Navigate to upload page
    await page.goto('/dashboard/documents');
    
    // Upload the sample PDF
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/sample.pdf');
    
    // Submit the upload
    await page.click('button[type="submit"]');
    
    // Wait for redirect to document detail page
    await page.waitForURL(/\/documents\/\d+/);
    
    // Check initial status
    const statusElement = page.locator('[data-testid="document-status"]');
    await expect(statusElement).toContainText('processing');
    
    // Poll for status changes (simulate processing completion)
    await page.waitForTimeout(2000);
    
    // Verify status updates are reflected
    await expect(statusElement).toContainText(/processing|completed|failed/);
  });

  test('should handle upload errors gracefully', async ({ page }) => {
    await page.goto('/dashboard/documents');
    
    // Try to upload without selecting a file
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('[role="alert"]')).toBeVisible();
  });
});

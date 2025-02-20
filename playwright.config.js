// @ts-check
import { defineConfig, devices } from '@playwright/test';



/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  timeout: 40 * 1000, //40secs for one test, 30 is by default
  expect: {
    timeout: 5000 //for assertions
  },
  reporter: 'html',
  use: {
     browserName: 'chromium',
     headless: false,
  },



});


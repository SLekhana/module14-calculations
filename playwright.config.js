module.exports = {
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:8000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'uvicorn app.main:app --host 0.0.0.0 --port 8000',
    port: 8000,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
};

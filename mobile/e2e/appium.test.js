const wdio = require("webdriverio");
const assert = require("assert");

const opts = {
  path: '/wd/hub',
  port: 4723,
  capabilities: {
    platformName: "Android",
    "appium:automationName": "UiAutomator2",
    "appium:app": "path/to/your/app.apk",
  }
};

async function main () {
  const client = await wdio.remote(opts);

  // Find the email input field
  const emailInput = await client.$('android=new UiSelector().text("Email Address")');
  await emailInput.setValue("test@example.com");

  // Find password field
  const passwordInput = await client.$('android=new UiSelector().text("Password")');
  await passwordInput.setValue("password123");

  // Click login
  const loginButton = await client.$('android=new UiSelector().text("Sign In")');
  await loginButton.click();

  console.log("✅ Appium E2E Login test executed");

  await client.deleteSession();
}

main();

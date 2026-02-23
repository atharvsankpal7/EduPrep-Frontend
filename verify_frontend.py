from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    print("Navigating to home page (which now renders TestInterface)...")
    page.goto("http://localhost:3000")

    try:
        # Wait for WarningModal (Start Test)
        print("Waiting for Start Test button...")
        try:
            start_btn = page.wait_for_selector("button:has-text('Start Test')", timeout=5000)
            print("Start Test button found. Clicking...")
            start_btn.click()
        except:
            print("Start Test button not found (might be already started?)")
            page.screenshot(path="debug_start.png")

        # Now wait for test interface main container
        page.wait_for_selector(".test-interface-theme", timeout=10000)
        print("Test interface loaded")

        # Check if timer is visible
        try:
            if page.get_by_text("Time Remaining").is_visible() or page.get_by_text("Time").is_visible():
                 print("Timer is visible")
            else:
                 print("Timer not immediately visible")
        except:
            pass

        # Interact with questions to check stability
        print("Clicking an option...")
        page.get_by_text("Yes").click()
        time.sleep(1)

        print("Navigating to next question...")
        page.get_by_role("button", name="Next").click()
        time.sleep(1)

        # Take screenshot
        page.screenshot(path="test_interface_success.png")
        print("Final screenshot taken")

    except Exception as e:
        print(f"Failed: {e}")
        page.screenshot(path="error_home.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

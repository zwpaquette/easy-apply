from playwright.sync_api import sync_playwright
from time import sleep

def run(playwright):
    user_data_dir = "/Users/annanapolitano/Library/Application Support/Google/Chrome/Default"

    # Launch the browser with the specified user profile
    browser = playwright.chromium.launch_persistent_context(user_data_dir, headless=True)

    # Open a new page
    page = browser.new_page()


    # Go to linkedin.com
    page.goto("https://www.linkedin.com/jobs")

    # Click on the email/phone field and type the email/phone information
    # page.fill('input[name="session_key"]', 'zack.paquette@gmail.com')

    # # Click on the password field and type the password information
    # page.fill('input[name="session_password"]', 'Jackthomas1')

    # # Click on the sign in button
    # sign_in_button_selector = 'button[data-id="sign-in-form__submit-btn"]'
    # page.click(sign_in_button_selector)
    sleep(10)
    # Take a screenshot
    page.screenshot(path='screenshot2.png')

    print('trying now')
    input_selector = '.jobs-search-box__text-input.jobs-search-box__keyboard-text-input.jobs-search-box__ghost-text-input[aria-label="Search by title, skill, or company"]'

    # Ensure the element is loaded
    #page.wait_for_selector(input_selector)

    # Optional: Check if the input is disabled, and if so, enable it via JavaScript
    is_disabled = page.evaluate(f"document.querySelector('{input_selector}').disabled")
    #if is_disabled:
    #    page.evaluate(f"document.querySelector('{input_selector}').disabled = false")
    print(f"disabled: {is_disabled}")
    # Fill the input field with text
    page.fill(input_selector, 'Software Engineer')  # Replace 'Software Engineer' with the desired text

    #page.fill('input[title="Search by title, skill, or company"]', 'Jackthomas1')
    # Ensure the element is loaded
   
    # Type something into the input field
    sleep(10)

    # You can add more code here to interact with the page post-login
    # ...

    # Close the browser
    browser.close()

with sync_playwright() as playwright:
    run(playwright)

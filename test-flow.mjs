import { chromium } from "playwright"

const BASE = "http://localhost:3000"

async function run() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("[browser error]", msg.text())
  })

  try {
    // 1. Navigate to home
    console.log("1. Navigate to home...")
    await page.goto(`${BASE}/en`, { waitUntil: "networkidle" })
    await page.screenshot({ path: "test-01-home.png" })
    console.log("   OK - home loaded")

    // 2. Enter business idea
    console.log("2. Enter business idea...")
    const textarea = page.locator("textarea").first()
    await textarea.waitFor({ state: "visible", timeout: 5000 })
    await textarea.fill("AI-powered platform for automating business document analysis and insights")
    await page.screenshot({ path: "test-02-idea-entered.png" })
    console.log("   OK - idea entered")

    // 3. Submit
    console.log("3. Submit idea...")
    const submitBtn = page.locator("button[type=submit]").first()
    await submitBtn.waitFor({ state: "visible", timeout: 5000 })
    await submitBtn.click()
    await page.screenshot({ path: "test-03-submitted.png" })
    console.log("   OK - submitted")

    // 4. Wait for generation to complete (look for model cards)
    console.log("4. Waiting for generation (up to 60s)...")
    // The generation shows "analyzing" -> "structuring" -> "generating_models" -> model selection
    await page.waitForFunction(() => {
      const text = document.body.innerText
      return text.includes("B2B") || text.includes("Marketplace") || text.includes("Advisory") ||
             text.includes("Вибрати") || text.includes("Choose") || text.includes("Select")
    }, { timeout: 60000 })
    await page.screenshot({ path: "test-04-models-ready.png" })
    console.log("   OK - models appeared")

    // 5. Select first model
    console.log("5. Selecting first model...")
    // Look for a "Choose" / "Вибрати" button or a card with a select action
    const modelBtn = page.locator("button").filter({ hasText: /вибрати|choose|select/i }).first()
    const modelBtnCount = await modelBtn.count()
    if (modelBtnCount > 0) {
      await modelBtn.click()
    } else {
      // fallback: click first model card
      await page.locator("[data-model-id], [class*='model']").first().click()
    }
    await page.screenshot({ path: "test-05-model-selected.png" })
    console.log("   OK - model selected")

    // 6. Wait for project workspace to load
    console.log("6. Waiting for project workspace...")
    await page.waitForFunction(() => {
      const text = document.body.innerText
      return (text.includes("Empathy") || text.includes("Емпатія") || text.includes("Hypothesis") || text.includes("Гіпотез")) &&
             !text.includes("generating") && !text.includes("аналіз")
    }, { timeout: 15000 })
    await page.screenshot({ path: "test-06-workspace.png" })
    console.log("   OK - workspace loaded")

    // 7. Check which tabs/sections are visible
    const bodyText = await page.evaluate(() => document.body.innerText)
    console.log("   Visible sections:",
      ["Empathy", "Scenario", "Hypothesis", "Canvas", "Pitch", "Емпатія", "Сценарій", "Гіпотез", "Канвас", "Пітч"]
        .filter(s => bodyText.includes(s))
    )

    // 8. Try to edit text in Empathy Map
    console.log("7. Testing text editing in Empathy Map...")
    // Look for editable text areas or contenteditable elements in the empathy section
    const editableElements = page.locator("[contenteditable='true'], textarea").filter({ hasText: /.+/ })
    const editCount = await editableElements.count()
    console.log(`   Found ${editCount} editable elements`)

    if (editCount > 0) {
      const firstEditable = editableElements.first()
      await firstEditable.click({ clickCount: 3 }) // select all
      const originalText = await firstEditable.inputValue().catch(() => firstEditable.textContent())
      console.log("   Original text:", String(originalText).slice(0, 60))
      await firstEditable.fill("Edited text for testing purposes")
      await page.screenshot({ path: "test-07-editing.png" })
      console.log("   OK - text edited")

      // Look for save button
      const saveBtn = page.locator("button").filter({ hasText: /зберег|save/i }).first()
      const saveBtnCount = await saveBtn.count()
      if (saveBtnCount > 0) {
        await saveBtn.click()
        console.log("   OK - save clicked")
        await page.screenshot({ path: "test-08-saved.png" })
      } else {
        console.log("   NOTE: no save button found (may auto-save)")
      }
    } else {
      console.log("   NOTE: no editable elements found directly, checking for edit buttons...")
      const editBtns = page.locator("button").filter({ hasText: /редаг|edit/i })
      const editBtnCount = await editBtns.count()
      console.log(`   Found ${editBtnCount} edit buttons`)
      if (editBtnCount > 0) {
        await editBtns.first().click()
        await page.screenshot({ path: "test-07-edit-clicked.png" })
      }
    }

    console.log("\n✅ Full flow test PASSED")
  } catch (err) {
    console.error("\n❌ Test FAILED:", err.message)
    await page.screenshot({ path: "test-FAILED.png" })
    process.exit(1)
  } finally {
    await browser.close()
  }
}

run()

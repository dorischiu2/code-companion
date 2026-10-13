// Every Python mission: wrong attempt (tutor must react) then correct answer; plus Show-me and Next-unlock checks.
export default async function (page, ok) {
  const PLAN = {
    "py-print": [["print('Hello, Python!')x", 'print("Hello, Python!")'], ['print("Hello, Python!")', 'print("Doris")'], ['print("one")', 'print("a")\nprint("b")\nprint("c")']],
    "py-vars": [["coins = ", 'name = "Alexa"\ncoins = 5\nprint(name, "has", coins, "coins")'],
      ['name = "Alexa"\ncoins = 5\nprint(name, "has", coins, "coins")\ncoins = coins + 10', 'name = "Alexa"\ncoins = 5\ncoins += 10\nprint(name + " has " + str(coins) + " coins")'],
      ['name = "Alexa"\ncoins = 15\nlevel = 3\nprint(coins)', 'Level = 3\nprint(f"Level: {Level}")']],
    "py-if": [["if True\n    print(1)", 'password = "dragon"\nif password == "dragon":\n    print("Door opens!")'],
      ['password = "dragon"\nif password == "dragon":\n    print("Door opens!")', 'password = "cat"\nif password == "dragon":\n    print("Door opens!")\nelse:\n    print("WRONG PASSWORD")'],
      ['age = "11"\nprint("Kid!")', 'age = 14\nif age >= 13:\n    print("teen!")\nelse:\n    print("kid!")']],
    "py-loop": [["for i in range(3)\n    print(i)", 'for i in range(3):\n    print("yay")'],
      ['for n in range(10, -1, -1):\n    print(n)\nprint("Liftoff!")', 'n = 10\nwhile n > 0:\n    print(n)\n    n -= 1\nprint("LIFTOFF!")']],
    "py-func": [['def greet(name):\n    print("Hi", name)\ngreet("Byte")', 'def greet(name):\n    print("Hi", name)\ngreet("Byte")\ngreet("Sam")'],
      ['def double(n):\n    print(n * 2)\ndouble(21)', 'def double(n):\n    return n * 2\nprint(double(21))']]
  };
  await page.evaluate(() => startMission("py-print"));
  await page.waitForFunction(() => /ready/.test(document.querySelector(".cw-status").textContent), null, { timeout: 90000 });
  for (const [id, steps] of Object.entries(PLAN)) {
    await page.evaluate((id) => startMission(id), id);
    await page.waitForTimeout(300);
    let good = true, note = "";
    for (let i = 0; i < steps.length; i++) {
      const [wrong, right] = steps[i];
      const before = await page.textContent("#bubble");
      await page.fill(".st-ta", wrong); await page.click(".cw-run"); await page.waitForTimeout(1200);
      const r = await page.evaluate(() => ({ i: ccDebug.runner().i, b: document.querySelector("#bubble").textContent }));
      if (r.i !== i) { good = false; note = "wrong answer advanced step " + i; break; }
      if (r.b === before) { good = false; note = "no tutor reaction to wrong answer at step " + i; break; }
      await page.fill(".st-ta", right); await page.click(".cw-run");
      const adv = await page.waitForFunction((i) => { const R = ccDebug.runner(); return R.i > i || R.done; }, i, { timeout: 8000 }).then(() => true, () => false);
      if (!adv) { good = false; note = "correct answer did not advance step " + i + ": " + (await page.textContent("#bubble")).slice(0, 100); break; }
      const fly = page.locator(".tb-stay"); if (await fly.count()) await fly.first().click();
    }
    if (good) { await page.waitForSelector(".tb-win", { timeout: 6000 }).catch(() => { good = false; note = "no win screen"; }); }
    if (good) { const nxt = await page.isVisible(".tb-next"); if (!nxt) { good = false; note = "Next mission button missing"; } }
    ok("python " + id + " wrong→right, completes", good, note);
  }
  // Show me path on py-vars: every step solvable by Show me alone
  await page.evaluate(() => startMission("py-vars")); await page.waitForTimeout(300);
  for (let i = 0; i < 3; i++) { await page.click("#btnShowMe"); await page.waitForFunction((i) => { const R = ccDebug.runner(); return R.i > i || R.done; }, i, { timeout: 10000 }).catch(() => {}); }
  ok("py-vars solvable with 👀 Show me", await page.evaluate(() => ccDebug.runner().done));
  // Next mission unlocks: track list shows py-if unlocked after py-vars done
  await page.click(".tb-next"); await page.waitForTimeout(500);
  ok("Next mission → opens py-if", (await page.textContent("#playTitle")).includes("Secret Door"));
  await page.evaluate(() => openTrack("python")); await page.waitForTimeout(300);
  const locked = await page.locator(".lesson-btn.locked").count();
  ok("python track: no locked missions after completing all", locked === 0, "locked=" + locked);
}

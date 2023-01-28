import { exec } from "../../utils/exec.ts"

const TARGET = "./.vscode/settings.json"

const hasSettingsJson = await Deno.readTextFile(TARGET)
  .then(() => true)
  .catch(() => false)

async function openInVSCode() {
  await exec(`code ${TARGET}`)
}

if (hasSettingsJson) {
  console.log(".vscode/settings.json is exist.")
  await openInVSCode()
  Deno.exit(0)
}

await Deno.writeTextFile(TARGET, `{\n}`)
await openInVSCode()

import { createNpmManager } from "./utils/createNpmManager.ts"
import { exec } from "./utils/exec.ts"

const { installPackage } = await createNpmManager()

await installPackage([
  // "prettier-plugin-organize-imports",
  "prettier",
  "@trivago/prettier-plugin-sort-imports",
])

const prettierConfig = {
  tabWidth: 2,
  semi: false,
  printWidth: 120,
  arrowParens: "always",
  importOrder: ["^[~/]", "^[../]", "^[./]"],
  importOrderSeparation: true,
}

await Deno.writeTextFile("./.prettierrc", JSON.stringify(prettierConfig))

await exec(`npx prettier --write .`)

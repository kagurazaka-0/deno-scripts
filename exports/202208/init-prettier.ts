import { createNpmManager } from "../../utils/createNpmManager.ts"
import { exec } from "../../utils/exec.ts"

const npmManager = await createNpmManager()

await npmManager.editToPackageJson({
  scripts: {
    format: `prettier --write .`,
  },
})

const isInstalledTailwind = npmManager.isInstalled("tailwindcss")
const isUseOrganizeImports = false

await npmManager.install(
  "prettier",
  isUseOrganizeImports && "prettier-plugin-organize-imports",
  // "@trivago/prettier-plugin-sort-imports",
  "@ianvs/prettier-plugin-sort-imports",
  isInstalledTailwind && "prettier-plugin-tailwindcss"
)

/** boolがfalseの時はから文字列,trueの時はsourceがreturn */
function maybeText(bool: boolean, source: string) {
  if (!bool) {
    return ""
  }
  return source
}

await Deno.writeTextFile(
  "./prettier.config.js",
  `
const pluginSortImports = require("@trivago/prettier-plugin-sort-imports")
${maybeText(isUseOrganizeImports, `const pluginOrganizeImports = require("prettier-plugin-organize-imports")`)}
${maybeText(isInstalledTailwind, `const pluginTailwindcss = require("prettier-plugin-tailwindcss")`)}

const { parsers: typescriptParsers } = require("prettier/parser-typescript")

/** @type {import("prettier").Parser}  */
const myParser = {
  ...typescriptParsers.typescript,
  preprocess(text, options) {
    let it = text
    try {
      it = pluginOrganizeImports.parsers.typescript.preprocess(it, options)
      it = pluginSortImports.parsers.typescript.preprocess(it, options)
    } catch (error) {
      console.warn(\`⚠️ plugin error\`, error)
    }
    return it
  },
  ${maybeText(isInstalledTailwind, `parse: pluginTailwindcss.parsers.typescript.parse,`)}
}

/** @type {import("prettier").Plugin}  */
const myPlugin = {
  parsers: {
    typescript: myParser,
  },
}

module.exports = {
  plugins: [myPlugin],
  tabWidth: 2,
  semi: false,
  printWidth: 120,
  arrowParens: "always",
  importOrder: ["^[~/]", "^[../]", "^[./]"],
  importOrderSeparation: true,
  trailingComma: "all"
}
`
)

if (Deno.args.includes("--format")) {
  await exec(`npx prettier --write .`)
}

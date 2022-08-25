import { createNpmManager } from "./utils/createNpmManager.ts"
import { exec } from "./utils/exec.ts"

const { installPackage, isInstalled } = await createNpmManager()

const isInstalledTailwind = isInstalled("tailwindcss")

await installPackage([
  "prettier",
  "prettier-plugin-organize-imports",
  "@trivago/prettier-plugin-sort-imports",
  isInstalledTailwind && "prettier-plugin-tailwindcss",
])

/** boolがfalseの時は`// `が付与される */
function maybeComment(bool: boolean, source: string) {
  if (!bool) {
    return `// ${source}`
  }
  return source
}

await Deno.writeTextFile(
  "./prettier.config.js",
  `
const pluginSortImports = require("@trivago/prettier-plugin-sort-imports")
const pluginOrganizeImports = require("prettier-plugin-organize-imports")
${maybeComment(isInstalledTailwind, `const pluginTailwindcss = require("prettier-plugin-tailwindcss")`)}

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
  ${maybeComment(isInstalledTailwind, `parse: pluginTailwindcss.parsers.typescript.parse,`)}
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
}
`
)

await exec(`npx prettier --write .`)

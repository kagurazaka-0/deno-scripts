const PACKAGE_LIST = ["prettier", "@trivago/prettier-plugin-sort-imports"]

const PRETTIER_CONFIG = {
  tabWidth: 2,
  semi: false,
  printWidth: 120,
  arrowParens: "always",
  importOrder: ["^[~/]", "^[../]", "^[./]"],
  importOrderSeparation: true,
}

const _packageJsonText = await Deno.readTextFile("./package.json").catch(() => {
  console.warn("⚠️  package.json is not found.")
  Deno.exit(1)
})

let result: Deno.ProcessStatus

if ((await Deno.stat("./yarn.lock")).isFile) {
  console.log("yarn mode")

  result = await Deno.run({ cmd: ["yarn", "add", "-D", ...PACKAGE_LIST] }).status()
} else {
  console.log("npm mode")

  result = await Deno.run({ cmd: ["npm", "i", "-D", ...PACKAGE_LIST] }).status()
}

if (!result.success) {
  console.warn("⚠️  install error")
  Deno.exit(1)
}

await Deno.writeTextFile("./.prettierrc", JSON.stringify(PRETTIER_CONFIG))

await Deno.run({ cmd: `npx prettier --write "*"`.split(" ") }).status()
await Deno.run({ cmd: `npx prettier --write "**/*"`.split(" ") }).status()

// TODO npm scriptsに追加
/*

type PackageJsonLike = {
  [x: string]: unknown
  scripts: Record<string, string>
}
const packageJson = JSON.parse(packageJsonText) as PackageJsonLike

*/

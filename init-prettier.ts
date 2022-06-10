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

type PackageType = "npm" | "yarn"
const packageType: PackageType = await Deno.readTextFile("./yarn.lock")
  .then(() => "yarn" as const)
  .catch(() => "npm" as const)

let installExecuteResult: Deno.ProcessStatus

console.log(`${packageType} mode`)
if (packageType === "yarn") {
  installExecuteResult = await Deno.run({ cmd: ["yarn", "add", "-D", ...PACKAGE_LIST] }).status()
} else {
  installExecuteResult = await Deno.run({ cmd: ["npm", "i", "-D", ...PACKAGE_LIST] }).status()
}

if (!installExecuteResult.success) {
  console.warn("⚠️  install error")
  Deno.exit(1)
}

await Deno.writeTextFile("./.prettierrc", JSON.stringify(PRETTIER_CONFIG))

await Deno.run({ cmd: `npx prettier --write .`.split(" ") }).status()

// TODO npm scriptsに追加
/*

type PackageJsonLike = {
  [x: string]: unknown
  scripts: Record<string, string>
}
const packageJson = JSON.parse(packageJsonText) as PackageJsonLike

*/

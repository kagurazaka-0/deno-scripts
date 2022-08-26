import { deepMerge } from "https://deno.land/std@0.153.0/collections/deep_merge.ts"

interface PackageJson {
  [x: string]: unknown
  scripts: Record<string, string | undefined>
  dependencies?: Record<string, unknown>
  devDependencies?: Record<string, unknown>
}

const PACKAGE_JSON_PATH = "./package.json"

async function readPackageJson() {
  const packageJsonText = await Deno.readTextFile(PACKAGE_JSON_PATH).catch(() => {
    console.warn("⚠️  package.json is not found.")
    Deno.exit(1)
  })

  const packageJson = JSON.parse(packageJsonText) as PackageJson
  return packageJson
}

export async function createNpmManager() {
  let packageJson = await readPackageJson()

  type PackageType = "npm" | "yarn"
  const packageType: PackageType = await Deno.readTextFile("./yarn.lock")
    .then(() => "yarn" as const)
    .catch(() => "npm" as const)

  const { dependencies, devDependencies } = packageJson
  const dependenciesAll = Object.assign({}, dependencies, devDependencies)

  console.log(`${packageType} mode`)

  return {
    /** パッケージがinstallされているか検証 */
    isInstalled(packageName: string): boolean {
      return packageName in dependenciesAll
    },
    async install(...packagesWithFalsy: (string | false)[]) {
      const packages = packagesWithFalsy.filter((it): it is string => typeof it === "string")
      const cmd = packageType === "yarn" ? ["yarn", "add", "-D", ...packages] : ["npm", "i", "-D", ...packages]
      const result = await Deno.run({ cmd }).status()
      if (!result.success) {
        console.warn("⚠️  install error")
        Deno.exit(1)
      }
    },
    async editToPackageJson(obj: Partial<PackageJson>) {
      // NOTE: deepMergeの型バグによりkeyが string のやつが正しく反応しない
      const merged = deepMerge<{}>(packageJson, obj) as PackageJson
      await Deno.writeTextFile(PACKAGE_JSON_PATH, JSON.stringify(merged))
      packageJson = merged
    },
  }
}

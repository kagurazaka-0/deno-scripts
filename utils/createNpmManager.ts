interface PackageJSON {
  [x: string]: unknown
  dependencies?: Record<string, unknown>
  devDependencies?: Record<string, unknown>
}

export async function createNpmManager() {
  const packageJsonText = await Deno.readTextFile("./package.json").catch(() => {
    console.warn("⚠️  package.json is not found.")
    Deno.exit(1)
  })

  const packageJson = JSON.parse(packageJsonText) as PackageJSON

  type PackageType = "npm" | "yarn"
  const packageType: PackageType = await Deno.readTextFile("./yarn.lock")
    .then(() => "yarn" as const)
    .catch(() => "npm" as const)

  console.log(`${packageType} mode`)

  return {
    async installPackage(packagesWithFalsy: (string | false)[]) {
      const packages = packagesWithFalsy.filter((it): it is string => typeof it === "string")
      const cmd = packageType === "yarn" ? ["yarn", "add", "-D", ...packages] : ["npm", "i", "-D", ...packages]
      const result = await Deno.run({ cmd }).status()
      if (!result.success) {
        console.warn("⚠️  install error")
        Deno.exit(1)
      }
    },
    isInstalled(packageName: string): boolean {
      return packageName in (packageJson.dependencies ?? {})
    },
  }
}

// TODO npm scriptsに追加
/*

type PackageJsonLike = {
  [x: string]: unknown
  scripts: Record<string, string>
}
const packageJson = JSON.parse(packageJsonText) as PackageJsonLike

*/

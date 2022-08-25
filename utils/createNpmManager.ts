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
    async installPackage(_packages: (string | false)[]) {
      const packages = _packages.filter((it): it is string => typeof it === "string")
      let installExecuteResult: Deno.ProcessStatus

      if (packageType === "yarn") {
        installExecuteResult = await Deno.run({ cmd: ["yarn", "add", "-D", ...packages] }).status()
      } else {
        installExecuteResult = await Deno.run({ cmd: ["npm", "i", "-D", ...packages] }).status()
      }

      if (!installExecuteResult.success) {
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

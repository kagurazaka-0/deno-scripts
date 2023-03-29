import { pipeInto } from "https://esm.sh/ts-functional-pipe@3.1.2"

import { exec } from "../../utils/exec.ts"

const { branchList, currentBranch } = pipeInto(
  await exec(`git branch -l`, { isReturnString: true }),
  it => it.split("\n"),
  array => {
    const branchList = array.filter(Boolean).map(s => s.slice(2))
    const currentBranch = array.find(s => s.startsWith("* ")) ?? "main"
    return { branchList, currentBranch }
  }
)

for (const branchName of branchList) {
  if (branchName === "main" || branchName === currentBranch) continue
  try {
    await exec(`git branch -d ${branchName}`)
    console.log("✅  " + branchName)
  } catch {
    console.log("⚠️  " + branchName)
  }
}

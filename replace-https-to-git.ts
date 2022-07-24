import { exec } from "./utils/exec.ts"

const REPLACE_FROM = "https://github.com/"
const REPLACE_TO = "git@github.com:"

const githubUrl = (await exec("git remote get-url origin", { isReturnString: true })).replace("\n", "")

if (githubUrl.includes(REPLACE_TO)) {
  console.log("ℹ️  すでに実行済み")
  Deno.exit(0)
}

const replacedUrl = githubUrl.replace(REPLACE_FROM, REPLACE_TO)
await exec(`git remote set-url origin ${replacedUrl}`)
console.log(`ℹ️  "${replacedUrl}"に変更しました`)

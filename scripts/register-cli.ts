import { walk } from "https://deno.land/std@0.127.0/fs/walk.ts"
import { assert } from "https://deno.land/std@0.127.0/_util/assert.ts"
import * as path from "https://deno.land/std@0.142.0/path/mod.ts"

import "https://deno.land/x/dotenv@v3.2.0/load.ts"

import { pipeInto } from "https://esm.sh/ts-functional-pipe@3.1.2"

const BIN_PATH = Deno.env.get("BIN_PATH")
assert(BIN_PATH, `BIN_PATH is not define from '.env'.`)

for await (const it of walk("./exports")) {
  const isTsFile = it.isFile && it.name.endsWith(".ts")
  if (!isTsFile) continue

  let scriptName = it.name.replace(".ts", "")
  if (scriptName.startsWith("_")) {
    scriptName = scriptName.replace("_", "")
  }

  const writeTargetPath = path.join(BIN_PATH, scriptName)
  // NOTE: ./denoはシンボリックリンク
  const text = `#!/usr/bin/env -S deno run --allow-all\nimport "./${path.join("./deno", it.path)}"`
  Deno.writeTextFile(writeTargetPath, text)
  console.log("✅  " + scriptName)
}

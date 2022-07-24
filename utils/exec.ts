const DECODER = new TextDecoder()

export async function exec(command: string, option: { isReturnString: true }): Promise<string>
export async function exec(command: string, option?: { isReturnString?: false }): Promise<void>
export async function exec(command: string, option: { isReturnString?: boolean } = {}): Promise<unknown> {
  const { isReturnString } = option
  const process = Deno.run({ cmd: command.split(" "), stdout: isReturnString ? "piped" : "inherit" })
  const status = await process.status()
  if (!status.success) {
    console.log(`⚠️  '${command}' is end. error code: ${status.code}`)
    Deno.exit(status.code)
  }

  if (isReturnString) {
    return DECODER.decode(await process.output())
  } else {
    return
  }
}

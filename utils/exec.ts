const DECODER = new TextDecoder()

type O = {
  isShowOutput?: boolean
}

export async function exec(command: string, option: O & { isReturnString: true }): Promise<string>
export async function exec(command: string, option?: O & { isReturnString?: false }): Promise<void>
export async function exec(command: string, option: O & { isReturnString?: boolean } = {}): Promise<unknown> {
  const { isReturnString, isShowOutput } = option
  const cmd = command.split(" ")
  const stdout = (isReturnString ? "piped" : isShowOutput ? "inherit" : "null") satisfies Deno.RunOptions["stdout"]
  const stderr = (isShowOutput ? "inherit" : "null") satisfies Deno.RunOptions["stderr"]
  const process = Deno.run({ cmd, stdout, stderr })
  const status = await process.status()
  if (!status.success) {
    const errorText = `'${command}' is end. error code: ${status.code}`
    // console.log(`⚠️  ${errorText}`)
    throw new ExecError(errorText)
  }

  if (isReturnString) {
    return DECODER.decode(await process.output())
  } else {
    return
  }
}

class ExecError extends Error {
  constructor(...params: Parameters<ErrorConstructor>) {
    super(...params)
    this.name = "ExecError"
  }
}

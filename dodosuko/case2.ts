export {}

const DODOSUKO = ["ドド", "スコ"] as const

type Dodosuko = typeof DODOSUKO[number]

const DODOSUKO_CHAINS_ROOT: Array<Dodosuko> = ["ドド", "スコ", "スコ", "スコ"]

function* createDodosukoChains() {
  yield* DODOSUKO_CHAINS_ROOT
  yield* DODOSUKO_CHAINS_ROOT
  yield* DODOSUKO_CHAINS_ROOT
}

function getDodosuko() {
  return DODOSUKO[Math.floor(Math.random() * DODOSUKO.length)]
}

function main() {
  let iterator = createDodosukoChains()
  while (true) {
    const nextDodosuko = iterator.next()
    if (nextDodosuko.done) {
      break
    }
    const dodosuko = getDodosuko()
    console.log(dodosuko)
    if (dodosuko !== nextDodosuko.value) {
      // NOTE: 初めからやり直し
      iterator = createDodosukoChains()
    }
  }
  console.log("ラブ注入💕")
}

main()

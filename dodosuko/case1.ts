export {}

// https://twitter.com/Sheeeeepla/status/1554028833942441984?s=20&t=FX1g8oTxTNJ3FDREglglXQ

const DODOSUKO = ["ドド", "スコ"] as const

type Dodosuko = typeof DODOSUKO[number]

const DODOSUKO_CHAINS_ROOT: Array<Dodosuko> = ["ドド", "スコ", "スコ", "スコ"]
const DODOSUKO_CHAINS: Array<Dodosuko> = [...DODOSUKO_CHAINS_ROOT, ...DODOSUKO_CHAINS_ROOT, ...DODOSUKO_CHAINS_ROOT]

function createDodosukoChains(): Iterator<Dodosuko> {
  return DODOSUKO_CHAINS[Symbol.iterator]()
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

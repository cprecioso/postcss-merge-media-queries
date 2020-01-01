// @ts-check

const postcss = require("postcss")

export default postcss.plugin("postcss-merge-media-queries", opts => css => {
  /** @type { Map<string, import("postcss").AtRule[]> } */
  const paramsMap = new Map()

  css.each(node => {
    if (node.type === "atrule" && node.name === "media") {
      if (!paramsMap.has(node.params)) {
        paramsMap.set(node.params, [])
      }
      const mqs = paramsMap.get(node.params)
      mqs.push(node)

      node.remove()
    }
  })

  const mergedMediaQueries = [
    ...paramsMap.values()
  ].map(([firstAtRule, ...atRules]) =>
    firstAtRule.append(...atRules.map(atRule => atRule.nodes))
  )

  css.append(...mergedMediaQueries)
})

export type ValueType = string | number | undefined

export type Options<T, V> = {
  variables?: Record<string, V>
  key: keyof T
}

export type CreateOptions = {
  fallback: string
  language: string
}

export function declOfNum(number: number, titles: string[]): string {
  const cases = [2, 0, 1, 1, 1, 2]
  return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]]
}

export function hasI18nKey<T>(content: T, options: Options<T, ValueType>): boolean {
  const { key } = options
  return !!content[key as string]
}

export function processI18N<T, V = ValueType, R = string>(content: T, options: Options<T, V>): R {
  const { variables, key } = options
  let response = content[key as string]

  if (!variables) {
    return response
  }

  const { textVariables, jsxVariables } = Object.entries(variables).reduce<{
    textVariables: Record<string, string>
    jsxVariables: { index: number; key: string; value: V }[]
  }>(
    (acc, [key, variable]) => {
      if (typeof variable === 'object') {
        acc.jsxVariables.push({
          index: response.indexOf(key),
          value: variable,
          key,
        })
      } else {
        acc.textVariables[key] = String(variable)
      }

      return acc
    },
    { textVariables: {}, jsxVariables: [] },
  )

  // replace variables
  for (const variable of Object.keys(textVariables)) {
    const reg = new RegExp(`{{${variable}}}`, 'g')
    response = response.replace(reg, textVariables[variable])
  }

  // for declOfNum
  const testMatch = response.match(/(\[.+])/) // find [number|item1|item2|item3]

  if (testMatch?.[0]) {
    const replaceString = testMatch[0]
    const parseExpression = replaceString.match(/\[(.+)]/) // find number|item1|item2|item3

    if (parseExpression?.[1] && parseExpression[1].indexOf('|') > -1) {
      const [counter, ...strings] = parseExpression[1].split('|') // to number, item1, item2, item3

      if (strings?.length > 0) {
        const counterData = Number(counter)
        response = response.replace(replaceString, declOfNum(counterData, strings))
      }
    }
  }

  const orderedJSX = jsxVariables.sort((a, b) => a.index - b.index)

  if (orderedJSX.length) {
    const joinedKeys = orderedJSX.map((item) => `{{${item.key}}}`).join('|')
    const parts = response.split(new RegExp(joinedKeys, 'g'))

    return orderedJSX.reduce<V[]>((acc, variable, index) => {
      acc.push(parts[index] as never)
      acc.push(variable.value as never)

      const isLastItem = index === orderedJSX.length - 1
      const nextPart = parts[index + 1]

      if (isLastItem && nextPart) {
        acc.push(nextPart as never)
      }

      return acc
    }, []) as never
  }

  return response
}

export function mergeContent<T>(contents: Array<T>, options: CreateOptions): T[keyof T] {
  const response = {} as T[keyof T]

  for (const obj of contents) {
    Object.assign(response, obj[options.fallback] || {}, obj[options.language] || {})
  }
  return response
}

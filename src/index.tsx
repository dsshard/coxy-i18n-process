type ParamValues = Record<string, string | number | undefined>

type Options<T> = {
  variables?: ParamValues
  key: keyof T
}

type CreateOptions = {
  fallback: string
  language: string
}

export function declOfNum(number: number, titles: string[]): string {
  const cases = [2, 0, 1, 1, 1, 2]
  return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]]
}

export function hasI18nKey<T>(content: T, options: Options<T>): boolean {
  const { key } = options
  return !!content[key as string]
}

export function processI18N<T>(content: T, options: Options<T>): string {
  const { variables, key } = options
  let response = content[key as string]

  if (!variables) {
    return response
  }

  // replace variables
  for (const variable of Object.keys(variables)) {
    const reg = new RegExp(`{{${variable}}}`, 'g')
    response = response.replace(reg, String(variables[variable]))
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

  return response
}

export function mergeContent<T>(contents: Array<T>, options: CreateOptions): T[keyof T] {
  const response = {} as T[keyof T]

  for (const obj of contents) {
    Object.assign(response, obj[options.fallback] || {}, obj[options.language] || {})
  }
  return response
}

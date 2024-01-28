// https://stackoverflow.com/a/6969486/4766136
export const escapeRegex = (text: string): string => {
  const specials = [
    // order matters for these
    '-',
    '[',
    ']',
    // order doesn't matter for any of these
    '/',
    '{',
    '}',
    '(',
    ')',
    '*',
    '+',
    '?',
    '.',
    '\\',
    '^',
    '$',
    '|',
  ]

  const regex = RegExp(`[${specials.join('\\')}]`, 'gu')

  return text.replace(regex, '\\$&')
}

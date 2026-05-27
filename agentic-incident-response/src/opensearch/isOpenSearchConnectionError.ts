export function isOpenSearchConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const code = 'code' in error ? String((error as NodeJS.ErrnoException).code) : ''
  return (
    code === 'ECONNREFUSED' ||
    code === 'ENOTFOUND' ||
    error.message.includes('ECONNREFUSED') ||
    error.message.includes('connect')
  )
}

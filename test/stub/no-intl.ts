export function disableIntl () {
  let intl: typeof Intl
  beforeEach(() => {
    intl = Intl
    delete (global as any).Intl
  })
  afterEach(() => {
    (global as any).Intl = intl
  })
}

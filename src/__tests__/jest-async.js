const defer = (func, done, fail) => {
  try {
    func()
    done()
  } catch (e) {
    fail(e)
  }
}

const jestAsync = (func, done) => {
  setTimeout(() => defer(func, done, done.fail))
}

export default jestAsync

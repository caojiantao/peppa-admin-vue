const deepCopy = (obj) => {
  let newobj = obj.constructor === Array ? [] : {}
  if (typeof obj !== 'object') {
    return
  } else if (window.JSON) {
    let str = JSON.stringify(obj)
    newobj = JSON.parse(str)
  } else {
    for (var i in obj) {
      newobj[i] = typeof obj[i] === 'object' ? deepCopy(obj[i]) : obj[i]
    }
  }
  return newobj
}

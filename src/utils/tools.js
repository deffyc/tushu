export default{
  zhuanyi: (str) => {
    let fbsArr = ['\\', '$', '(', ')', '*', '+', '.', '[', ']', '?', '^', '{', '}', '|', '_', '%', '!']
    for (var i = 0; i < fbsArr; i++) {
      str.replace(fbsArr[i], '\\' + fbsArr[i])
    }
    return str
  }
}

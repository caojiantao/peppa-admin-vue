const getToken = () => {
  let token = sessionStorage.getItem('token')
  if (!token) {
    token = localStorage.getItem('token')
  }
  return token
}

const getUserId = () => {
  let userId = sessionStorage.getItem('userId')
  if (!userId) {
    userId = localStorage.getItem('userId')
  }
  return userId
}

const saveToken = (token, userId, rememberMe) => {
  if (rememberMe) {
    window.localStorage.setItem('token', token)
    window.localStorage.setItem('userId', userId)
  } else {
    window.sessionStorage.setItem('token', token)
    window.sessionStorage.setItem('userId', userId)
  }
}

export {getToken, saveToken, getUserId}

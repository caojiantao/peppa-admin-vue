import axio from 'axios'

export function login () {
  axio.get('http://caojiantao.com')
  .then(function (response) {
    console.log(response)
  }).catch(function (error) {
    console.log(error)
  })
}

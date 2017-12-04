import ajax from '@/utils/ajax'

export function login () {
  ajax({
    url: 'http://jspang.com/DemoApi/oftenGoods.php',
    method: 'GET'
  })
}

// 整理分散的node，得到树形填充数据（待优化）
const getTreeData = (datas) => {
  let nodes = []
  for (let index in datas) {
    let node = datas[index]
    if (node.parentId === 0) {
      setChildren(node, datas)
      nodes.push(node)
    }
  }
  return nodes
}

// 递归设置子菜单项
const setChildren = (node, datas) => {
  for (let index in datas) {
    let child = datas[index]
    if (child.parentId === node.id) {
      setChildren(child, datas)
      if (!node.children) {
        node.children = []
      }
      node.children.push(child)
    }
  }
}

const formatterDate = (date, pattern) => {
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  var week = {
    '0': '/u65e5',
    '1': '/u4e00',
    '2': '/u4e8c',
    '3': '/u4e09',
    '4': '/u56db',
    '5': '/u4e94',
    '6': '/u516d'
  }
  if (/(y+)/.test(pattern)) {
    pattern = pattern.replace(RegExp.$1, (String(date.getFullYear())).substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(pattern)) {
    pattern = pattern.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[String(date.getDay())])
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(pattern)) {
      pattern = pattern.replace(RegExp.$1, (RegExp.$1.length === 1) ? o[k] : (('00' + o[k]).substr(String(o[k]).length)))
    }
  }
  return pattern
}

const getParam = function (name) {
  let qs = location.href.substring(location.href.indexOf('?') + 1)
  let items = qs.length ? qs.split('&') : []
  let item = null
  let len = items.length
  for (var i = 0; i < len; i++) {
    item = items[i].split('=')
    let key = item[0]
    let value = decodeURIComponent(item[1])
    if (key === name) {
      return value
    }
  }
  return null
}

const getBreadcrumb = function (path, menus) {
  let menuId
  for (let i in menus) {
    if (menus[i].href === path) {
      menuId = menus[i].id
      break
    }
  }
  let breads = []
  if (menuId) {
    initBreadcrumb(breads, menus, menuId)
  }
  return breads
}

const initBreadcrumb = function (breadcrumbs, menus, menuId) {
  let menu = menus[menuId]
  if (menu) {
    breadcrumbs.splice(0, 0, menu)
    initBreadcrumb(breadcrumbs, menus, menu.parentId)
  }
}

export {getTreeData, formatterDate, getParam, getBreadcrumb}

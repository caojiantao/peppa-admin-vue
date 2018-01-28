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

export {getTreeData}

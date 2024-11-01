const state = {
  isCollapse: false,
  selectMenu: []
}

const mutations = {
  collapseMenu(state) {
    state.isCollapse = !state.isCollapse
  },
  addMenu(state, payload) {
    // selectMeni数组去重
    if(state.selectMenu.findIndex(item => item.path === payload.path) === -1) {
      state.selectMenu.push(payload)
    }
  },
  closeMenu(state,payload) {
    const index = state.selectMenu.findIndex(value => value.name === payload.name)
    state.selectMenu.splice(index,1)
  },
}
export default { state, mutations }
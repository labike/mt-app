import Vue from 'vue'
import Vuex from 'vuex'

import position from './modules/position'
import home from './modules/home'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  modules: {
    position,
    home
  },
  actions: {
    async nuxtServerInit({commit}, {req, app}){
      const {status, data: {province, city}} = await app.$axios.get('/position/getPosition')
      commit('position/setPosition', status === 200 ? {province, city} : {province: '', city: ''})
      const {status: status2, data: {menu}} = await app.$axios.get('/position/menu')
      commit('home/setMenu', status2 === 200 ? menu: [])
      const {status: status3, data: {result}} = await app.$axios.get('/search/hotPlace', {
        params: {
          city: app.store.state.position.position.city.replace('市', '')
        }
      })
      commit('home/setHotPlace', status3 === 200 ? result : [])
    }
  }
})

export default store
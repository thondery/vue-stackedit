import Vue from 'vue'
import App from './App.vue'
import store from './store'

import Message from './libs/message-vue'
import VueSubmitButton from './components/SubmitButton.vue'
import VueSelect from './components/Select.vue'
import VuePopupWindow from './components/PopupWindow.vue'
import VueTab from './components/Tab.vue'
import VueUploadButton from './components/UploadButton.vue'

if (!NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach
}

// Vue.component('beauty-alert', BeautyAlert)
// Vue.component('vue-loading', VueLoading)
Vue.component('vue-popup-window', VuePopupWindow)
// Vue.component('vue-progress-bar', VueProgressBar)
Vue.component('vue-select', VueSelect)
Vue.component('vue-submit-button', VueSubmitButton)
Vue.component('vue-tab', VueTab)
Vue.component('vue-upload-button', VueUploadButton)

Vue.prototype.$msg = Message
Vue.prototype.success = msg => Message(msg)
Vue.prototype.info = msg => {
  Message({
    type: 'info',
    message: msg
  })
}
Vue.prototype.warn = msg => {
  Message({
    type: 'warn',
    message: msg
  })
}
Vue.prototype.error = (msg, close) => {
  Message({
    type: 'error',
    message: msg,
    showClose: true
  })
}

Vue.config.errorHandler = (error, vm) => {
  vm.error(error)
}

Vue.config.warnHandler = (warn, vm) => {
  vm.error(warn)
}

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('app')

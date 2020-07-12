import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'

import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import ToggleButton from 'vue-js-toggle-button'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.use(ToggleButton)

Vue.prototype.$http = axios


Vue.config.productionTip = false

new Vue({
    data: {
        currentUser: {
            id: -1,
            username: '',
            // name: '',
            // surname: '',
            // email: '',
            userAuthorities: []
        },
        apiURL: 'http://localhost:8080/api/'
    },
    methods: {
        messageBoxOk(title, bodyText, okBtnStyle) {
            this.$bvModal.msgBoxOk(bodyText, {
                title: title,
                size: 'sm',
                buttonSize: 'sm',
                okVariant: okBtnStyle ? okBtnStyle : 'success',
                headerClass: 'p-2 border-bottom-0',
                footerClass: 'p-2 border-top-0',
                centered: true,
                autoFocusButton: 'ok'
            })
        }
    },
    created() {
        if (localStorage.getItem('currentUser') && localStorage.getItem("authorizationToken")) {
            try {
                this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
                let authToken = localStorage.getItem('authorizationToken')
                axios.defaults.headers.common['Authorization'] = authToken
            } catch (e) {
                localStorage.removeItem('currentUser');
            }
        }
    },
    router,
    render: h => h(App)
}).$mount('#app')

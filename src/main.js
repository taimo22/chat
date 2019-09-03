import firebase from 'firebase'
import("firebase/functions");
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueClipboard from 'vue-clipboard2'


// Vue.use(Meta)
VueClipboard.config.autoSetContainer = true

Vue.use(VueClipboard)
Vue.use(VueAxios, axios)
var VueCookie = require('vue-cookie');

Vue.use(VueCookie);


Vue.config.productionTip = false

// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyBObs1M4JuqqL0loqnRTAM_pVMArJt2zsk",
    authDomain: "halogen-pier-234105.firebaseapp.com",
    databaseURL: "https://halogen-pier-234105.firebaseio.com",
    projectId: "halogen-pier-234105",
    storageBucket: "",
    messagingSenderId: "536778493172",
    appId: "1:536778493172:web:64ed3dcbdd4f6728"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);6
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})

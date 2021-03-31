import Vue from 'vue'
import App from './App.vue'
import { Button, Input, Select, Table, Icon, Checkbox, DatePicker } from 'ant-design-vue';
Vue.component(Button.name, Button)
Vue.component(Input.name, Input)
Vue.component(Input.TextArea.name, Input.TextArea)
Vue.component(Select.name, Select)
Vue.component(Select.Option.name, Select.Option)
Vue.component(Table.name, Table)
Vue.component(Icon.name, Icon)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Checkbox.Group.name, Checkbox.Group)
Vue.component(DatePicker.name, DatePicker)
Vue.config.productionTip = false


new Vue({
  render: h => h(App),
}).$mount('#app')

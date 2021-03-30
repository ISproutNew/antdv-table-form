/*
 * @Date: 2021-03-30 13:25:14
 * @LastEditors: GanYong
 * @LastEditTime: 2021-03-30 15:10:32
 */
import Vue from 'vue'
import App from './App.vue'
import { Button, Input, Select, Table, Icon } from 'ant-design-vue';
Vue.component(Button.name, Button)
Vue.component(Input.name, Input)
Vue.component(Input.TextArea.name, Input.TextArea)
Vue.component(Select.name, Select)
Vue.component(Select.Option.name, Select.Option)
Vue.component(Table.name, Table)
Vue.component(Icon.name, Icon)
Vue.config.productionTip = false


new Vue({
  render: h => h(App),
}).$mount('#app')

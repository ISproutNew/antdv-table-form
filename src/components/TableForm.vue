<template>
  <div class="table-from ant-table-bordered">
    <table width="100%" class="table">
      <caption>
        <span>{{ title }}</span>
        <a-button class="table-from-add" v-if="isAdd" icon="plus" type="default" @click="addTd">新增行</a-button>
      </caption>
      <thead class="ant-table-thead">
        <tr>
          <th class="ant-table-align-center" v-for="(item, index) in headList" :key="index" :style="{ width: item.width ? `${item.width}px` : '' }">
            <span class="ant-table-header-column">{{ item.title }}</span>
          </th>
        </tr>
      </thead>
      <tbody ref="tbody" class="ant-table-tbody" v-if="isTable">
        <tr class="ant-table-row" v-for="(item, index) in counmsList" :key="index">
          <td v-for="(name, indexData) in Object.keys(item)" :key="indexData" :indexData="indexData">
            <span v-if="headList[indexData].formType === 'textarea' && headList[indexData].type === 'text'">
              <a-textarea
                class="form-text"
                :style="{ resize: 'none' }"
                placeholder=""
                @change="inputOnChange"
                v-model="item[name]"/>
            </span>
            <span v-else-if="headList[indexData].formType === 'input' && headList[indexData].type === 'number'">
              <a-input
                class="form-text"
                type="number"
                :style="{ resize: 'none' }"
                placeholder=""
                @change="inputOnChange"
                v-model="item[name]"/>
            </span>
            <span v-else-if="headList[indexData].formType === 'checkbox' && headList[indexData].type === 'boolean'">
              <a-checkbox-group
                v-model="item[name]"
                name="checkboxgroup"
                :options="checkboxOptions[index][name]"
                @change="inputOnChange"
              />
            </span>
            <span v-else-if="headList[indexData].formType === 'datepicker' && headList[indexData].type === 'time'">
              <a-date-picker v-model="item[name]" :format="dateFormat" />
            </span>
            <span v-else-if="headList[indexData].formType === 'select' && headList[indexData].type === 'text' && selectData">
              <a-select v-model="item[name]" class="form-text">
                <a-select-option v-for="(option, optionIndex) in selectData[headList[indexData].dataIndex]" :key="optionIndex" :value="option.value">
                  {{ option.value }}
                </a-select-option>
              </a-select>
            </span>
            <!-- <span :style="{ width: trW + 'px' }" v-if="Object.keys(item).length - 1 === indexData" @mousedown="tableHeightChange" class="from-draggable"></span> -->
          </td>
        </tr>
      </tbody>
    </table>
    <div class="no-data" v-if="!isTable">
      <span>无默认表格</span>
      <a-icon type="frown" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'TableForm',
  props: {
    dataIndex: { // 头部key索引
      type: Array,
      default: () => []
    },
		defaultRow: { // 默认渲染1-n行
			type: [String, Number],
			default () {
				return 0
			}
		},
		title: { // table的标题
			type: String,
			default: ''
		},
		isShowAdd: { // 是否显示增加按钮
			type: [String, Boolean],
			default: true
		},
    defaultData: { // 默认渲染的行数据
      type: Array,
      default: () => []
    },
    selectData: { // select的列表数据
      type: Object,
      default: () => {}
    }
  },
  computed: {
		isAdd: function () { // 类型转换
			return JSON.parse(this.isShowAdd)
		},
		isTable: function () {
			return this.counmsList.length
		}
	},
  watch: {
    counmsList: { // 监听数据输入
      handler (val) {
				this.$emit('getTableFormData', val)
      },
      deep: true
    }
  },
  data () {
    return {
      headList: this.dataIndex,
      counmsList: [],
      checkboxOptions: [],
      trH: 0,
      trW: 0,
      dateFormat: 'YYYY-MM-DD'
    }
  },
	created () {
    if (this.defaultData.length > 0) {
      this.renderTable(false)
    } else {
      this.showDefaultRow()
    }
	},
  mounted () {},
  methods: {
    moment,
    // 输入框的值改变时触发
    inputOnChange (e) {
      const heightArrs = []
      console.log(e)
      const trNode = this.depNode(e.currentTarget || e?.nativeEvent?.target)
      if (!trNode) return
      const childrenNode = [...trNode.children]
      childrenNode.forEach(item => {
        const textareaNode = item.firstElementChild.firstElementChild
        textareaNode.style.height = 'auto'
        heightArrs.push(textareaNode.scrollHeight)
      })
      childrenNode.forEach(item => {
        const textareaNode = item.firstElementChild.firstElementChild
        const nodeName = textareaNode.nodeName
        if (nodeName !== 'DIV' && nodeName !== 'LABEL') {
          const maxNum = Math.max.apply(null, heightArrs)
          if (maxNum > 50) {
            textareaNode.style.height = `${maxNum}px`
          } else {
            textareaNode.style.height = `${34}px`
          }
        }
      })
    },
    // 查找tr
    depNode (target) {
      if (!target) return
      let node = target
      while (node.nodeName !== 'TR') {
        node = node.parentElement
      }
      return node
    },
    // 增加一行
    addTd () {
      this.renderTable(true)
    },
		// 默认显示的table行
		showDefaultRow () {
			let i, len
      if (this.defaultData.length > 0) return
      if (parseInt(this.defaultRow) > 0) {
        for (i = 0, len = parseInt(this.defaultRow); i < len; i++) {
          this.renderTable(true)
        }
      }
		},
    // 提取key
    filterKey () {
      const res = {}
      this.dataIndex.forEach(item => {
        if (item.formType !== 'checkbox') {
          res[item.dataIndex] = ''
        } else {
          res[item.dataIndex] = []
        }
      })
      return res
    },
    // table行渲染方式
    renderTable (frequency) {
      const key = this.filterKey()
      // 如果不需要默认数据展示 只渲染空对象
      if (frequency) {
        this.counmsList.push(key)
      } else {
        // 需要渲染默认的情况 合并有值的key
        if (Array.isArray(this.defaultData)) {
          this.defaultData.forEach((item) => {
            const objs = { ...key, ...item }
            this.counmsList.push(objs)
          })
        }
        // 渲染组件是checkbox时复制一份数据作为选项列表
        this.checkboxOptions = JSON.parse(JSON.stringify(this.counmsList))
        // 对checkbox数据双向绑定的对象做处理
        this.counmsList.forEach((item) => {
          Object.keys(item).forEach(key => {
            if (Array.isArray(item[key]) && item[key].length > 0) {
              // item[key] = []
            }
          })
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  text-align: center;
}
/deep/ table tbody tr:hover>td {
  background-color:#ffffff!important
}
table {
	margin-top: 20px;
  border-collapse: collapse;
  text-align: center;
  table-layout: fixed;
  caption{
    caption-side: top;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    padding: 20px 0 20px 0;
		color: #17233d;
		position: relative;
		> spam{
			display: inline-block;
			height: 32px;
		}
		.table-from-add{
			position: absolute;
			right: 0;
		}
  }
  thead{
    th{
      text-align: center;
      padding: 8px !important;
    }
  }
  td{
    color: #666;
    padding: 1px !important;
    .form-text{
      text-align: center;
    }
  }
}
table tr{
  background: #fff;
  -moz-user-select:none;
  -webkit-user-select:none;
  user-select: none
}
table tr:nth-child(even) {
  // background: #f5fafa;
}
tbody{
  td{
    position: relative;
    .from-draggable{
      display: block;
      position: absolute;
      height: 4px;
      right: 0;
      bottom: -2;
      background: #666;
      cursor: move;
    }
    /*添加css样式*/
    /deep/ input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    /deep/ input[type="number"] {
        -moz-appearance: textfield;
    }
  }
}
.table-from{
	.no-data{
		width: 100%;
		padding: 8px;
		text-align: center;
		color: #c5c8ce;
		background: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		> span{
			display: inline-block;
			padding-right: 8px;
		}
	}
}
.table-from /deep/ .ant-input{
  border-radius: 0px;
  border: none;
}
.table-from /deep/ .ant-select{
  width: 100%;
  .ant-select-selection{
    border-radius: 0px;
    border: none;
  }
  .ant-select-selection-selected-value{
    width: 100%;
  }
}
.table-from /deep/ .ant-calendar-picker{
  width: 100%;
  display: flex;
  justify-content: center;
  & > div{
    width: 100%;
    .ant-input{
      text-align: center;
    }
  }
}
.table-from /deep/ textarea.ant-input{
  min-height: 30px;
  height: 34px;
}
</style>

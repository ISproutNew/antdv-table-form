<!--
 * @Date: 2021-03-23 10:41:30
 * @LastEditors: GanYong
 * @LastEditTime: 2021-03-30 15:10:01
-->
<template>
  <div class="table-from ant-table-bordered">
    <table width="100%" class="table">
      <caption>
        <span>{{ title }}</span>
        <a-button
          class="table-from-add"
          v-if="isAdd"
          icon="plus"
          type="default"
          @click="addTd"
          >新增</a-button
        >
      </caption>
      <thead class="ant-table-thead">
        <tr>
          <th
            class="ant-table-align-center"
            v-for="(item, index) in headList"
            :key="index"
            :style="{ width: item.width ? `${item.width}px` : '' }"
          >
            <span class="ant-table-header-column">{{ item.title }}</span>
          </th>
        </tr>
      </thead>
      <tbody ref="tbody" class="ant-table-tbody" v-if="isTable">
        <tr
          class="ant-table-row"
          v-for="(item, index) in counmsList"
          :key="index"
        >
          <td
            v-for="(name, indexData) in Object.keys(item)"
            :key="indexData"
            :indexData="indexData"
          >
            <span
              v-if="
                headList[indexData].formType === 'textarea' &&
                headList[indexData].type === 'text'
              "
            >
              <a-textarea
                class="form-text"
                :style="{ resize: 'none' }"
                placeholder=""
                @change="inputOnChange"
                v-model="item[name]"
              />
            </span>
            <span
              v-else-if="
                headList[indexData].formType === 'input' &&
                headList[indexData].type === 'number'
              "
            >
              <a-input
                class="form-text"
                type="number"
                :style="{ resize: 'none' }"
                placeholder=""
                @change="inputOnChange"
                v-model="item[name]"
              />
            </span>
            <span
              v-else-if="
                headList[indexData].formType === 'select' &&
                headList[indexData].type === 'text' &&
                selectData
              "
            >
              <a-select v-model="item[name]" class="form-text">
                <a-select-option
                  v-for="(option, optionIndex) in selectData[
                    headList[indexData].dataIndex
                  ]"
                  :key="optionIndex"
                  :value="option.value"
                >
                  {{ option.value }}
                </a-select-option>
              </a-select>
            </span>
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
export default {
  name: "TableForm",
  props: {
    dataIndex: {
      // 头部key索引
      type: Array,
      default: () => [],
    },
    defaultRow: {
      // 默认渲染0-n行
      type: [String, Number],
      default() {
        return 0;
      },
    },
    title: {
      // table的标题
      type: String,
      default: "",
    },
    isShowAdd: {
      // 是否显示增加按钮
      type: [String, Boolean],
      default: true,
    },
    defaultData: {
      // 默认渲染的行数据
      type: Array,
      default: () => [],
    },
    selectData: {
      // select的列表数据
      type: Object,
      default: () => {},
    },
  },
  computed: {
    isAdd: function () {
      // 类型转换
      return JSON.parse(this.isShowAdd);
    },
    isTable: function () {
      return this.defaultRow && this.counmsList.length;
    },
  },
  watch: {
    counmsList: {
      // 监听数据输入
      handler(val) {
        this.$emit("getTableFormData", val);
      },
      deep: true,
    },
  },
  data() {
    return {
      headList: this.dataIndex,
      counmsList: [],
    };
  },
  created() {
    if (this.defaultData.length > 0) {
      this.renderTable(false);
    } else {
      this.showDefaultRow();
    }
  },
  mounted() {},
  methods: {
    // 输入框的值改变时触发
    inputOnChange(e) {
      const heightArrs = [];
      const trNode = e.currentTarget.parentElement.parentElement.parentElement;
      const childrenNode = [...trNode.children];
      childrenNode.forEach((item) => {
        const textareaNode = item.firstElementChild.firstElementChild;
        textareaNode.style.height = "auto";
        heightArrs.push(textareaNode.scrollHeight);
      });
      childrenNode.forEach((item) => {
        const textareaNode = item.firstElementChild.firstElementChild;
        if (textareaNode.nodeName !== "DIV") {
          const maxNum = Math.max.apply(null, heightArrs);
          if (maxNum > 50) {
            textareaNode.style.height = `${maxNum}px`;
          } else {
            textareaNode.style.height = `${34}px`;
          }
        }
      });
    },
    // 增加一行
    addTd() {
      this.renderTable(true);
    },
    // 默认显示的table行
    showDefaultRow() {
      let i, len;
      if (this.defaultData.length > 0) return;
      if (parseInt(this.defaultRow) > 0) {
        for (i = 0, len = parseInt(this.defaultRow); i < len; i++) {
          this.renderTable(true);
        }
      }else {
          return
      }
    },
    // 提取key
    filterKey() {
      const res = {};
      this.dataIndex.forEach((item) => {
        res[item.dataIndex] = "";
      });
      return res;
    },
    // table行渲染方式
    renderTable(frequency) {
      const key = this.filterKey();
      if (frequency) {
        this.counmsList.push(key);
      } else {
        if (Array.isArray(this.defaultData)) {
          this.defaultData.forEach((item) => {
            const objs = { ...key, ...item };
            this.counmsList.push(objs);
          });
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  text-align: center;
}
/deep/ table tbody tr:hover > td {
  background-color: #ffffff !important;
}
table {
  margin-top: 20px;
  border-collapse: collapse;
  text-align: center;
  table-layout: fixed;
  caption {
    caption-side: top;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    padding: 20px 0 20px 0;
    color: #17233d;
    position: relative;
    > spam {
      display: inline-block;
      height: 32px;
    }
    .table-from-add {
      position: absolute;
      right: 0;
    }
  }
  thead {
    th {
      text-align: center;
      padding: 8px !important;
    }
  }
  td {
    color: #666;
    padding: 1px !important;
    .form-text {
      text-align: center;
    }
  }
}
table tr {
  background: #fff;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
tbody {
  td {
    position: relative;
    .from-draggable {
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
.table-from {
  .no-data {
    width: 100%;
    padding: 8px;
    text-align: center;
    color: #c5c8ce;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    > span {
      display: inline-block;
      padding-right: 8px;
    }
  }
}
.table-from /deep/ .ant-input {
  border-radius: 0px;
  border: none;
}
.table-from /deep/ .ant-select {
  width: 100%;
  .ant-select-selection {
    border-radius: 0px;
    border: none;
  }
  .ant-select-selection-selected-value {
    width: 100%;
  }
}
.table-from /deep/ textarea.ant-input {
  min-height: 30px;
  height: 34px;
}
</style>

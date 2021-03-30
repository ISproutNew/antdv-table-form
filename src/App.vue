<template>
  <div id="app">
    <div>
      <table-form
        :title="Title1"
        :dataIndex="data1"
        defaultRow="1"
        :selectData="selectData"
        :defaultData="defaultdata1"
        isShowAdd="false"
        @getTableFormData="getdata1"
      ></table-form>
      <table-form
        :title="Title2"
        :dataIndex="data2"
        defaultRow="1"
        :selectData="teamSelectData"
        isShowAdd="true"
        @getTableFormData="getdata2"
      ></table-form>
      <table-form
        :title="Title3"
        :dataIndex="data3"
        defaultRow="0"
        isShowAdd="true"
      ></table-form>
    </div>
  </div>
</template>

<script>
import TableForm from "./components/TableForm";
export default {
  name: "App",
  components: {
    TableForm,
  },
  data() {
    return {
      Title1: "Title-1",
      Title2: "Title-2",
      Title3: "Title-3",
      selectData: {}, // 需要符合该数据格式：'当前列的key': []
      data1: [
        {
          title: "Table-Title-1", // table列标题
          width: 180, // table列宽度 默认自适应
          dataIndex: "name", // 行数据索引-包括提交的数据key
          type: "text", // 限制输入类型
          formType: "textarea", // table表格内使用的组件类型
        },
        {
          title: "Table-Title-2",
          width: 200,
          dataIndex: "age",
          type: "number",
          formType: "input", // formType为input类型时type需为number
        },
        {
          title: "Table-Title-3",
          width: 300,
          dataIndex: "price",
          type: "text",
          formType: "select", // formType为select类型时需要传入selectData{ key: [ value: xxx ]}否则会被与渲染成textarea
        },
        {
          title: "Table-Title-4",
          dataIndex: "action",
          type: "text",
          formType: "select",
        },
        {
          title: "Table-Title-5",
          dataIndex: "pic",
          type: "text",
          formType: "textarea",
        },
      ],
      data2: [
        {
          title: "Table-Title-1",
          dataIndex: "name",
          type: "number",
          formType: "input",
        },
        {
          title: "Table-Title-2",
          dataIndex: "age",
          type: "text",
          formType: "select",
        },
        {
          title: "Table-Title-3",
          dataIndex: "price",
          type: "text",
          formType: "textarea",
        },
        {
          title: "Table-Title-4",
          dataIndex: "action",
          type: "text",
          formType: "textarea",
        },
        {
          title: "Table-Title-5",
          dataIndex: "pic",
          type: "text",
          formType: "textarea",
        },
        {
          title: "Table-Title-6",
          dataIndex: "memo",
          type: "text",
          formType: "textarea",
        },
      ],
      data3: [
        {
          title: "Table-Title-1",
          dataIndex: "name",
          type: "text",
          formType: "textarea",
        },
        {
          title: "Table-Title-2",
          dataIndex: "age",
          type: "text",
          formType: "textarea",
        },
        {
          title: "Table-Title-3",
          dataIndex: "action",
          type: "text",
          formType: "textarea",
        },
      ],
      teamSelectData: {
        age: [
          {
            value: "测试1",
          },
          {
            value: "测试2",
          },
          {
            value: "测试3",
          },
        ],
      },
      defaultdata1: [
        { name: "default-1", price: "" },
        { name: "default-2" },
        { name: "default-3" },
        { name: "default-4" },
        { name: "default-5" },
        { name: "default-6" },
      ],
    };
  },
  mounted() {
    // 模拟异步获取select列表数据
    setTimeout(() => {
      this.selectData = {
        price: [
          {
            value: "list-1",
          },
          {
            value: "list-2",
          },
          {
            value: "list-3",
          },
        ],
        action: [
          {
            value: "list-4",
          },
          {
            value: "list-5",
          },
          {
            value: "list-6",
          },
        ],
      };
    }, 3000);
  },
  methods: {
    // 表格数据改变时触发
    getdata1(data) {
      const arr = this.filterData(data);
      console.log(arr);
    },
    getdata2(data) {
      console.log(data);
    },
    getShipOrCarData(data) {
      console.log(data);
    },
    // 过滤空数据 示例
    filterData(data) {
      return data.filter((item) => {
        if (
          Object.keys(item).every((key) => {
            return item[key];
          })
        ) {
          return item;
        }
      });
    },
  },
};
</script>

<style>
#app {
  background-color: #f0f2f5;
  padding: 50px;
  height: 100%;
}
</style>

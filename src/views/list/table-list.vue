<template>
  <div class="au-page-table-list">
    <au-elastic-panel :transformative="true" v-model:transformed="transformed" placement="left">
      <template #form>
        <a-form>
          <a-row :gutter="16">
            <a-col v-bind="formGridProps">
              <a-form-item label="租户编码">
                <a-input v-model="queryParam.id" allowClear placeholder="请输入租户编码" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formGridProps">
              <a-form-item label="租户名称">
                <a-input v-model="queryParam.name" allowClear placeholder="请输入租户名称" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formGridProps">
              <a-form-item label="租户账号">
                <a-input v-model="queryParam.account" allowClear placeholder="请输入租户账号" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formGridProps">
              <a-form-item label="租户域名">
                <a-input v-model="queryParam.domain" allowClear placeholder="请输入租户域名" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formGridProps">
              <a-form-item label="租户状态">
                <a-select v-model="queryParam.status" allowClear placeholder="请选择租户状态">
                  <a-select-option v-for="key in Object.keys(statusMap)" :value="key" :key="key">
                    {{ statusMap[key].label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col v-bind="formGridProps" style="text-align: right; float: right">
              <a-form-item>
                <a-button type="primary">查询</a-button>
                <a-button style="margin-left: 8px">重置</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
      <template #data>
        <div class="data-action">
          <div class="content-action-base">
            <a-button type="primary">新增</a-button>
            <a-button :disabled="tableSelectedKeys.length !== 1">编辑</a-button>
            <a-button :disabled="tableSelectedKeys.length === 0">删除</a-button>
          </div>
          <div class="content-action-extra">
            <a-button>
              <au-iconfont type="refresh"></au-iconfont>
            </a-button>
          </div>
        </div>
        <div class="data-table">
          <a-table
            :columns="tableColumns"
            :data-source="tableData"
            :pagination="false"
            :row-selection="{ selectedRowKeys: tableSelectedKeys, onChange: handleTableRowSelect }"
            rowKey="id"
          >
            <span slot="status" slot-scope="text">
              <a-tag :color="statusMap[text].color">
                {{ statusMap[text].label }}
              </a-tag>
            </span>
            <span slot="createTime" slot-scope="text">{{ text | timestamp }}</span>
            <span slot="updateTime" slot-scope="text">{{ text | timestamp }}</span>
          </a-table>
        </div>
        <div class="data-pagination">
          <a-pagination show-quick-jumper show-size-changer :total="100" />
        </div>
      </template>
    </au-elastic-panel>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';

export default defineComponent({
  setup() {
    const transformed = ref(false);
    const statusMap = reactive({
      0: {
        color: 'orange',
        label: '失效',
      },
      1: {
        color: 'green',
        label: '生效',
      },
    });
    const queryParam = reactive({
      id: '',
      name: '',
      account: '',
      domain: '',
      status: undefined,
    });
    const tableColumns = reactive([
      {
        title: '租户编码',
        dataIndex: 'id',
        ellipsis: true,
      },
      {
        title: '租户名称',
        dataIndex: 'name',
      },
      {
        title: '租户账号',
        dataIndex: 'account',
      },
      {
        title: '租户域名',
        dataIndex: 'domain',
      },
      {
        title: '租户状态',
        dataIndex: 'status',
        scopedSlots: { customRender: 'status' },
      },
      {
        title: '描述信息',
        dataIndex: 'description',
        ellipsis: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        scopedSlots: { customRender: 'createTime' },
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        scopedSlots: { customRender: 'updateTime' },
      },
    ]);
    const tableData = reactive([
      {
        id: '0b5cd93d1815434ea1409275f5d47c69',
        name: 'example',
        account: 'example',
        domain: 'example',
        status: 1,
        description: '',
        createTime: 1597574491390,
        updateTime: 1597574491390,
      },
      {
        id: 'f84f6cd9b74a4a0a9f8a67fed24f228d',
        name: 'example',
        account: 'example',
        domain: 'example',
        status: 0,
        description: '',
        createTime: 1597574491390,
        updateTime: 1597574491390,
      },
      {
        id: '00a1c6b8abff418c8440d17aeb5e4588',
        name: 'example',
        account: 'example',
        domain: 'example',
        status: 0,
        description: '',
        createTime: 1597574491390,
        updateTime: 1597574491390,
      },
      {
        id: '0e69c80ec850468ba535c11b7e67790a',
        name: 'example',
        account: 'example',
        domain: 'example',
        status: 0,
        description: '',
        createTime: 1597574491390,
        updateTime: 1597574491390,
      },
      {
        id: '41d56ad1097c42bbb4156dbe37ae48b9',
        name: 'example',
        account: 'example',
        domain: 'example',
        status: 0,
        description: '',
        createTime: 1597574491390,
        updateTime: 1597574491390,
      },
      {
        id: 'd447bb5f4ff84f3e8ea062653a68dc27',
        name: 'example',
        account: 'example',
        domain: 'example',
        status: 1,
        description: '',
        createTime: 1597574491390,
        updateTime: 1597574491390,
      },
      {
        id: 'a14e4b626cab46b0bcc9cc5505ee31ad',
        name: 'example',
        account: 'example',
        domain: 'example',
        status: 0,
        description: '',
        createTime: 1597574491390,
        updateTime: 1597574491390,
      },
      {
        id: 'e198b606af77422ea5ed3e4e1c4b00c0',
        name: 'example',
        account: 'example',
        domain: 'example',
        status: 0,
        description: '',
        createTime: 1597574491390,
        updateTime: 1597574491390,
      },
      {
        id: '5945a3b1619b4eb590ea53c18971b1dd',
        name: 'example',
        account: 'example',
        domain: 'example',
        status: 0,
        description: '',
        createTime: 1597574491390,
        updateTime: 1597574491390,
      },
      {
        id: 'fa392be103914332ad015d0cde08f7e5',
        name: 'example',
        account: 'example',
        domain: 'example',
        status: 0,
        description: '',
        createTime: 1597574491390,
        updateTime: 1597574491390,
      },
    ]);
    const tableSelectedKeys = ref<string[]>([]);
    const formGridProps = computed(() => {
      if (transformed.value) {
        return {
          span: 24,
        };
      } else {
        return {
          sm: 24,
          md: 12,
          lg: 8,
          xl: 6,
          xxl: 4,
        };
      }
    });

    const handleTableRowSelect = (selectedRowKeys: Array<string>) => {
      tableSelectedKeys.value = selectedRowKeys;
    };

    return {
      transformed,
      statusMap,
      queryParam,
      tableColumns,
      tableData,
      tableSelectedKeys,
      formGridProps,
      handleTableRowSelect,
    };
  },
});
</script>

<style lang="less" scoped>
@import '../../style/index';

.au-page-table-list {
  width: 100%;

  .data-action {
    margin-bottom: 10px;
    display: flex;

    .content-action-base {
      flex: 1;
      width: 0;
    }

    .content-action-extra {
      flex-shrink: 0;
    }

    ::v-deep(.ant-btn) {
      margin-right: 6px;
    }
  }

  .data-table {
    flex: auto;
    margin-bottom: 10px;
  }

  .data-pagination {
    margin-bottom: 15px;
    text-align: right;
  }
}

/*override form-item style*/
::v-deep(.ant-form-item) {
  display: flex;
  margin-bottom: 10px;

  .ant-form-item-label {
    width: 70px;
  }

  .ant-form-item-control-wrapper {
    flex: 1;
  }
}
</style>

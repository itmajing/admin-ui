<template>
  <div class="au-page-table-list">
    <au-toolkit
      class="table-list-trigger"
      init-position="right"
      direction="vertical"
      @onclick="handleModelTriggerClick"
      title="拖拽调整位置，点击切换视图"
    >
      <au-iconfont v-if="model === 'vertical'" type="vertical" :style="{ fontSize: '20px' }"></au-iconfont>
      <au-iconfont v-else type="horizontal" :style="{ fontSize: '20px' }"></au-iconfont>
    </au-toolkit>
    <div class="table-list-wrapper" :class="`table-list-${model}`">
      <div class="table-list-search" :class="{ 'table-list-search-collapsed': collapsed }">
        <a-form-model class="search-form" label-width="120px">
          <a-row :gutter="16">
            <a-col v-bind="gridProps[model]">
              <a-form-model-item label="租户编码">
                <a-input v-model="queryParam.id" allowClear placeholder="请输入租户编码" />
              </a-form-model-item>
            </a-col>
            <a-col v-bind="gridProps[model]">
              <a-form-model-item label="租户名称">
                <a-input v-model="queryParam.name" allowClear placeholder="请输入租户名称" />
              </a-form-model-item>
            </a-col>
            <a-col v-bind="gridProps[model]">
              <a-form-model-item label="租户账号">
                <a-input v-model="queryParam.account" allowClear placeholder="请输入租户账号" />
              </a-form-model-item>
            </a-col>
            <a-col v-bind="gridProps[model]">
              <a-form-model-item label="租户域名">
                <a-input v-model="queryParam.domain" allowClear placeholder="请输入租户域名" />
              </a-form-model-item>
            </a-col>
            <a-col v-bind="gridProps[model]">
              <a-form-model-item label="租户状态">
                <a-select v-model="queryParam.status" allowClear placeholder="请选择租户状态">
                  <a-select-option v-for="key in Object.keys(statusMap)" :value="key" :key="key">
                    {{ statusMap[key].label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col v-bind="gridProps[model]" style="text-align: right; float: right">
              <a-form-model-item>
                <a-button type="primary">查询</a-button>
                <a-button style="margin-left: 8px">重置</a-button>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
        <div class="search-collapsed" title="点击展开或收起" @click="handleCollapsedTriggerClick">
          <au-iconfont :type="collapsedIcon"></au-iconfont>
        </div>
      </div>
      <div class="table-list-content">
        <div class="content-action">
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
        <div class="content-table">
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
        <div class="content-pagination">
          <a-pagination show-quick-jumper show-size-changer :total="100" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class TableList extends Vue {
  $refs!: { modelTrigger: HTMLFormElement }
  model = 'vertical'
  collapsed = false
  gridProps = {
    vertical: {
      sm: 24,
      md: 12,
      lg: 8,
      xl: 6,
      xxl: 4,
    },
    horizontal: {
      span: 24,
    },
  }

  queryParam = {
    id: '',
    name: '',
    account: '',
    domain: '',
    status: undefined,
  }

  tableColumns = [
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
  ]
  tableData = [
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
  ]
  tableSelectedKeys: Array<string> = []

  statusMap = {
    0: {
      color: 'orange',
      label: '失效',
    },
    1: {
      color: 'green',
      label: '生效',
    },
  }

  get collapsedIcon() {
    if (this.model === 'vertical') {
      return this.collapsed ? 'double-bottom' : 'double-top'
    } else {
      return this.collapsed ? 'double-right' : 'double-left'
    }
  }

  handleModelTriggerClick() {
    if (this.model === 'vertical') {
      this.model = 'horizontal'
    } else {
      this.model = 'vertical'
    }
  }

  handleCollapsedTriggerClick() {
    this.collapsed = !this.collapsed
  }

  handleTableRowSelect(selectedRowKeys: Array<string>) {
    this.tableSelectedKeys = selectedRowKeys
  }
}
</script>

<style lang="less" scoped>
@import '../../style/index';

.au-page-table-list {
  width: 100%;

  .table-list-trigger {
    height: 36px;
    width: 36px;
    border-radius: 50%;
    box-shadow: rgba(29, 35, 41, 0.05) 0 1px 4px 0;
    color: rgb(255, 255, 255);
    background-color: @primary-color;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .table-list-wrapper {
    display: flex;

    .table-list-search {
      flex-shrink: 0;
      position: relative;

      .search-collapsed {
        position: absolute;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.35);

        &:hover {
          color: @primary-color;
        }
      }
    }

    .table-list-content {
      flex: 1;
      display: flex;
      flex-flow: column;

      .content-action {
        margin-bottom: 10px;
        display: flex;

        .content-action-base {
          flex: 1;
          width: 0;
        }

        .content-action-extra {
          flex-shrink: 0;
        }

        /deep/ .ant-btn {
          margin-right: 6px;
        }
      }

      .content-table {
        flex: auto;
        margin-bottom: 10px;
      }

      .content-pagination {
        margin-bottom: 15px;
        text-align: right;
      }
    }
  }

  .table-list-vertical {
    flex-flow: column;

    .table-list-search {
      margin: 0 8px;
      border-bottom: 1px solid #e8e8e8;

      &-collapsed {
        height: 0;
        transition: all 0.3s;

        .search-form {
          display: none;
        }
      }

      .search-collapsed {
        bottom: -10px;
        left: calc(~'50% - 7px');
      }
    }

    .table-list-content {
      margin-top: 10px;
    }
  }

  .table-list-horizontal {
    flex-flow: row;

    .table-list-search {
      width: 500px;
      padding: 0 16px 0 6px;
      border-right: 1px solid #e8e8e8;
      transition: all 0.3s;

      &-collapsed {
        width: 0;
        padding: 0 0 0 6px;

        .search-form {
          overflow: hidden;
        }
      }

      .search-collapsed {
        right: -8px;
        top: calc(~'50% - 10px');
      }
    }

    .table-list-content {
      margin-left: 10px;
    }
  }
}

/*override form-item style*/
/deep/ .ant-form-item {
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

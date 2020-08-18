<template>
  <div class="au-page-card-list">
    <div class="card-list-search" :class="{ 'card-list-search-collapsed': collapsed }">
      <a-form-model class="search-form">
        <a-row :gutter="16">
          <a-col v-bind="formGridPros">
            <a-form-model-item label="操作系统">
              <a-select v-model="queryParam.os" allowClear placeholder="请选择操作系统">
                <a-select-option v-for="key in Object.keys(osMap)" :value="key" :key="key">
                  <au-iconfont :type="osMap[key].icon" />
                  <span style="margin-left: 5px">{{ osMap[key].label }}</span>
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col v-bind="formGridPros">
            <a-form-model-item label="运行状态">
              <a-select v-model="queryParam.status" allowClear placeholder="请选择运行状态">
                <a-select-option v-for="key in Object.keys(statusMap)" :value="key" :key="key">
                  <a-badge :status="statusMap[key].status" :text="statusMap[key].label" />
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col v-bind="formGridPros" style="text-align: right; float: right">
            <a-form-model-item>
              <a-button type="primary">查询</a-button>
              <a-button style="margin-left: 8px">重置</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <div
        class="search-collapsed"
        title="点击展开或收起"
        @click="
          () => {
            collapsed = !collapsed
          }
        "
      >
        <au-iconfont :type="collapsed ? 'double-bottom' : 'double-top'"></au-iconfont>
      </div>
    </div>
    <div class="card-list-content">
      <a-row :gutter="[16, 16]">
        <a-col v-bind="cardGridProps" class="card-wrapper">
          <a-card :hoverable="true" :bodyStyle="{ padding: '0' }" style="{ border-style: dashed }">
            <div class="card-content card-content-add">
              <a-icon type="plus" :style="{ fontSize: '26px' }" />
            </div>
          </a-card>
        </a-col>
        <a-col v-bind="cardGridProps" v-for="item in cardData" :key="item.id">
          <a-card :hoverable="true" :bodyStyle="{ padding: '0' }">
            <div class="card-content">
              <!--temp code-->
              <div style="display: flex; flex-flow: column; padding: 10px; height: 100%">
                <div style="height: 30px; flex-shrink: 0; display: flex; align-items: center">
                  <div style="flex: auto; display: flex; align-items: center">
                    <au-iconfont :type="osMap[item.os].icon" :style="{ fontSize: '20px' }" />
                    <span style="margin-left: 8px">{{ osMap[item.os].label }}</span>
                    <span style="margin-left: 5px">{{ item.version }}</span>
                  </div>
                  <div style="flex-shrink: 0; display: flex; align-items: center">
                    <au-iconfont type="remote-desktop" />
                    <au-iconfont type="shutdown" style="margin-left: 8px" />
                    <au-iconfont type="manage" style="margin-left: 8px" />
                  </div>
                </div>
                <div style="flex: auto; margin: 10px 0">
                  {{ item.info }}
                </div>
                <div style="height: 30px; display: flex; flex-shrink: 0">
                  <div style="flex: auto">
                    <a-badge :status="statusMap[item.status].status" :text="statusMap[item.status].label" />
                  </div>
                  <span>{{ item.ip }}</span>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class CardList extends Vue {
  collapsed = false
  formGridPros = {
    sm: 24,
    md: 12,
    lg: 8,
    xl: 6,
    xxl: 4,
  }
  cardGridProps = {
    sm: 24,
    md: 12,
    lg: 12,
    xl: 8,
    xxl: 6,
  }
  queryParam = {
    os: undefined,
    status: undefined,
  }
  osMap = {
    windows: {
      icon: 'windows',
      label: 'Windows',
    },
    centos: {
      icon: 'centos',
      label: 'CentOS',
    },
    ubuntu: {
      icon: 'ubuntu',
      label: 'Ubuntu',
    },
    debian: {
      icon: 'debian',
      label: 'Debian',
    },
    opensuse: {
      icon: 'suse',
      label: 'OpenSUSE',
    },
  }
  statusMap = {
    0: {
      status: 'default',
      label: '已关机',
    },
    1: {
      status: 'success',
      label: '运行中',
    },
    2: {
      status: 'processing',
      label: '重启中',
    },
  }

  cardData = [
    {
      id: 'a1a6ccdcff044e7485d69a941ec9cbae',
      os: 'windows',
      version: '2012 R2',
      status: 1,
      ip: '10.0.12.210',
      info: '4核 - 16GB内存 - 系统盘 1TB SSD云盘 - 杭州',
    },
    {
      id: '092a60a2f2854f63a35dd31459c1eae2',
      os: 'centos',
      version: '7.3',
      status: 1,
      ip: '10.0.12.211',
      info: '4核 - 16GB内存 - 系统盘 1TB SSD云盘 - 杭州',
    },
    {
      id: '36a17bb1b78d499aa6f43b73b28793fc',
      os: 'opensuse',
      version: '42.3',
      status: 1,
      ip: '10.0.12.212',
      info: '4核 - 16GB内存 - 系统盘 1TB SSD云盘 - 杭州',
    },
    {
      id: 'ce3dc47a0fcd4d6fa16918c0eab2f24d',
      os: 'centos',
      version: '7.3',
      status: 1,
      ip: '10.0.12.213',
      info: '4核 - 16GB内存 - 系统盘 1TB SSD云盘 - 杭州',
    },
    {
      id: 'ad669f4f3b404097935fa2f9f64885f5',
      os: 'centos',
      version: '7.3',
      status: 1,
      ip: '10.0.12.214',
      info: '4核 - 16GB内存 - 系统盘 1TB SSD云盘 - 杭州',
    },
    {
      id: 'da2b90bb735849fcb7525221d7e9e675',
      os: 'centos',
      version: '7.3',
      status: 1,
      ip: '10.0.12.215',
      info: '4核 - 16GB内存 - 系统盘 1TB SSD云盘 - 杭州',
    },
    {
      id: 'c8505a5131cf4a8db5931d303e2f88ed',
      os: 'ubuntu',
      version: '18.04',
      status: 1,
      ip: '10.0.12.216',
      info: '4核 - 16GB内存 - 系统盘 1TB SSD云盘 - 杭州',
    },
    {
      id: 'a02f97d88bd345b88f3f714bfc12e5dd',
      os: 'windows',
      version: '2012 R2',
      status: 0,
      ip: '10.0.12.217',
      info: '4核 - 16GB内存 - 系统盘 1TB SSD云盘 - 杭州',
    },
    {
      id: 'eadf48a4f1ce4028866ca1bc2298637a',
      os: 'ubuntu',
      version: '18.04',
      status: 1,
      ip: '10.0.12.218',
      info: '4核 - 16GB内存 - 系统盘 1TB SSD云盘 - 杭州',
    },
    {
      id: '6f7b12774e5a47da80807e5938992870',
      os: 'centos',
      version: '7.4',
      status: 1,
      ip: '10.0.12.219',
      info: '4核 - 16GB内存 - 系统盘 1TB SSD云盘 - 杭州',
    },
  ]
}
</script>

<style lang="less" scoped>
@import '../../style/index';

.au-page-card-list {
  width: 100%;

  .card-list-search {
    margin: 0 8px;
    border-bottom: 1px solid #e8e8e8;
    position: relative;

    &-collapsed {
      height: 0;
      transition: all 0.3s;

      .search-form {
        display: none;
      }
    }

    .search-collapsed {
      position: absolute;
      cursor: pointer;
      color: rgba(0, 0, 0, 0.35);
      bottom: -10px;
      left: calc(~'50% - 7px');

      &:hover {
        color: @primary-color;
      }
    }
  }

  .card-list-content {
    margin-top: 10px;

    .card-wrapper {
      /deep/ .ant-card-bordered {
        border-style: dashed;
      }
    }

    .card-content {
      height: 170px;
      overflow: hidden;

      img {
        width: 100%;
      }

      &::before {
        content: '';
        height: 6px;
        display: block;
        transition: background-color 0.2s;
      }
      &:hover::before {
        background-color: @primary-color;
      }

      &-add {
        display: flex;
        justify-content: center;
        align-items: center;
        color: @text-color-secondary;

        &::before {
          height: 0;
        }
      }
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

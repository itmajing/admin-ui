<template>
  <div class="account-setting-info">
    <a-list itemLayout="horizontal" :dataSource="listData">
      <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
        <a-list-item-meta>
          <span slot="title">{{ item.title }}</span>
          <span slot="description">
            <span class="security-list-description">{{ item.description }}</span>
            <span v-if="item.value"> : </span>
            <span class="security-list-value">{{ item.value }}</span>
          </span>
        </a-list-item-meta>
        <template v-if="item.actions">
          <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { message } from 'ant-design-vue';

export default defineComponent({
  setup() {
    const listData = reactive([
      {
        title: '账户密码',
        description: '当前密码强度',
        value: '强',
        actions: {
          title: '修改',
          callback: () => {
            message.info('This is a normal message');
          },
        },
      },
      {
        title: '密保手机',
        description: '已绑定手机',
        value: '138****8293',
        actions: {
          title: '修改',
          callback: () => {
            message.success('This is a message of success');
          },
        },
      },
      {
        title: '密保问题',
        description: '未设置密保问题，密保问题可有效保护账户安全',
        value: '',
        actions: {
          title: '设置',
          callback: () => {
            message.error('This is a message of error');
          },
        },
      },
      {
        title: '备用邮箱',
        description: '已绑定邮箱',
        value: 'a****@163.com',
        actions: {
          title: '修改',
          callback: () => {
            message.warning('This is message of warning');
          },
        },
      },
    ]);
    return {
      listData,
    };
  },
});
</script>

<style lang="less" scoped></style>

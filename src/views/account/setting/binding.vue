<template>
  <div>
    <div class="account-setting-info">
      <a-list itemLayout="horizontal" :dataSource="listData">
        <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
          <a-list-item-meta>
            <div slot="title">
              <au-iconfont :type="item.icon"></au-iconfont>
              <span style="padding-left: 5px">{{ item.title }}</span>
            </div>
            <span slot="description">
              <span v-if="item.value">{{ item.value }}</span>
              <span v-else>当前未绑定{{ item.title }}账号</span>
            </span>
          </a-list-item-meta>
          <template v-if="item.actions">
            <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
          </template>
        </a-list-item>
      </a-list>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { message } from 'ant-design-vue';

export default defineComponent({
  setup() {
    const listData = reactive([
      {
        icon: 'qq',
        title: 'QQ',
        value: '179****255',
        actions: {
          title: '修改',
          callback: () => {
            message.info('This is a normal message');
          },
        },
      },
      {
        icon: 'wechat',
        title: '微信',
        value: '',
        actions: {
          title: '绑定',
          callback: () => {
            message.warn('This is a warn message');
          },
        },
      },
      {
        icon: 'github',
        title: 'Github',
        value: '',
        actions: {
          title: '绑定',
          callback: () => {
            message.warn('This is a warn message');
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

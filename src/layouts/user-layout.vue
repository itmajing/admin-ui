<template>
  <div class="au-user-layout">
    <div class="au-user-layout-content">
      <div class="au-user-layout-wrapper">
        <div class="au-user-layout-content-header">
          <img src="../assets/logo.png" alt="logo" />
          <span>Admin UI</span>
        </div>
        <a-card class="au-user-layout-content-body" :hoverable="true" :bordered="false">
          <router-view />
        </a-card>
      </div>
    </div>
    <div class="au-user-layout-footer">
      <span>Copyright © 2020 Admin UI</span>
    </div>
    <vue-particles class="au-user-layout-background"></vue-particles>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'UserLayout',
})
export default class UserLayout extends Vue {}
</script>

<style scoped lang="less">
@import '../style/index';
.au-user-layout {
  height: 100%;
  width: 100%;

  /*禁止复制文本*/
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  user-select: none;

  .au-user-layout-content {
    position: absolute;
    top: 120px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .au-user-layout-wrapper {
      .au-user-layout-content-header {
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          height: 44px;
        }

        span {
          margin-left: 15px;
          color: rgba(0, 0, 0, 0.85);
          font-weight: 600;
          font-size: 33px;
        }
      }

      .au-user-layout-content-body {
        width: 380px;
        margin-top: 36px;
        background-color: rgba(255, 255, 255, 0.1);
        border-color: rgba(0, 0, 0, 0.06);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

        &:hover {
          background-color: rgba(255, 255, 255, 0.6);
          border-color: rgba(0, 0, 0, 0.09);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
        }
      }
    }
  }

  .au-user-layout-footer {
    position: absolute;
    bottom: 0;
    height: 64px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .au-user-layout-background {
    width: 100%;
    height: 100%;
  }
}
</style>

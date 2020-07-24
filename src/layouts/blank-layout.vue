<template>
  <div class="au-blank-layout">
    <router-view />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'BlankLayout',
})
export default class BlankLayout extends Vue {}
</script>

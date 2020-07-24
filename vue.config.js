module.exports = {
  devServer: {
    port: 8080,
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js',
      },
    },
    plugins: [],
  },
}

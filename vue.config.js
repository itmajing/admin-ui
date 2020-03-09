module.exports = {
  devServer: {
    port: 8080
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  configureWebpack: {
    plugins: []
  }
};

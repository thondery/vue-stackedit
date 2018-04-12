const fs = require('fs')

module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      less: {
        data: fs.readFileSync('src/less/Bootstrapping/Variables.less', 'utf-8'),
        strictMath: 'on'
      }
    }
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.yml$/,
          use: [{ loader: 'raw-loader' }]
        }
      ]
    }
  }
}

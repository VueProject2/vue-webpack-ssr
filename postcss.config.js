const autoprefixer = require('autoprefixer')

module.exports = {
  plugins: [
    // 自动加载浏览器对应前缀：-webkit-等
    autoprefixer()
  ]
}

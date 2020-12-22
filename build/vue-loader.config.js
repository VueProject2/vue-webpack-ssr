module.exports = (isDev) => {
  return {
    preserveWhitepace: true, // 解决template中不小心打的空格
    extractCSS: !isDev // 生产环境中生效，处理vue文件中的css代码，将这些代码和其他css代码一样分离出去(事实上，不适用这个配置，vue文件中的css代码已经分离出去了)
    // hotReload: false,//控制是否启用热重载，虽然设置成false，修改页面内容，页面也会自动更新，但是不同的是false时会刷新页面更新，true时不刷新页面更新
  }
}

module.exports = {
    port: 3000,
    proxy: {
        '/api': {
            target: 'http://localhost:8888',
            changeOrigin: true
        }
    },
    optimizeDeps: {
        include: ['element-plus/lib/locale/lang/zh-cn']
    },

}

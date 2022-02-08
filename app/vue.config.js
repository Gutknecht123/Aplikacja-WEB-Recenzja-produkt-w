const bootstrapSassAbstractsImports = require('vue-cli-plugin-bootstrap-vue/sassAbstractsImports.js')
module.exports = {
	css: {
		loaderOptions: {
			sass: {
				additionalData: bootstrapSassAbstractsImports.join('\n')
			},
			scss: {
				additionalData: [...bootstrapSassAbstractsImports, ''].join(';\n')
			}
		}
	},
	chainWebpack: (config) => {
        // Disable prefetching and preloading
        config.plugins.delete('prefetch')
        config.plugins.delete('preload')
    },

	devServer: {
		proxy: 'http://192.168.1.12:8080/',
	}
}
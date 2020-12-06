module.exports = {configureWebpack: (config) => {
  config.module.rules = [
    {
      test: /\.worker\.js$/i,
      use: [
        {
          loader: 'comlink-loader',
          options: {
            singleton: true
          }
        }
      ]
    },
    {
      test: /\.scss$/,
      use: [
        'vue-style-loader',
        'css-loader',
        'sass-loader'
      ]
    },
    ...config.module.rules
  ]
}

}
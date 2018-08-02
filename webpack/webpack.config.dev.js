/**************************************
 * Created by Hertz on 2015年10月20日
 **************************************/
const path = require('path')
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

// webpack 配置
module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',

  entry: {
    // 热加载写法
    app: ['webpack-hot-middleware/client', './App.js'],
    css: ['webpack-hot-middleware/client', './style/bs_main.scss'],
  },

  output: {
    filename: '[name].js',

    // build时输出目录，不发布代码可以注释掉
    path: path.resolve(__dirname, 'build/lyj'),

    // 开发模式(文档译为观察模式)下输出的文件路径
    // server.html里的js路径需与这里保持一致
    publicPath: '/lyj',
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new BundleAnalyzerPlugin(), // 用于分析包大小的插件,启用后运行浏览器会自动弹出分析页面
  ],

  module: {
    rules: [
      { // js|jsx rules
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ]
      }, // end of js|jsx rules

      { // css rules
        test: /\.(scss|sass)$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ],
      }, // end of scss|sass rules

      { // css rules
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
        exclude: /flexboxgrid/
      }, // end of css rules

      { // flexboxgrid 不能用postcss-loader自动加前缀
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
        include: /flexboxgrid/
      }, // end of css rules

      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 100000
          }
        }]
      }
    ]
  }, // end of module
}

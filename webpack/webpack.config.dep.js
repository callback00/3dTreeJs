const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

// webpack 配置
module.exports = [
    // 打包 Web Components 代码
    {
        mode: 'production',
        context: path.resolve(__dirname, '..'),
        node: {
            __dirname: true
        },

        entry: {
            app: ['./App.js'],
            css: ['./style/bs_main.scss'],
        },

        output: {
            path: path.resolve(__dirname, '../dist/mobile'),
            filename: '[name].js',
            publicPath: '../dist',
        },

        // target: "node",

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
                        'sass-loader',
                    ]
                }, // end of scss|sass rules

                { // css rules
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'postcss-loader',
                    ]
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

        resolve: {
            extensions: ['.js', '.jsx']
        },

        plugins: [

            new webpack.ContextReplacementPlugin(
                /moment\/locale$/,
                /zh-cn/
            ),
        ]
    },
]

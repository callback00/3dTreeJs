// 该文件只是用于调试启动

const path = require('path')
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require("webpack-hot-middleware");
const proxy = require('express-http-proxy');

const app = express();
const config = require('./webpack/webpack.config.dev.js');
const compiler = webpack(config);

/**
 * 用于指定URL路径和服务器路径的映射
 */
const publicDir = path.resolve(__dirname, './public')

let options = {
    setHeaders: function (res, path, stat) {
        res.set('Access-Control-Allow-Origin', '*')
    }
}

app.use('/', express.static(publicDir, options))

// Tell express to use the webpack-dev-middleware and use the webpack.config.dev.js
// configuration file as a base.
// webpack-dev-middleware 是一个容器(wrapper)，它可以把 webpack 处理后的文件传递给一个服务器(server)
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

app.use(function (req, res) {
    res.sendFile('Server.html', { root: __dirname })
})

// Serve the files on port.app.listen只能监听http的服务，如果环境为https ,用 https.createServer(options, app).listen(443)，options为证书相关信息

const port = 8002
app.listen(port, function () {
    console.log(`manage web listening on http://localhost:${port} \n`);
});
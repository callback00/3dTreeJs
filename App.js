import React from 'react'
import ReactDOM from 'react-dom'
// import vConsole from 'vconsole'  // 手机端调试，生产环境注释掉
import { BrowserRouter as Router } from 'react-router-dom'

import Routes from './routes/CustRoutes'

// 这里需要babel转换，否则编译报错。同时必须配置.babelrc，webconfig中也要配置js需要babel-loader转换
const render = (Component) => {
  ReactDOM.render(
    <Router basename="/">
      <Component />
    </Router>,
    document.getElementById('app-mount')
  )
}

render(Routes)

// 热加载更新
if (module.hot) {
  module.hot.accept();
}

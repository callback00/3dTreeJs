import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'

import Index from '../examples/Index'
import threeJsFirst from '../examples/zother/3dFirst'
import threeJsSecond from '../examples/zother/3dSecond'
import threeJsThird from '../examples/zother/3dThird'
import threeJsFourth from '../examples/zother/3dFourth'
import threeJsFifth from '../examples/zother/3dFifth'
import threeJsSixth from '../examples/zother/3dSixth'
import threeJsSeventh from '../examples/zother/3dSeventh'
import threeJsEighth from '../examples/zother/3dEighth'
import threeJsNinth from '../examples/zother/3dNinth'
import threeJsTenth from '../examples/zother/3dTenth'

import threeJsPointLight from '../examples/zother/pointLight'
import threeJsSpotLight from '../examples/zother/spotLight'
import threeJsSpotLight_Example from '../examples/zother/spotLight_example'
import threeJsDirectionalLight from '../examples/zother/directionalLight'
import threeJsHemisphereLight from '../examples/zother/hemisphereLight'

import threeJsClickGeometry from '../examples/zother/clickGeometry'

class CustRoutes extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route path="/threeJsFirst" component={threeJsFirst} routeComponent={this} />
                    <Route path="/threeJsSecond" component={threeJsSecond} routeComponent={this} />
                    <Route path="/threeJsThird" component={threeJsThird} routeComponent={this} />
                    <Route path="/threeJsFourth" component={threeJsFourth} routeComponent={this} />
                    <Route path="/threeJsFifth" component={threeJsFifth} routeComponent={this} />
                    <Route path="/threeJsSixth" component={threeJsSixth} routeComponent={this} />
                    <Route path="/threeJsSeventh" component={threeJsSeventh} routeComponent={this} />
                    <Route path="/threeJsEighth" component={threeJsEighth} routeComponent={this} />
                    <Route path="/threeJsNinth" component={threeJsNinth} routeComponent={this} />
                    <Route path="/threeJsTenth" component={threeJsTenth} routeComponent={this} />

                    <Route path="/threeJsPointLight" component={threeJsPointLight} routeComponent={this} />
                    <Route path="/threeJsSpotLight" component={threeJsSpotLight} routeComponent={this} />
                    <Route path="/threeJsSpotLight_Example" component={threeJsSpotLight_Example} routeComponent={this} />
                    <Route path="/threeJsDirectionalLight" component={threeJsDirectionalLight} routeComponent={this} />
                    <Route path="/threeJsHemisphereLight" component={threeJsHemisphereLight} routeComponent={this} />

                    <Route path="/threeJsClickGeometry" component={threeJsClickGeometry} routeComponent={this} />
                    <Route path="/" component={Index} routeComponent={this} />
                </Switch>
            </div>
        )
    }
}

CustRoutes = withRouter(CustRoutes)

export default CustRoutes

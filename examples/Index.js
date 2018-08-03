import React, { Component } from 'react'

function ContextIndex(props) {
    return (
        <div>
            <a href={props.url} >{props.title}</a>
            <p>
                {props.describe}
            </p>
        </div>
    )
}

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div style={{ paddingTop: '50px' }} >
                <ContextIndex
                    url="/threeJsFirst"
                    title="第一节 (透视正方体) "
                    describe="旋转的透视正方体，初步学习如何创建scene、camera、renderer、mesh 以及如何使几何体旋转、移动。"
                />
                <ContextIndex
                    url="/threeJsSecond"
                    title="第二节 (线条)"
                    describe="学习如何创建线条几何体"
                />
                <ContextIndex
                    url="/threeJsThird"
                    title="第三节 (正方体 与 平面)"
                    describe="创建一个平面以及一个六面色正方体，学习如果改变几何体表面颜色"
                />
                <ContextIndex
                    url="/threeJsFourth"
                    title="第四节 (线条在坐标系中的透视投影)"
                    describe="使用线条创建网格，通过旋转线条了解线条在直接坐标系中的透视投影效果"
                />
                <ContextIndex
                    url="/threeJsFifth"
                    title="第五节 (Lambert材质与光源)"
                    describe="创建Lambert材质的几何体，了解光源的该材质的影响"
                />
                <ContextIndex
                    url="/threeJsSixth"
                    title="第六节 (纹理)"
                    describe="了解如何给材质贴上皮肤"
                />
                <ContextIndex
                    url="/threeJsSeventh"
                    title="第七节 (坐标系案例)"
                    describe="构建一个坐标系，使用dat.GUI组件控制变量，使用OrbitControls控制相机，设置阴影效果"
                />
                <ContextIndex
                    url="/threeJsEighth"
                    title="第八节 (上一篇的改进，添加光源控制调整)"
                    describe="上一篇可观察直角坐标系，这一篇添加了光源的调整，可观察光源对场景及物体的影响。例子还添加了一个多面体，可观察多面体的创建"
                />
                <ContextIndex
                    url="/threeJsNinth"
                    title="第九节 (相机)"
                    describe="相机"
                />
                <ContextIndex
                    url="/threeJsTenth"
                    title="第十节 (点光源与聚光灯光源)"
                    describe="切换光源了解点光源与聚光灯光源效果。"
                />

                <ContextIndex
                    url="/threeJsPointLight"
                    title="第十一节 (点光源)"
                    describe="深入了解点光源的参数"
                />

                <ContextIndex
                    url="/threeJsSpotLight"
                    title="第十二节 (聚光灯光源)"
                    describe="深入了解聚光灯光源的参数，以及平面材质对光源的接收影响"
                />

                <ContextIndex
                    url="/threeJsSpotLight_Example"
                    title="第十三节 (聚光灯光源制作舞台灯效果)"
                    describe="结合TWEEN.js动画库移动光源"
                />

                <ContextIndex
                    url="/threeJsDirectionalLight"
                    title="第十四节 (方向光)"
                    describe=""
                />

                <ContextIndex
                    url="/threeJsHemisphereLight"
                    title="第十五节 (半球光光源)"
                    describe="环境光+平行光+聚光+HemisphereLight 能创建出更贴近室内效果的灯光"
                />

                <ContextIndex
                    url="/threeJsClickGeometry"
                    title="第十六节 (获取点击物体)"
                    describe="学习如何获取点击的几何体对象"
                />

                <ContextIndex
                    url="/threeJsLensFlare"
                    title="第十七节 (光晕)"
                    describe="给PointLight添加光晕"
                />
            </div>
        )
    }
}

export default Index

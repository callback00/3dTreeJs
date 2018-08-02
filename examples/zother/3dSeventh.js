import React from 'react'
import * as dat from 'dat.gui';

// 直角坐标系案例
class Index extends React.Component {
    constructor(props) {
        super(props)

        this.cube = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.guiControls = {
            rotationSpeed: 0.02, // 旋转速度
            bouncingSpeed: 0.04, // 球弹跳速度
            x: 0, // 球体x轴坐标
            z: 0 // 球体z轴坐标
        }

        this.gui = null
    }

    componentDidMount() {
        /** 定义 dat.GUI 对象，并绑定 guiControls 的两个属性 */
        if (this.gui === null) { // 热加载无法销毁gui，每次保存之后热加载启动都会新增一个对象出来
            this.gui = new dat.GUI();

            this.gui.add(this.guiControls, 'rotationSpeed', 0, 0.5);
            this.gui.add(this.guiControls, 'bouncingSpeed', 0, 0.5);
            this.gui.add(this.guiControls, 'x', 0, 10);
            this.gui.add(this.guiControls, 'z', 0, 10);
        }
        this.init();
    }

    componentWillUnmount() {
        this.gui.destroy();
        console.log('销毁gui')
    }

    init() {
        // 获取浏览器窗口的宽高，后续会用
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;

        // 创建一个场景
        this.scene = new THREE.Scene();

        // 创建一个具有透视效果的摄像头
        this.camera = new THREE.PerspectiveCamera(15, width / height, 0.1, 800);
        this.camera.position.x = -20;
        this.camera.position.y = 240;
        this.camera.position.z = 100;

        this.camera.up.x = 0;
        this.camera.up.y = 1;
        this.camera.up.z = 0;
        this.camera.lookAt(this.scene.position);

        // 创建一个 WebGL 渲染器，Three.js 还提供 <canvas>, <svg>, CSS3D 渲染器。
        this.renderer = new THREE.WebGLRenderer({ antialias: true }); // antialias 抗锯齿
        // 设置渲染器的清除颜色（即背景色）和尺寸
        this.renderer.setClearColor(0xEEEEEE);
        this.renderer.setSize(width, height);

        // 加入该控件后可以自由调整视角，需要引入 OrbitControls.js (three.js自带的扩展库)
        const controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        //生成一个坐标轴，辅助线，坐标轴的参数 蓝色z轴 绿色y轴,橙色是x轴，尝试改变球体位置就可以验证轴方向
        const axes = new THREE.AxesHelper(20);

        //生成一个平面
        const planeGeometry = new THREE.PlaneGeometry(20, 20, 3, 3);
        //生成一个平面需要的材质，设置材质的颜色，设置为线框图(wireframe为true)便于观察透视图
        const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc, wireframe: false });
        //生成一个网格，将平面和材质放在一个网格中，组合在一起，组成一个物体
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI;

        //加入一个球体
        const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        const sphereMaterial = new THREE.MeshLambertMaterial({ color: '#FFCC99', wireframe: false });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);


        // 加入一个光源
        // 注：基础材质 MeshBasicMaterial 不会对光源产生反应，因此要改用 MeshLambertMaterial 或 MeshPhongMaterial 材质才有效果
        const spotLight = new THREE.SpotLight('#CCFFFF');
        spotLight.position.set(10, 60, 0);
        spotLight.castShadow = true; // 光源投射阴影
        spotLight.shadow.mapSize.width = 2048; // 必须是 2的幂，默认值为 512
        spotLight.shadow.mapSize.height = 2048; // 必须是 2的幂，默认值为 512

        //设置阴影效果
        this.renderer.shadowMap.enabled = true; // 首先要告诉 renderer 渲染器，我们需要阴影
        plane.receiveShadow = true; // 其次我们要明确指出让地面 plane 接受阴影，MeshBasicMaterial无法接收阴影
        sphere.castShadow = true; // 指出哪些物体投射阴影
        spotLight.castShadow = true; // 我们要指明哪个光源可以产生阴影，本示例为 spotLight

        // 将所有东西加入到场景中
        this.scene.add(this.camera);
        this.scene.add(axes);
        this.scene.add(plane);
        this.scene.add(sphere);
        this.scene.add(spotLight)

        // 将渲染器的输出（此处是 canvas 元素）插入到 组件中
        this.container.appendChild(this.renderer.domElement);

        // 渲染，即摄像头拍下此刻的场景
        this.animationRender(plane, sphere);
    }

    animationRender(plane, sphere, step = 0) {

        stats.update();

        // 旋转动画
        plane.rotation.z += this.guiControls.rotationSpeed; // 为什么平面不是沿Y轴转？ 看下平面是如何初始化 已经把z改成y后效果就知道了
        sphere.rotation.y += this.guiControls.rotationSpeed;

        // 弹跳球体，其实就是利用三角函数 正负值来处理 高低差
        step += this.guiControls.bouncingSpeed;
        // sphere.position.x = 20 + (10 * Math.cos(step)); //x轴弹跳
        sphere.position.y = 3.7 + (10 * Math.abs(Math.sin(step))); // y轴弹跳

        sphere.position.x = this.guiControls.x;
        sphere.position.z = this.guiControls.z;

        requestAnimationFrame(this.animationRender.bind(this, plane, sphere, step));

        this.renderer.render(this.scene, this.camera);
    }


    render() {
        return (
            <div ref={element => this.container = element} >
            </div>
        );
    };
};

export default Index
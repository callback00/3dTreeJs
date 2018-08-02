import React from 'react'
import * as dat from 'dat.gui';

// 直角坐标系案例
class Index extends React.Component {
    constructor(props) {
        super(props)

        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.gui = null;

        this.guiControls = {
            rotationSpeed: 0.02, // 旋转速度
            switchCamera: function () {
                if (this.camera instanceof THREE.PerspectiveCamera) {
                    this.camera = new THREE.OrthographicCamera(window.innerWidth / -20, window.innerWidth / 20,
                        window.innerHeight / 20, window.innerHeight / -20,
                        -200, 500);
                } else {
                    this.camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 800);
                }

                let target = this.scene.position.clone();
                const controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
                this.camera.position.x = -20;
                this.camera.position.y = 240;
                this.camera.position.z = 100;
                this.camera.lookAt(target);
            }.bind(this)

        }

        this.gui = null
    }

    componentDidMount() {
        /** 定义 dat.GUI 对象，并绑定 guiControls 的两个属性 */
        if (this.gui === null) { // 热加载无法销毁gui，每次保存之后热加载启动都会新增一个对象出来
            this.gui = new dat.GUI();
            this.gui.add(this.guiControls, 'rotationSpeed', 0, 0.5); // 后两位参数时值范围

            this.gui.add(this.guiControls, 'switchCamera');
        }

        this.start();
    }

    componentWillUnmount() {
        this.gui.destroy();
        console.log('销毁gui')
    }

    start() {

        // 初始化相机，场景，渲染器，坐标轴
        this.initBase();

        // 将场景赋值给控制器
        this.guiControls.scene = this.scene;

        // 初始化一个平面作为参照物
        this.initPlane();

        // 初始化环境光源
        this.initAmbientLight();

        // 初始化点光源
        this.initSpotLight();

        // 初始化几何体
        this.initGeometry();

        // 设置阴影
        this.initShadow();

        // 渲染，即摄像头拍下此刻的场景
        this.animationRender();
    }

    // 初始化相机，场景，渲染器，坐标轴
    initBase() {
        // 获取浏览器窗口的宽高
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
        const axes = new THREE.AxesHelper(50);

        // 将相机、坐标轴优先加入场景中
        this.scene.add(this.camera);
        this.scene.add(axes);

        // 将渲染器的输出（此处是 canvas 元素）插入到 组件中
        this.container.appendChild(this.renderer.domElement);
    }

    // 初始化一个平面作为参照物
    initPlane() {
        //生成一个平面
        const planeGeometry = new THREE.PlaneGeometry(100, 100, 3, 3);
        //生成一个平面需要的材质，设置材质的颜色，设置为线框图(wireframe为true)可便于观察透视图(这里不需要观察了)
        const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc, wireframe: false });
        //生成一个网格，将平面和材质放在一个网格中，组合在一起，组成一个物体
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI; // 沿着 X轴旋转-90°
        plane.name = 'example-ninth-plane' // 给平面命名

        this.scene.add(plane); // 将平面加入场景
    }

    // 初始化环境光源
    initAmbientLight() {
        // 加入一个环境光源
        const ambientLight = new THREE.AmbientLight(0x0C0C0C);

        this.scene.add(ambientLight);
    }

    // 初始化聚光灯光源
    initSpotLight() {
        // 注：基础材质 MeshBasicMaterial 不会对光源产生反应，因此几何体材质要改用 MeshLambertMaterial 或 MeshPhongMaterial 材质才有效果
        const spotLight = new THREE.SpotLight('#CCFFFF');
        spotLight.position.set(50, 60, 0);
        spotLight.shadow.mapSize.width = 4000; // 必须是 2的幂，默认值为 512
        spotLight.shadow.mapSize.height = 4000; // 必须是 2的幂，默认值为 512

        spotLight.name = 'example-ninth-spotLight'
        this.scene.add(spotLight);
    }

    // 初始化几何体
    initGeometry() {

        // 加入一个球体, 为了看清楚球旋转的效果，后两位参数设置得小一点
        const sphereGeometry = new THREE.SphereGeometry(4, 20, 100);
        const sphereMaterial = new THREE.MeshLambertMaterial({ color: '#FFCC99', wireframe: false });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        sphere.position.y = 10;

        sphere.name = 'example-ninth-sphere';
        this.scene.add(sphere);

        // 创建一个长宽高均为 4 个单位长度的立方体（几何体）
        const cubeGeometry = new THREE.BoxGeometry(8, 8, 8);

        // 创建材质
        const cubeMaterial = new THREE.MeshBasicMaterial({
            color: 'rgb(108, 174, 221)',
            wireframe: true
        });

        // 创建一个立方体网格（mesh）：将材质包裹在几何体上
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        cube.position.x = 15;
        cube.position.y = 4;

        this.scene.add(cube);
    }

    // 设置阴影
    initShadow() {
        this.renderer.shadowMap.enabled = true; // 首先要告诉 renderer 渲染器，我们需要阴影

        const plane = this.scene.getObjectByName('example-ninth-plane')
        plane.receiveShadow = true; // 其次我们要明确指出让地面 plane 接受阴影，MeshBasicMaterial无法接收阴影

        const sphere = this.scene.getObjectByName('example-ninth-sphere')
        sphere.castShadow = true; // 指出哪些物体投射阴影

        const spotLight = this.scene.getObjectByName('example-ninth-spotLight')
        spotLight.castShadow = true; // 要指明哪个光源可以产生阴影，本示例为 spotLight
    }

    // 渲染
    animationRender() {

        stats.update();

        const plane = this.scene.getObjectByName('example-ninth-plane')
        this.rotateCube(plane);

        requestAnimationFrame(this.animationRender.bind(this));

        this.renderer.render(this.scene, this.camera);
    }

    /** 转动立方体 */
    rotateCube(plane) {
        // 遍历整个场景
        this.scene.traverse(function (e) {
            if (e instanceof THREE.Mesh && e !== plane) {
                e.rotation.y += this.guiControls.rotationSpeed;
            }
        }.bind(this));
    }

    render() {
        return (
            <div ref={element => this.container = element} >
            </div>
        );
    };
};

export default Index
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
            step: 0,

            ambientColor: 0xffffff, // 环境光颜色
            disableAmbientLight: false,
            disableLight: false, // 关闭或打开非环境光源

            lightColor: 0xac6c25, // 光源颜色


            intensity: 0.5, // 光照强度
            distance: 0, // 光照距离
            target: 'Plane',
        }

        this.gui = null
    }

    componentDidMount() {

        this.start();

        this.initGui();
    }

    componentWillUnmount() {
        if (this.gui) {
            this.gui.destroy();
            console.log('销毁gui')
        }
    }

    initGui() {
        let gui = this.gui
        /** 定义 dat.GUI 对象，并绑定 guiControls 的两个属性 */
        if (gui === null) { // 热加载无法销毁gui，每次保存之后热加载启动都会新增一个对象出来
            gui = new dat.GUI();
            gui.add(this.guiControls, 'rotationSpeed', 0, 0.5); // 后两位参数时值范围

            const scene = this.scene;

            const ambientLight = scene.getObjectByName('example-ambientLight')
            const light = scene.getObjectByName('example-light')

            gui.addColor(this.guiControls, 'ambientColor').onChange((e) => {
                ambientLight.color = new THREE.Color(e);
            });

            gui.add(this.guiControls, 'disableAmbientLight').onChange((e) => {
                ambientLight.visible = !e;
            });

            gui.addColor(this.guiControls, 'lightColor').onChange((e) => {
                light.color = new THREE.Color(e);
            });

            gui.add(this.guiControls, 'intensity', 0, 3).onChange(function (e) {
                light.intensity = e;
            });
            gui.add(this.guiControls, 'distance', 0, 100).onChange(function (e) {
                light.distance = e;
            });
            gui.add(this.guiControls, 'target', ['Plane', 'Cube', 'Sphere']).onChange(function (e) {

                const plane = scene.getObjectByName('example-plane');
                const cube = scene.getObjectByName('example-cube');
                const sphere = scene.getObjectByName('example-sphere');
                const directionalLight = scene.getObjectByName('example-light');
                switch (e) {
                    case 'Plane':
                        directionalLight.target = plane;
                        break;
                    case 'Cube':
                        directionalLight.target = cube;
                        break;
                    case 'Sphere':
                        directionalLight.target = sphere;
                        break;
                }
            });

            gui.add(this.guiControls, 'disableLight').onChange((e) => {
                light.visible = !e;
            });
        }
    }

    start() {

        // 初始化相机，场景，渲染器，坐标轴
        this.initBase();

        // 初始化一个平面作为参照物
        this.initPlane();

        // 初始化环境光源
        this.initAmbientLight();

        // 初始化光源
        this.initLight();

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
        this.camera.position.x = 150;
        this.camera.position.y = 140;
        this.camera.position.z = 200;

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
        const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x808080, wireframe: false });
        //生成一个网格，将平面和材质放在一个网格中，组合在一起，组成一个物体
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI; // 沿着 X轴旋转-90°
        plane.name = 'example-plane' // 给平面命名

        this.scene.add(plane); // 将平面加入场景
    }

    // 初始化环境光源
    initAmbientLight() {
        // 加入一个环境光源
        const ambientLight = new THREE.AmbientLight(0xffffff);
        ambientLight.name = 'example-ambientLight';
        this.scene.add(ambientLight);
    }

    // 初始化光源
    initLight() {

        // 加入一个方向光：color 颜色, intensity 强度
        const light = new THREE.DirectionalLight(0xac6c25, 0.5);
        light.position.set(10, 15, 3);
        light.distance = 0;
        light.shadow.mapSize.set(2048, 2048); // 必须是 2的幂，默认值为 512
        light.shadow.camera.near = 2;
        light.shadow.camera.far = 100;
        light.shadow.camera.left = -50;
        light.shadow.camera.right = 50;
        light.shadow.camera.top = 50;
        light.shadow.camera.bottom = -50;
        light.name = 'example-light'

        const plane = this.scene.getObjectByName('example-plane');
        light.target = plane;

        // 加入一个小球体来表示点光源位置
        const sphereGeometry = new THREE.SphereGeometry(0.2, 20, 20);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xac6c25 });
        const lightMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

        light.add(lightMesh)
        this.scene.add(light);

        const shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera);
        shadowCameraHelper.name = "shadowCameraHelper";
        this.scene.add(shadowCameraHelper);
    }

    // 初始化几何体
    initGeometry() {

        // 加入一个球体, 为了看清楚球旋转的效果，后两位参数设置得小一点
        const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        const sphereMaterial = new THREE.MeshLambertMaterial({ color: '#FFCC99', wireframe: false });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.x = 20;
        sphere.position.y = 4;
        sphere.position.z = 2;
        sphere.name = 'example-sphere';
        this.scene.add(sphere);


        // 加入一个立方体
        const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xFF7777 });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.x = -4;
        cube.position.y = 3;
        cube.position.z = 0;
        cube.name = 'example-cube';
        this.scene.add(cube);

    }

    // 设置阴影
    initShadow() {
        this.renderer.shadowMap.enabled = true; // 首先要告诉 renderer 渲染器，我们需要阴影

        const plane = this.scene.getObjectByName('example-plane')
        plane.receiveShadow = true; // 其次我们要明确指出让地面 plane 接受阴影，MeshBasicMaterial无法接收阴影

        const sphere = this.scene.getObjectByName('example-sphere')
        sphere.castShadow = true; // 指出哪些物体投射阴影

        const cube = this.scene.getObjectByName('example-cube')
        cube.castShadow = true; // 立方体投射阴影

        const light = this.scene.getObjectByName('example-light')
        light.castShadow = true; // 要指明哪个光源可以产生阴影，本示例为 light
    }

    // 渲染
    animationRender() {

        stats.update();

        this.rotateCube();
        this.bounceSphere();

        requestAnimationFrame(this.animationRender.bind(this));

        this.renderer.render(this.scene, this.camera);
    }

    /** 转动立方体 */
    rotateCube() {
        const plane = this.scene.getObjectByName('example-plane')
        // 遍历整个场景
        this.scene.traverse(function (e) {
            if (e instanceof THREE.Mesh && e !== plane) {
                e.rotation.y += this.guiControls.rotationSpeed;
            }
        }.bind(this));
    }

    /** 弹跳球体 */
    bounceSphere() {

        const sphere = this.scene.getObjectByName('example-sphere')
        this.guiControls.step += 0.02
        sphere.position.x = 20 + (10 * Math.cos(this.guiControls.step));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(this.guiControls.step)));
    }


    render() {
        return (
            <div ref={element => this.container = element} >
            </div>
        );
    };
};

export default Index
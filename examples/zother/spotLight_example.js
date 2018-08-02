import React from 'react'

// 与spotLight.js对比， 发现材质对阴影的形成也有影响
class Index extends React.Component {
    constructor(props) {
        super(props)

        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.clock = new THREE.Clock();

    }

    componentDidMount() {
        this.start();
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

        this.animateLight();
    }

    // 初始化相机，场景，渲染器，坐标轴
    initBase() {
        // 获取浏览器窗口的宽高
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;

        // 创建一个场景
        this.scene = new THREE.Scene();

        // 创建一个具有透视效果的摄像头
        this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
        this.camera.position.x = 150;
        this.camera.position.y = 140;
        this.camera.position.z = 200;

        this.camera.up.x = 0;
        this.camera.up.y = 1;
        this.camera.up.z = 0;
        this.camera.lookAt(this.scene.position);

        // 创建一个 WebGL 渲染器，Three.js 还提供 <canvas>, <svg>, CSS3D 渲染器。
        this.renderer = new THREE.WebGLRenderer({ antialias: true }); // antialias 抗锯齿
        // 设置设备像素比，防止在retina等屏幕上出现图像变形、模糊等显示问题
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Gamma 校正补偿了不同输出设备存在的颜色显示差异，从而使图像在不同的监视器上呈现出相同的效果。从设置上来看是处理了灰度，使得图片显得明亮
        this.renderer.gammaInput = true;  // 如果设置，则它预期所有纹理和颜色都是预乘的伽马。
        this.renderer.gammaOutput = true; // 如果设置，则期望所有纹理和颜色需要在预乘伽马中输出。

        // 设置渲染器的清除颜色（即背景色）和尺寸
        this.renderer.setClearColor(0xEEEEEE);
        this.renderer.setSize(width, height);

        // 加入该控件后可以自由调整视角，需要引入 OrbitControls.js (three.js自带的扩展库)
        const controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        controls.minDistance = 20;
        controls.maxDistance = 500;

        //生成一个坐标轴，辅助线，坐标轴的参数 蓝色z轴 绿色y轴,橙色是x轴，尝试改变球体位置就可以验证轴方向
        const axes = new THREE.AxesHelper(50);

        // 将相机、坐标轴优先加入场景中
        this.scene.add(this.camera);
        this.scene.add(axes);

        // 将渲染器的输出（此处是 canvas 元素）插入到 组件中
        this.container.appendChild(this.renderer.domElement);
    }

    // 初始化环境光源
    initAmbientLight() {
        // 加入一个环境光源, AmbientLight( color : Integer, intensity : Float )
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        ambientLight.name = 'example-ambientLight';
        this.scene.add(ambientLight);
    }

    // 初始化光源
    initLight() {
        this.createSpotlight(0xff0040, 'light1');
        this.createSpotlight(0x0040ff, 'light2');
        this.createSpotlight(0x80ff80, 'light3');
        this.createSpotlight(0xffaa00, 'light4');
    }

    createSpotlight(color, name) {
        // color 颜色, intensity 强度, distance 距离, angle 散射角, penumbra 衰减百分比, decay 衰减
        const light = new THREE.SpotLight(color, 2);
        light.distance = 100;
        light.angle = 0.3;
        light.penumbra = 0.2;
        light.decay = 2;

        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;

        // 加入一个小球体来表示点光源位置
        const sphereGeometry = new THREE.SphereGeometry(0.2, 20, 20);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color });
        const lightMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

        light.name = name;
        light.add(lightMesh);

        const lightHelper = new THREE.SpotLightHelper(light);
        lightHelper.name = "lightHelper-" + name;

        this.scene.add(lightHelper);
        this.scene.add(light);
    }

    createPointlight(color, name) {
        const light = new THREE.PointLight(color, 2);
        light.distance = 100;
        light.angle = 0.3;
        light.penumbra = 0.2;
        light.decay = 2;

        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;

        // 加入一个小球体来表示点光源位置
        const sphereGeometry = new THREE.SphereGeometry(0.2, 20, 20);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color });
        const lightMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

        light.name = name;
        light.add(lightMesh);

        const lightHelper = new THREE.PointLightHelper(light);
        lightHelper.name = "lightHelper-" + name;

        this.scene.add(lightHelper);

        this.scene.add(light);
    }

    // 初始化一个平面作为参照物，该平面与前面例子的材质不同，用的是MeshPhongMaterial， 通过它可以创建一种光亮表面的材质效果
    initPlane() {
        // dithering 是否应用抖动来消除带状现象。默认为false
        const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x808080, dithering: true });

        const planeGeometry = new THREE.PlaneBufferGeometry(500, 500);

        //生成一个网格，将平面和材质放在一个网格中，组合在一起，组成一个物体
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI; // 沿着 X轴旋转-90°
        plane.name = 'example-plane' // 给平面命名

        this.scene.add(plane); // 将平面加入场景
    }

    // 初始化几何体
    initGeometry() {

        // 加入一个立方体
        const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xFF7777 });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.y = 5;
        cube.name = 'example-cube';
        this.scene.add(cube);

    }

    // 设置阴影
    initShadow() {

        // 光源的阴影已在创建时赋值

        this.renderer.shadowMap.enabled = true; // 首先要告诉 renderer 渲染器，我们需要阴影
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const plane = this.scene.getObjectByName('example-plane')
        plane.receiveShadow = true; // 其次我们要明确指出让地面 plane 接受阴影，MeshBasicMaterial无法接收阴影

        const cube = this.scene.getObjectByName('example-cube')
        cube.castShadow = true; // 立方体投射阴影
    }

    // 渲染
    animationRender() {

        requestAnimationFrame(this.animationRender.bind(this));

        stats.update();

        const lightHelper1 = this.scene.getObjectByName('lightHelper-light1');
        const lightHelper2 = this.scene.getObjectByName('lightHelper-light2');
        const lightHelper3 = this.scene.getObjectByName('lightHelper-light3');
        const lightHelper4 = this.scene.getObjectByName('lightHelper-light4');
        if (lightHelper1) lightHelper1.update();
        if (lightHelper2) lightHelper2.update();
        if (lightHelper3) lightHelper3.update();
        if (lightHelper4) lightHelper4.update();

        TWEEN.update()

        this.renderer.render(this.scene, this.camera);
    }

    animateLight() {

        const light1 = this.scene.getObjectByName('light1');
        const light2 = this.scene.getObjectByName('light2');
        const light3 = this.scene.getObjectByName('light3');
        const light4 = this.scene.getObjectByName('light4');

        this.renderLight(light1);
        this.renderLight(light2);
        this.renderLight(light3);
        this.renderLight(light4);

        setTimeout(this.animateLight.bind(this), 5000);

    }

    renderLight(light) {

        // to的第二个参数是整个过程的时间
        new TWEEN.Tween(light).to({
            angle: (Math.random() * 0.7) + 0.1,
            penumbra: Math.random() + 1
        }, Math.random() * 3000 + 2000)
            .easing(TWEEN.Easing.Quadratic.Out).start();

        new TWEEN.Tween(light.position).to({
            x: (Math.random() * 30) - 15,
            y: (Math.random() * 10) + 15,
            z: (Math.random() * 30) - 15
        }, Math.random() * 3000 + 2000)
            .easing(TWEEN.Easing.Quadratic.Out).start();
    }

    render() {
        return (
            <div ref={element => this.container = element} >
            </div>
        );
    };
};

export default Index
import React from 'react'
import * as dat from 'dat.gui';

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

            planeMaterial: 'MeshPhong',

            ambientColor: 0xffffff, // 环境光颜色
            disableAmbientLight: false,
            disableLight: false, // 关闭或打开非环境光源

            lightColor: 0xffffff, // 光源颜色

            intensity: 1, // 光照强度
            distance: 200, // 光照距离
            angle: Math.PI / 4, // 散射角
            penumbra: 0.05, // 衰减百分比
            decay: 2, // 衰减
            near: 2,
            far: 200,

            debug: false,
        };

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.tubeMat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.6});
	    this.tube = null;
    }

    componentDidMount() {

        this.start();

        this.initGui();

        document.documentElement.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
        document.documentElement.addEventListener('mousedown', this.onDocumentMouseDown.bind(this));
    }

    componentWillUnmount() {

        document.documentElement.removeEventListener("mousemove", this.onDocumentMouseMove.bind(this));
        document.documentElement.removeEventListener("mousedown", this.onDocumentMouseDown.bind(this));

        if (this.gui) {
            this.gui.destroy();
            console.log('销毁gui')
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

        this.createHighlightBox();

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
        // 注：基础材质 MeshBasicMaterial 不会对光源产生反应，因此几何体材质要改用 MeshLambertMaterial 或 MeshPhongMaterial 材质才有效果
        // 加入一个点光源：color 颜色, intensity 强度, distance 距离, angle 散射角, penumbra 衰减百分比, decay 衰减
        const light = new THREE.SpotLight(0xffffff, 1, 200, Math.PI / 4, 0.05, 2);
        light.position.set(15, 40, 35);

        light.name = 'example-light'

        // 加入一个小球体来表示点光源位置
        const sphereGeometry = new THREE.SphereGeometry(0.2, 20, 20);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xac6c25 });
        const lightMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

        light.add(lightMesh)
        this.scene.add(light);
    }

    // 初始化一个平面作为参照物，该平面与前面例子的材质不同，用的是MeshPhongMaterial， 通过它可以创建一种光亮表面的材质效果
    initPlane() {
        // dithering 是否应用抖动来消除带状现象。默认为false
        const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x808080, dithering: true, side: THREE.DoubleSide });

        const planeGeometry = new THREE.PlaneBufferGeometry(500, 500);

        //生成一个网格，将平面和材质放在一个网格中，组合在一起，组成一个物体
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI; // 沿着 X轴旋转-90°
        plane.name = 'example-plane' // 给平面命名

        this.scene.add(plane); // 将平面加入场景
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

        // 创建柱体
        const cylinderGeometry = new THREE.CylinderGeometry(2, 2, 20);
        const cylinderMaterial = new THREE.MeshLambertMaterial({ color: 0x77ff77 });
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.name = 'example-cylinder';
        cylinder.position.set(0, 0, 5);
        this.scene.add(cylinder);
    }


    /** 创建包围盒 */
    createHighlightBox() {
        const box = new THREE.Box3();
        box.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), new THREE.Vector3(8, 8, 8));
        const highlightBox = new THREE.Box3Helper(box, 0xffff00);
        highlightBox.visible = true;
        this.scene.add(highlightBox);
    }


    // 设置阴影
    initShadow() {
        this.renderer.shadowMap.enabled = true; // 首先要告诉 renderer 渲染器，我们需要阴影
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const plane = this.scene.getObjectByName('example-plane')
        plane.receiveShadow = true; // 其次我们要明确指出让地面 plane 接受阴影，MeshBasicMaterial无法接收阴影

        const sphere = this.scene.getObjectByName('example-sphere')
        sphere.castShadow = true; // 指出哪些物体投射阴影

        const cube = this.scene.getObjectByName('example-cube')
        cube.castShadow = true; // 立方体投射阴影

        const light = this.scene.getObjectByName('example-light')
        light.castShadow = true; // 要指明哪个光源可以产生阴影，本示例为 spotLight
        light.shadow.mapSize.width = 512; // 必须是 2的幂，默认值为 512，这两个值越大阴影越清晰
        light.shadow.mapSize.height = 512; // 必须是 2的幂，默认值为 512，这两个值越大阴影越清晰
        light.shadow.camera.near = 10;
        light.shadow.camera.far = 200;
    }

    // 渲染
    animationRender() {

        stats.update();

        this.rotateCube();
        this.bounceSphere();

        const shadowCameraHelper = this.scene.getObjectByName('shadowCameraHelper')
        const lightHelper = this.scene.getObjectByName('lightHelper')
        if (shadowCameraHelper && lightHelper) {
            lightHelper.update();
            shadowCameraHelper.update();
        }

        requestAnimationFrame(this.animationRender.bind(this));

        this.renderer.render(this.scene, this.camera);
    }

    // 光源模型处理
    updateShadowCamera() {
        const light = this.scene.getObjectByName('example-light')
        light.shadow.camera.near = this.guiControls.near;
        light.shadow.camera.far = this.guiControls.far;

        if (this.guiControls.debug) {
            this.scene.remove(this.scene.getObjectByName('shadowCameraHelper'));
            const shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera); // 用来表示聚光灯相机的几何线框
            shadowCameraHelper.name = "shadowCameraHelper";
            this.scene.add(shadowCameraHelper);

            this.scene.remove(this.scene.getObjectByName('lightHelper'));
            const lightHelper = new THREE.SpotLightHelper(light);         // 用来表示聚光灯属性的几何线框
            lightHelper.name = "lightHelper";
            this.scene.add(lightHelper);
        } else {
            this.scene.remove(this.scene.getObjectByName('shadowCameraHelper'));
            this.scene.remove(this.scene.getObjectByName('lightHelper'));
        }
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

    // 建立控制器
    initGui() {
        let gui = this.gui

        const updateShadowCamera = this.updateShadowCamera.bind(this)
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
            gui.add(this.guiControls, 'distance', 0, 10000).onChange(function (e) {
                light.distance = e;
            });
            gui.add(this.guiControls, 'angle', 0, 2 * Math.PI).onChange(function (e) {
                light.angle = e;
            });
            gui.add(this.guiControls, 'penumbra', 0.0, 1.0).onChange(function (e) {
                light.penumbra = e;
            });
            gui.add(this.guiControls, 'decay', 0, 30).onChange(function (e) {
                light.decay = e;
            });
            gui.add(this.guiControls, 'near', 2, 20).onChange(function (e) {
                updateShadowCamera();
            });
            gui.add(this.guiControls, 'far', 20, 200).onChange(function (e) {
                updateShadowCamera();
            });

            gui.add(this.guiControls, 'disableLight').onChange((e) => {
                light.visible = !e;
            });

            gui.add(this.guiControls, 'debug').onChange((e) => {
                updateShadowCamera();
            });

            gui.add(this.guiControls, 'planeMaterial', ['MeshPhong', 'MeshLambert']).onChange((e) => {

                this.scene.remove(this.scene.getObjectByName('example-plane'))

                let planeMaterial = null;
                let planeGeometry = null;
                switch (e) {
                    case 'MeshPhong':
                        planeMaterial = new THREE.MeshPhongMaterial({ color: 0x808080, dithering: true });
                        planeGeometry = new THREE.PlaneBufferGeometry(500, 500);
                        break;
                    case 'MeshLambert':
                        planeMaterial = new THREE.MeshLambertMaterial({ color: 0x808080, wireframe: false });
                        planeGeometry = new THREE.PlaneBufferGeometry(500, 500, 10, 10);
                        break;
                }

                const plane = new THREE.Mesh(planeGeometry, planeMaterial);
                plane.rotation.x = -0.5 * Math.PI; // 沿着 X轴旋转-90°
                plane.name = 'example-plane' // 给平面命名

                plane.receiveShadow = true;

                scene.add(plane); // 将平面加入场景
            });
        }
    }

    onDocumentMouseMove(event) {
        event.preventDefault();
        const camera = this.camera;
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // 把屏幕坐标转成 three.js 三维坐标
        const mouse3d = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
        mouse3d.unproject(camera);
        const dir = mouse3d.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const pos3d = camera.position.clone().add(dir.multiplyScalar(distance));

        //console.log('pos3d: ' + pos3d.x + ', ' + pos3d.y + ', ' + pos3d.z);

        if (this.tube) this.scene.remove(this.tube);
        // if (guiParams.showRay == false)
        // 	return;

        // 加入一束射线
        const linePoints = [];
        linePoints.push(new THREE.Vector3(camera.position.x, camera.position.y - 0.2, camera.position.z));
        linePoints.push(new THREE.Vector3(pos3d.x, pos3d.y, pos3d.z));
        const tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(linePoints), 60, 0.001);

        this.tube = new THREE.Mesh(tubeGeometry, this.tubeMat);
        this.tube.name = 'tube';
        this.scene.add(this.tube);
    }

    /** 鼠标移动处理函数 */
    onDocumentMouseDown(event) {
        event.preventDefault();
        if (event.target.tagName != 'CANVAS')
            return;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children,
            false);
        if (intersects.length < 1) {
            // highlightBox.visible = false;
            return;
        }
        const intersected = intersects[0].object;

        console.log(intersected)
        // intersected.geometry.computeBoundingBox();
        // highlightBox.box.setFromCenterAndSize(intersected.position, intersected.geometry.boundingBox.getSize().multiplyScalar(1.03));
        // highlightBox.visible = true;
    }

    render() {
        return (
            <div ref={element => this.container = element} >
            </div>
        );
    };
};

export default Index
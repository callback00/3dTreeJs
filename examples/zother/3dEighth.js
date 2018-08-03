import React from 'react'
import * as dat from 'dat.gui';

// 直角坐标系案例
class Index extends React.Component {
    constructor(props) {
        super(props)

        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.controlPoints = []

        this.gui = null;

        this.guiControls = {
            rotationSpeed: 0.02, // 旋转速度
            scene: null,
            ambientColor: '#0c0c0c',
            disableSpotLight: false,

            // 克隆处理函数
            clone: function () {
                const mesh = this.scene.getObjectByName('Geometry-4')
                var cloneGeometry = mesh.children[0].geometry.clone();
                var materials = [
                    new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0xff44ff, transparent: true }),
                    new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })

                ];
                var cloneMesh = THREE.SceneUtils.createMultiMaterialObject(cloneGeometry, materials);
                cloneMesh.children.forEach(function (e) {
                    e.castShadow = true;
                });

                cloneMesh.translateX(5);
                cloneMesh.translateZ(5);

                cloneMesh.name = "cloneMesh";
                this.scene.remove(this.scene.getObjectByName("cloneMesh"));
                this.scene.add(cloneMesh);
            }
        }
    }

    componentDidMount() {

        // 加入一个六面体的顶点集合，确定一个六面体只需8个顶点
        this.controlPoints.push({ x: 3, y: 5, z: 3 });
        this.controlPoints.push({ x: 3, y: 5, z: 0 });
        this.controlPoints.push({ x: 3, y: 0, z: 3 });
        this.controlPoints.push({ x: 3, y: 0, z: 0 });
        this.controlPoints.push({ x: 0, y: 5, z: 0 });
        this.controlPoints.push({ x: 0, y: 5, z: 3 });
        this.controlPoints.push({ x: 0, y: 0, z: 0 });
        this.controlPoints.push({ x: 0, y: 0, z: 3 });

        this.start();

        this.initGui();
    }

    componentWillUnmount() {
        this.gui.destroy();
        console.log('销毁gui')
    }

    initGui() {
        /** 定义 dat.GUI 对象，并绑定 guiControls 的两个属性 */
        if (this.gui === null) { // 热加载无法销毁gui，每次保存之后热加载启动都会新增一个对象出来
            this.gui = new dat.GUI();
            this.gui.add(this.guiControls, 'rotationSpeed', 0, 0.5); // 后两位参数时值范围
            this.gui.add(this.guiControls, 'clone');

            const scene = this.scene;
            this.gui.addColor(this.guiControls, 'ambientColor').onChange((e) => {
                const ambientLight = scene.getObjectByName('example-eighth-ambientLight')
                ambientLight.color = new THREE.Color(e);
            });

            this.gui.add(this.guiControls, 'disableSpotLight').onChange((e) => {
                const spotLight = scene.getObjectByName('example-eighth-spotLight')
                spotLight.visible = !e;
            });


            for (let i = 0; i < 8; i++) {
                const folder = this.gui.addFolder('Vertices ' + (i + 1));
                folder.add(this.controlPoints[i], 'x', -10, 10); // 后两位参数时值范围
                folder.add(this.controlPoints[i], 'y', -10, 10); // 后两位参数时值范围
                folder.add(this.controlPoints[i], 'z', -10, 10); // 后两位参数时值范围
            }
        }
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
        plane.name = 'example-eighth-plane' // 给平面命名

        this.scene.add(plane); // 将平面加入场景
    }

    // 初始化环境光源
    initAmbientLight() {
        // 加入一个环境光源
        const ambientLight = new THREE.AmbientLight(0x0C0C0C);
        ambientLight.name = 'example-eighth-ambientLight';
        this.scene.add(ambientLight);
    }

    // 初始化聚光灯光源
    initSpotLight() {
        // 注：基础材质 MeshBasicMaterial 不会对光源产生反应，因此几何体材质要改用 MeshLambertMaterial 或 MeshPhongMaterial 材质才有效果
        const spotLight = new THREE.SpotLight('#CCFFFF');
        spotLight.position.set(50, 60, 0);
        spotLight.shadow.mapSize.width = 4000; // 必须是 2的幂，默认值为 512
        spotLight.shadow.mapSize.height = 4000; // 必须是 2的幂，默认值为 512

        spotLight.name = 'example-eighth-spotLight'
        this.scene.add(spotLight);
    }

    // 初始化几何体
    initGeometry() {

        // 加入一个球体, 为了看清楚球旋转的效果，后两位参数设置得小一点
        const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        const sphereMaterial = new THREE.MeshLambertMaterial({ color: '#FFCC99', wireframe: false });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        sphere.position.y = 10;

        sphere.name = 'example-eighth-sphere';
        this.scene.add(sphere);

        // 再加入一个多面体几何体
        this.addGeomtries();
    }

    // 设置阴影
    initShadow() {
        this.renderer.shadowMap.enabled = true; // 首先要告诉 renderer 渲染器，我们需要阴影

        const plane = this.scene.getObjectByName('example-eighth-plane')
        plane.receiveShadow = true; // 其次我们要明确指出让地面 plane 接受阴影，MeshBasicMaterial无法接收阴影

        const sphere = this.scene.getObjectByName('example-eighth-sphere')
        sphere.castShadow = true; // 指出哪些物体投射阴影

        const spotLight = this.scene.getObjectByName('example-eighth-spotLight')
        spotLight.castShadow = true; // 要指明哪个光源可以产生阴影，本示例为 spotLight
    }

    // 渲染
    animationRender() {

        stats.update();

        const plane = this.scene.getObjectByName('example-eighth-plane')
        this.rotateCube(plane);

        this.updateMesh()

        requestAnimationFrame(this.animationRender.bind(this));

        this.renderer.render(this.scene, this.camera);
    }

    /** 添加多面体物体 */
    addGeomtries() {
        // 通过一系列点创建物体
        const vertices = [
            new THREE.Vector3(1, 3, 1),
            new THREE.Vector3(1, 3, -1),
            new THREE.Vector3(1, -1, 1),
            new THREE.Vector3(1, -1, -1),
            new THREE.Vector3(-1, 3, -1),
            new THREE.Vector3(-1, 3, 1),
            new THREE.Vector3(-1, -1, -1),
            new THREE.Vector3(-1, -1, 1)
        ];

        // new THREE.Face3(0, 1, 2)创建一个三个顶点组成的面，追加到geometry.faces数组中。三个参数分别是三个顶点在geometry.vertices中的序号。
        // 如果需要设置由四个顶点组成的面片，可以类似地使用THREE.Face4，例如 new THREE.Face4(0, 1, 5, 4)。
        // 3个顶点为一个面就需要12个面，如果是用Face4 只需6个面
        const faces = [
            new THREE.Face3(0, 2, 1),
            new THREE.Face3(2, 3, 1),
            new THREE.Face3(4, 6, 5),
            new THREE.Face3(6, 7, 5),
            new THREE.Face3(4, 5, 1),
            new THREE.Face3(5, 0, 1),
            new THREE.Face3(7, 6, 2),
            new THREE.Face3(6, 3, 2),
            new THREE.Face3(5, 7, 0),
            new THREE.Face3(7, 2, 0),
            new THREE.Face3(1, 3, 4),
            new THREE.Face3(3, 6, 4),
        ];

        const geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals(); // 渲染面(计算面)，没有该方法无法渲染MeshLambertMaterial材质的面

        const materials = [
            new THREE.MeshLambertMaterial({ color: 0x44ff44, opacity: 0.6, transparent: true }),
            new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
        ];

        // 创建多材质对象, 需要引入SceneUtils.js扩展库
        const mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials);
        mesh.traverse(function (e) {
            e.castShadow = true;
        });

        mesh.position.x = 0;
        mesh.position.z = 0;
        mesh.position.y = 0;

        mesh.name = geom.type + "-" + 4;
        this.scene.add(mesh);
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

    // 更新六面体
    updateMesh() {
        const mesh = this.scene.getObjectByName('Geometry-4');
        const controlPoints = this.controlPoints
        mesh.children.forEach(function (e) {
            for (var i = 0; i < 8; i++) {
                e.geometry.vertices[i].x = controlPoints[i].x;
                e.geometry.vertices[i].y = controlPoints[i].y;
                e.geometry.vertices[i].z = controlPoints[i].z;
            }
            e.geometry.verticesNeedUpdate = true; // 告诉渲染器需要更细顶点，没有这个标致无法动态更新顶点位置，这是three.js出于对性能的考虑设计
            e.geometry.computeFaceNormals(); // 渲染面(计算面)，没有该方法无法渲染MeshLambertMaterial材质的面 
        });
    }

    render() {
        return (
            <div ref={element => this.container = element} >
            </div>
        );
    };
};

export default Index
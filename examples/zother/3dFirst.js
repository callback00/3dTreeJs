import React from 'react'

class Index extends React.Component {
    constructor(props) {
        super(props)

        this.cube = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }

    componentDidMount() {
        this.init();
    }

    init() {
        // 获取浏览器窗口的宽高，后续会用
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;

        // 创建一个场景
        this.scene = new THREE.Scene();

        // 创建一个具有透视效果的摄像头
        this.camera = new THREE.PerspectiveCamera(15, width / height, 0.1, 800);

        // 创建一个 WebGL 渲染器，Three.js 还提供 <canvas>, <svg>, CSS3D 渲染器。
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        // 设置渲染器的清除颜色（即背景色）和尺寸
        this.renderer.setClearColor('black');
        this.renderer.setSize(width, height);

        // 创建一个长宽高均为 4 个单位长度的立方体（几何体）
        const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);

        // 创建材质
        const cubeMaterial = new THREE.MeshBasicMaterial({
            color: 'rgb(108, 174, 221)',
            wireframe: true
        });

        // 创建一个立方体网格（mesh）：将材质包裹在几何体上
        this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        // 设置立方体网格位置
        // 设置位置的的方式有三种：
        // ①直接设置坐标 cube.position.x = 10 cube.position.y = 3 cube.position.z = 1
        // ②一次性设置 cube.position.set(10, 3, 1)
        // ③ position 属性是一个 THREE.Vector3 对象 cube.position = new THREE.Vector3(10, 3, 1)
        this.cube.position.x = 0;
        this.cube.position.y = 0;
        this.cube.position.z = 0;

        // 将立方体网格加入到场景中
        this.scene.add(this.cube);

        // 设置摄像机位置，并将其朝向场景中心(0, 0, 0)
        this.camera.position.x = 30;
        this.camera.position.y = 30;
        this.camera.position.z = 30;
        this.camera.lookAt(this.scene.position);

        // 将渲染器的输出（此处是 canvas 元素）插入到 组件中
        this.container.appendChild(this.renderer.domElement);

        // 渲染，即摄像头拍下此刻的场景
        this.animationRender();
    }

    animationRender() {
        requestAnimationFrame(this.animationRender.bind(this));
        // this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
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
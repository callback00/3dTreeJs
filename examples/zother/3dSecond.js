import React from 'react'

class Index extends React.Component {
    constructor(props) {
        super(props)

        this.cube = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.light = null;
    }

    componentDidMount() {
        this.threeStart()
    }

    initThree() {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setSize(width, height);
        this.container.appendChild(this.renderer.domElement);
        this.renderer.setClearColor(0xFFFFFF, 1.0);
    }

    initCamera() {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;

        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        this.camera.position.x = 0;
        this.camera.position.y = 1000;
        this.camera.position.z = 0;
        this.camera.up.x = 0;
        this.camera.up.y = 1;
        this.camera.up.z = 0;

        this.camera.lookAt(0, 0, 0);
    }

    initScene() {
        this.scene = new THREE.Scene();
    }

    initLight() {
        this.light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
        this.light.position.set(100, 100, 200);
        this.scene.add(this.light);
    }

    initObject() {

        const geometry = new THREE.Geometry();
        const material = new THREE.LineBasicMaterial({ vertexColors: true });
        const color1 = new THREE.Color(0x444444), color2 = new THREE.Color(0xFF0000);

        const p1 = new THREE.Vector3(-100, 0, 0);
        const p2 = new THREE.Vector3(100, 0, 0);
        geometry.vertices.push(p1);
        geometry.vertices.push(p2);
        geometry.colors.push(color1, color2);
        const line = new THREE.Line(geometry, material, THREE.LineSegments);
        // var line = new THREE.Line( geometry, material, THREE.LinePieces );
        this.scene.add(line);
    }

    threeStart() {
        this.initThree();
        this.initCamera();
        this.initScene();
        this.initLight();
        this.initObject();
        this.renderer.clear();
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
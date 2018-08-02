import React from 'react'

const colors =[
    '#ED5565',
    '#3BAFDA',

    '#FC6E51',
    '#37BC9B',

    '#FFCE54',
    '#8CC152',

    '#A0D468',
    '#FCBB42',

    '#48CFAD',
    '#E9573F',

    '#4FC1E9',
    '#DA4453',
]

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
        // this.camera.position.x = -0;
        // this.camera.position.y = -2000;
        // this.camera.position.z = -1000;

        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 2000;
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
        geometry.vertices.push(new THREE.Vector3(-250, 0, 0));
        geometry.vertices.push(new THREE.Vector3(250, 0, 0));

        for (let i = 0; i < 11; i++) {
            let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: colors[i], opacity: 1.0 }));
            line.position.y = i * 50 - 250
            line.rotation.y = 90 * Math.PI / 180;
            this.scene.add(line);

            // line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: colors[i], opacity: 1.0 }));
            // line.position.x = i * 50 - 250
            // line.rotation.z = 90 * Math.PI / 180; //选择90度， degrees*Math.PI/180 这是一个公式
            // this.scene.add(line);
        }
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
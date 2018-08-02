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
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.y = 150;
        this.camera.position.z = 500;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);


        // Cube

        var geometry = new THREE.BoxGeometry(200, 200, 200);

        for (var i = 0; i < geometry.faces.length; i += 2) {

            var hex = Math.random() * 0xffffff;
            geometry.faces[i].color.setHex(hex);
            geometry.faces[i + 1].color.setHex(hex);

        }

        var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, overdraw: 0.5 });

        this.cube = new THREE.Mesh(geometry, material);
        this.cube.position.y = 150;
        this.scene.add(this.cube);

        // Plane

        var geometry = new THREE.PlaneBufferGeometry(500, 200);
        geometry.rotateX(- Math.PI / 2);

        var material = new THREE.MeshBasicMaterial({ color: 0xe0e0e0, overdraw: 0.5 });

        const plane = new THREE.Mesh(geometry, material);
        this.scene.add(plane);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.render.shadowMapEnabled = true;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        this.animationRender();
    }

    animationRender() {
        requestAnimationFrame(this.animationRender.bind(this));
        this.cube.rotation.x += 0.01;
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
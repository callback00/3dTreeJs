import React from 'react'

class Index extends React.Component {
    constructor(props) {
        super(props)

        this.cube = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.onWindowResize = this.onWindowResize.bind(this)
    }

    componentDidMount() {
        this.init();
        this.animate(); // 文理必须要一直调用requestAnimationFrame
    }

    init() {

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        //
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.z = 400;
        this.scene = new THREE.Scene();

        // A begin
        var geometry = new THREE.PlaneGeometry(500, 300, 1, 1);
        geometry.vertices[0].uv = new THREE.Vector2(0, 0);
        geometry.vertices[1].uv = new THREE.Vector2(2, 0);
        geometry.vertices[2].uv = new THREE.Vector2(2, 2);
        geometry.vertices[3].uv = new THREE.Vector2(0, 2);
        // A end
        // B begin
        // 纹理坐标怎么弄
        var texture = new THREE.TextureLoader().load("http://localhost:8002/image/first.jpg");
        var material = new THREE.MeshBasicMaterial({ map: texture });
        var mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        // B end

        // window.addEventListener('resize', this.onWindowResize, false);
        

    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
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
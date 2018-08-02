import React from 'react'

// 这是一个 MeshLambertMaterial 材质与光照 影响颜色的例子。
// RGB光的反射原理： 减色法是物体表面反射光线的原理， 减色法能让我们看见周围物体的色彩，譬如：一个绿球，在白光中出现绿色是因为此球吸收红、蓝波长，而反射出绿色。当然，若光源中只发出红、蓝光（或是品红光），此球将出现黑色，因为绿球上没有绿波长可反射出来。
// MeshLambertMaterial材质在没有光源的情况下，无论材质是什么颜色都显示为黑色(其他材质，如MeshBasicMaterial 就不受光照影响)。这就好比在伸手不见五指的地方里，即便有彩虹你也看不见
class Index extends React.Component {
    constructor(props) {
        super(props)

        this.cube = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }

    componentDidMount() {
        this.threeStart();
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
        this.camera.position.x = 200;
        this.camera.position.y = 200;
        this.camera.position.z = 200;
        this.camera.up.x = 0;
        this.camera.up.y = 1;
        this.camera.up.z = 0;

        this.camera.lookAt(0, 0, 0);
    }

    initScene() {
        this.scene = new THREE.Scene();
    }

    initLight() {
        this.light = new THREE.DirectionalLight('rgb(138, 43, 226)', 2);
        this.light.position.set(5, 0, 10);
        this.scene.add(this.light);
    }

    initObject() {
        const geometry = new THREE.CubeGeometry(200, 100, 50, 4, 4);
        // B start
        const material = new THREE.MeshLambertMaterial({ color: 'rgb(0, 191, 255)' });
        // B end
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = 0;
        mesh.position.y = 0;
        mesh.position.z = 0;
        this.scene.add(mesh);
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
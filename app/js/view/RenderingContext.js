export default class RenderingContext {
    constructor(scene, camera, renderer, controls) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.controls = controls;
    }

    static getDefault(containerElement) {
        //const width  = window.innerWidth, height = window.innerHeight;
        const width  =containerElement.offsetWidth, height = containerElement.offsetHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
        const renderer = new THREE.WebGLRenderer();
        const controls = new THREE.TrackballControls(camera);

        camera.position.z = 20;
        renderer.setSize(width, height);
        scene.add(new THREE.AmbientLight(0x666666));

        const pointLight = new THREE.PointLight(0xaaaaaa, 1, 0, 1);
        pointLight.position.set(0, 0, 0);
        scene.add(pointLight);
      

        // const light = new THREE.DirectionalLight(0xffffff, 0.5);
        // light.position.set(0.01,0.01,0.01);
        // scene.add(light);

        containerElement.appendChild(renderer.domElement);

        return new RenderingContext(scene, camera, renderer, controls);
    }
}
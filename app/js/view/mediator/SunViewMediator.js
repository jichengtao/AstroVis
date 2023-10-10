import ViewMediator from './ViewMediator';

export default class SunViewMediator extends ViewMediator {
    constructor(sun, mediatorFactory) {
        super(sun, mediatorFactory);
    }

    makeObject3D() {
        
        const object3D = new THREE.Mesh(
            new THREE.SphereGeometry(0.001, SunViewMediator.SphereSegments, SunViewMediator.SphereSegments),
            //new THREE.SphereGeometry(this.astronomicalBody.properties.radius, SunViewMediator.SphereSegments, SunViewMediator.SphereSegments),

            new THREE.MeshPhongMaterial({
                 map	: new THREE.TextureLoader().load(this.astronomicalBody.properties.texture),
                // color: 0xFFA70E,
                // emissive: 0xFFA70E, // 发光颜色
                // emissiveIntensity: 10, // 强度
                // side: THREE.DoubleSide, // 双面渲染
                // opacity: 0.5, // 设置透明度为 0.5
                // transparent: true //
               
            })
        );

        const texture = new THREE.TextureLoader().load('images/darkuniverse_glare.png');
        texture.encoding = THREE.sRGBEncoding;
        texture.flipY=false;
        
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: texture,
            //alphaMap:texture,
            alphaTest : 0.5,
            transparent: true,
            blending: THREE.AdditiveBlending,
            saturation: { value: 0.8 },
            //useScreenCoordinates: false,
            //color: 0xFFFFFF
            depthWrite: false
           
        }));
        sprite.scale.x = this.astronomicalBody.properties.radius * 15;
        sprite.scale.y = this.astronomicalBody.properties.radius * 15;
        sprite.scale.z = 1;

        const container = new THREE.Object3D();
        container.add(sprite);
        container.add(object3D);
        return container;
    }
}

SunViewMediator.SphereSegments = 32;
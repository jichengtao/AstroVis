import ViewMediator from './ViewMediator';

export default class GalaxyViewMediator extends ViewMediator {
    constructor(galaxy, mediatorFactory) {
        super(galaxy, mediatorFactory);
        this.astronomicalBody.addObserver("SolarSystemAdded", (e) => this.onSolarSystemAdded(e));

        const stars = this.createStars(500, 60);
        //const stars =this.createStars(0, 0);

        this.object3D.add(stars);
    }

    onSolarSystemAdded(e) {
        this.addChild(e.solarSystem);
    }

    createStars(radius, segments) {
        const texture = new THREE.TextureLoader().load('images/eso_dark.jpg');
        // texture.minFilter = THREE.NearestFilter;
        // texture.magFilter = THREE.NearestFilter;
        texture.encoding = THREE.sRGBEncoding;
        texture.flipY=false;

        return new THREE.Mesh(
            new THREE.SphereGeometry(radius, segments, segments),
            new THREE.MeshBasicMaterial({
                //color: 0x808080, 
                
                //ambient: 0xCCCCCC,
                //map:  new THREE.TextureLoader().load('images/DarkUniverse_mellinger_8k.jpg'),
                //map:  new THREE.TextureLoader().load('images/eso_dark.jpg'),
                map: texture,
                side: THREE.BackSide
            })
        );
    }
}
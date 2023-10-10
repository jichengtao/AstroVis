import ViewMediator from './ViewMediator';
//import Orbit from './Orbit';

export default class PlanetViewMediator extends ViewMediator {
    constructor(planet, mediatorFactory) {
        super(planet, mediatorFactory);
        //this.parent = sun;
        this.astronomicalBody.addObserver("SatelliteAdded", (e) => this.onSatelliteAdded(e));
        this.astronomicalBody.addObserver("SatelliteRemoved", (e) => this.onSatelliteRemoved(e));
    }

    makeObject3D() {
        const container = new THREE.Object3D();
        const texture = new THREE.TextureLoader().load(this.astronomicalBody.properties.texture);
        texture.encoding = THREE.sRGBEncoding;
        texture.flipY=false;
        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(this.astronomicalBody.properties.radius, PlanetViewMediator.SphereSegments, PlanetViewMediator.SphereSegments),
            
            new THREE.MeshPhongMaterial({
                map	: texture
            })
        );

        container.rotation.y = Math.random() * 360;
        container.add(mesh);


        // //Orbit
        const color = new THREE.Color('#404040'); // 设置轨道颜色，可选
        var resolution =500; //this.astronomicalBody.properties.radius + 400 * Math.pow(10, -4.2) + 15 * 50; // segments in the line
        var length = 360 / resolution;          
        var material = new THREE.LineBasicMaterial({
            color: color,
            linewidth: 1,
            fog: true
          });
    
        const points = [];
        // Build the orbit line
        for (var i = 0; i <= resolution; i++) {
            var segment = (i * length) * Math.PI / 180;
            var orbitAmplitude = this.astronomicalBody.properties.distance;
    
            points.push(
              new THREE.Vector3(
                Math.cos(segment) * orbitAmplitude,
                Math.sin(segment) * orbitAmplitude,
                0
              )
            );
          }
        var orbitLine = new THREE.BufferGeometry().setFromPoints( points );
    
        var line = new THREE.Line(orbitLine, material);
    
          line.position.set(0, 0, 0);
          line.rotation.x = Math.PI / 2

          container.add(line);
      
  
        mesh.position.setX(this.astronomicalBody.properties.distance);
        return container;
    }

    // makeOrbit(){
    //     const container = new THREE.Object3D();
       
    // }

    onSatelliteAdded(e) {
        this.addChild(e.satellite);
    }

    onSatelliteRemoved(e) {
        this.removeChild(e.satellite);
    }

    onFrameRenderered() {
        super.onFrameRenderered();

        if (this.astronomicalBody.isMoving) {
            if (this.astronomicalBody.properties.orbitalSpeed) {
                this.object3D.rotation.y += this.astronomicalBody.properties.orbitalSpeed / 3;
            }

            if (this.astronomicalBody.properties.rotationSpeed) {
                this.object3D.children[0].rotation.y += this.astronomicalBody.properties.rotationSpeed / 3;
            }
        }
    }
}

PlanetViewMediator.SphereSegments = 32;
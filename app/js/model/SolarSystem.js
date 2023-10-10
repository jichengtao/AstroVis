import AstronomicalBody from './AstronomicalBody';

export default class SolarSystem extends AstronomicalBody {
    constructor(name, sun, properties,pointcloud) {
        super(name, sun, properties,pointcloud);
        this.sun = sun;
        this.planets = [];
        this.pointcloud= pointcloud;
        this.className = 'SolarSystem';
    }

    addPlanet(planet) {
        planet.parent = this.sun;
       // planet.parent = this;
        this.planets.push(planet);
        this.emit('PlanetAdded', { planet });
    }

    removePlanet(planet) {
        const index = this.planets.indexOf(planet);

        if (index !== -1) {
            this.planets.splice(index, 1);
            this.emit('PlanetRemoved', { planet });
        }
    }
  

    // addPointCloud(pointcloud) {
    //     pointcloud.parent = this;
    //     this.pointclouds.push(pointcloud);
    //     this.emit('PointCloudAdded', { pointcloud });
    // }

    // removePointCloud(pointcloud) {
    //     const index = this.pointclouds.indexOf(pointcloud);

    //     if (index !== -1) {
    //         this.pointclouds.splice(index, 1);
    //         this.emit('PointCloudRemoved', { pointcloud });
    //     }
    // }

    [Symbol.iterator]() {
        return this.planets.values();
    }
    // [Symbol.iterator]() {
    //     return this.pointclouds.values();
    // }
}
import AstronomicalBody from './AstronomicalBody';

export default class PointCloud extends AstronomicalBody {
    constructor(name, properties) {
        super(name, properties);
        this.className = 'PointCloud';
        // this.isMoving = false;
    }



}
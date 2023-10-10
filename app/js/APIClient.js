
export default class APIClient {
    //async getRecord() {
        getRecord() {
    //const data = await this.loadData('data85.json');
        return APIClient.galaxyRecord;
    }
    // loadData(url) {
    //     return new Promise((resolve, reject) => {
    //         const loader = new THREE.FileLoader();
    //         loader.load(
    //             url,
    //             (data) => {
    //                 resolve(data);
    //             },
    //             undefined,
    //             (err) => {
    //                 reject(err);
    //             }
    //         );
    //     });
    // }



}



APIClient.galaxyRecord = {
    name: 'Milky Way',
    solarSystems: [
        {
            name: 'Solar System',
            props: {},
            sun: {
                name: 'Sun',
                props: {
                    radius: 2,
                    texture: 'images/sun.jpg'
                }
            },
            pointcloud:{
                name: 'ClousterWolfe',
                props: {
                      // //pointData: //JSON.parse(data)
        
                }
            },
            planets: [
                {name: 'Mercury',
                    props: {
                        texture: 'images/mercurymap.jpg',
                        orbitalSpeed: 0.01,
                        rotationSpeed: 0.05,
                        radius: 0.4,
                        distance: 5
                    }
                },
                {name: 'Venus',
                    props: {
                        texture: 'images/venusmap.jpg',
                        orbitalSpeed: 0.007,
                        rotationSpeed: -0.05,
                        radius: 0.8,
                        distance: 10
                    }
                },
                {name: 'Earth',
                    satellites: [
                        {
                            name: 'Moon',
                            props: {
                                texture: 'images/moonmap1k.jpg',
                                orbitalSpeed: -0.05,
                                rotationSpeed: 0.01,
                                radius: 0.4,
                                distance: 2
                            }
                        }
                    ],
                    props: {
                        texture: 'images/earthmap1k.jpg',
                        orbitalSpeed: 0.006,
                        rotationSpeed: 0.005,
                        radius: 0.8,
                        distance: 15
                    }
                },
                {name: 'Mars',
                    props: {
                        texture: 'images/marsmap1k.jpg',
                        orbitalSpeed: 0.005,
                        rotationSpeed: 0.005,
                        radius: 0.6,
                        distance: 20
                    }
                },
                {name: 'Jupiter',
                satellites: [
                    {
                        name: 'Io',
                        props: {
                            texture: 'images/moonmap1k.jpg',
                            orbitalSpeed: -0.04,
                            rotationSpeed: 0.02,
                            radius: 0.18,
                            distance: 3.2
                        }
                    },
                    {
                        name: 'Europa',
                        props: {
                            texture: 'images/moonmap1k.jpg',
                            orbitalSpeed: 0.05,
                            rotationSpeed: 0.01,
                            radius: 0.2,
                            distance: 2
                        }
                    },
                    {
                        name: 'Ganymede',
                        props: {
                            texture: 'images/moonmap1k.jpg',
                            orbitalSpeed: -0.05,
                            rotationSpeed: 0.03,
                            radius: 0.1,
                            distance: 2.5
                        }
                    },
                    {
                        name: 'Callisto',
                        props: {
                            texture: 'images/moonmap1k.jpg',
                            orbitalSpeed: -0.03,
                            rotationSpeed: 0.02,
                            radius: 0.1,
                            distance: 3
                        }
                    }
                ],
                    props: {
                        texture: 'images/jupitermap.jpg',
                        orbitalSpeed: 0.003,
                        rotationSpeed: 0.0025,
                        radius: 1.6,
                        distance: 26
                    }
                },
                {name: 'Saturn',
                    props: {
                        texture: 'images/saturnmap.jpg',
                        orbitalSpeed: 0.002,
                        rotationSpeed: 0.0025,
                        radius: 1.2,
                        distance: 33
                    }
                },
                {name: 'Uranus',
                    props: {
                        texture: 'images/uranusmap.jpg',
                        orbitalSpeed: 0.002,
                        rotationSpeed: -0.004,
                        radius: 1,
                        distance: 40
                    }
                },
                {name: 'Neptune',
                    props: {
                        texture: 'images/neptunemap.jpg',
                        orbitalSpeed: 0.0015,
                        rotationSpeed: 0.004,
                        radius: 0.9,
                        distance: 50
                    }
                },
                {name: 'Pluto',
                    props: {
                        texture: 'images/plutomap1k.jpg',
                        orbitalSpeed: 0.002,
                        rotationSpeed: 0.003,
                        radius: 0.4,
                        distance: 60
                    }
                },
                {name: 'Wolfe',
                props: {
                    texture: 'images/plutomap1k.jpg',
                    orbitalSpeed: 0.004,
                    rotationSpeed: 0.006,
                    radius: 1.6,
                    distance: 37
                    }
                }
            ]
            

        }
    ]
};
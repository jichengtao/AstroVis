import ViewMediator from './ViewMediator';



export default class PointCloudViewMediator extends ViewMediator {
    constructor(pointcloud, mediatorFactory) {
        super(pointcloud, mediatorFactory);
    }

    makePointCloud(data,container){

        let geometry = new THREE.BufferGeometry();
        const colors = data.colors;
        const masses = data.masses;
        const positions = data.positions;

        const positionNumComponents = 3;  //how many componente each position, here x, y, z
        const colorNumComponents = 3; //how many componente each color, here r, g, b
        

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));//new THREE.Float32BufferAttribute(positions, positionNumComponents));
        
        // var guiColor = new dat.GUI({ autoPlace: false });
        // guiColor.domElement.id = 'guiColor-container';
        
        // document.body.appendChild(guiColor.domElement);
        

        var result = [];
        for (var i = 0; i < masses.length; i++) {
            result.push(Math.random());
            result.push(Math.random());
            result.push(Math.random());
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(result), colorNumComponents));

        //  var coloroptions = { Mass: false};
        // guiColor.add(coloroptions, 'Mass').onChange((value3)=> {
        //     if(value3){
        //        geometry.addAttribute('color',new THREE.BufferAttribute(new Float32Array(colors), colorNumComponents )); //new THREE.Float32BufferAttribute(colors, colorNumComponents));

        //     }else{
        //         geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(result), colorNumComponents));

        //     }
                
        //   });单独的gui，不用了，用下面这个listener，gui改到mainView了

          var value;
          window.addEventListener('message', function(event) {
            if (event.data.type === 'color') {
                value=event.data.colorOption;
                if(value){
                    geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(colors), colorNumComponents )); //new THREE.Float32BufferAttribute(colors, colorNumComponents));
     
                 }else{
                     geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(result), colorNumComponents));
     
                 }
                }
            });
      



        //   var colorChange = (function() {
        //     function handleValue(value) {
        //         if(value){
        //             geometry.addAttribute('color',new THREE.BufferAttribute(new Float32Array(colors), colorNumComponents )); //new THREE.Float32BufferAttribute(colors, colorNumComponents));
     
        //          }else{
        //              geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(result), colorNumComponents));
     
        //          }
        //         console.log('Received value in another module:', value);
        //     }
        
        //     return {
        //         handleValue: handleValue
        //     };
        // })();



        geometry.computeBoundingSphere();
        
       let circleTexture = new THREE.TextureLoader().load( "images/halo.png" );

       circleTexture.encoding = THREE.sRGBEncoding;
       circleTexture.flipY=false;
        /*I told you to take those motion sickness pills. Clean that vommit up, we're going again!*/
        let particles = new THREE.Points(geometry, 
            new THREE.PointsMaterial({
                size: 20,
                alphaTest: 0.5, 
                transparent: true,
                map: circleTexture,
                vertexColors: true
            }));
        container.add(particles); 
        return container;
    }

    makeObject3D() {
        //THREE.Cache.enabled = true;
        const container = new THREE.Object3D();

        fetch('data/data85.json')
        .then(response => response.json())
        .then(data => {       
            this.makePointCloud(data, container);
        })
        .catch(error => {
            console.error('An error happened', error);
        });



        //const loader = new THREE.FileLoader();
        // loader.load(
        //     // resource URL
        //     'data85.json',
        
        //     // onLoad callback
        //     function ( data ) {
        //         const jsonData = JSON.parse(data)
        //         makePointCloud(jsonData,container);
               
        //     },
        
        //     // onProgress callback
        //     function ( xhr ) {
        //         console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        //     },
        
        //     // onError callback
        //     function ( err ) {
        //         console.error( 'An error happened' );
        //     }
        // );
       

        return container;

        /***********************************************************************/

        // const loader = new THREE.FileLoader();
        // loader.load(
        //     // resource URL
        //     'C:/Users/User/Desktop/1threejs-mvc-example-master/app/data85.json',

        //     // onLoad callback
        //     (data) => {
        //         console.log("true");
        //         const pointData=JSON.parse(data);

        //         const container = new THREE.Object3D();
        //         let geometry = new THREE.BufferGeometry(); 
        
        //         const colors = pointData.colors;
        //         const masses = pointData.masses;
        //         const positions = pointData.positions;
                
                
        //         const positionNumComponents = 3;  //how many componente each position, here x, y, z
        //         const colorNumComponents = 3; //how many componente each color, here r, g, b
        //         var colorResult = [];
        //         for (var i = 0; i < masses.length; i++) {
        //              var num = masses[i];
        //              colorResult.push(Math.random());
        //              colorResult.push(Math.random());
        //              colorResult.push(Math.random());
        //         }
        
        //         geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, positionNumComponents));
        //         geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorResult, colorNumComponents));
        //         //geometry.setAttribute('color', new THREE.Float32BufferAttribute(masses, massNumComponents));
        //         geometry.computeBoundingSphere();
        
        //         let circleTexture = new THREE.TextureLoader().load( "glare.png" );
        
        //         /*I told you to take those motion sickness pills. Clean that vommit up, we're going again!*/
        //         let particles = new THREE.Points(geometry, 
        //             new THREE.PointsMaterial({
        //                 size: 20,
        //                 alphaTest: 0.5, 
        //                 transparent: true,
        //                 map: circleTexture,
        //                 vertexColors: true
        //             }));
        //         container.add(particles); 

        //     },

        //     // onProgress callback
        //     (xhr) => {
        //         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        //     },

        //     // onError callback
        //     (err) => {
        //         console.error('An error happened');
        //     }
        // );

    


/**********************************************************************************************/
    
        // const container = new THREE.Object3D();
        // let geometry = new THREE.BufferGeometry(); 

        // const colors = data.colors;
        // const masses = data.masses;
        // const positions = data.positions;
        
        
        // const positionNumComponents = 3;  //how many componente each position, here x, y, z
        // const colorNumComponents = 3; //how many componente each color, here r, g, b
        // var colorResult = [];
        // for (var i = 0; i < masses.length; i++) {
        //      var num = masses[i];
        //      colorResult.push(Math.random());
        //      colorResult.push(Math.random());
        //      colorResult.push(Math.random());
        // }

        // geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, positionNumComponents));
        // geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorResult, colorNumComponents));
        // //geometry.setAttribute('color', new THREE.Float32BufferAttribute(masses, massNumComponents));
        // geometry.computeBoundingSphere();

        // let circleTexture = new THREE.TextureLoader().load( "glare.png" );

        // /*I told you to take those motion sickness pills. Clean that vommit up, we're going again!*/
        // let particles = new THREE.Points(geometry, 
        //     new THREE.PointsMaterial({
        //         size: 20,
        //         alphaTest: 0.5, 
        //         transparent: true,
        //         map: circleTexture,
        //         vertexColors: true
        //     }));
        // container.add(particles); 


        
    
/*********************************************************** */
        // const particleCount = 1000;
        // for (let i = 0; i < particleCount; i++) {
        //     const geometry = new THREE.SphereGeometry(1, 8, 8); // 使用简单的球体几何体作为点状天体
        //     const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }); // 随机生成颜色
        //     const mesh = new THREE.Mesh(geometry, material);
            
        //     const position = new THREE.Vector3(
        //         Math.random() * 2000 - 1000, // 随机生成 X 轴坐标
        //         Math.random() * 2000 - 1000, // 随机生成 Y 轴坐标
        //         Math.random() * 2000 - 1000  // 随机生成 Z 轴坐标
        //     );
        //     mesh.position.copy(position);
    
        //     container.add(mesh);
        // }
    
        // return container;
    
/*************************************************************************************************/

        // const container = new THREE.Object3D();
        // const mesh = new THREE.Mesh(
        //     new THREE.SphereGeometry(this.astronomicalBody.properties.radius, PointCloudViewMediator.SphereSegments, PointCloudViewMediator.SphereSegments),
        //     new THREE.MeshPhongMaterial({
        //         map	: THREE.ImageUtils.loadTexture(this.astronomicalBody.properties.texture)
        //     })
        // );

        // container.rotation.y = Math.random() * 360;
        // container.add(mesh);

        // mesh.position.setX(this.astronomicalBody.properties.distance);
        // return container;
        /*********************************************************************************************** */

    }

}

PointCloudViewMediator.SphereSegments = 32;
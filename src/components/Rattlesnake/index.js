import React, { useRef, useEffect, useState } from "react";
import { Canvas, useThree, useFrame, useUpdate } from "react-three-fiber";
import { map, noise } from "./PerlinNoise"


/* 
Usamos planeGeometry ya que planeBufferGeometry
no cuenta con la propiedad de vertices.
*/
function RattlesnakeMesh() {
  let ref = useRef();
  let refPlaneGeo = useRef();
  let [offset, setOffset] = useState(0);
  let [arrayTrench, setArrayTrench] = useState([]);
  let [arrayMountains, setArrayMountains] = useState([]);
  const {camera} = useThree();

  // Contruir el terreno
  // TODO: Hacer un arreglo para zanja y otro para paredes
  useEffect(() => {
    generateTerrain();
    //console.log(perlinNoise) 
  },[])
  

  const generateTerrain = () => {
    let vertices = refPlaneGeo.current.vertices;
    let smooth = 5;
    for (let i = 0; i < vertices.length; i++) {
      let { x, y, z } = vertices[i];
      let noiseValue = 0;
      if(vertices[i].y > -5 && vertices[i].y < 5) {
        noiseValue = map(noise(x / smooth, (z + y) / smooth), 0, 0.8, 0, 4);          
        setArrayTrench(oldValue => [...oldValue, { index: i, noiseValue: noiseValue }]); 
      }
      else {
        noiseValue = map(noise(x / 2.5, (z + y) / 2.5), 0, 0.8, -1.5, 3) * -1.05;
        setArrayMountains(oldValue => [...oldValue, { index: i, noiseValue: noiseValue }])
      }  
      refPlaneGeo.current.vertices[i].z = noiseValue;
    }
  }

  useFrame(() => {    
    arrayTrench.forEach((trench) => {
      // Esta operacion sirve para calcular la posición en el arreglo que se le indica,
      // el valor de esta operacion lo usaremos para inidcar la posicion en el arreglo.
      let planeIndex = Math.floor((trench.index + offset) % arrayTrench.length);
      refPlaneGeo.current.vertices[arrayTrench[planeIndex].index].z = trench.noiseValue;
    });

    arrayMountains.forEach((mountain, idx) => {
      let planeIndex = Math.floor((idx + offset) % arrayMountains.length);
      refPlaneGeo.current.vertices[arrayMountains[planeIndex].index].z = mountain.noiseValue;
    })
    
    refPlaneGeo.current.verticesNeedUpdate = true;
    setOffset(offset + 0.8);   
    camera.lookAt(0, 0, 0);
  })

// x:55
  return (
    <mesh ref={ref} position={[0,-1,0]} rotation={[(70 * Math.PI) / 180, 0, (90 * Math.PI) / 180]}>
      <planeGeometry ref={refPlaneGeo} attach="geometry" args={[15, 30, 100, 100]} />
      <meshBasicMaterial attach="material" wireframe={true} color="#ff0000" />
    </mesh>
  );
}

/*
Creamos un compoenente para la camara
y de esa forma se puede ajustar [0,0,5] fov:75
*/
function CustomCamera(props) {
  const ref = useRef();
  const { setDefaultCamera } = useThree();
  // This makes sure that size-related calculations are proper
  // Every call to useThree will return this camera instead of the default camera
  useEffect(() => void setDefaultCamera(ref.current), [setDefaultCamera]);

  let offset = 0;
  let bound = false;
  useFrame(()=> {    
    ref.current.position.y += (-offset / 50 - ref.current.position.y) * 0.05;     
    if (ref.current.position.y > 6.66) bound = true;
    if (ref.current.position.y < -0.66) bound = false;

    if(bound) {
      offset += 0.66;
    }
    else {
      offset -= 1;
    }    
    ref.current.lookAt(0, 0, 0);
  })
  return <perspectiveCamera ref={ref} {...props} />;
}

function Rig({ mouse }) {
  // Añadir a canvas si queremos mover la camara con el mouse.
  // const mouse = useRef([0, 0]); 
  // onMouseMove={e => (mouse.current = [e.clientX - window.innerWidth / 2, e.clientY - window.innerHeight / 2])}
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.current[0] / 50 - camera.position.x) * 0.05;
    //camera.position.y += (-mouse.current[1] / 50 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });  
  return null;
}
// camera 0,5.45,8
function Rattlesnake() {   
  const mouse = useRef([0, 0]); 
  return (
    <Canvas onMouseMove={e => (mouse.current = [e.clientX - window.innerWidth / 2, e.clientY - window.innerHeight / 2])}>
      <CustomCamera position={[0, 0.5, 8]} fov={75} />
      <RattlesnakeMesh />        
    </Canvas>
  );
}

export default Rattlesnake;
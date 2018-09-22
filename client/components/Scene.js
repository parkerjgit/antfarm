import React from 'react'
import {EventEmitter} from 'events'
// import SharedDrawing from './SharedDrawing'
// import ColorPicker from './ColorPicker'

// globals
// const canvas = document.createElement('canvas');
// const ctx = canvas.getContext('2d');

import * as dat from 'dat.gui';

import 'three/CanvasRenderer';
import 'three/Projector';
import 'three/OrbitControls';
//import {EventEmitter} from 'events';



// globals
var container;
var camera, scene, renderer;
var plane;
var mouse, raycaster, isShiftDown = false;
var color = 0x00ff80;
var cubeGeometry = new THREE.BoxBufferGeometry( 50, 50, 50 );
var cubeMaterial = new THREE.MeshLambertMaterial( { color, overdraw: 0.5 } );
var objects = [];
var orbit;

export const viewport = new EventEmitter();
//export default viewport;
export function addVoxel(point, normal, color, shouldBroadcast = true) {
  cubeMaterial = new THREE.MeshLambertMaterial( { color, overdraw: 0.5 } );
  var voxel = new THREE.Mesh( cubeGeometry, cubeMaterial );
  voxel.position.copy( point ).add( normal );
  voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
  scene.add( voxel );
  objects.push( voxel );

  shouldBroadcast &&
    viewport.emit('addVoxel', point, normal, color)

    render();
}
function save() {
  window.open( renderer.domElement.toDataURL('image/png'), 'mywindow' );
  return false;
}
function render() {
  renderer.render( scene, camera );
}

export default class Scene extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   whiteboard: new EventEmitter(),
    //   color: '',
    //   currentMouse: {
    //     x: 0,
    //     y: 0
    //   },
    //   lastMouse: {
    //     x: 0,
    //     y: 0
    //   }
    // }
    this.draw = this.draw.bind(this);
    this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
  }

  init() {

    // render
    container = document.createElement( 'div' );
    container.className = "canvasContainer";
    document.body.appendChild( container );
    // var info = document.createElement( 'div' );
    // info.style.position = 'absolute';
    // info.style.top = '10px';
    // info.style.width = '100%';
    // info.style.textAlign = 'center';
    // info.innerHTML = '<a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> - voxel painter<br><strong>click</strong>: add voxel, <strong>shift + click</strong>: remove voxel, <a href="javascript:save()">save .png</a>';
    // container.appendChild( info );

    // setup camera
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 500, 800, 1300 );
    camera.lookAt( 0, 0, 0 );
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );
    // Grid
    var gridHelper = new THREE.GridHelper( 1000, 20 );
    scene.add( gridHelper );
    //
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
    geometry.rotateX( - Math.PI / 2 );
    plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
    scene.add( plane );
    objects.push( plane );

    // setup Lights
    var ambientLight = new THREE.AmbientLight( 0x606060 );
    scene.add( ambientLight );
    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.add( directionalLight );
    var directionalLight = new THREE.DirectionalLight( 0x808080 );
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.add( directionalLight );


    // setup render
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

     // setup orbit
     orbit = new THREE.OrbitControls(camera, renderer.domElement);
     orbit.update();
     orbit.addEventListener( 'change', render );

    // setup renderer
    // renderer = new THREE.CanvasRenderer();
    // renderer.setPixelRatio( window.devicePixelRatio );
    // renderer.setSize( window.innerWidth, window.innerHeight );
    // container.appendChild(renderer.domElement);

    //
    document.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
    document.addEventListener( 'keydown', this.onDocumentKeyDown, false );
    document.addEventListener( 'keyup', this.onDocumentKeyUp, false );
    //
    window.addEventListener( 'resize', this.onWindowResize, false );

    var Options = function() {
      this.color0 = "#ffae23"; // CSS string
    };

    window.onload = function() {
      var options = new Options();
      var gui = new dat.GUI();

      gui.addColor(options, 'color0').onFinishChange(function(value){
        console.log(value)
        color = value;
      });
      gui.close();
    };
  }
  draw(mouse, color, shouldBroadcast = true) {

    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 0 ) {
      var intersect = intersects[ 0 ];
      if ( isShiftDown ) {
        if ( intersect.object != plane ) {
          scene.remove( intersect.object );
          objects.splice( objects.indexOf( intersect.object ), 1 );
        }
      } else {
        addVoxel(intersect.point, intersect.face.normal, color, shouldBroadcast);
      }
    }
  }

  // ---
  onDocumentMouseDown( event ) {

    //event.preventDefault();

    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
    console.log(`drawing color ------------- ${color}`)
    this.draw(mouse, color)
  }
  onDocumentKeyDown( event ) {
    switch( event.keyCode ) {
      case 16: // Shift
        isShiftDown = true;
        break;
    }
  }
  onDocumentKeyUp( event ) {
    switch( event.keyCode ) {
      case 16: isShiftDown = false; break;
    }
  }
  onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
  }

  // ****************** dat.gui





  // replaces document.addEventListener('DOMContentLoaded', setup)
  componentDidMount() {
    console.log('---------------ComponentDidMount');
    // document.body.appendChild(canvas)
    // this.setupColorPicker()
    // this.setupCanvas() // window must be ready

    this.init();
    render();
  }

  render() {
    return (
      <div ></div>
      // <SharedScene whiteboard={this.state.whiteboard} draw={this.draw} />
    )
  }
}

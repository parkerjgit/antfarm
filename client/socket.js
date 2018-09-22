import io from 'socket.io-client';
import store, { gotNewMessage } from './store'

import {viewport, addVoxel} from './components/Scene';

const socket = io(window.location.origin);

socket.on('connect', () => {
  console.log('I am now connected to the server!');
});

socket.on('new-message', (message) => {
  store.dispatch(gotNewMessage(message))
})

//----------
//const socket = io(window.location.origin)

//socket.on('connect', () => console.log('I have made a persistent two-way connection to the server!'));

socket.on('load', function (boxes) {

  boxes.forEach(function (box) {
    const { point, normal, color } = box;
    addVoxel(point, normal, color, false);
  });

});

// when recieve incoming broadcast from server
socket.on('someOneDrew', function (point, normal, color) {
  console.log(`recieving color ------------- ${color}`)
  addVoxel(point, normal, color, false);
});

// when viewport "broacasts"...
viewport.on('addVoxel', function (point, normal, color) {
  // socket.emit('draw', mouse);
  console.log(`emiting2 color ------------- ${color}`)
  socket.emit('addVoxel', point, normal, color)
});
//----------

export default socket;

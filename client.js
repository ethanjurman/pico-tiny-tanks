const socket = io();

let playerId = null;

// every 250ms check the room code from the last gpio values.
let roomCodeInterval = setInterval(() => {
  if (window.pico8_gpio[126] !== undefined && window.pico8_gpio[127] !== undefined) {
    clearInterval(roomCodeInterval);
    socket.emit('room_join', { roomId: `${`${window.pico8_gpio[126]}`.padStart(2, '0')}${`${window.pico8_gpio[127]}`.padStart(2, '0')}` });
  }
}, 250);

// on every frame send updates to the server about our tank from gpio
function onFrameUpdate() {
  // check to see if we have selected a tank
  if (window.pico8_gpio[0] !== undefined && window.pico8_gpio[0] !== 100 && playerId === null) {
    playerId = window.pico8_gpio[0];
  }
  // check to see if the tank data in gpio is our tank
  if (playerId === window.pico8_gpio[0]) {
    // if it is, send data to server (volatile means unsent data can be dropped)
    socket.volatile.emit("tank_update", window.pico8_gpio.slice(0, 40));
  }
  // run this function 15ms from now, on the next animation frame (throttle how quickly data is sent / drawn)
  setTimeout(() => {
    window.requestAnimationFrame(onFrameUpdate);
  }, 15)
}

window.requestAnimationFrame(onFrameUpdate);

// when we get other tank data from the server, set our gpio so pico8 can read it
socket.on('tank_update_from_server', (updatedTankData) => {
  // if we haven't picked a player (we are not in a game), then return immediately
  if (playerId === null) { return; }
  // if the updated tank data is our tank, then we can ignore the updates
  if (playerId === updatedTankData[0]) { return; }
  // write the updated tank data (which should exist in the first 40 values in gpio) to pico8
  for (let i = 0; i < 40; i++) {
    window.pico8_gpio[i] = updatedTankData[i];
  }
})
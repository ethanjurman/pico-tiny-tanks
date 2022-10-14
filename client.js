const socket = io();

socket.emit('room-join', { roomId: 111 });

let playerId = null;

function onFrameUpdate() {
  if (window.pico8_gpio[0] !== undefined && playerId === null) {
    playerId = window.pico8_gpio[0];
  }
  if (playerId === window.pico8_gpio[0]) {
    socket.volatile.emit("tank_update", window.pico8_gpio.slice(0, 40));
  }
  setTimeout(() => {
    window.requestAnimationFrame(onFrameUpdate);
  }, 15)
}

window.requestAnimationFrame(onFrameUpdate);

socket.on('tank_update_from_server', (updatedTankData) => {
  if (playerId === null) { return; }
  for (let i = 0; i < 40; i++) {
    window.pico8_gpio[i] = updatedTankData[i];
  }
})
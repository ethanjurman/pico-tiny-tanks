const socket = io();

let playerId = null;

let roomCodeInterval = setInterval(() => {
  console.log()
  if (window.pico8_gpio[126] !== undefined && window.pico8_gpio[127] !== undefined) {
    console.log(window.pico8_gpio[126], window.pico8_gpio[127])
    clearInterval(roomCodeInterval);
    socket.emit('room_join', { roomId: `${`${window.pico8_gpio[126]}`.padStart(2, '0')}${`${window.pico8_gpio[127]}`.padStart(2, '0')}` });
  }
}, 30);

function onFrameUpdate() {
  if (window.pico8_gpio[0] !== undefined && window.pico8_gpio[0] !== 100 && playerId === null) {
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
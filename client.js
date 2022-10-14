const socket = io();

// const roomId = searchParams.get('roomId') || `${Math.floor(Math.random() * 16777215).toString(16)
//   }-${(new Date().getTime()).toString(36)}`;
// searchParams.set('roomId', roomId);

socket.emit('room-join', { roomId: 111 });

// const socketPause = () => {
//   socket.emit("action", { action: 'pause', roomId });
// }

// const socketUnpause = () => {
//   socket.emit("action", { action: 'unpause', roomId });
// }

// const socketRotate = (playerId, cursorX, cursorY) => {
//   socket.emit("action", { action: "rotate", roomId, playerId, cursorX, cursorY });
// }

// const socketNewGame = (seed) => {
//   socket.emit("action", { action: "new-game", seed, roomId });
// }

let playerId = null;

function onFrameUpdate() {
  if (window.pico8_gpio[0] !== undefined && playerId === null) {
    playerId = window.pico8_gpio[0];
  }
  if (playerId === window.pico8_gpio[0]) {
    socket.volatile.emit("tank_update", window.pico8_gpio.slice(0, 4));
  }
  setTimeout(() => {
    window.requestAnimationFrame(onFrameUpdate);
  }, 15)
}

window.requestAnimationFrame(onFrameUpdate);

socket.on('tank_update_from_server', (updatedTankData) => {
  if (playerId === null) { return; }
  for (let i = 0; i < 4; i++) {
    window.pico8_gpio[i] = updatedTankData[i];
  }
})

// socket.on('action', (actionData) => {
//   if (actionData.action === 'rotate' && actionData.playerId === 1) {
//     rotateP1(actionData.cursorX, actionData.cursorY, true);
//   }
//   if (actionData.action === 'rotate' && actionData.playerId === 2) {
//     rotateP2(actionData.cursorX, actionData.cursorY, true);
//   }
//   if (actionData.action === 'pause') {
//     pauseGame(true);
//   }
//   if (actionData.action === 'unpause') {
//     unpauseGame(true);
//   }
//   if (actionData.action === 'new-game') {
//     startOver(true, actionData.seed)
//   }
// });
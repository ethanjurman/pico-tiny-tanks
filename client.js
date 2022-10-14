const socket = io();

// const roomId = searchParams.get('roomId') || `${Math.floor(Math.random() * 16777215).toString(16)
//   }-${(new Date().getTime()).toString(36)}`;
// searchParams.set('roomId', roomId);

// socket.emit('room-join', { roomId });

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

function onFrameUpdate() {
  socket.emit("tank_update", window.pico8_gpio.slice(0, 4));
  window.requestAnimationFrame(onFrameUpdate);
}

window.requestAnimationFrame(onFrameUpdate);

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
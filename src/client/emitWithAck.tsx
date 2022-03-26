export default (socket, ...args) => {
  return new Promise((resolve, reject) => {
    socket.emit(...args, (success) => {
      if (success)
        resolve(true);
      else
        reject(new Error('Invalid'));
    });
  });
};

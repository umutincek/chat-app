const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

let users = [];
let messages = [];
let index = 0;

io.on("connection", socket => {
    socket.emit('loggedIn', {
        users: users.map(val => val.username),
        messages
    });
    socket.on('newUser', username => {
        console.log(`${username} çevrimiçi`);
        socket.username = username;
        users.push(socket);
        io.emit('userOnline', socket.username);
    });
    socket.on('msg', msg => {
        let message = {
            index,
            username: socket.username,
            msg
        }
        messages.push(message);
        io.emit('msg', message);
        index++;
    });
    socket.on('disconnect', () => {
        console.log(`${socket.username} çevrimdışı`);
        io.emit("userLeft", socket.username);
        users.splice(users.indexOf(socket), 1);
    });
});

http.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port %s", process.env.PORT || 3000);
});

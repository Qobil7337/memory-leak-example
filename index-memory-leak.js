const express = require('express');
const EventEmitter = require('events');

const app = express();
const PORT = 3000;

let users = [];  // 1️⃣ Global variable leak - Never cleared, keeps growing
const emitter = new EventEmitter();

setInterval(() => {
    console.log('Leaky interval running...');
}, 1000); // 2️⃣ Unclosed interval - Never cleared

// Hit this route 10 times, probably your machine will be crashed
app.get('/add-user', (req, res) => {
    const user = {name : `User ${users.length + 1}`, data: new Array(100000000).fill('*')}; // Large object
    users.push(user); // 3️⃣ Reference Leak - Objects never removed
    emitter.on('data', () => {}); // 4️⃣ Event Listener Leak - Adds listeners without removing
    res.send('User added. total users: ' + users.length);
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

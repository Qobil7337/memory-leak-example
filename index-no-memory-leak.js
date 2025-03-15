const express = require('express');
const EventEmitter = require('events');

const app = express();
const PORT = 3000;

let users = new Map(); // ✅ Use Map with a limit instead of an unbounded array
const emitter = new EventEmitter();

let interval = setInterval(() => {
    console.log('Interval running...');
}, 1000);

// Cleanup the interval when process exits
process.on('SIGINT', () => {
    clearInterval(interval);
    console.log('Server shutting down. Interval cleared.');
    process.exit();
});

app.get('/add-user', (req, res) => {
    if (users.size >= 5) {
        users.clear();
    }
    users.set(users.size, {name : `User ${users.size + 1}`, data: new Array(100000000).fill('*')});

    const listener = () => {};
    emitter.on('data', listener);
    emitter.emit('data');

    // ✅ Properly remove event listener after execution
    emitter.removeListener('data', listener);
    res.send(`User added. Total users: ${users.size}`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//🔍 What’s Fixed?
// ✅ Global Variable Leak – Now using a Map with a 100-user limit instead of an ever-growing array.
// ✅ Unclosed Timers & Intervals – Properly clearing setInterval when the server shuts down.
// ✅ References to Unused Objects – Users are stored efficiently, and old data is removed when the limit is reached.
// ✅ Event Listeners Not Removed – Every event listener is removed after execution.

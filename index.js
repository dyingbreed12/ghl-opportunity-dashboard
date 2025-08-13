// const express = require('express');
// const http = require('http');  // to create server for socket.io
// const { Server } = require('socket.io');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// const server = http.createServer(app);  // create HTTP server
// const io = new Server(server, {
//   cors: { origin: "*" }  // allow all origins or restrict as needed
// });

// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(bodyParser.json());

// const opportunitiesRouter = require('./routes/opportunities')(io);  // pass io instance
//const webhookRouter = require('./routes/webhook')(io);              // pass io instance

//app.use('/api/opportunities', opportunitiesRouter);
//app.use('/api/webhook', webhookRouter);

// server.listen(PORT, () => {
//   console.log(`Backend running on http://localhost:${PORT}`);
// });

// Optional: Listen for socket connections for debugging
// io.on('connection', (socket) => {
//   console.log('A client connected:', socket.id);

//   socket.on('disconnect', () => {
//     console.log('Client disconnected:', socket.id);
//   });
// });

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Models & routes
import authRoutes from './routes/auth.js';
import campaignRoutes from './routes/campaigns.js';
import dealRoutes from './routes/deals.js';
import aiRoutes from './routes/ai.js';
import feedRoutes from './routes/feed.js';
import Message from './models/Message.js';
import DealEscrow from './models/DealEscrow.js';

dotenv.config();

// Connect DB
connectDB();

const app = express();
const server = http.createServer(app);

// CORS Config
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST API mounting
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/feed', feedRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'CreatorConnect Platform' });
});

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`Socket Client Connected: ${socket.id}`);

  // Join a Deal Room
  socket.on('join_deal_room', ({ dealId }) => {
    socket.join(dealId);
    console.log(`User joined deal room: ${dealId}`);
  });

  // Handle messages in Deal Room
  socket.on('send_deal_message', async ({ dealId, senderId, text, attachment }) => {
    try {
      const message = await Message.create({
        dealId,
        senderId,
        text,
        attachment
      });

      const populatedMessage = await Message.findById(message._id).populate('senderId', 'name role');

      // Broadcast message to room members
      io.to(dealId).emit('receive_deal_message', populatedMessage);
    } catch (error) {
      console.error('Error saving/sending message:', error);
    }
  });

  // Handle deal milestone approval trigger
  socket.on('update_deal_milestone', async ({ dealId }) => {
    try {
      const deal = await DealEscrow.findById(dealId)
        .populate('campaignId')
        .populate('brandId', 'name email')
        .populate('creatorId', 'name email creatorProfile');
      
      if (deal) {
        io.to(dealId).emit('deal_updated', deal);
      }
    } catch (err) {
      console.error('Error broadcasting deal update:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket Client Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`CreatorConnect core systems live on port ${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/finance_she_manage';
console.log('Attempting to connect to MongoDB...');
console.log('URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:');
        console.error(err);
        process.exit(1);
    });

const subscriptionPlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    features: [String],
}, { timestamps: true });

subscriptionPlanSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    planAccess: { type: String, enum: ['free', 'premium'], default: 'free' },
    category: { type: String, default: 'tutorial' },
    s3Key: { type: String, required: true },
    thumbnailKey: { type: String, default: '' },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

videoSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        // Map DB fields to UI expected fields
        ret.url = ret.s3Key.startsWith('http') ? ret.s3Key : `https://hey-jessica-media.s3.us-east-1.amazonaws.com/${ret.s3Key}`;
        ret.category = ret.planAccess === 'premium' ? 'Premium' : 'Free';
        ret.thumbnail = ret.thumbnailKey ? `https://hey-jessica-media.s3.us-east-1.amazonaws.com/${ret.thumbnailKey}` : 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200';
        ret.uploadDate = ret.createdAt ? new Date(ret.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        delete ret._id;
        delete ret.__v;
    }
});

const Video = mongoose.model('Video', videoSchema);

app.get('/api/v1/subscriptions/plans', async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find();
        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/v1/subscriptions/plans', async (req, res) => {
    try {
        const { id, name, price, duration, features } = req.body;
        let plan;

        if (id) {
            plan = await SubscriptionPlan.findByIdAndUpdate(
                id,
                { name, price, duration, features },
                { new: true }
            );
        } else {
            plan = new SubscriptionPlan({ name, price, duration, features });
            await plan.save();
        }

        res.status(201).json(plan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/v1/subscriptions/plans/:id', async (req, res) => {
    try {
        await SubscriptionPlan.findByIdAndDelete(req.params.id);
        res.json({ message: 'Plan deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- VIDEO ROUTES ---

app.get('/api/v1/videos', async (req, res) => {
    try {
        const { category } = req.query;
        // The UI filters by "Free" or "Premium", but the DB uses "planAccess" = "free" or "premium"
        const filter = category ? { planAccess: category.toLowerCase() } : {};
        const videos = await Video.find(filter).sort({ createdAt: -1 });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/v1/videos/upload-url', async (req, res) => {
    try {
        const { fileName, fileType } = req.body;
        const mockVideoUrl = `https://mock-s3-bucket.s3.amazonaws.com/videos/${Date.now()}-${fileName}`;
        res.json({
            uploadUrl: 'https://mock-s3-upload.endpoint',
            videoUrl: mockVideoUrl
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/v1/videos', async (req, res) => {
    try {
        const { title, category, url } = req.body;

        const planAccess = category === 'Premium' ? 'premium' : 'free';
        const s3Key = url.includes('amazonaws.com/') ? url.split('amazonaws.com/')[1] : url;

        const video = new Video({
            title,
            planAccess,
            s3Key,
            category: 'tutorial',
            isActive: true
        });
        await video.save();
        res.status(201).json(video);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/v1/videos/:id', async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.json({ message: 'Video deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});




const path = require('path');
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});








app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

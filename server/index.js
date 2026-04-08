const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
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

// --- MODELS ---

// const subscriptionPlanSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     duration: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
//     features: [String],
// }, { timestamps: true });

const slugify = (s) =>
    String(s || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

const subscriptionPlanSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
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

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    role: { type: String, default: 'User' },
    status: { type: String, default: 'Active' },
    createdDate: { type: String },
}, { timestamps: true, strict: false, collection: 'users' });

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

const User = mongoose.model('User', userSchema);

// --- ROUTES ---

// Subscription Routes
app.get('/api/v1/subscriptions/plans', async(req, res) => {
    try {
        const plans = await SubscriptionPlan.find();
        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// app.post('/api/v1/subscriptions/plans', async(req, res) => {
//     try {
//         const { id, name, price, duration, features } = req.body;
//         let plan;

//         if (id) {
//             plan = await SubscriptionPlan.findByIdAndUpdate(
//                 id, { name, price, duration, features }, { new: true }
//             );
//         } else {
//             plan = new SubscriptionPlan({ name, price, duration, features });
//             await plan.save();
//         }

//         res.status(201).json(plan);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });



app.post('/api/v1/subscriptions/plans', async(req, res) => {
    try {
        const { id, name, price, duration, features } = req.body;

        const key = slugify(name);

        let plan;
        if (id) {
            plan = await SubscriptionPlan.findByIdAndUpdate(
                id, { key, name, price, duration, features }, { new: true }
            );
        } else {
            plan = new SubscriptionPlan({ key, name, price, duration, features });
            await plan.save();
        }

        res.status(201).json(plan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});











app.delete('/api/v1/subscriptions/plans/:id', async(req, res) => {
    try {
        await SubscriptionPlan.findByIdAndDelete(req.params.id);
        res.json({ message: 'Plan deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Video Routes
app.get('/api/v1/videos', async(req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { planAccess: category.toLowerCase() } : {};
        const videos = await Video.find(filter).sort({ createdAt: -1 });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/v1/videos/upload-url', async(req, res) => {
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

app.post('/api/v1/videos', async(req, res) => {
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

app.delete('/api/v1/videos/:id', async(req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.json({ message: 'Video deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// User Admin Routes
app.get('/api/v1/admin/users', async(req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/v1/admin/users/:id', async(req, res) => {
    try {
        const { name, email, role, status } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id, { name, email, role, status }, { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/v1/admin/users/:id', async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- ONBOARDING ROUTES ---

const onboardingGoalSchema = new mongoose.Schema({
    key: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
}, { timestamps: true, collection: 'onboardinggoals' });

onboardingGoalSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

const OnboardingGoal = mongoose.model('OnboardingGoal', onboardingGoalSchema);

const configurationSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true, collection: 'configurations' });

configurationSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

const Configuration = mongoose.model('Configuration', configurationSchema);

app.get('/api/v1/admin/onboarding/content', async(req, res) => {
    try {
        const goals = await OnboardingGoal.find().sort({ sortOrder: 1 });
        const promptConfig = await Configuration.findOne({ key: 'ONBOARDING_GOALS_PROMPT' });
        res.json({
            goals,
            prompt: promptConfig ? promptConfig.value : 'What are your primary financial goals?'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/v1/admin/onboarding/options/goals/:id', async(req, res) => {
    try {
        const { title, sortOrder, isActive } = req.body;
        const goal = await OnboardingGoal.findByIdAndUpdate(
            req.params.id, { title, sortOrder, isActive }, { new: true }
        );
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        res.json(goal);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/v1/admin/onboarding/options/goals/:id', async(req, res) => {
    try {
        const goal = await OnboardingGoal.findByIdAndDelete(req.params.id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        res.json({ message: 'Goal deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/v1/admin/onboarding/prompts/:key', async(req, res) => {
    try {
        const { value } = req.body;
        const config = await Configuration.findOneAndUpdate({ key: req.params.key }, { value }, { new: true, upsert: true });
        res.json(config);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Static files & Catch-all
app.use(express.static(path.join(__dirname, '../dist')));
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
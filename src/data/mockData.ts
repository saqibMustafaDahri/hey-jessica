export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  status: 'Active' | 'Inactive' | 'Suspended';
  createdDate: string;
}

export interface DeepfakeVideo {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  uploadDate: string;
}

export interface TutorialVideo {
  id: string;
  title: string;
  category: 'Free' | 'Premium';
  url: string;
  uploadDate: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: 'monthly' | 'yearly';
  features: string[];
}

export interface OnboardingQuestion {
  id: string;
  questionText: string;
  type: 'MCQ' | 'Text' | 'Boolean';
  options: string[];
  order: number;
}

export const mockUsers: User[] = [
  // { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Admin', status: 'Active', createdDate: '2024-01-15' },
  // { id: '2', name: 'Emily Chen', email: 'emily@example.com', role: 'User', status: 'Active', createdDate: '2024-02-20' },
  // { id: '3', name: 'Jessica Williams', email: 'jessica@example.com', role: 'User', status: 'Inactive', createdDate: '2024-03-10' },
  // { id: '4', name: 'Amanda Garcia', email: 'amanda@example.com', role: 'Moderator', status: 'Active', createdDate: '2024-04-05' },
  // { id: '5', name: 'Rachel Brown', email: 'rachel@example.com', role: 'User', status: 'Suspended', createdDate: '2024-05-12' },
  // { id: '6', name: 'Megan Taylor', email: 'megan@example.com', role: 'User', status: 'Active', createdDate: '2024-06-08' },
  // { id: '7', name: 'Lisa Anderson', email: 'lisa@example.com', role: 'User', status: 'Active', createdDate: '2024-07-01' },
  // { id: '8', name: 'Nicole Martinez', email: 'nicole@example.com', role: 'Moderator', status: 'Inactive', createdDate: '2024-07-15' },
];

export const mockDeepfakeVideos: DeepfakeVideo[] = [
  // { id: '1', title: 'Deepfake Awareness #1', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200', url: 'https://example.com/video1.mp4', uploadDate: '2024-06-01' },
  // { id: '2', title: 'AI Detection Demo', thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200', url: 'https://example.com/video2.mp4', uploadDate: '2024-06-15' },
  // { id: '3', title: 'Safety Guide Video', thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200', url: 'https://example.com/video3.mp4', uploadDate: '2024-07-01' },
];

export const mockTutorialVideos: TutorialVideo[] = [
  // { id: '1', title: 'Getting Started with Budgeting', category: 'Free', url: 'https://example.com/tut1.mp4', uploadDate: '2024-05-01' },
  // { id: '2', title: 'Advanced Investment Strategies', category: 'Premium', url: 'https://example.com/tut2.mp4', uploadDate: '2024-05-15' },
  // { id: '3', title: 'Emergency Fund Basics', category: 'Free', url: 'https://example.com/tut3.mp4', uploadDate: '2024-06-01' },
  // { id: '4', title: 'Tax Planning Masterclass', category: 'Premium', url: 'https://example.com/tut4.mp4', uploadDate: '2024-06-15' },
  // { id: '5', title: 'Saving Tips for Beginners', category: 'Free', url: 'https://example.com/tut5.mp4', uploadDate: '2024-07-01' },
];

export const mockPlans: SubscriptionPlan[] = [
  // { id: '1', name: 'Basic', price: 0, duration: 'monthly', features: ['Access to free tutorials', 'Basic budgeting tools', 'Community forum access'] },
  // { id: '2', name: 'Premium', price: 9.99, duration: 'monthly', features: ['All Basic features', 'Premium tutorials', 'AI financial advisor', 'Priority support', 'Deepfake protection tools'] },
  // { id: '3', name: 'Premium Annual', price: 99.99, duration: 'yearly', features: ['All Premium features', '2 months free', 'Exclusive workshops', '1-on-1 financial coaching'] },
];

export const mockQuestions: OnboardingQuestion[] = [
  // { id: '1', questionText: 'What is your primary financial goal?', type: 'MCQ', options: ['Save money', 'Invest', 'Pay off debt', 'Build emergency fund'], order: 1 },
  // { id: '2', questionText: 'What is your current monthly income range?', type: 'MCQ', options: ['Under $2,000', '$2,000-$5,000', '$5,000-$10,000', 'Over $10,000'], order: 2 },
  // { id: '3', questionText: 'Do you currently have a budget?', type: 'Boolean', options: ['Yes', 'No'], order: 3 },
  // { id: '4', questionText: 'What area of finance would you like to learn about first?', type: 'Text', options: [], order: 4 },
];

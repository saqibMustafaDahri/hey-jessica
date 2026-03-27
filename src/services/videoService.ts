import api from '../lib/axios';
import axios from 'axios';

export interface Video {
    id: string;
    title: string;
    category?: 'Free' | 'Premium';
    url: string;
    thumbnail?: string;
    uploadDate: string;
}

export const getVideos = async (category?: string): Promise<Video[]> => {
    const response = await api.get(`/videos${category ? `?category=${category}` : ''}`);
    return response.data;
};

export const getUploadUrl = async (fileName: string, fileType: string): Promise<{ uploadUrl: string, videoUrl: string }> => {
    const response = await api.post('/videos/upload-url', { fileName, fileType });
    return response.data;
};

export const uploadToS3 = async (uploadUrl: string, file: File): Promise<void> => {
    if (uploadUrl.includes('mock-s3-upload')) {
        // Simulate upload delay for the mock S3 endpoint
        await new Promise(resolve => setTimeout(resolve, 1500));
        return;
    }
    await axios.put(uploadUrl, file, {
        headers: {
            'Content-Type': file.type,
        },
    });
};

export const saveVideoMetadata = async (videoData: Partial<Video>): Promise<Video> => {
    const response = await api.post('/videos', videoData);
    return response.data;
};

export const deleteVideo = async (id: string): Promise<void> => {
    await api.delete(`/videos/${id}`);
};

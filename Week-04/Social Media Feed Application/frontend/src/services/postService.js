import api from './api';

export const fetchPosts = async (page = 1, limit = 10) => {
  const { data } = await api.get('/posts', { params: { page, limit } });
  return data;
};

export const fetchPostById = async (postId) => {
  const { data } = await api.get(`/posts/${postId}`);
  return data;
};

export const createPost = async ({ content, imageFile }) => {
  const formData = new FormData();
  if (content) formData.append('content', content);
  if (imageFile) formData.append('image', imageFile);

  const { data } = await api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updatePost = async (postId, { content, imageFile, removeImage }) => {
  const formData = new FormData();
  formData.append('content', content ?? '');
  if (imageFile) formData.append('image', imageFile);
  if (removeImage) formData.append('removeImage', 'true');

  const { data } = await api.put(`/posts/${postId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deletePost = async (postId) => {
  const { data } = await api.delete(`/posts/${postId}`);
  return data;
};

export const likePost = async (postId) => {
  const { data } = await api.post(`/posts/${postId}/like`);
  return data;
};

export const unlikePost = async (postId) => {
  const { data } = await api.delete(`/posts/${postId}/like`);
  return data;
};

export const fetchComments = async (postId) => {
  const { data } = await api.get(`/posts/${postId}/comments`);
  return data;
};

export const addComment = async (postId, text) => {
  const { data } = await api.post(`/posts/${postId}/comments`, { text });
  return data;
};

export const deleteComment = async (postId, commentId) => {
  const { data } = await api.delete(`/posts/${postId}/comments/${commentId}`);
  return data;
};


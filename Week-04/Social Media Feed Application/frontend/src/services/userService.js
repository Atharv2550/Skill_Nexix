import api from './api';

export const fetchUserProfile = async (userId) => {
  const { data } = await api.get(`/users/${userId}`);
  return data;
};

export const updateUserProfile = async ({ fullName, username, bio, profilePictureFile }) => {
  const formData = new FormData();
  if (fullName !== undefined) formData.append('fullName', fullName);
  if (username !== undefined) formData.append('username', username);
  if (bio !== undefined) formData.append('bio', bio);
  if (profilePictureFile) formData.append('profilePicture', profilePictureFile);

  const { data } = await api.put('/users/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const fetchUserPosts = async (userId, page = 1, limit = 10) => {
  const { data } = await api.get(`/users/${userId}/posts`, { params: { page, limit } });
  return data;
};


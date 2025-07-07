// Auth header helper
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export default getAuthHeaders;
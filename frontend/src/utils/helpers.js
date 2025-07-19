export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'var(--success-color)';
    case 'in-progress':
      return 'var(--primary-color)';
    default:
      return 'var(--light-color)';
  }
};
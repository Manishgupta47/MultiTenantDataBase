export const generateFioId = () => {
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${random}`;
};

const isImageUrl = (url) => {
  return /\.(jpeg|jpg|gif|png|webp|svg)$/.test(url);
};

export default isImageUrl;

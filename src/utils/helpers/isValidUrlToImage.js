function isValidUrlToImage(url) {
    return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg|docx|doc|pdf)$/.test(url);
}

export default isValidUrlToImage;

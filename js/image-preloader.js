/**
 * Image Preloader
 * Preloads key images for better user experience
 */
document.addEventListener('DOMContentLoaded', function() {
  // List of critical images to preload
  const criticalImages = [
    'images/C0014T01.jpg',
    'images/C0086T01.jpg', 
    'images/C0022T01 (2).jpg'
  ];

  // Preload hero slider images first
  preloadImages(criticalImages);

  // Preload remaining images after critical ones
  const remainingImages = [
    'images/C0023T01 (2).jpg',
    'images/C0020T01 (2).jpg',
    'images/C0066T01 (3).jpg',
    'images/C0069T01 (2).jpg',
    'images/C0096T01 (2).jpg',
    'images/DSC00008 (2).jpg',
    'images/DSC00073.jpg'
  ];

  // Delay loading of non-critical images
  setTimeout(() => {
    preloadImages(remainingImages);
  }, 3000);

  /**
   * Preload an array of images
   * @param {Array} imageArray - Array of image URLs to preload
   */
  function preloadImages(imageArray) {
    for (let i = 0; i < imageArray.length; i++) {
      const img = new Image();
      img.src = imageArray[i];
    }
  }
}); 
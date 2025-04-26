/**
 * Random Image Gallery
 * Displays a collection of images in random order
 */
document.addEventListener('DOMContentLoaded', function() {
  const images = [
    'images/C0014T01.JPG',
    'images/C0022T01 (2).JPG',
    'images/C0023T01 (2).JPG',
    'images/C0020T01 (2).JPG',
    'images/C0066T01 (3).JPG',
    'images/C0069T01 (2).JPG',
    'images/C0086T01.JPG',
    'images/C0096T01 (2).JPG',
    'images/DSC00008 (2).JPG',
    'images/DSC00073.JPG'
  ];

  // Fisher-Yates shuffle algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Get gallery container
  const galleryContainer = document.getElementById('random-gallery');
  
  if (galleryContainer) {
    // Shuffle the images array
    const shuffledImages = shuffleArray([...images]);
    
    // Create and append image elements
    shuffledImages.forEach(imageSrc => {
      const imgElement = document.createElement('div');
      imgElement.className = 'gallery-item';
      imgElement.innerHTML = `<img src="${imageSrc}" alt="Gallery Image">`;
      galleryContainer.appendChild(imgElement);
    });
  } else {
    console.error('Gallery container not found. Make sure to add an element with id="random-gallery"');
  }
}); 
/**
 * Khur Travel - Search Utility
 * Advanced search functionality for the Khur Travel website
 */

// Tour data - in a production environment, this would be loaded from a server
const tourData = [
    {
        id: 1,
        title: 'Gobi Desert Explorer',
        description: 'Discover the mysteries of the Gobi Desert on this 5-day adventure. Visit the Flaming Cliffs, sand dunes, and experience nomadic life.',
        image: 'images/tour-1.jpg',
        url: 'tour-details.html?id=1',
        type: 'Tour',
        category: ['adventure', 'desert', 'nature'],
        duration: '5 Days',
        price: '$690',
        location: 'Southern Mongolia'
    },
    {
        id: 2,
        title: 'Nomadic Life Experience',
        description: 'Live with local nomads and learn their way of life. Experience traditional customs, food, and daily activities.',
        image: 'images/tour-2.jpg',
        url: 'tour-details.html?id=2',
        type: 'Tour',
        category: ['culture', 'nomadic', 'traditional'],
        duration: '7 Days',
        price: '$850',
        location: 'Central Mongolia'
    },
    {
        id: 3,
        title: 'Horseback Riding Adventure',
        description: 'Explore the steppes on horseback like true Mongolians. Ride through beautiful landscapes and stay with nomadic families.',
        image: 'images/tour-3.jpg',
        url: 'tour-details.html?id=3',
        type: 'Tour',
        category: ['adventure', 'riding', 'nature'],
        duration: '8 Days',
        price: '$920',
        location: 'Central Mongolia'
    },
    {
        id: 4,
        title: 'Lake Khövsgöl Journey',
        description: 'Visit the stunning blue pearl of Mongolia. Enjoy the pristine nature, beautiful lake views, and local culture.',
        image: 'images/tour-4.jpg',
        url: 'tour-details.html?id=4',
        type: 'Tour',
        category: ['nature', 'lake', 'culture'],
        duration: '6 Days',
        price: '$780',
        location: 'Northern Mongolia'
    },
    {
        id: 5,
        title: 'Western Mongolia Explorer',
        description: 'Discover the diverse landscapes and ethnic cultures of Western Mongolia, including the Altai Mountains and Kazakh eagle hunters.',
        image: 'images/destination-1.jpg',
        url: 'tour-details.html?id=5',
        type: 'Tour',
        category: ['adventure', 'culture', 'mountain'],
        duration: '10 Days',
        price: '$1,250',
        location: 'Western Mongolia'
    },
    {
        id: 6,
        title: 'Naadam Festival Experience',
        description: 'Experience Mongolia's biggest festival featuring traditional sports: wrestling, archery, and horse racing.',
        image: 'images/events-1.jpg',
        url: 'tour-details.html?id=6',
        type: 'Tour',
        category: ['festival', 'culture', 'event'],
        duration: '7 Days',
        price: '$980',
        location: 'Ulaanbaatar & Central Mongolia'
    }
];

// Blog data
const blogData = [
    {
        id: 1,
        title: 'Mongolian Nomadic Culture',
        description: 'Learn about the ancient traditions and customs of Mongolian nomads in this informative article.',
        image: 'images/blog-1.jpg',
        url: 'blog-post.html?id=1',
        type: 'Blog',
        category: ['culture', 'nomadic', 'traditional'],
        date: 'June 15, 2023'
    },
    {
        id: 2,
        title: 'Photography Guide: Capturing Mongolia',
        description: 'Tips and techniques for photography enthusiasts to capture the beauty of Mongolia's landscapes and people.',
        image: 'images/blog-2.jpg',
        url: 'blog-post.html?id=2',
        type: 'Blog',
        category: ['photography', 'guide', 'tips'],
        date: 'July 8, 2023'
    },
    {
        id: 3,
        title: 'Best Time to Visit Mongolia',
        description: 'A comprehensive guide to Mongolia's seasons and the best times to visit for different experiences.',
        image: 'images/blog-3.jpg',
        url: 'blog-post.html?id=3',
        type: 'Blog',
        category: ['guide', 'planning', 'seasons'],
        date: 'August 22, 2023'
    }
];

// Destination data
const destinationData = [
    {
        id: 1,
        title: 'Western Mongolia',
        description: 'Snow-capped peaks, crystal-clear lakes, and diverse ethnic cultures in Mongolia's westernmost region.',
        image: 'images/destination-1.jpg',
        url: 'destinations.html#western',
        type: 'Destination',
        highlights: ['Altai Mountains', 'Kazakh Eagle Hunters', 'Snow Leopard Territory']
    },
    {
        id: 2,
        title: 'Central Mongolia',
        description: 'Rich history, vast steppes and the heart of the Mongol Empire including the ancient capital of Karakorum.',
        image: 'images/destination-2.jpg',
        url: 'destinations.html#central',
        type: 'Destination',
        highlights: ['Orkhon Valley', 'Khustai National Park', 'Karakorum']
    },
    {
        id: 3,
        title: 'Gobi Desert',
        description: 'Vast desert landscapes, rolling sand dunes, and dinosaur fossil sites in the famous Gobi region.',
        image: 'images/destination-4.jpg',
        url: 'destinations.html#southern',
        type: 'Destination',
        highlights: ['Khongoryn Els', 'Flaming Cliffs', 'Yolyn Am']
    }
];

// Combine all data for unified search
const searchableData = [...tourData, ...blogData, ...destinationData];

/**
 * Performs a search across all data types
 * @param {string} query - The search query
 * @param {Object} filters - Optional filters to apply (type, category, duration, etc.)
 * @returns {Array} - Array of matching results
 */
function performSearch(query, filters = {}) {
    if (!query || query.trim() === '') {
        return [];
    }
    
    const searchTerm = query.toLowerCase().trim();
    
    // Special case: If searching for "tour" or "tours", return all tours
    if (searchTerm === 'tour' || searchTerm === 'tours' || 
        searchTerm === 'all' || searchTerm === 'all tours') {
        let allTours = searchableData.filter(item => item.type === 'Tour');
        return applyFilters(allTours, filters);
    }
    
    // Special case: If searching for a location like "Mongolia", "Central", etc.
    const locationTerms = ['mongolia', 'central', 'western', 'southern', 'northern', 'eastern', 'gobi'];
    if (locationTerms.includes(searchTerm)) {
        let locationResults = searchableData.filter(item => 
            item.location && item.location.toLowerCase().includes(searchTerm)
        );
        return applyFilters(locationResults, filters);
    }
    
    // First filter by query
    let results = searchableData.filter(item => {
        // Check title and description
        const titleMatch = item.title.toLowerCase().includes(searchTerm);
        const descMatch = item.description.toLowerCase().includes(searchTerm);
        
        // Check categories if they exist
        let categoryMatch = false;
        if (item.category) {
            categoryMatch = item.category.some(cat => 
                cat.toLowerCase().includes(searchTerm)
            );
        }
        
        // Check location if it exists
        let locationMatch = false;
        if (item.location) {
            locationMatch = item.location.toLowerCase().includes(searchTerm);
        }
        
        // Check highlights if they exist
        let highlightsMatch = false;
        if (item.highlights) {
            highlightsMatch = item.highlights.some(highlight => 
                highlight.toLowerCase().includes(searchTerm)
            );
        }
        
        return titleMatch || descMatch || categoryMatch || locationMatch || highlightsMatch;
    });
    
    // Then apply any additional filters
    return applyFilters(results, filters);
}

/**
 * Applies filters to search results
 * @param {Array} results - The search results to filter
 * @param {Object} filters - The filters to apply
 * @returns {Array} - The filtered results
 */
function applyFilters(results, filters = {}) {
    let filteredResults = [...results];
    
    if (filters.type) {
        filteredResults = filteredResults.filter(item => item.type === filters.type);
    }
    
    if (filters.category) {
        filteredResults = filteredResults.filter(item => 
            item.category && item.category.some(cat => 
                cat.toLowerCase().includes(filters.category.toLowerCase())
            )
        );
    }
    
    if (filters.location) {
        filteredResults = filteredResults.filter(item => 
            item.location && item.location.toLowerCase().includes(filters.location.toLowerCase())
        );
    }
    
    // Handle price filters for tour types only
    if ((filters.minPrice !== undefined || filters.maxPrice !== undefined) && 
        !isNaN(filters.minPrice) && !isNaN(filters.maxPrice)) {
        
        const minPrice = parseFloat(filters.minPrice) || 0;
        const maxPrice = parseFloat(filters.maxPrice) || Number.MAX_SAFE_INTEGER;
        
        filteredResults = filteredResults.filter(item => {
            if (item.type !== 'Tour' || !item.price) return true;
            
            // Extract numeric price value
            const priceString = item.price.replace(/[^0-9.]/g, '');
            const priceValue = parseFloat(priceString);
            
            return !isNaN(priceValue) && priceValue >= minPrice && priceValue <= maxPrice;
        });
    }
    
    return filteredResults;
}

/**
 * Highlights the search term in a given text
 * @param {string} text - The text to highlight in
 * @param {string} query - The search term to highlight
 * @returns {string} - HTML with highlighted search terms
 */
function highlightSearchTerm(text, query) {
    if (!query || !text) return text;
    
    const escQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escQuery})`, 'gi');
    
    return text.replace(regex, '<span class="matching-text">$1</span>');
}

/**
 * Gets suggested search terms based on a partial query
 * @param {string} partialQuery - The partial search query
 * @returns {Array} - Array of suggested search terms
 */
function getSuggestions(partialQuery) {
    if (!partialQuery || partialQuery.length < 2) return [];
    
    const query = partialQuery.toLowerCase().trim();
    const suggestions = new Set();
    
    // Add common search terms
    const commonTerms = [
        'gobi', 'desert', 'nomadic', 'culture', 'horse', 'riding',
        'photography', 'adventure', 'festival', 'naadam', 'lake',
        'western', 'central', 'northern', 'southern', 'ulaanbaatar',
        'trekking', 'hiking', 'camping', 'eagle', 'hunting', 'camel'
    ];
    
    // Filter common terms that match the query
    commonTerms.forEach(term => {
        if (term.includes(query)) {
            suggestions.add(term);
        }
    });
    
    // Add matching tour titles, locations, and categories
    searchableData.forEach(item => {
        // Check title words
        const titleWords = item.title.toLowerCase().split(' ');
        titleWords.forEach(word => {
            if (word.length > 3 && word.includes(query)) {
                suggestions.add(word);
            }
        });
        
        // Check categories
        if (item.category) {
            item.category.forEach(cat => {
                if (cat.includes(query)) {
                    suggestions.add(cat);
                }
            });
        }
        
        // Check location
        if (item.location && item.location.toLowerCase().includes(query)) {
            suggestions.add(item.location);
        }
    });
    
    // Sort suggestions by relevance (starting with the query first)
    return Array.from(suggestions)
        .sort((a, b) => {
            // Suggestions starting with the query come first
            const aStartsWith = a.startsWith(query);
            const bStartsWith = b.startsWith(query);
            
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            
            // Then sort by length (shorter suggestions first)
            return a.length - b.length;
        })
        .slice(0, 8); // Limit to 8 suggestions
}

// Export functions for use in other scripts
window.KhurSearch = {
    performSearch,
    highlightSearchTerm,
    getSuggestions,
    tourData,
    blogData,
    destinationData
}; 
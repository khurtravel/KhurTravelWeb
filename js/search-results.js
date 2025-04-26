/**
 * Khur Travel - Search Results Handler
 * Script to display and manage search results on the search results page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fallback search data in case the main search.js fails to load
    const fallbackTourData = [
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
            description: 'Experience Mongolia\'s biggest festival featuring traditional sports: wrestling, archery, and horse racing.',
            image: 'images/events-1.jpg',
            url: 'tour-details.html?id=6',
            type: 'Tour',
            category: ['festival', 'culture', 'event'],
            duration: '7 Days',
            price: '$980',
            location: 'Ulaanbaatar & Central Mongolia'
        }
    ];
    
    const fallbackBlogData = [
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
            description: 'Tips and techniques for photography enthusiasts to capture the beauty of Mongolia\'s landscapes and people.',
            image: 'images/blog-2.jpg',
            url: 'blog-post.html?id=2',
            type: 'Blog',
            category: ['photography', 'guide', 'tips'],
            date: 'July 8, 2023'
        },
        {
            id: 3,
            title: 'Best Time to Visit Mongolia',
            description: 'A comprehensive guide to Mongolia\'s seasons and the best times to visit for different experiences.',
            image: 'images/blog-3.jpg',
            url: 'blog-post.html?id=3',
            type: 'Blog',
            category: ['guide', 'planning', 'seasons'],
            date: 'August 22, 2023'
        }
    ];
    
    const fallbackDestinationData = [
        {
            id: 1,
            title: 'Western Mongolia',
            description: 'Snow-capped peaks, crystal-clear lakes, and diverse ethnic cultures in Mongolia\'s westernmost region.',
            image: 'images/destination-1.jpg',
            url: 'destinations.html#western',
            type: 'Destination',
            highlights: ['Altai Mountains', 'Kazakh Eagle Hunters', 'Snow Leopard Territory'],
            location: 'Western Mongolia'
        },
        {
            id: 2,
            title: 'Central Mongolia',
            description: 'Rich history, vast steppes and the heart of the Mongol Empire including the ancient capital of Karakorum.',
            image: 'images/destination-2.jpg',
            url: 'destinations.html#central',
            type: 'Destination',
            highlights: ['Orkhon Valley', 'Khustai National Park', 'Karakorum'],
            location: 'Central Mongolia'
        },
        {
            id: 3,
            title: 'Gobi Desert',
            description: 'Vast desert landscapes, rolling sand dunes, and dinosaur fossil sites in the famous Gobi region.',
            image: 'images/destination-4.jpg',
            url: 'destinations.html#southern',
            type: 'Destination',
            highlights: ['Khongoryn Els', 'Flaming Cliffs', 'Yolyn Am'],
            location: 'Southern Mongolia'
        }
    ];
    
    // Create fallback search utility
    if (!window.KhurSearch) {
        console.log('KhurSearch not found, creating fallback search utility');
        window.KhurSearch = {
            tourData: fallbackTourData,
            blogData: fallbackBlogData,
            destinationData: fallbackDestinationData,
            performSearch: function(query, filters = {}) {
                if (!query || query.trim() === '') {
                    return [];
                }
                
                const searchTerm = query.toLowerCase().trim();
                const allData = [...fallbackTourData, ...fallbackBlogData, ...fallbackDestinationData];
                
                // Filter by search term
                let results = allData.filter(item => {
                    const titleMatch = item.title.toLowerCase().includes(searchTerm);
                    const descMatch = item.description.toLowerCase().includes(searchTerm);
                    
                    // Check category
                    let categoryMatch = false;
                    if (item.category) {
                        categoryMatch = item.category.some(cat => 
                            cat.toLowerCase().includes(searchTerm)
                        );
                    }
                    
                    // Check location
                    let locationMatch = false;
                    if (item.location) {
                        locationMatch = item.location.toLowerCase().includes(searchTerm);
                    }
                    
                    // Check highlights
                    let highlightsMatch = false;
                    if (item.highlights) {
                        highlightsMatch = item.highlights.some(highlight => 
                            highlight.toLowerCase().includes(searchTerm)
                        );
                    }
                    
                    return titleMatch || descMatch || categoryMatch || locationMatch || highlightsMatch;
                });
                
                // Filter by type
                if (filters.type) {
                    results = results.filter(item => item.type === filters.type);
                }
                
                // Filter by category
                if (filters.category) {
                    results = results.filter(item => 
                        item.category && item.category.includes(filters.category)
                    );
                }
                
                // Filter by location
                if (filters.location) {
                    results = results.filter(item => 
                        item.location && item.location.toLowerCase().includes(filters.location.toLowerCase())
                    );
                }
                
                return results;
            },
            highlightSearchTerm: function(text, query) {
                if (!query || !text) return text;
                
                const escQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`(${escQuery})`, 'gi');
                
                return text.replace(regex, '<span class="matching-text">$1</span>');
            },
            getSuggestions: function(query) {
                if (!query || query.length < 2) return [];
                
                const suggestions = [
                    'gobi desert', 'horseback riding', 'nomadic life',
                    'western mongolia', 'camel riding', 'eagle hunting',
                    'naadam festival', 'photography tour'
                ];
                
                return suggestions.filter(s => s.includes(query.toLowerCase()));
            }
        };
    }

    const resultsContainer = document.getElementById('search-results');
    const resultsCount = document.getElementById('results-count');
    const searchQueryDisplay = document.getElementById('search-query');
    const noResultsSection = document.getElementById('no-results-section');
    const filterForm = document.getElementById('filter-form');
    const searchAgainForm = document.getElementById('search-again-form');
    const suggestionsList = document.getElementById('suggestions-list');
    
    // Get query parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query') || '';
    
    // Set the search query in the display and form
    if (searchQueryDisplay) {
        searchQueryDisplay.textContent = searchQuery;
    }
    
    // Set the search query in the search again form
    const searchAgainInput = document.getElementById('search-again-input');
    if (searchAgainInput) {
        searchAgainInput.value = searchQuery;
    }
    
    // Initialize filters from URL parameters
    const filters = {
        type: urlParams.get('type') || '',
        category: urlParams.get('category') || '',
        location: urlParams.get('location') || '',
        minPrice: urlParams.get('minPrice') || '',
        maxPrice: urlParams.get('maxPrice') || ''
    };
    
    // Set initial filter form values if they exist
    if (filterForm) {
        const typeSelect = document.getElementById('filter-type');
        const categorySelect = document.getElementById('filter-category');
        const locationSelect = document.getElementById('filter-location');
        const minPriceInput = document.getElementById('filter-min-price');
        const maxPriceInput = document.getElementById('filter-max-price');
        
        if (typeSelect) typeSelect.value = filters.type;
        if (categorySelect) categorySelect.value = filters.category;
        if (locationSelect) locationSelect.value = filters.location;
        if (minPriceInput) minPriceInput.value = filters.minPrice;
        if (maxPriceInput) maxPriceInput.value = filters.maxPrice;
    }
    
    // Perform search
    function performSearchAndDisplayResults() {
        if (!searchQuery || searchQuery.trim() === '') {
            showNoResults('Please enter a search term.');
            return;
        }
        
        try {
            // Create proper filter object including price filters
            const searchFilters = {
                type: filters.type,
                category: filters.category,
                location: filters.location,
                minPrice: parseFloat(filters.minPrice) || 0,
                maxPrice: parseFloat(filters.maxPrice) || Number.MAX_SAFE_INTEGER
            };
            
            // Use the search utility from search.js or fallback
            const results = window.KhurSearch.performSearch(searchQuery, searchFilters);
            
            // Apply price filtering here if we have price values
            let filteredResults = results;
            if (filters.minPrice || filters.maxPrice) {
                const minPrice = parseFloat(filters.minPrice) || 0;
                const maxPrice = parseFloat(filters.maxPrice) || Number.MAX_SAFE_INTEGER;
                
                filteredResults = results.filter(item => {
                    // Only apply price filter to tours
                    if (item.type !== 'Tour' || !item.price) return true;
                    
                    // Extract numeric price value
                    const priceString = item.price.replace(/[^0-9.]/g, '');
                    const priceValue = parseFloat(priceString);
                    
                    return !isNaN(priceValue) && priceValue >= minPrice && priceValue <= maxPrice;
                });
            }
            
            displayResults(filteredResults);
        } catch (error) {
            console.error('Search error:', error);
            showNoResults('Search functionality encountered an error. Please try again.');
        }
    }
    
    // Display search results
    function displayResults(results) {
        if (!resultsContainer) return;
        
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            showNoResults();
            return;
        }
        
        // Hide no results section
        if (noResultsSection) {
            noResultsSection.style.display = 'none';
        }
        
        // Update results count
        if (resultsCount) {
            resultsCount.textContent = results.length;
        }
        
        // Create result cards
        results.forEach(item => {
            const resultCard = document.createElement('div');
            resultCard.className = 'search-result-card';
            
            const imageUrl = item.image || 'images/placeholder.jpg';
            const highlightedTitle = window.KhurSearch.highlightSearchTerm(item.title, searchQuery);
            const description = item.description || '';
            const shortDescription = description.length > 150 ? description.substring(0, 150) + '...' : description;
            const highlightedDescription = window.KhurSearch.highlightSearchTerm(shortDescription, searchQuery);
            
            let typeClass = '';
            if (item.type === 'Tour') {
                typeClass = 'tour';
            } else if (item.type === 'Blog') {
                typeClass = 'blog';
            } else if (item.type === 'Destination') {
                typeClass = 'destination';
            }
            
            let metaInfo = '';
            if (item.type === 'Tour') {
                metaInfo = `
                    <div class="search-result-meta">
                        <span><i class="fas fa-clock"></i> ${item.duration || 'Variable duration'}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${item.location || 'Various locations'}</span>
                        <span><i class="fas fa-tag"></i> ${item.price || 'Contact for price'}</span>
                    </div>
                `;
            } else if (item.type === 'Blog') {
                metaInfo = `
                    <div class="search-result-meta">
                        <span><i class="fas fa-calendar-alt"></i> ${item.date || 'Recent'}</span>
                        <span><i class="fas fa-user"></i> ${item.author || 'Khur Travel'}</span>
                    </div>
                `;
            } else if (item.type === 'Destination') {
                metaInfo = `
                    <div class="search-result-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${item.location || 'Mongolia'}</span>
                        <span><i class="fas fa-star"></i> ${item.highlights && item.highlights.length > 0 ? item.highlights[0] : 'Scenic beauty'}</span>
                    </div>
                `;
            }
            
            resultCard.innerHTML = `
                <div class="search-result-img">
                    <img src="${imageUrl}" alt="${item.title}">
                    <span class="search-result-type ${typeClass}">${item.type}</span>
                </div>
                <div class="search-result-content">
                    <h3>${highlightedTitle}</h3>
                    <p>${highlightedDescription}</p>
                    ${metaInfo}
                    <a href="${item.url}" class="btn-small">View Details</a>
                </div>
            `;
            
            resultsContainer.appendChild(resultCard);
        });
    }
    
    // Display no results message
    function showNoResults(message = 'We couldn\'t find any matches for your search term. Please try a different search or browse our popular topics.') {
        if (!noResultsSection) return;
        
        // Show no results section
        noResultsSection.style.display = 'block';
        
        // Update message if there's a specific message element
        const messageElement = noResultsSection.querySelector('p');
        if (messageElement) {
            messageElement.textContent = message;
        }
        
        // Update suggestions
        updateSuggestions();
        
        // Clear results container
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
        
        // Update results count
        if (resultsCount) {
            resultsCount.textContent = '0';
        }
    }
    
    // Update suggestions based on the search query
    function updateSuggestions() {
        if (!suggestionsList) return;
        
        // Clear previous suggestions
        suggestionsList.innerHTML = '';
        
        try {
            // Get suggestions
            const suggestions = window.KhurSearch.getSuggestions(searchQuery);
            
            if (suggestions.length === 0) {
                const defaultSuggestions = [
                    'gobi desert', 'horseback riding', 'nomadic life',
                    'western mongolia', 'camel riding', 'eagle hunting',
                    'naadam festival', 'photography tour'
                ];
                
                // Add default suggestions
                defaultSuggestions.forEach(suggestion => {
                    const suggestionLink = document.createElement('a');
                    suggestionLink.href = `search-results.html?query=${encodeURIComponent(suggestion)}`;
                    suggestionLink.textContent = suggestion;
                    suggestionsList.appendChild(suggestionLink);
                });
            } else {
                // Add suggestions
                suggestions.forEach(suggestion => {
                    const suggestionLink = document.createElement('a');
                    suggestionLink.href = `search-results.html?query=${encodeURIComponent(suggestion)}`;
                    suggestionLink.textContent = suggestion;
                    suggestionsList.appendChild(suggestionLink);
                });
            }
        } catch (error) {
            console.error('Error updating suggestions:', error);
            const defaultSuggestions = [
                'gobi desert', 'horseback riding', 'nomadic life',
                'western mongolia', 'camel riding', 'eagle hunting'
            ];
            
            defaultSuggestions.forEach(suggestion => {
                const suggestionLink = document.createElement('a');
                suggestionLink.href = `search-results.html?query=${encodeURIComponent(suggestion)}`;
                suggestionLink.textContent = suggestion;
                suggestionsList.appendChild(suggestionLink);
            });
        }
    }
    
    // Handle filter form submission
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Update filters
            const typeSelect = document.getElementById('filter-type');
            const categorySelect = document.getElementById('filter-category');
            const locationSelect = document.getElementById('filter-location');
            const minPriceInput = document.getElementById('filter-min-price');
            const maxPriceInput = document.getElementById('filter-max-price');
            
            filters.type = typeSelect ? typeSelect.value : '';
            filters.category = categorySelect ? categorySelect.value : '';
            filters.location = locationSelect ? locationSelect.value : '';
            filters.minPrice = minPriceInput ? minPriceInput.value : '';
            filters.maxPrice = maxPriceInput ? maxPriceInput.value : '';
            
            // Update URL with new filters
            const newUrl = new URL(window.location);
            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    newUrl.searchParams.set(key, filters[key]);
                } else {
                    newUrl.searchParams.delete(key);
                }
            });
            window.history.pushState({}, '', newUrl);
            
            // Perform search with new filters
            performSearchAndDisplayResults();
        });
    }
    
    // Handle search again form submission
    if (searchAgainForm) {
        searchAgainForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newQuery = searchAgainInput.value.trim();
            if (newQuery) {
                window.location.href = `search-results.html?query=${encodeURIComponent(newQuery)}`;
            }
        });
    }
    
    // Initialize search on page load
    performSearchAndDisplayResults();
    
    // Mobile menu toggle for filters on small screens
    const filterToggle = document.querySelector('.filter-toggle');
    if (filterToggle) {
        filterToggle.addEventListener('click', function() {
            const filterResults = document.querySelector('.filter-results');
            if (filterResults) {
                filterResults.classList.toggle('show-filters');
                this.setAttribute('aria-expanded', 
                    this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
                );
            }
        });
    }

    // Add popular searches to the suggestions in the "No Results Found" section
    function addPopularSearches() {
        const popularSearches = document.querySelector('.suggestion-links');
        if (!popularSearches) return;

        // Only add popular searches if they don't already exist
        if (popularSearches.children.length === 0) {
            const suggestions = [
                'gobi', 'desert', 'nomadic', 'horse riding', 
                'adventure', 'festival', 'naadam', 'khur',
                'western mongolia', 'lake khuvsgul'
            ];
            
            suggestions.forEach(term => {
                const link = document.createElement('a');
                link.href = `search-results.html?query=${encodeURIComponent(term)}`;
                link.textContent = term;
                popularSearches.appendChild(link);
            });
        }
    }

    // Initialize popular searches
    addPopularSearches();
}); 
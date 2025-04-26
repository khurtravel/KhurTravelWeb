#!/bin/bash

# List of HTML files to update (excluding index.html that we already updated)
HTML_FILES=(
    "about-mongolia.html"
    "blog.html"
    "central-tours.html"
    "destinations.html"
    "gobi-tours.html"
    "naadam-tours.html"
    "northern-tours.html"
    "payment.html"
    "privacy-policy.html"
    "search-results.html"
    "sitemap.html"
    "tailor-made.html"
    "terms-conditions.html"
    "tour-details-altai-eagle.html"
    "tour-details-khovsgol.html"
    "tour-details-northern-horse.html"
    "tour-details-tavan-bogd.html"
    "tour-details-tsaatan.html"
    "tour-details-western-exploration.html"
    "tour-details-western-mongolia.html"
    "tour-details-western-nomadic.html"
    "tours.html"
    "western-tours.html"
    "enquire.html"
)

# Loop through each file and update the footer
for file in "${HTML_FILES[@]}"; do
    echo "Updating footer in $file..."
    
    # Use sed to replace the old footer with the new one
    sed -i '' '/<footer>/,/<\/footer>/c\
    <footer class="site-footer">\
        <div class="footer-top">\
            <div class="container">\
                <div class="footer-content">\
                    <div class="footer-col footer-info">\
                        <div class="footer-logo">\
                            <img src="images/logo-light.png" alt="Khur Travel Logo">\
                        </div>\
                        <address>\
                            Room 14, Building 69 Sukhbaatar<br>\
                            District, 14200, Ulaanbaatar, Mongolia\
                        </address>\
                        <p class="footer-contact">\
                            <span><i class="fas fa-phone"></i> 976-70106695</span>\
                            <span><i class="fas fa-mobile-alt"></i> 976-99775008</span>\
                            <span><i class="fas fa-envelope"></i> info@tourmongolia.com</span>\
                        </p>\
                        <div class="footer-social">\
                            <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>\
                            <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>\
                            <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>\
                            <a href="#" aria-label="Pinterest"><i class="fab fa-pinterest"></i></a>\
                            <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>\
                        </div>\
                    </div>\
                    \
                    <div class="footer-col">\
                        <h4>Travel Destinations</h4>\
                        <ul>\
                            <li><a href="destinations.html#northern">Northern Mongolia</a></li>\
                            <li><a href="destinations.html#central">Central Mongolia</a></li>\
                            <li><a href="destinations.html#eastern">Eastern Mongolia</a></li>\
                            <li><a href="destinations.html#southern">Southern Mongolia</a></li>\
                            <li><a href="destinations.html#western">Western Mongolia</a></li>\
                            <li><a href="destinations.html">Top Travel Destinations</a></li>\
                            <li><a href="photo-spots.html">Best Photography Spots</a></li>\
                        </ul>\
                    </div>\
                    \
                    <div class="footer-col">\
                        <h4>Mongolia Tours</h4>\
                        <ul>\
                            <li><a href="tours.html?type=adventure">Adventure Tours</a></li>\
                            <li><a href="tours.html?type=photography">Photography Tours</a></li>\
                            <li><a href="tours.html?type=culture">Culture Tours</a></li>\
                            <li><a href="tours.html?type=discovery">Discovery Tours</a></li>\
                            <li><a href="tours.html?type=hiking">Hiking & Trekking</a></li>\
                            <li><a href="tours.html?type=riding">Horse & Camel Riding</a></li>\
                            <li><a href="tours.html?type=naadam">Naadam Festival</a></li>\
                            <li><a href="tours.html?type=event">Event Tours</a></li>\
                            <li><a href="tours.html?type=best">Best Sellers</a></li>\
                            <li><a href="tours.html?type=fixed">Fixed Date Tours</a></li>\
                            <li><a href="tours.html?type=discount">Discounted Tours</a></li>\
                        </ul>\
                    </div>\
                    \
                    <div class="footer-col">\
                        <h4>Travel Resources</h4>\
                        <div class="footer-double-col">\
                            <div>\
                                <h5>Travel Guide</h5>\
                                <ul>\
                                    <li><a href="trip-planning.html">Trip Planning</a></li>\
                                    <li><a href="travel-tips.html">Travel Tips</a></li>\
                                    <li><a href="things-to-do.html">Things To Do</a></li>\
                                    <li><a href="best-of-mongolia.html">Best of Mongolia</a></li>\
                                    <li><a href="attractions.html">Attractions</a></li>\
                                    <li><a href="custom-trip.html">Custom Trips</a></li>\
                                    <li><a href="blog.html">Travel Blog</a></li>\
                                </ul>\
                            </div>\
                            <div>\
                                <h5>About Mongolia</h5>\
                                <ul>\
                                    <li><a href="about-mongolia.html#geography">Geography</a></li>\
                                    <li><a href="about-mongolia.html#history">History</a></li>\
                                    <li><a href="about-mongolia.html#nomads">Nomadic Life</a></li>\
                                    <li><a href="about-mongolia.html#culture">Culture & Heritage</a></li>\
                                    <li><a href="festivals.html">Festivals & Events</a></li>\
                                    <li><a href="nature.html">Nature & Wildlife</a></li>\
                                    <li><a href="cuisine.html">Cuisine</a></li>\
                                </ul>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>\
        \
        <div class="footer-bottom">\
            <div class="container">\
                <div class="footer-bottom-wrapper">\
                    <div class="copyright">\
                        <p>&copy; 2007-2023 KHUR TRAVEL CO.LTD. All rights reserved.</p>\
                    </div>\
                    <div class="payment-methods">\
                        <span>Secure Payments:</span>\
                        <img src="images/payment-icons.png" alt="Payment Methods">\
                    </div>\
                    <nav class="footer-nav">\
                        <a href="index.html">Home</a>\
                        <a href="tours.html">Tours</a>\
                        <a href="blog.html">Blog</a>\
                        <a href="terms-conditions.html">Terms</a>\
                        <a href="privacy-policy.html">Privacy</a>\
                        <a href="payment.html">Payment</a>\
                        <a href="contact-us.html">Contact</a>\
                        <a href="sitemap.html">Sitemap</a>\
                    </nav>\
                </div>\
            </div>\
        </div>\
    </footer>\
\
    <button id="scroll-top" class="scroll-top" aria-label="Scroll to top">\
        <i class="fas fa-arrow-up"></i>\
    </button>' "$file"
    
    echo "Updated $file successfully."
done

echo "All footers have been updated!" 
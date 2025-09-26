/**
 * ArtikelList Component JavaScript
 * Enhanced functionality for article list with search, pagination, and loading states
 */

(function($) {
    'use strict';

    // Configuration
    const config = {
        itemsPerPage: 6,
        searchDelay: 300,
        skeletonCount: 6
    };

    // Sample article data - In a real app, this would come from an API
    const sampleArticles = [
        {
            id: 1,
            title: "Getting Started with Web Development",
            excerpt: "Learn the fundamentals of web development including HTML, CSS, and JavaScript. This comprehensive guide will take you through the basics and help you build your first website.",
            category: "Web Development",
            author: "John Doe",
            date: "2024-01-15",
            readingTime: "5 min read",
            image: "images/pic01.jpg",
            tags: ["HTML", "CSS", "JavaScript", "Beginner"],
            slug: "getting-started-web-development"
        },
        {
            id: 2,
            title: "Advanced React Techniques",
            excerpt: "Explore advanced React patterns and techniques to build scalable applications. Learn about hooks, context, and performance optimization strategies.",
            category: "React",
            author: "Jane Smith",
            date: "2024-01-20",
            readingTime: "8 min read",
            image: "images/pic02.jpg",
            tags: ["React", "JavaScript", "Advanced", "Hooks"],
            slug: "advanced-react-techniques"
        },
        {
            id: 3,
            title: "Modern CSS Grid Layout",
            excerpt: "Master CSS Grid layout system and create responsive designs with ease. Learn practical techniques and real-world examples.",
            category: "CSS",
            author: "Mike Johnson",
            date: "2024-01-25",
            readingTime: "6 min read",
            image: "images/pic03.jpg",
            tags: ["CSS", "Grid", "Layout", "Responsive"],
            slug: "modern-css-grid-layout"
        },
        {
            id: 4,
            title: "Node.js Backend Development",
            excerpt: "Build robust backend applications with Node.js. Learn about Express, databases, authentication, and API development.",
            category: "Backend",
            author: "Sarah Wilson",
            date: "2024-02-01",
            readingTime: "10 min read",
            image: "images/pic04.jpg",
            tags: ["Node.js", "Express", "Backend", "API"],
            slug: "nodejs-backend-development"
        },
        {
            id: 5,
            title: "Database Design Best Practices",
            excerpt: "Learn how to design efficient and scalable databases. Understand normalization, indexing, and query optimization techniques.",
            category: "Database",
            author: "Tom Brown",
            date: "2024-02-05",
            readingTime: "7 min read",
            image: "images/pic05.jpg",
            tags: ["Database", "SQL", "Design", "Performance"],
            slug: "database-design-best-practices"
        },
        {
            id: 6,
            title: "Mobile-First Responsive Design",
            excerpt: "Create websites that work perfectly on all devices. Learn mobile-first approach and responsive design principles.",
            category: "Design",
            author: "Lisa Davis",
            date: "2024-02-10",
            readingTime: "6 min read",
            image: "images/pic06.jpg",
            tags: ["Responsive", "Mobile", "Design", "UX"],
            slug: "mobile-first-responsive-design"
        },
        {
            id: 7,
            title: "JavaScript ES6+ Features",
            excerpt: "Explore modern JavaScript features and syntax. Learn about arrow functions, destructuring, modules, and async/await.",
            category: "JavaScript",
            author: "Alex Chen",
            date: "2024-02-15",
            readingTime: "9 min read",
            image: "images/pic07.jpg",
            tags: ["JavaScript", "ES6", "Modern", "Syntax"],
            slug: "javascript-es6-features"
        },
        {
            id: 8,
            title: "Web Performance Optimization",
            excerpt: "Optimize your website performance for better user experience. Learn about loading speed, caching, and optimization techniques.",
            category: "Performance",
            author: "David Lee",
            date: "2024-02-20",
            readingTime: "8 min read",
            image: "images/pic08.jpg",
            tags: ["Performance", "Optimization", "Speed", "UX"],
            slug: "web-performance-optimization"
        }
    ];

    // ArtikelList class
    class ArtikelList {
        constructor(container) {
            this.container = $(container);
            this.articles = [...sampleArticles];
            this.filteredArticles = [...sampleArticles];
            this.currentPage = 1;
            this.itemsPerPage = config.itemsPerPage;
            this.searchTimeout = null;
            this.isLoading = false;

            this.init();
        }

        init() {
            this.bindEvents();
            this.render();
        }

        bindEvents() {
            // Search functionality
            this.container.on('input', '.search-input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, config.searchDelay);
            });

            // Search button click
            this.container.on('click', '.search-button', (e) => {
                e.preventDefault();
                const searchTerm = this.container.find('.search-input').val();
                this.handleSearch(searchTerm);
            });

            // Pagination clicks
            this.container.on('click', '.page-btn:not(.disabled)', (e) => {
                e.preventDefault();
                const page = $(e.currentTarget).data('page');
                if (page && page !== this.currentPage) {
                    this.goToPage(page);
                }
            });

            // Tag clicks
            this.container.on('click', '.tag', (e) => {
                e.preventDefault();
                const tag = $(e.currentTarget).text();
                this.container.find('.search-input').val(tag);
                this.handleSearch(tag);
            });

            // Retry button for error state
            this.container.on('click', '.retry-button', () => {
                this.render();
            });
        }

        handleSearch(searchTerm) {
            const term = searchTerm.toLowerCase().trim();
            
            if (term === '') {
                this.filteredArticles = [...this.articles];
            } else {
                this.filteredArticles = this.articles.filter(article => 
                    article.title.toLowerCase().includes(term) ||
                    article.excerpt.toLowerCase().includes(term) ||
                    article.category.toLowerCase().includes(term) ||
                    article.author.toLowerCase().includes(term) ||
                    article.tags.some(tag => tag.toLowerCase().includes(term))
                );
            }

            this.currentPage = 1;
            this.render();
        }

        goToPage(page) {
            this.currentPage = page;
            this.render();
            
            // Smooth scroll to top of list
            $('html, body').animate({
                scrollTop: this.container.offset().top - 100
            }, 500);
        }

        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        createArticleCard(article) {
            const imageElement = article.image 
                ? `<img src="${article.image}" alt="${article.title}" loading="lazy">`
                : `<div class="image-placeholder"><i class="fas fa-image"></i></div>`;

            const tagsHtml = article.tags.map(tag => 
                `<a href="#" class="tag">${tag}</a>`
            ).join('');

            return `
                <article class="artikel-card">
                    <div class="artikel-card__image">
                        ${imageElement}
                        <span class="category-badge">${article.category}</span>
                    </div>
                    <div class="artikel-card__content">
                        <div class="meta">
                            <div class="date">
                                <i class="fas fa-calendar-alt"></i>
                                <span>${this.formatDate(article.date)}</span>
                            </div>
                            <div class="author">
                                <i class="fas fa-user"></i>
                                <span>${article.author}</span>
                            </div>
                            <div class="reading-time">
                                <i class="fas fa-clock"></i>
                                <span>${article.readingTime}</span>
                            </div>
                        </div>
                        <h3>
                            <a href="#${article.slug}">${article.title}</a>
                        </h3>
                        <p class="excerpt">${article.excerpt}</p>
                        <div class="tags">
                            ${tagsHtml}
                        </div>
                        <a href="#${article.slug}" class="read-more">
                            Baca Selengkapnya <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </article>
            `;
        }

        createSkeletonCard() {
            return `
                <div class="artikel-skeleton">
                    <div class="artikel-skeleton__image"></div>
                    <div class="artikel-skeleton__content">
                        <div class="skeleton-line short"></div>
                        <div class="skeleton-line medium"></div>
                        <div class="skeleton-line long"></div>
                        <div class="skeleton-line medium"></div>
                        <div class="skeleton-tags">
                            <div class="skeleton-tag"></div>
                            <div class="skeleton-tag"></div>
                            <div class="skeleton-tag"></div>
                        </div>
                        <div class="skeleton-line short"></div>
                    </div>
                </div>
            `;
        }

        createEmptyState() {
            return `
                <div class="artikel-empty">
                    <div class="empty-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>Tidak Ada Artikel Ditemukan</h3>
                    <p>Coba gunakan kata kunci yang berbeda atau periksa ejaan pencarian Anda.</p>
                </div>
            `;
        }

        createErrorState() {
            return `
                <div class="artikel-error">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>Terjadi Kesalahan</h3>
                    <p>Maaf, terjadi kesalahan saat memuat artikel. Silakan coba lagi.</p>
                    <button class="retry-button">Coba Lagi</button>
                </div>
            `;
        }

        createPagination() {
            const totalPages = Math.ceil(this.filteredArticles.length / this.itemsPerPage);
            
            if (totalPages <= 1) return '';

            const startItem = ((this.currentPage - 1) * this.itemsPerPage) + 1;
            const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredArticles.length);
            
            let paginationHtml = `
                <div class="artikel-pagination">
                    <a href="#" class="page-btn ${this.currentPage === 1 ? 'disabled' : ''}" data-page="${this.currentPage - 1}">
                        <i class="fas fa-chevron-left"></i>
                    </a>
            `;

            // Show page numbers
            const startPage = Math.max(1, this.currentPage - 2);
            const endPage = Math.min(totalPages, this.currentPage + 2);

            if (startPage > 1) {
                paginationHtml += `<a href="#" class="page-btn" data-page="1">1</a>`;
                if (startPage > 2) {
                    paginationHtml += `<span class="page-btn disabled">...</span>`;
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                paginationHtml += `
                    <a href="#" class="page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
                        ${i}
                    </a>
                `;
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    paginationHtml += `<span class="page-btn disabled">...</span>`;
                }
                paginationHtml += `<a href="#" class="page-btn" data-page="${totalPages}">${totalPages}</a>`;
            }

            paginationHtml += `
                    <a href="#" class="page-btn ${this.currentPage === totalPages ? 'disabled' : ''}" data-page="${this.currentPage + 1}">
                        <i class="fas fa-chevron-right"></i>
                    </a>
                    <div class="page-info">
                        Menampilkan ${startItem}-${endItem} dari ${this.filteredArticles.length} artikel
                    </div>
                </div>
            `;

            return paginationHtml;
        }

        render() {
            const grid = this.container.find('.artikel-list__grid');
            
            if (this.isLoading) {
                // Show skeleton loading
                const skeletons = Array(config.skeletonCount).fill().map(() => this.createSkeletonCard()).join('');
                grid.html(skeletons);
                return;
            }

            if (this.filteredArticles.length === 0) {
                // Show empty state
                grid.html(this.createEmptyState());
                this.container.find('.artikel-pagination').remove();
                return;
            }

            // Calculate pagination
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            const currentArticles = this.filteredArticles.slice(startIndex, endIndex);

            // Render articles
            const articlesHtml = currentArticles.map(article => this.createArticleCard(article)).join('');
            grid.html(articlesHtml);

            // Add pagination
            const existingPagination = this.container.find('.artikel-pagination');
            const paginationHtml = this.createPagination();
            
            if (existingPagination.length) {
                existingPagination.replaceWith(paginationHtml);
            } else {
                this.container.append(paginationHtml);
            }

            // Trigger image lazy loading
            this.triggerImageLoading();
        }

        triggerImageLoading() {
            // Simple lazy loading implementation
            const images = this.container.find('img[loading="lazy"]');
            images.each(function() {
                const img = $(this);
                const src = img.attr('src');
                
                // Add loading class
                img.addClass('loading');
                
                // Create a new image to preload
                const newImg = new Image();
                newImg.onload = function() {
                    img.removeClass('loading').addClass('loaded');
                };
                newImg.onerror = function() {
                    img.removeClass('loading').addClass('error');
                    img.parent().html('<div class="image-placeholder"><i class="fas fa-image"></i></div>');
                };
                newImg.src = src;
            });
        }

        // Public methods
        showLoading() {
            this.isLoading = true;
            this.render();
        }

        hideLoading() {
            this.isLoading = false;
            this.render();
        }

        updateArticles(articles) {
            this.articles = articles;
            this.filteredArticles = [...articles];
            this.currentPage = 1;
            this.render();
        }

        search(term) {
            this.container.find('.search-input').val(term);
            this.handleSearch(term);
        }
    }

    // Auto-initialize ArtikelList components
    $(document).ready(function() {
        $('.artikel-list').each(function() {
            const artikelList = new ArtikelList(this);
            
            // Store instance for external access
            $(this).data('artikelList', artikelList);
        });
    });

    // Expose ArtikelList globally
    window.ArtikelList = ArtikelList;

})(jQuery);
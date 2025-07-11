class InstagramGrid {
    constructor() {
        this.grid = document.getElementById('instagramGrid');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.loadPhotos();
        this.setupAutoRefresh();
        this.setupRefreshButton();
    }

    async loadPhotos() {
        this.showRefreshIndicator();
        
        try {
            const response = await fetch('/api/photos');
            if (!response.ok) throw new Error('Failed to fetch photos');
            
            const photos = await response.json();
            this.renderPhotos(photos);
        } catch (error) {
            console.error('Error loading photos:', error);
            this.renderError('Failed to load photos. Please check your Notion integration.');
        } finally {
            this.hideRefreshIndicator();
        }
    }

    renderPhotos(photos) {
        if (photos.length === 0) {
            this.renderEmptyState();
            return;
        }

        this.grid.innerHTML = photos.map(photo => {
            return `
                <div class="photo-item" data-id="${photo.id}">
                    <img src="${photo.image_url}" alt="Photo" loading="lazy" onerror="this.parentElement.style.display='none'">
                </div>
            `;
        }).join('');

        // Add click handlers for lightbox effect
        this.addClickHandlers();
    }

    renderEmptyState() {
        this.grid.innerHTML = `
            <div class="empty-state">
                <h3>No photos yet</h3>
                <p>Add some photos to your Notion database and check the "Posted" checkbox to see them here!</p>
            </div>
        `;
    }

    renderError(message) {
        this.grid.innerHTML = `<div class="error">${message}</div>`;
    }

    formatDate(dateString) {
        if (!dateString) return 'No date';
        
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) return 'Yesterday';
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
            
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid date';
        }
    }

    addClickHandlers() {
        const photoItems = document.querySelectorAll('.photo-item');
        photoItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                this.openLightbox(img.src, 'Photo');
            });
        });
    }

    openLightbox(imageSrc, caption) {
        // Create lightbox overlay
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${imageSrc}" alt="${caption}">
                <button class="lightbox-close">&times;</button>
            </div>
        `;

        // Add lightbox styles
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;

        const content = lightbox.querySelector('.lightbox-content');
        content.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
            text-align: center;
        `;

        const img = lightbox.querySelector('img');
        img.style.cssText = `
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
            border-radius: 8px;
        `;

        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 30px;
            cursor: pointer;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Add to document
        document.body.appendChild(lightbox);

        // Close handlers
        const closeLightbox = () => {
            lightbox.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => document.body.removeChild(lightbox), 300);
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Add fade animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    showRefreshIndicator() {
        this.refreshBtn.classList.add('loading');
        this.refreshBtn.disabled = true;
    }

    hideRefreshIndicator() {
        this.refreshBtn.classList.remove('loading');
        this.refreshBtn.disabled = false;
    }

    setupRefreshButton() {
        this.refreshBtn.addEventListener('click', () => {
            this.loadPhotos();
        });
    }

    setupAutoRefresh() {
        // Refresh every 2 minutes
        setInterval(() => {
            this.loadPhotos();
        }, 2 * 60 * 1000);

        // Also refresh when window becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.loadPhotos();
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InstagramGrid();
});

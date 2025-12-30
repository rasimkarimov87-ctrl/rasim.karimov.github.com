// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const smokeEffects = document.querySelectorAll('.smoke-effect');
    const shapes = document.querySelectorAll('.geometric-shapes .shape');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    smokeEffects.forEach((smoke, index) => {
        const speed = (index + 1) * 0.3;
        smoke.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.2;
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Mouse move parallax effect
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const shapes = document.querySelectorAll('.geometric-shapes .shape');
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 20;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        shape.style.transform += ` translate(${x}px, ${y}px)`;
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.section-heading, .section-text, .column, .number-item, .project-item, .testimonial-text'
    );
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

// Play icon click effect
document.querySelectorAll('.play-icon').forEach(icon => {
    icon.addEventListener('click', function() {
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1.1)';
        }, 100);
    });
});

// Button ripple effect
const btnReadMore = document.querySelector('.btn-read-more');
if (btnReadMore) {
    btnReadMore.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @media (max-width: 768px) {
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(10, 10, 10, 0.95);
            padding: 20px;
            gap: 20px;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(8px, 8px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -7px);
        }
    }
`;
document.head.appendChild(style);

// ========== MUSIC PLAYER FUNCTIONALITY ==========

class MusicPlayer {
    constructor() {
        this.playlist = [];
        this.currentTrackIndex = -1;
        this.isPlaying = false;
        this.isShuffled = false;
        this.isRepeated = false;
        this.audio = document.getElementById('audioPlayer');
        this.initializeElements();
        this.attachEventListeners();
        this.loadPlaylistFromStorage();
    }

    initializeElements() {
        this.fileInput = document.getElementById('fileInput');
        this.uploadBox = document.getElementById('uploadBox');
        this.playerContainer = document.getElementById('playerContainer');
        this.playlistContainer = document.getElementById('playlist');
        this.playlistCount = document.getElementById('playlistCount');
        this.trackTitle = document.getElementById('trackTitle');
        this.trackArtist = document.getElementById('trackArtist');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressSlider = document.getElementById('progressSlider');
        this.progress = document.getElementById('progress');
        this.timeCurrent = document.getElementById('timeCurrent');
        this.timeTotal = document.getElementById('timeTotal');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeValue = document.getElementById('volumeValue');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        this.clearBtn = document.getElementById('clearBtn');
    }

    attachEventListeners() {
        // File upload
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.uploadBox.addEventListener('click', () => this.fileInput.click());
        this.uploadBox.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadBox.addEventListener('drop', (e) => this.handleDrop(e));
        this.uploadBox.addEventListener('dragleave', () => this.uploadBox.classList.remove('drag-over'));

        // Player controls
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.progressSlider.addEventListener('input', (e) => this.seek(e.target.value));
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        this.clearBtn.addEventListener('click', () => this.clearPlaylist());

        // Audio events
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.onTrackEnd());
        this.audio.addEventListener('error', (e) => this.handleAudioError(e));
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.addFilesToPlaylist(files);
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadBox.classList.add('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadBox.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('audio/'));
        this.addFilesToPlaylist(files);
    }

    addFilesToPlaylist(files) {
        files.forEach(file => {
            if (file.type.startsWith('audio/')) {
                const track = {
                    id: Date.now() + Math.random(),
                    name: file.name.replace(/\.[^/.]+$/, ''),
                    file: file,
                    url: URL.createObjectURL(file),
                    format: file.name.split('.').pop().toUpperCase()
                };
                this.playlist.push(track);
                this.addTrackToPlaylistUI(track);
            }
        });
        this.updatePlaylistCount();
        this.savePlaylistToStorage();
        
        // Auto-play first track if nothing is playing
        if (this.currentTrackIndex === -1 && this.playlist.length > 0) {
            this.playTrack(0);
        }
    }

    addTrackToPlaylistUI(track) {
        const playlistEmpty = this.playlistContainer.querySelector('.playlist-empty');
        if (playlistEmpty) {
            playlistEmpty.remove();
        }

        const trackElement = document.createElement('div');
        trackElement.className = 'playlist-item';
        trackElement.dataset.trackId = track.id;
        
        trackElement.innerHTML = `
            <div class="playlist-item-info">
                <div class="playlist-item-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                </div>
                <div class="playlist-item-details">
                    <div class="playlist-item-title">${this.escapeHtml(track.name)}</div>
                    <div class="playlist-item-format">${track.format}</div>
                </div>
            </div>
            <button class="playlist-item-remove" data-track-id="${track.id}">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        `;

        trackElement.addEventListener('click', (e) => {
            if (!e.target.closest('.playlist-item-remove')) {
                const index = this.playlist.findIndex(t => t.id === track.id);
                this.playTrack(index);
            }
        });

        const removeBtn = trackElement.querySelector('.playlist-item-remove');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeTrack(track.id);
        });

        this.playlistContainer.appendChild(trackElement);
    }

    removeTrack(trackId) {
        const index = this.playlist.findIndex(t => t.id === trackId);
        if (index === -1) return;

        // If removing current track, stop and play next
        if (index === this.currentTrackIndex) {
            this.audio.pause();
            this.isPlaying = false;
            this.updatePlayPauseButton();
        }

        // Revoke object URL to free memory
        URL.revokeObjectURL(this.playlist[index].url);
        this.playlist.splice(index, 1);

        // Update current track index
        if (index < this.currentTrackIndex) {
            this.currentTrackIndex--;
        } else if (index === this.currentTrackIndex && this.playlist.length > 0) {
            this.currentTrackIndex = Math.min(this.currentTrackIndex, this.playlist.length - 1);
            if (this.isPlaying) {
                this.playTrack(this.currentTrackIndex);
            }
        }

        // Remove from UI
        const trackElement = this.playlistContainer.querySelector(`[data-track-id="${trackId}"]`);
        if (trackElement) {
            trackElement.remove();
        }

        if (this.playlist.length === 0) {
            this.playlistContainer.innerHTML = '<p class="playlist-empty">Плейлист пуст. Загрузите музыку, чтобы начать.</p>';
            this.playerContainer.style.display = 'none';
            this.currentTrackIndex = -1;
        }

        this.updatePlaylistCount();
        this.updatePlaylistUI();
        this.savePlaylistToStorage();
    }

    playTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;

        this.currentTrackIndex = index;
        const track = this.playlist[index];

        // Update UI
        this.trackTitle.textContent = track.name;
        this.trackArtist.textContent = track.format;
        this.playerContainer.style.display = 'block';

        // Load and play
        this.audio.src = track.url;
        this.audio.load();
        this.audio.play();
        this.isPlaying = true;
        this.updatePlayPauseButton();
        this.updatePlaylistUI();
    }

    togglePlayPause() {
        if (this.currentTrackIndex === -1 && this.playlist.length > 0) {
            this.playTrack(0);
            return;
        }

        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
        this.isPlaying = !this.isPlaying;
        this.updatePlayPauseButton();
    }

    playPrevious() {
        if (this.playlist.length === 0) return;
        
        if (this.isShuffled) {
            this.currentTrackIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        }
        this.playTrack(this.currentTrackIndex);
    }

    playNext() {
        if (this.playlist.length === 0) return;

        if (this.isShuffled) {
            this.currentTrackIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        }
        this.playTrack(this.currentTrackIndex);
    }

    onTrackEnd() {
        if (this.isRepeated) {
            this.audio.currentTime = 0;
            this.audio.play();
        } else {
            this.playNext();
        }
    }

    seek(value) {
        const time = (value / 100) * this.audio.duration;
        this.audio.currentTime = time;
    }

    setVolume(value) {
        this.audio.volume = value / 100;
        this.volumeValue.textContent = `${value}%`;
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        this.shuffleBtn.classList.toggle('active', this.isShuffled);
    }

    toggleRepeat() {
        this.isRepeated = !this.isRepeated;
        this.repeatBtn.classList.toggle('active', this.isRepeated);
    }

    clearPlaylist() {
        if (confirm('Вы уверены, что хотите очистить весь плейлист?')) {
            // Revoke all object URLs
            this.playlist.forEach(track => URL.revokeObjectURL(track.url));
            
            this.playlist = [];
            this.currentTrackIndex = -1;
            this.audio.pause();
            this.audio.src = '';
            this.isPlaying = false;
            this.updatePlayPauseButton();
            
            this.playlistContainer.innerHTML = '<p class="playlist-empty">Плейлист пуст. Загрузите музыку, чтобы начать.</p>';
            this.playerContainer.style.display = 'none';
            this.updatePlaylistCount();
            this.savePlaylistToStorage();
        }
    }

    updateProgress() {
        if (this.audio.duration) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressSlider.value = percent;
            this.progress.style.width = `${percent}%`;
            this.timeCurrent.textContent = this.formatTime(this.audio.currentTime);
        }
    }

    updateDuration() {
        this.timeTotal.textContent = this.formatTime(this.audio.duration);
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    updatePlayPauseButton() {
        const playIcon = this.playPauseBtn.querySelector('.play-icon-svg');
        const pauseIcon = this.playPauseBtn.querySelector('.pause-icon-svg');
        
        if (this.isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }

    updatePlaylistUI() {
        const items = this.playlistContainer.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentTrackIndex);
        });
    }

    updatePlaylistCount() {
        this.playlistCount.textContent = this.playlist.length;
    }

    handleAudioError(e) {
        console.error('Audio error:', e);
        alert('Ошибка воспроизведения файла. Возможно, формат не поддерживается.');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    savePlaylistToStorage() {
        // Save only track names and formats (not file objects)
        const playlistData = this.playlist.map(track => ({
            id: track.id,
            name: track.name,
            format: track.format
        }));
        localStorage.setItem('musicPlaylist', JSON.stringify(playlistData));
    }

    loadPlaylistFromStorage() {
        // Note: We can't restore File objects from localStorage
        // This is just for reference - users need to re-upload files
        const saved = localStorage.getItem('musicPlaylist');
        if (saved) {
            try {
                const playlistData = JSON.parse(saved);
                // Clear saved playlist since we can't restore files
                localStorage.removeItem('musicPlaylist');
            } catch (e) {
                console.error('Error loading playlist:', e);
            }
        }
    }
}

// Initialize music player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer();
    initArtistsSection();
});

// ========== ARTISTS SECTION FUNCTIONALITY ==========
function initArtistsSection() {
    const artistCards = document.querySelectorAll('.artist-card');
    
    artistCards.forEach(card => {
        card.addEventListener('click', function() {
            const artistName = this.querySelector('.artist-name').textContent;
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'artist-ripple';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Scroll to music player section
            const musicSection = document.getElementById('music');
            if (musicSection) {
                musicSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Optional: Show notification
            showArtistNotification(artistName);
        });
    });
}

function showArtistNotification(artistName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'artist-notification';
    notification.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
        <span>Загрузите музыку ${artistName} в плеер</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add styles for artist interactions
const artistStyles = document.createElement('style');
artistStyles.textContent = `
    .artist-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(139, 92, 246, 0.6);
        transform: scale(0);
        animation: artist-ripple-animation 0.6s ease-out;
        pointer-events: none;
        width: 100px;
        height: 100px;
        top: 50%;
        left: 50%;
        margin-top: -50px;
        margin-left: -50px;
        z-index: 10;
    }
    
    @keyframes artist-ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .artist-notification {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, var(--purple), var(--pink));
        color: var(--text-light);
        padding: 20px 30px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        gap: 15px;
        box-shadow: 0 10px 40px rgba(139, 92, 246, 0.4);
        z-index: 10000;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        max-width: 350px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .artist-notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .artist-notification svg {
        width: 30px;
        height: 30px;
        flex-shrink: 0;
    }
    
    .artist-notification span {
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.5px;
    }
    
    @media (max-width: 768px) {
        .artist-notification {
            bottom: 20px;
            right: 20px;
            left: 20px;
            max-width: none;
            transform: translateY(100px);
        }
        
        .artist-notification.show {
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(artistStyles);
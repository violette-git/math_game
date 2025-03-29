/**
 * Math Adventure: Number Quest
 * Audio management system for game sounds, music, and narration
 */

const AudioController = {
    // Audio elements
    backgroundMusic: null,
    effectsAudio: null,
    narrationAudio: null,
    
    // Audio states
    isMusicMuted: false,
    isEffectsMuted: false,
    isNarrationMuted: false,
    
    // Audio files
    audioFiles: {
        music: {
            'home': 'home-theme.mp3',
            'world-map': 'world-map-theme.mp3',
            'counting-cove': 'counting-cove-theme.mp3',
            'number-neighborhood': 'number-neighborhood-theme.mp3',
            'addition-avenue': 'addition-avenue-theme.mp3',
            'subtraction-street': 'subtraction-street-theme.mp3',
            'math-mountain': 'math-mountain-theme.mp3',
            'reward': 'reward-theme.mp3'
        },
        effects: {
            'button-click': 'button-click.mp3',
            'correct': 'correct.mp3',
            'incorrect': 'incorrect.mp3',
            'level-complete': 'level-complete.mp3',
            'star-earned': 'star-earned.mp3',
            'character-select': 'character-select.mp3',
            'world-unlock': 'world-unlock.mp3',
            'drag-start': 'drag-start.mp3',
            'drag-end': 'drag-end.mp3',
            'pop': 'pop.mp3',
            'whoosh': 'whoosh.mp3'
        },
        narration: {
            'welcome': 'welcome.mp3',
            'great-job': 'great-job.mp3',
            'try-again': 'try-again.mp3',
            'counting-cove-intro': 'counting-cove-intro.mp3',
            'number-neighborhood-intro': 'number-neighborhood-intro.mp3',
            'addition-avenue-intro': 'addition-avenue-intro.mp3',
            'subtraction-street-intro': 'subtraction-street-intro.mp3',
            'math-mountain-intro': 'math-mountain-intro.mp3',
            'count-objects': 'count-objects.mp3',
            'select-number': 'select-number.mp3',
            'addition-help': 'addition-help.mp3',
            'subtraction-help': 'subtraction-help.mp3'
        }
    },
    
    // Preloaded audio cache
    audioCache: {
        music: {},
        effects: {},
        narration: {}
    },
    
    /**
     * Initialize the audio controller
     */
    init: function() {
        console.log('Initializing Audio Controller');
        
        // Get audio elements
        this.backgroundMusic = document.getElementById('background-music');
        this.effectsAudio = document.getElementById('effect-audio');
        this.narrationAudio = document.getElementById('narration-audio');
        
        // Set initial volumes from game state
        this.setMusicVolume(GameState.settings.musicVolume);
        this.setEffectsVolume(GameState.settings.effectsVolume);
        this.setNarrationVolume(GameState.settings.narrationVolume);
        
        // Preload commonly used audio files
        this.preloadAudio();
        
        // Set up event listeners for audio completion
        this.setupEventListeners();
    },
    
    /**
     * Preload commonly used audio files
     */
    preloadAudio: function() {
        // Preload common effect sounds
        this.preloadEffect('button-click');
        this.preloadEffect('correct');
        this.preloadEffect('incorrect');
        
        // Preload home music
        this.preloadMusic('home');
        
        // Preload common narrations
        this.preloadNarration('welcome');
        this.preloadNarration('great-job');
        this.preloadNarration('try-again');
    },
    
    /**
     * Set up event listeners for audio elements
     */
    setupEventListeners: function() {
        // Background music loop handling
        this.backgroundMusic.addEventListener('ended', () => {
            if (this.backgroundMusic.getAttribute('data-loop') === 'true') {
                this.backgroundMusic.currentTime = 0;
                this.backgroundMusic.play().catch(error => {
                    console.log('Music playback prevented:', error);
                });
            }
        });
        
        // Handle visibility change for pausing/resuming audio
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden, pause audio
                this.pauseMusic();
            } else {
                // Page is visible again, resume music if it was playing
                if (this.backgroundMusic.getAttribute('data-playing') === 'true') {
                    this.resumeMusic();
                }
            }
        });
    },
    
    /**
     * Preload a music file into cache
     * @param {string} key - The key of the music file to preload
     */
    preloadMusic: function(key) {
        const filename = this.audioFiles.music[key];
        if (!filename) return;
        
        const audio = new Audio();
        audio.src = `assets/audio/music/${filename}`;
        audio.preload = 'auto';
        this.audioCache.music[key] = audio;
        
        console.log(`Preloaded music: ${key}`);
    },
    
    /**
     * Preload an effect sound into cache
     * @param {string} key - The key of the effect sound to preload
     */
    preloadEffect: function(key) {
        const filename = this.audioFiles.effects[key];
        if (!filename) return;
        
        const audio = new Audio();
        audio.src = `assets/audio/effects/${filename}`;
        audio.preload = 'auto';
        this.audioCache.effects[key] = audio;
        
        console.log(`Preloaded effect: ${key}`);
    },
    
    /**
     * Preload a narration into cache
     * @param {string} key - The key of the narration to preload
     */
    preloadNarration: function(key) {
        const filename = this.audioFiles.narration[key];
        if (!filename) return;
        
        const audio = new Audio();
        audio.src = `assets/audio/narration/${filename}`;
        audio.preload = 'auto';
        this.audioCache.narration[key] = audio;
        
        console.log(`Preloaded narration: ${key}`);
    },
    
    /**
     * Play background music
     * @param {string} key - The key of the music to play
     * @param {boolean} loop - Whether to loop the music (default: true)
     */
    playMusic: function(key, loop = true) {
        if (this.isMusicMuted) return;
        
        const filename = this.audioFiles.music[key];
        if (!filename) return;
        
        // Stop current music
        this.stopMusic();
        
        // Set new music source
        this.backgroundMusic.src = `assets/audio/music/${filename}`;
        this.backgroundMusic.loop = loop;
        this.backgroundMusic.setAttribute('data-loop', loop.toString());
        this.backgroundMusic.setAttribute('data-key', key);
        
        // Play music (handle autoplay restrictions)
        const playPromise = this.backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.backgroundMusic.setAttribute('data-playing', 'true');
                console.log(`Playing music: ${key}`);
            }).catch(error => {
                console.log('Music playback prevented:', error);
                this.backgroundMusic.setAttribute('data-playing', 'false');
            });
        }
    },
    
    /**
     * Play a sound effect
     * @param {string} key - The key of the effect to play
     */
    playEffect: function(key) {
        if (this.isEffectsMuted) return;
        
        const filename = this.audioFiles.effects[key];
        if (!filename) return;
        
        // Check if we have a cached version
        if (this.audioCache.effects[key]) {
            // Clone the audio to allow multiple simultaneous playback
            const effectSound = this.audioCache.effects[key].cloneNode();
            effectSound.volume = this.effectsAudio.volume;
            effectSound.play().catch(error => {
                console.log('Effect playback prevented:', error);
            });
        } else {
            // Play using the effects audio element
            this.effectsAudio.src = `assets/audio/effects/${filename}`;
            this.effectsAudio.play().catch(error => {
                console.log('Effect playback prevented:', error);
            });
        }
        
        console.log(`Playing effect: ${key}`);
    },
    
    /**
     * Play a narration
     * @param {string} key - The key of the narration to play
     * @param {Function} callback - Optional callback to execute when narration ends
     */
    playNarration: function(key, callback = null) {
        if (this.isNarrationMuted) {
            if (callback) callback();
            return;
        }
        
        const filename = this.audioFiles.narration[key];
        if (!filename) {
            if (callback) callback();
            return;
        }
        
        // Stop any current narration
        this.stopNarration();
        
        // Set up callback if provided
        if (callback) {
            const onEndedHandler = () => {
                callback();
                this.narrationAudio.removeEventListener('ended', onEndedHandler);
            };
            this.narrationAudio.addEventListener('ended', onEndedHandler);
        }
        
        // Check if we have a cached version
        if (this.audioCache.narration[key]) {
            this.narrationAudio.src = this.audioCache.narration[key].src;
        } else {
            this.narrationAudio.src = `assets/audio/narration/${filename}`;
        }
        
        this.narrationAudio.play().catch(error => {
            console.log('Narration playback prevented:', error);
            if (callback) callback();
        });
        
        console.log(`Playing narration: ${key}`);
    },
    
    /**
     * Stop background music
     */
    stopMusic: function() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic.setAttribute('data-playing', 'false');
        }
    },
    
    /**
     * Pause background music
     */
    pauseMusic: function() {
        if (this.backgroundMusic && !this.backgroundMusic.paused) {
            this.backgroundMusic.pause();
        }
    },
    
    /**
     * Resume background music
     */
    resumeMusic: function() {
        if (this.backgroundMusic && this.backgroundMusic.paused && !this.isMusicMuted) {
            this.backgroundMusic.play().catch(error => {
                console.log('Music resume prevented:', error);
            });
        }
    },
    
    /**
     * Stop sound effect
     */
    stopEffect: function() {
        if (this.effectsAudio) {
            this.effectsAudio.pause();
            this.effectsAudio.currentTime = 0;
        }
    },
    
    /**
     * Stop narration
     */
    stopNarration: function() {
        if (this.narrationAudio) {
            this.narrationAudio.pause();
            this.narrationAudio.currentTime = 0;
        }
    },
    
    /**
     * Stop all audio
     */
    stopAll: function() {
        this.stopMusic();
        this.stopEffect();
        this.stopNarration();
    },
    
    /**
     * Set music volume
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    setMusicVolume: function(volume) {
        if (!this.backgroundMusic) return;
        
        GameState.settings.musicVolume = volume;
        this.backgroundMusic.volume = volume;
        
        // Update mute state
        this.isMusicMuted = (volume <= 0);
        
        console.log(`Music volume set to: ${volume}`);
    },
    
    /**
     * Set effects volume
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    setEffectsVolume: function(volume) {
        if (!this.effectsAudio) return;
        
        GameState.settings.effectsVolume = volume;
        this.effectsAudio.volume = volume;
        
        // Update mute state
        this.isEffectsMuted = (volume <= 0);
        
        console.log(`Effects volume set to: ${volume}`);
    },
    
    /**
     * Set narration volume
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    setNarrationVolume: function(volume) {
        if (!this.narrationAudio) return;
        
        GameState.settings.narrationVolume = volume;
        this.narrationAudio.volume = volume;
        
        // Update mute state
        this.isNarrationMuted = (volume <= 0);
        
        console.log(`Narration volume set to: ${volume}`);
    },
    
    /**
     * Toggle music mute state
     * @returns {boolean} New mute state
     */
    toggleMusicMute: function() {
        this.isMusicMuted = !this.isMusicMuted;
        
        if (this.isMusicMuted) {
            this.pauseMusic();
        } else {
            this.resumeMusic();
        }
        
        console.log(`Music muted: ${this.isMusicMuted}`);
        return this.isMusicMuted;
    },
    
    /**
     * Toggle effects mute state
     * @returns {boolean} New mute state
     */
    toggleEffectsMute: function() {
        this.isEffectsMuted = !this.isEffectsMuted;
        console.log(`Effects muted: ${this.isEffectsMuted}`);
        return this.isEffectsMuted;
    },
    
    /**
     * Toggle narration mute state
     * @returns {boolean} New mute state
     */
    toggleNarrationMute: function() {
        this.isNarrationMuted = !this.isNarrationMuted;
        
        if (this.isNarrationMuted) {
            this.stopNarration();
        }
        
        console.log(`Narration muted: ${this.isNarrationMuted}`);
        return this.isNarrationMuted;
    }
};
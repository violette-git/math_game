/**
 * Math Adventure: Number Quest
 * Animation functions for enhanced visual feedback and transitions
 */

const AnimationController = {
    /**
     * Initialize the animation controller
     */
    init: function() {
        console.log('Initializing Animation Controller');
    },
    
    /**
     * Animate screen transitions
     * @param {string} fromScreenId - ID of the screen to transition from
     * @param {string} toScreenId - ID of the screen to transition to
     * @param {string} direction - Direction of transition ('left', 'right', 'up', 'down', 'fade')
     * @param {Function} callback - Callback function to execute after transition
     */
    transitionScreens: function(fromScreenId, toScreenId, direction = 'fade', callback = null) {
        const fromScreen = document.getElementById(fromScreenId);
        const toScreen = document.getElementById(toScreenId);
        
        if (!fromScreen || !toScreen) {
            console.error('Screen not found for transition');
            return;
        }
        
        // Remove any existing transition classes
        fromScreen.classList.remove('transition-in', 'transition-out', 'slide-in-left', 'slide-out-left', 'slide-in-right', 'slide-out-right');
        toScreen.classList.remove('transition-in', 'transition-out', 'slide-in-left', 'slide-out-left', 'slide-in-right', 'slide-out-right');
        
        // Make sure the target screen is in the DOM but hidden
        toScreen.classList.remove('hidden');
        
        // Apply appropriate transition classes based on direction
        switch (direction) {
            case 'left':
                fromScreen.classList.add('slide-out-left');
                toScreen.classList.add('slide-in-right');
                break;
            case 'right':
                fromScreen.classList.add('slide-out-right');
                toScreen.classList.add('slide-in-left');
                break;
            case 'up':
                fromScreen.classList.add('slide-out-up');
                toScreen.classList.add('slide-in-down');
                break;
            case 'down':
                fromScreen.classList.add('slide-out-down');
                toScreen.classList.add('slide-in-up');
                break;
            case 'fade':
            default:
                fromScreen.classList.add('fade-out');
                toScreen.classList.add('fade-in');
                break;
        }
        
        // Play transition sound
        AudioController.playEffect('whoosh');
        
        // After animation completes, hide the from screen
        setTimeout(() => {
            fromScreen.classList.add('hidden');
            
            // Execute callback if provided
            if (callback && typeof callback === 'function') {
                callback();
            }
        }, 500); // Match this with the CSS animation duration
    },
    
    /**
     * Show correct answer animation
     * @param {HTMLElement} element - Element to animate
     */
    showCorrectAnimation: function(element) {
        // Create a container for the animation effects
        const effectsContainer = document.createElement('div');
        effectsContainer.className = 'animation-effects-container';
        element.appendChild(effectsContainer);
        
        // Add green flash effect
        element.classList.add('feedback', 'correct');
        
        // Add celebration stars
        this.createCelebrationStars(effectsContainer, 5);
        
        // Play correct sound
        AudioController.playEffect('correct');
        
        // Remove animation classes after animation completes
        setTimeout(() => {
            element.classList.remove('feedback', 'correct');
            effectsContainer.remove();
        }, 1500);
    },
    
    /**
     * Show incorrect answer animation
     * @param {HTMLElement} element - Element to animate
     */
    showIncorrectAnimation: function(element) {
        // Add red flash and shake effect
        element.classList.add('feedback', 'incorrect');
        
        // Play incorrect sound
        AudioController.playEffect('incorrect');
        
        // Remove animation classes after animation completes
        setTimeout(() => {
            element.classList.remove('feedback', 'incorrect');
        }, 1000);
    },
    
    /**
     * Create celebration stars animation
     * @param {HTMLElement} container - Container element for stars
     * @param {number} count - Number of stars to create
     */
    createCelebrationStars: function(container, count) {
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'celebration-star';
            
            // Random position within container
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            
            // Random delay for staggered animation
            const delay = Math.random() * 0.5;
            
            star.style.left = `${left}%`;
            star.style.top = `${top}%`;
            star.style.animationDelay = `${delay}s`;
            
            container.appendChild(star);
            
            // Remove star after animation completes
            setTimeout(() => {
                star.remove();
            }, 1500 + (delay * 1000));
        }
    },
    
    /**
     * Create confetti animation for celebrations
     * @param {HTMLElement} container - Container element for confetti
     */
    createConfetti: function(container) {
        const colors = ['#ff4e50', '#fc913a', '#f9d62e', '#eae374', '#e2f4c7', '#9fe8fa', '#4481e3'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'celebration-confetti';
            
            // Random position, color, and size
            const left = Math.random() * 100;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 10 + 5;
            const delay = Math.random() * 2;
            const duration = Math.random() * 2 + 2;
            
            confetti.style.left = `${left}%`;
            confetti.style.top = '-5%';
            confetti.style.backgroundColor = color;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.animationDelay = `${delay}s`;
            confetti.style.animationDuration = `${duration}s`;
            
            container.appendChild(confetti);
            
            // Remove confetti after animation completes
            setTimeout(() => {
                confetti.remove();
            }, (delay + duration) * 1000);
        }
    },
    
    /**
     * Animate a number counting up
     * @param {HTMLElement} element - Element to display the counting number
     * @param {number} start - Starting number
     * @param {number} end - Ending number
     * @param {number} duration - Duration of animation in milliseconds
     * @param {Function} callback - Callback function to execute after animation
     */
    animateNumber: function(element, start, end, duration = 1000, callback = null) {
        const range = end - start;
        const minStep = 1;
        const stepTime = Math.abs(Math.floor(duration / range));
        
        let current = start;
        const step = Math.sign(range) * Math.max(minStep, Math.abs(Math.floor(range / 20)));
        
        const timer = setInterval(() => {
            current += step;
            
            if ((step > 0 && current >= end) || (step < 0 && current <= end)) {
                element.textContent = end;
                clearInterval(timer);
                
                if (callback && typeof callback === 'function') {
                    callback();
                }
            } else {
                element.textContent = current;
            }
        }, stepTime);
    },
    
    /**
     * Animate a progress bar filling
     * @param {HTMLElement} progressBar - Progress bar element
     * @param {number} percent - Percentage to fill (0-100)
     * @param {number} duration - Duration of animation in milliseconds
     */
    animateProgressBar: function(progressBar, percent, duration = 1000) {
        // Ensure the progress bar has the right structure
        if (!progressBar.querySelector('.progress-fill')) {
            const fill = document.createElement('div');
            fill.className = 'progress-fill';
            progressBar.appendChild(fill);
        }
        
        const fill = progressBar.querySelector('.progress-fill');
        
        // Reset to 0% first
        fill.style.width = '0%';
        
        // Trigger reflow to ensure animation works
        void fill.offsetWidth;
        
        // Set animation duration
        fill.style.transitionDuration = `${duration}ms`;
        
        // Start animation
        fill.style.width = `${percent}%`;
    },
    
    /**
     * Animate character helper
     * @param {string} animation - Animation type ('wave', 'jump', 'dance')
     * @param {HTMLElement} characterElement - Character element to animate
     */
    animateCharacter: function(animation, characterElement) {
        if (!characterElement) return;
        
        // Remove any existing animation classes
        characterElement.classList.remove('waving', 'jumping', 'dancing');
        
        // Add requested animation class
        switch (animation) {
            case 'wave':
                characterElement.classList.add('waving');
                break;
            case 'jump':
                characterElement.classList.add('jumping');
                break;
            case 'dance':
                characterElement.classList.add('dancing');
                break;
        }
        
        // Remove animation class after it completes
        setTimeout(() => {
            characterElement.classList.remove('waving', 'jumping', 'dancing');
        }, 2000);
    },
    
    /**
     * Show a hint bubble with animation
     * @param {HTMLElement} targetElement - Element to attach the hint to
     * @param {string} message - Hint message to display
     * @param {number} duration - Duration to show the hint in milliseconds
     */
    showHintBubble: function(targetElement, message, duration = 3000) {
        // Create hint bubble
        const bubble = document.createElement('div');
        bubble.className = 'hint-bubble';
        bubble.textContent = message;
        
        // Position bubble near target element
        const targetRect = targetElement.getBoundingClientRect();
        document.body.appendChild(bubble);
        
        const bubbleRect = bubble.getBoundingClientRect();
        
        // Position above the target by default
        let top = targetRect.top - bubbleRect.height - 10;
        let left = targetRect.left + (targetRect.width / 2) - (bubbleRect.width / 2);
        
        // If there's not enough space above, position below
        if (top < 10) {
            top = targetRect.bottom + 10;
        }
        
        // Ensure bubble stays within viewport horizontally
        left = Math.max(10, Math.min(left, window.innerWidth - bubbleRect.width - 10));
        
        bubble.style.top = `${top}px`;
        bubble.style.left = `${left}px`;
        
        // Add animation
        bubble.classList.add('pop');
        
        // Remove after duration
        setTimeout(() => {
            bubble.classList.add('fade-out');
            setTimeout(() => {
                bubble.remove();
            }, 500);
        }, duration);
    },
    
    /**
     * Animate button click
     * @param {HTMLElement} button - Button element
     */
    animateButtonClick: function(button) {
        // Add and remove animation class
        button.classList.add('pop');
        
        setTimeout(() => {
            button.classList.remove('pop');
        }, 300);
        
        // Play button click sound
        AudioController.playEffect('button-click');
    },
    
    /**
     * Animate reward stars
     * @param {HTMLElement} container - Container for stars
     * @param {number} count - Number of stars earned (1-3)
     * @param {Function} callback - Callback function to execute after animation
     */
    animateRewardStars: function(container, count, callback = null) {
        // Clear container
        container.innerHTML = '';
        
        // Create stars
        for (let i = 0; i < 3; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Determine if this star is earned
            if (i < count) {
                star.classList.add('earned');
                
                // Add delay for staggered animation
                star.style.animationDelay = `${i * 0.5}s`;
                
                // Play star sound with delay
                setTimeout(() => {
                    AudioController.playEffect('star-earned');
                }, i * 500);
            } else {
                star.classList.add('not-earned');
            }
            
            container.appendChild(star);
        }
        
        // Execute callback after all stars have animated
        if (callback && typeof callback === 'function') {
            setTimeout(callback, count * 500 + 1000);
        }
    },
    
    /**
     * Animate level completion celebration
     * @param {HTMLElement} container - Container for celebration effects
     */
    animateLevelComplete: function(container) {
        // Play level complete sound
        AudioController.playEffect('level-complete');
        
        // Create celebration effects
        this.createConfetti(container);
        
        // Animate container
        container.classList.add('pulse');
        
        // Remove animation class after it completes
        setTimeout(() => {
            container.classList.remove('pulse');
        }, 2000);
    },
    
    /**
     * Animate drag and drop interaction
     * @param {HTMLElement} element - Element being dragged
     * @param {boolean} isStart - Whether this is the start or end of drag
     */
    animateDragInteraction: function(element, isStart) {
        if (isStart) {
            // Start drag animation
            element.classList.add('dragging');
            AudioController.playEffect('drag-start');
        } else {
            // End drag animation
            element.classList.remove('dragging');
            element.classList.add('pop');
            AudioController.playEffect('drag-end');
            
            // Remove pop animation class after it completes
            setTimeout(() => {
                element.classList.remove('pop');
            }, 300);
        }
    }
};
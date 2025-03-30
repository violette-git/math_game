/**
 * Math Adventure: Number Quest
 * Main JavaScript file for game initialization and core functionality
 */

// Immediately Invoked Function Expression (IIFE) to avoid global scope pollution
(function() {
  'use strict';

  // ===== Game Configuration =====
  const CONFIG = {
    // Game settings
    DEBUG_MODE: false,
    ANIMATION_SPEED: 300, // ms
    
    // Audio settings
    MUSIC_VOLUME: 0.7,
    EFFECTS_VOLUME: 1.0,
    NARRATION_VOLUME: 1.0,
    
    // Difficulty settings
    DEFAULT_DIFFICULTY: 'adaptive', // 'easy', 'medium', 'hard', 'adaptive'
    
    // Age ranges
    AGE_RANGES: {
      '2-3': { minAge: 2, maxAge: 3, worldId: 'counting-cove' },
      '3-4': { minAge: 3, maxAge: 4, worldId: 'number-neighborhood' },
      '4-5': { minAge: 4, maxAge: 5, worldId: 'addition-avenue' },
      '5-6': { minAge: 5, maxAge: 6, worldId: 'subtraction-street' },
      '6-7': { minAge: 6, maxAge: 7, worldId: 'math-mountain' }
    }
  };

  // ===== Game State =====
  const GameState = {
    // Player information
    player: {
      name: '',
      character: '',
      age: null,
      stars: 0
    },
    
    // Game progress
    progress: {
      currentWorld: '',
      currentLevel: 0,
      currentActivity: 0,
      unlockedWorlds: ['counting-cove'], // Start with first world unlocked
      completedLevels: {},
      earnedStars: {}
    },
    
    // Current game session state
    session: {
      currentScreen: 'loading-screen',
      isParentMode: false,
      selectedWorld: null,
      selectedLevel: null,
      activityData: null,
      activityProgress: 0,
      activityResults: [],
      currentActivityIndex: 0,
      currentLevelActivities: []
    },
    
    // Settings
    settings: {
      musicVolume: CONFIG.MUSIC_VOLUME,
      effectsVolume: CONFIG.EFFECTS_VOLUME,
      narrationVolume: CONFIG.NARRATION_VOLUME,
      difficulty: CONFIG.DEFAULT_DIFFICULTY,
      highContrast: false,
      textSize: 'medium' // 'small', 'medium', 'large'
    },
    
    // Save game state to localStorage
    save: function() {
      try {
        const saveData = {
          player: this.player,
          progress: this.progress,
          settings: this.settings,
          lastPlayed: new Date().toISOString()
        };
        
        localStorage.setItem('mathAdventureSave', JSON.stringify(saveData));
        console.log('Game saved successfully');
        return true;
      } catch (error) {
        console.error('Failed to save game:', error);
        return false;
      }
    },
    
    // Load game state from localStorage
    load: function() {
      try {
        const saveData = localStorage.getItem('mathAdventureSave');
        
        if (!saveData) {
          console.log('No saved game found');
          return false;
        }
        
        const parsedData = JSON.parse(saveData);
        
        // Update state with saved data
        this.player = { ...this.player, ...parsedData.player };
        this.progress = { ...this.progress, ...parsedData.progress };
        this.settings = { ...this.settings, ...parsedData.settings };
        
        console.log('Game loaded successfully');
        return true;
      } catch (error) {
        console.error('Failed to load game:', error);
        return false;
      }
    },
    
    // Reset game state (for testing or new game)
    reset: function() {
      // Reset player info
      this.player = {
        name: '',
        character: '',
        age: null,
        stars: 0
      };
      
      // Reset progress
      this.progress = {
        currentWorld: '',
        currentLevel: 0,
        currentActivity: 0,
        unlockedWorlds: ['counting-cove'],
        completedLevels: {},
        earnedStars: {}
      };
      
      // Reset session
      this.session = {
        currentScreen: 'loading-screen',
        isParentMode: false,
        selectedWorld: null,
        selectedLevel: null,
        activityData: null,
        activityProgress: 0,
        activityResults: [],
        currentActivityIndex: 0,
        currentLevelActivities: []
      };
      
      // Keep settings as they are
      
      console.log('Game state reset');
      localStorage.removeItem('mathAdventureSave');
    },
    
    // Check if a level is unlocked
    isLevelUnlocked: function(worldId, levelNum) {
      // First level of each world is always unlocked if the world is unlocked
      if (levelNum === 1 && this.progress.unlockedWorlds.includes(worldId)) {
        return true;
      }
      
      // Check if previous level is completed
      const previousLevelKey = `${worldId}-${levelNum - 1}`;
      return this.progress.completedLevels[previousLevelKey] === true;
    },
    
    // Check if a world is unlocked
    isWorldUnlocked: function(worldId) {
      return this.progress.unlockedWorlds.includes(worldId);
    },
    
    // Unlock a level
    unlockLevel: function(worldId, levelNum) {
      // Mark level as unlocked by completing the previous level
      if (levelNum > 1) {
        const previousLevelKey = `${worldId}-${levelNum - 1}`;
        this.progress.completedLevels[previousLevelKey] = true;
      }
      
      // Save game state
      this.save();
    },
    
    // Unlock a world
    unlockWorld: function(worldId) {
      if (!this.progress.unlockedWorlds.includes(worldId)) {
        this.progress.unlockedWorlds.push(worldId);
        
        // Save game state
        this.save();
      }
    },
    
    // Complete a level and award stars
    completeLevel: function(worldId, levelNum, stars) {
      const levelKey = `${worldId}-${levelNum}`;
      
      // Mark level as completed
      this.progress.completedLevels[levelKey] = true;
      
      // Award stars (keep highest star count)
      const currentStars = this.progress.earnedStars[levelKey] || 0;
      this.progress.earnedStars[levelKey] = Math.max(currentStars, stars);
      
      // Update total stars
      this.updateTotalStars();
      
      // Unlock next level
      if (levelNum < 10) { // Assuming 10 levels per world
        this.unlockLevel(worldId, levelNum + 1);
      } else {
        // Unlock next world if this was the last level
        this.unlockNextWorld(worldId);
      }
      
      // Save game state
      this.save();
    },
    
    // Unlock the next world after completing all levels in the current world
    unlockNextWorld: function(currentWorldId) {
      const worldOrder = [
        'counting-cove',
        'number-neighborhood',
        'addition-avenue',
        'subtraction-street',
        'math-mountain'
      ];
      
      const currentIndex = worldOrder.indexOf(currentWorldId);
      if (currentIndex >= 0 && currentIndex < worldOrder.length - 1) {
        const nextWorldId = worldOrder[currentIndex + 1];
        this.unlockWorld(nextWorldId);
      }
    },
    
    // Update total stars count
    updateTotalStars: function() {
      let totalStars = 0;
      
      // Sum up all earned stars
      for (const levelKey in this.progress.earnedStars) {
        totalStars += this.progress.earnedStars[levelKey];
      }
      
      this.player.stars = totalStars;
    },
    
    // Start a level
    startLevel: function(worldId, levelNum) {
      // Set current world and level
      this.progress.currentWorld = worldId;
      this.progress.currentLevel = levelNum;
      this.progress.currentActivity = 1;
      
      // Reset session data for the new level
      this.session.selectedWorld = worldId;
      this.session.selectedLevel = levelNum;
      this.session.activityProgress = 0;
      this.session.activityResults = [];
      this.session.currentActivityIndex = 0;
      
      // Access the pre-defined activities for this level
      // Note: levelNum is 1-based, array index is 0-based
      this.session.currentLevelActivities = GameData.worlds[worldId].levels[levelNum - 1].activities;
      
      // Set the first activity
      if (this.session.currentLevelActivities.length > 0) {
        this.session.activityData = this.session.currentLevelActivities[0];
      }
      
      // Save game state
      this.save();
    },
    
    // Move to the next activity in the current level
    nextActivity: function() {
      // Increment activity index
      this.session.currentActivityIndex++;
      
      // Check if there are more activities
      if (this.session.currentActivityIndex < this.session.currentLevelActivities.length) {
        // Set the next activity
        this.session.activityData = this.session.currentLevelActivities[this.session.currentActivityIndex];
        this.progress.currentActivity = this.session.currentActivityIndex + 1;
        return true;
      } else {
        // No more activities, level is complete
        return false;
      }
    },
    
    // Calculate stars earned for the current level
    calculateStarsEarned: function() {
      const correctAnswers = this.session.activityResults.filter(result => result).length;
      const totalActivities = this.session.activityResults.length;
      
      // Calculate percentage of correct answers
      const percentage = (correctAnswers / totalActivities) * 100;
      
      // Award stars based on percentage
      if (percentage >= 90) {
        return 3; // 3 stars for 90% or higher
      } else if (percentage >= 70) {
        return 2; // 2 stars for 70-89%
      } else if (percentage >= 50) {
        return 1; // 1 star for 50-69%
      } else {
        return 0; // 0 stars for less than 50%
      }
    }
  };

  // ===== Audio Manager =====
  const AudioManager = {
    backgroundMusic: null,
    effectsAudio: null,
    narrationAudio: null,
    
    init: function() {
      this.backgroundMusic = document.getElementById('background-music');
      this.effectsAudio = document.getElementById('effect-audio');
      this.narrationAudio = document.getElementById('narration-audio');
      
      // Set initial volumes
      this.setMusicVolume(GameState.settings.musicVolume);
      this.setEffectsVolume(GameState.settings.effectsVolume);
      this.setNarrationVolume(GameState.settings.narrationVolume);
    },
    
    playMusic: function(musicFile) {
      if (!this.backgroundMusic) return;
      
      this.backgroundMusic.src = `assets/audio/${musicFile}`;
      this.backgroundMusic.loop = true;
      
      // Play music (handle autoplay restrictions)
      const playPromise = this.backgroundMusic.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Autoplay prevented. User interaction required.');
        });
      }
    },
    
    playEffect: function(effectFile) {
      if (!this.effectsAudio) return;
      
      this.effectsAudio.src = `assets/audio/${effectFile}`;
      this.effectsAudio.play().catch(error => {
        console.log('Effect playback prevented:', error);
      });
    },
    
    playNarration: function(narrationFile) {
      if (!this.narrationAudio) return;
      
      this.narrationAudio.src = `assets/audio/${narrationFile}`;
      this.narrationAudio.play().catch(error => {
        console.log('Narration playback prevented:', error);
      });
    },
    
    setMusicVolume: function(volume) {
      if (!this.backgroundMusic) return;
      
      GameState.settings.musicVolume = volume;
      this.backgroundMusic.volume = volume;
    },
    
    setEffectsVolume: function(volume) {
      if (!this.effectsAudio) return;
      
      GameState.settings.effectsVolume = volume;
      this.effectsAudio.volume = volume;
    },
    
    setNarrationVolume: function(volume) {
      if (!this.narrationAudio) return;
      
      GameState.settings.narrationVolume = volume;
      this.narrationAudio.volume = volume;
    },
    
    stopAll: function() {
      if (this.backgroundMusic) this.backgroundMusic.pause();
      if (this.effectsAudio) this.effectsAudio.pause();
      if (this.narrationAudio) this.narrationAudio.pause();
    }
  };

  // ===== Screen Manager =====
  const ScreenManager = {
    currentScreen: null,
    
    init: function() {
      this.currentScreen = GameState.session.currentScreen;
    },
    
    showScreen: function(screenId) {
      // Hide all screens
      const screens = document.querySelectorAll('.screen');
      screens.forEach(screen => {
        screen.classList.add('hidden');
      });
      
      // Show requested screen
      const targetScreen = document.getElementById(screenId);
      if (targetScreen) {
        targetScreen.classList.remove('hidden');
        this.currentScreen = screenId;
        GameState.session.currentScreen = screenId;
        
        // Trigger screen-specific initialization
        this.initScreen(screenId);
      } else {
        console.error(`Screen not found: ${screenId}`);
      }
    },
    
    initScreen: function(screenId) {
      // Initialize screen-specific content and events
      switch (screenId) {
        case 'loading-screen':
          // Simulate loading process
          setTimeout(() => {
            this.showScreen('home-screen');
          }, 2000);
          break;
          
        case 'home-screen':
          this.initHomeScreen();
          break;
          
        case 'world-map-screen':
          this.initWorldMapScreen();
          break;
          
        case 'level-selection-screen':
          this.initLevelSelectionScreen();
          break;
          
        case 'activity-screen':
          this.initActivityScreen();
          break;
          
        case 'reward-screen':
          this.initRewardScreen();
          break;
          
        case 'settings-screen':
          this.initSettingsScreen();
          break;
          
        case 'parent-zone-screen':
          this.initParentZoneScreen();
          break;
      }
    },
    
    initHomeScreen: function() {
      // Set up character selection
      const characterOptions = document.querySelector('.character-options');
      
      // Generate character options
      characterOptions.innerHTML = `
        <div class="character-option ${GameState.player.character === 'boy' ? 'selected' : ''}" data-character="boy">
          <div class="character-image boy"></div>
          <div class="character-name">Boy</div>
        </div>
        <div class="character-option ${GameState.player.character === 'girl' ? 'selected' : ''}" data-character="girl">
          <div class="character-image girl"></div>
          <div class="character-name">Girl</div>
        </div>
      `;
      
      // Add character selection events
      document.querySelectorAll('.character-option').forEach(option => {
        option.addEventListener('click', () => {
          // Remove selected class from all options
          document.querySelectorAll('.character-option').forEach(opt => {
            opt.classList.remove('selected');
          });
          
          // Add selected class to clicked option
          option.classList.add('selected');
          
          // Update player character
          GameState.player.character = option.dataset.character;
          
          // Save game state
          GameState.save();
        });
      });
      
      // Set up button event listeners
      document.getElementById('play-button').addEventListener('click', () => {
        this.showScreen('world-map-screen');
      });
      
      document.getElementById('settings-button').addEventListener('click', () => {
        this.showScreen('settings-screen');
      });
      
      document.getElementById('parent-zone-button').addEventListener('click', () => {
        this.showScreen('parent-zone-screen');
      });
    },
    
    initWorldMapScreen: function() {
      // Update player info
      document.querySelectorAll('.player-name').forEach(el => {
        el.textContent = GameState.player.name || 'Player';
      });
      
      document.querySelectorAll('.player-stars').forEach(el => {
        el.textContent = GameState.player.stars || '0';
      });
      
      // Set up world selection
      const worlds = document.querySelectorAll('.world');
      worlds.forEach(world => {
        const worldId = world.dataset.world;
        
        // Check if world is unlocked
        const isUnlocked = GameState.isWorldUnlocked(worldId);
        world.classList.toggle('locked', !isUnlocked);
        
        // Add click event for unlocked worlds
        if (isUnlocked) {
          world.addEventListener('click', () => {
            GameState.session.selectedWorld = worldId;
            this.showScreen('level-selection-screen');
          });
        }
      });
      
      // Set up back button
      document.querySelector('#world-map-screen .back-button').addEventListener('click', () => {
        this.showScreen('home-screen');
      });
    },
    
    initLevelSelectionScreen: function() {
      const worldId = GameState.session.selectedWorld;
      if (!worldId) {
        console.error('No world selected');
        this.showScreen('world-map-screen');
        return;
      }
      
      // Set world name
      const worldName = document.querySelector('#level-selection-screen .world-name');
      worldName.textContent = this.getWorldName(worldId);
      
      // Generate levels
      const levelsContainer = document.querySelector('.levels-container');
      levelsContainer.innerHTML = '';
      
      // Create 10 levels per world
      for (let i = 1; i <= 10; i++) {
        const levelKey = `${worldId}-${i}`;
        const isCompleted = GameState.progress.completedLevels[levelKey];
        const stars = GameState.progress.earnedStars[levelKey] || 0;
        const isUnlocked = GameState.isLevelUnlocked(worldId, i);
        
        // Create level element
        const levelElement = document.createElement('div');
        levelElement.className = `level ${isCompleted ? 'completed' : ''} ${isUnlocked ? '' : 'locked'}`;
        levelElement.innerHTML = `
          <div class="level-number">${i}</div>
          <div class="level-stars">${'★'.repeat(stars)}</div>
        `;
        
        // Add click event for unlocked levels
        if (isUnlocked) {
          levelElement.addEventListener('click', () => {
            // Start the level
            GameState.startLevel(worldId, i);
            this.showScreen('activity-screen');
          });
        }
        
        levelsContainer.appendChild(levelElement);
      }
      
      // Set up back button
      document.querySelector('#level-selection-screen .back-button').addEventListener('click', () => {
        this.showScreen('world-map-screen');
      });
    },
    
    initActivityScreen: function() {
      const worldId = GameState.session.selectedWorld;
      const levelNum = GameState.session.selectedLevel;
      const activityData = GameState.session.activityData;
      
      if (!worldId || !levelNum || !activityData) {
        console.error('World, level, or activity data not set');
        this.showScreen('level-selection-screen');
        return;
      }
      
      // Set activity name
      const activityName = document.querySelector('.activity-name');
      activityName.textContent = `Level ${levelNum} - Activity ${activityData.activityNum}`;
      
      // Set progress indicator
      document.querySelector('.current-step').textContent = activityData.activityNum;
      document.querySelector('.total-steps').textContent = GameState.session.currentLevelActivities.length;
      
      // Get the activity handler
      const activityHandler = Activities.getActivityHandler(worldId, activityData.type);
      
      if (!activityHandler) {
        console.error('Activity handler not found for type:', activityData.type);
        return;
      }
      
      // Render the activity
      const activityContainer = document.querySelector('.activity-container');
      activityHandler.render(activityData, activityContainer);
      
      // Set up back button
      document.querySelector('#activity-screen .back-button').addEventListener('click', () => {
        this.showScreen('level-selection-screen');
      });
      
      // Set up help button
      document.querySelector('.help-button').addEventListener('click', () => {
        ActivityManager.showHelp();
      });
      
      // Set up submit button
      document.querySelector('.submit-button').addEventListener('click', () => {
        ActivityManager.checkAnswer();
      });
    },
    
    initRewardScreen: function() {
      // Calculate stars earned
      const earnedStarCount = GameState.calculateStarsEarned();
      
      // Update stars display
      const starsEarned = document.querySelector('.stars-earned');
      starsEarned.innerHTML = '';
      
      for (let i = 0; i < 3; i++) {
        const star = document.createElement('div');
        star.className = `star ${i < earnedStarCount ? 'earned' : 'not-earned'}`;
        star.innerHTML = '★';
        starsEarned.appendChild(star);
      }
      
      // Complete the level and award stars
      const worldId = GameState.session.selectedWorld;
      const levelNum = GameState.session.selectedLevel;
      
      if (worldId && levelNum) {
        GameState.completeLevel(worldId, levelNum, earnedStarCount);
      }
      
      // Set up buttons
      document.querySelector('.next-button').addEventListener('click', () => {
        // Go to next level or back to level selection
        if (levelNum < 10) {
          // Start next level
          GameState.startLevel(worldId, levelNum + 1);
          this.showScreen('activity-screen');
        } else {
          // Go back to level selection
          this.showScreen('level-selection-screen');
        }
      });
      
      document.querySelector('.replay-button').addEventListener('click', () => {
        // Replay the same level
        GameState.startLevel(worldId, levelNum);
        this.showScreen('activity-screen');
      });
      
      document.querySelector('.home-button').addEventListener('click', () => {
        // Go back to home
        this.showScreen('home-screen');
      });
    },
    
    initSettingsScreen: function() {
      // Set up volume sliders
      const musicVolume = document.getElementById('music-volume');
      musicVolume.value = GameState.settings.musicVolume * 100;
      musicVolume.addEventListener('input', () => {
        AudioManager.setMusicVolume(musicVolume.value / 100);
      });
      
      const effectsVolume = document.getElementById('effects-volume');
      effectsVolume.value = GameState.settings.effectsVolume * 100;
      effectsVolume.addEventListener('input', () => {
        AudioManager.setEffectsVolume(effectsVolume.value / 100);
      });
      
      const narrationVolume = document.getElementById('narration-volume');
      narrationVolume.value = GameState.settings.narrationVolume * 100;
      narrationVolume.addEventListener('input', () => {
        AudioManager.setNarrationVolume(narrationVolume.value / 100);
      });
      
      // Set up accessibility options
      const highContrast = document.getElementById('high-contrast');
      highContrast.checked = GameState.settings.highContrast;
      highContrast.addEventListener('change', () => {
        GameState.settings.highContrast = highContrast.checked;
        document.body.classList.toggle('high-contrast', highContrast.checked);
      });
      
      const textSize = document.getElementById('text-size');
      textSize.value = GameState.settings.textSize;
      textSize.addEventListener('change', () => {
        GameState.settings.textSize = textSize.value;
        document.body.classList.remove('small-text', 'medium-text', 'large-text');
        document.body.classList.add(`${textSize.value}-text`);
      });
      
      // Set up back button
      document.querySelector('#settings-screen .back-button').addEventListener('click', () => {
        // Save settings
        GameState.save();
        this.showScreen('home-screen');
      });
    },
    
    initParentZoneScreen: function() {
      // Set up parent gate
      const parentGate = document.querySelector('.parent-gate');
      const parentZoneContent = document.querySelector('.parent-zone-content');
      
      if (!GameState.session.isParentMode) {
        // Show parent gate
        parentGate.classList.remove('hidden');
        parentZoneContent.classList.add('hidden');
        
        // Generate a simple math problem for parent gate
        const num1 = Math.floor(Math.random() * 10) + 10;
        const num2 = Math.floor(Math.random() * 10) + 5;
        const answer = num1 + num2;
        
        const challenge = document.querySelector('.parent-gate-challenge');
        challenge.textContent = `${num1} + ${num2} = ?`;
        
        // Set up submit button
        document.getElementById('parent-gate-submit').addEventListener('click', () => {
          const userAnswer = document.getElementById('parent-gate-answer').value;
          
          if (parseInt(userAnswer) === answer) {
            // Correct answer, show parent zone
            GameState.session.isParentMode = true;
            parentGate.classList.add('hidden');
            parentZoneContent.classList.remove('hidden');
            this.initParentZoneContent();
          } else {
            // Wrong answer, shake the input
            document.getElementById('parent-gate-answer').classList.add('shake');
            setTimeout(() => {
              document.getElementById('parent-gate-answer').classList.remove('shake');
            }, 500);
          }
        });
      } else {
        // Already in parent mode, show content directly
        parentGate.classList.add('hidden');
        parentZoneContent.classList.remove('hidden');
        this.initParentZoneContent();
      }
    },
    
    initParentZoneContent: function() {
      // Set up tabs
      const tabButtons = document.querySelectorAll('.tab-button');
      tabButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Deactivate all tabs
          tabButtons.forEach(btn => btn.classList.remove('active'));
          document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
          
          // Activate selected tab
          button.classList.add('active');
          const tabId = button.dataset.tab;
          document.getElementById(`${tabId}-tab`).classList.add('active');
        });
      });
      
      // Set up back button
      document.querySelector('.parent-zone-content .back-button').addEventListener('click', () => {
        this.showScreen('home-screen');
      });
      
      // Set up exit button
      document.querySelector('.exit-parent-zone').addEventListener('click', () => {
        GameState.session.isParentMode = false;
        this.showScreen('home-screen');
      });
      
      // Load progress data
      this.loadParentProgressData();
    },
    
    loadParentProgressData: function() {
      // Populate progress tab with player data
      const progressTab = document.getElementById('progress-tab');
      
      // Calculate completion percentages
      const worldCompletion = this.calculateWorldCompletion();
      
      // Generate progress summary
      let progressHTML = `
        <div class="progress-summary">
          <h3>Progress Summary</h3>
          <p>Player: ${GameState.player.name || 'Player'}</p>
          <p>Age: ${GameState.player.age || 'Not set'}</p>
          <p>Stars Collected: ${GameState.player.stars || 0}</p>
        </div>
        
        <div class="skill-progress">
          <h3>Skills Progress</h3>
      `;
      
      // Add world completion bars
      for (const worldId in worldCompletion) {
        const worldName = this.getWorldName(worldId);
        const completion = worldCompletion[worldId];
        
        progressHTML += `
          <div class="progress-item">
            <div class="progress-label">${worldName}</div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${completion}%"></div>
            </div>
            <div class="progress-percentage">${completion}%</div>
          </div>
        `;
      }
      
      progressHTML += `</div>`;
      
      progressTab.innerHTML = progressHTML;
    },
    
    calculateWorldCompletion: function() {
      const worldCompletion = {};
      const worldIds = [
        'counting-cove',
        'number-neighborhood',
        'addition-avenue',
        'subtraction-street',
        'math-mountain'
      ];
      
      worldIds.forEach(worldId => {
        let completedLevels = 0;
        let totalLevels = 10; // Assuming 10 levels per world
        
        for (let i = 1; i <= totalLevels; i++) {
          const levelKey = `${worldId}-${i}`;
          if (GameState.progress.completedLevels[levelKey]) {
            completedLevels++;
          }
        }
        
        const completionPercentage = Math.round((completedLevels / totalLevels) * 100);
        worldCompletion[worldId] = completionPercentage;
      });
      
      return worldCompletion;
    },
    
    getWorldName: function(worldId) {
      const worldNames = {
        'counting-cove': 'Counting Cove',
        'number-neighborhood': 'Number Neighborhood',
        'addition-avenue': 'Addition Avenue',
        'subtraction-street': 'Subtraction Street',
        'math-mountain': 'Math Mountain'
      };
      
      return worldNames[worldId] || 'Unknown World';
    }
  };

  // ===== Activity Manager =====
  const ActivityManager = {
    checkAnswer: function() {
      const activityData = GameState.session.activityData;
      if (!activityData) return;
      
      const worldId = GameState.session.selectedWorld;
      const activityHandler = Activities.getActivityHandler(worldId, activityData.type);
      
      if (!activityHandler) {
        console.error('Activity handler not found for type:', activityData.type);
        return;
      }
      
      // Check the answer using the activity handler
      const isCorrect = activityHandler.checkAnswer(activityData);
      
      // Store result
      GameState.session.activityResults.push(isCorrect);
      
      // Play appropriate sound
      if (isCorrect) {
        AudioManager.playEffect('correct.mp3');
      } else {
        AudioManager.playEffect('incorrect.mp3');
      }
      
      // Show feedback
      const activityContainer = document.querySelector('.activity-container');
      const feedback = activityHandler.showFeedback(isCorrect, activityContainer);
      
      // Disable submit button
      document.querySelector('.submit-button').disabled = true;
      
      // After a delay, move to next activity or show reward screen
      setTimeout(() => {
        // Remove feedback
        if (feedback) {
          feedback.remove();
        }
        
        // Check if there are more activities
        if (GameState.nextActivity()) {
          // Load next activity
          ScreenManager.initActivityScreen();
        } else {
          // No more activities, show reward screen
          ScreenManager.showScreen('reward-screen');
        }
      }, 1500);
    },
    
    showHelp: function() {
      const activityData = GameState.session.activityData;
      if (!activityData) return;
      
      const activityContainer = document.querySelector('.activity-container');
      
      // Create help overlay
      const helpOverlay = document.createElement('div');
      helpOverlay.className = 'help-overlay';
      
      // Add help content based on current activity
      helpOverlay.innerHTML = `
        <div class="help-content">
          <h3>Need Help?</h3>
          <p>Here's a hint to help you solve this problem!</p>
          <div class="help-hint">
            ${this.getHintForActivity(activityData)}
          </div>
          <button class="close-help">Got it!</button>
        </div>
      `;
      
      // Add to container
      activityContainer.appendChild(helpOverlay);
      
      // Set up close button
      helpOverlay.querySelector('.close-help').addEventListener('click', () => {
        helpOverlay.remove();
      });
    },
    
    getHintForActivity: function(activityData) {
      if (!activityData) return 'Try to think about the problem carefully.';
      
      // Return hint based on activity type
      switch (activityData.type) {
        case 'number-recognition':
          return 'Look at the number carefully. Can you say its name?';
        case 'counting':
          return 'Count each object one by one, pointing as you go.';
        case 'sequencing':
          return 'Look at how the numbers are changing. What comes next?';
        case 'addition':
          return 'Addition means combining groups together. Count the total.';
        case 'subtraction':
          return 'Subtraction means taking away. Count what\'s left.';
        case 'multiplication':
          return 'Multiplication is repeated addition. Count groups of numbers.';
        case 'division':
          return 'Division means sharing equally. How many in each group?';
        default:
          return 'Try to think about the problem carefully.';
      }
    }
  };

  // ===== Initialization =====
  function init() {
    console.log('Initializing Math Adventure: Number Quest');
    
    // Try to load saved game
    GameState.load();
    
    // Initialize managers
    AudioManager.init();
    ScreenManager.init();
    
    // Show loading screen
    ScreenManager.showScreen('loading-screen');
    
    // Apply settings
    document.body.classList.toggle('high-contrast', GameState.settings.highContrast);
    document.body.classList.add(`${GameState.settings.textSize}-text`);
    
    // Set up global event listeners
    setupEventListeners();
    
    console.log('Initialization complete');
  }
  
  function setupEventListeners() {
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Handle visibility change (for pausing/resuming audio)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Prevent pinch zoom on mobile
    document.addEventListener('touchmove', function(event) {
      if (event.scale !== 1) {
        event.preventDefault();
      }
    }, { passive: false });
  }
  
  function handleResize() {
    // Adjust game container size if needed
    console.log('Window resized');
  }
  
  function handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden, pause audio
      AudioManager.stopAll();
    } else {
      // Page is visible again, resume audio if needed
      // This would need more logic to determine what audio to resume
    }
  }
  
  // Start the game when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', init);
})();

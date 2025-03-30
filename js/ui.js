/**
 * ui.js
 * Handles user interface interactions and updates for the Math Adventure game.
 */

(function() {
    'use strict';
  
    const UI = {
      init: function() {
        this.setupEventListeners();
        this.updatePlayerInfo();
      },
  
      setupEventListeners: function() {
        // Home Screen buttons
        this.handleButtonClick('play-button', () => ScreenManager.showScreen('world-map-screen'));
        this.handleButtonClick('settings-button', () => ScreenManager.showScreen('settings-screen'));
        this.handleButtonClick('parent-zone-button', () => ScreenManager.showScreen('parent-zone-screen'));
  
        // World Map Screen buttons
        const worldMapScreen = document.getElementById('world-map-screen');
        if (worldMapScreen) {
          const worldButtons = worldMapScreen.querySelectorAll('.world');
          worldButtons.forEach(worldButton => {
            worldButton.addEventListener('click', (event) => {
              const worldId = event.currentTarget.dataset.world;
              ScreenManager.showScreen('level-selection-screen');
              UI.loadLevelSelection(worldId);
            });
          });
          const backButtonWorldMap = worldMapScreen.querySelector('.back-button');
          if (backButtonWorldMap) {
            backButtonWorldMap.addEventListener('click', () => ScreenManager.showScreen('home-screen'));
          }
        }
  
        // Level Selection Screen buttons
        const levelSelectionScreen = document.getElementById('level-selection-screen');
        if (levelSelectionScreen) {
          const backButtonLevelSelect = levelSelectionScreen.querySelector('.back-button');
          if (backButtonLevelSelect) {
            backButtonLevelSelect.addEventListener('click', () => ScreenManager.showScreen('world-map-screen'));
          }
        }
  
        // Activity Screen buttons
        const activityScreen = document.getElementById('activity-screen');
        if (activityScreen) {
          const backButtonActivity = activityScreen.querySelector('.back-button');
          if (backButtonActivity) {
            backButtonActivity.addEventListener('click', () => ScreenManager.showScreen('level-selection-screen'));
          }
          this.handleButtonClick('.help-button', () => {
            const currentActivityData = GameState.session.activityData;
            const hint = ActivityManager.getHintForActivity(currentActivityData);
            alert(hint); // Basic alert for now, can be improved
          });
          this.handleButtonClick('.submit-button', () => {
            const currentActivityData = GameState.session.activityData;
            const isCorrect = Activities.checkAnswer(currentActivityData);
            Activities.showFeedback(isCorrect, document.querySelector('.activity-container'));
            setTimeout(() => {
              const nextActivity = GameState.nextActivity();
              if (nextActivity) {
                UI.loadActivity(nextActivity);
              } else {
                ScreenManager.showScreen('reward-screen');
                UI.loadRewardScreen();
              }
            }, 1500); // Short delay to show feedback
          });
        }
  
        // Reward Screen buttons
        this.handleButtonClick('#reward-screen .next-button', () => {
              const nextLevel = GameState.progress.currentLevel + 1;
          if (nextLevel) {
            ScreenManager.showScreen('level-selection-screen');
            UI.loadLevelSelection(GameState.currentWorldId);
          } else {
            ScreenManager.showScreen('world-map-screen');
          }
        });
        this.handleButtonClick('#reward-screen .replay-button', () => {
            UI.loadLevel(GameState.progress.currentWorld, GameState.progress.currentLevel);
        });
        this.handleButtonClick('#reward-screen .home-button', () => ScreenManager.showScreen('home-screen'));
  
        // Settings Screen buttons and inputs
        const settingsScreen = document.getElementById('settings-screen');
        if (settingsScreen) {
          const backButtonSettings = settingsScreen.querySelector('.back-button');
          if (backButtonSettings) {
            backButtonSettings.addEventListener('click', () => ScreenManager.showScreen('home-screen'));
          }
          const highContrastToggle = settingsScreen.querySelector('#high-contrast');
          if (highContrastToggle) {
            highContrastToggle.addEventListener('change', () => {
              GameState.settings.highContrast = highContrastToggle.checked;
              document.body.classList.toggle('high-contrast', GameState.settings.highContrast);
              GameState.save();
            });
          }
          const textSizeSelect = settingsScreen.querySelector('#text-size');
          if (textSizeSelect) {
            textSizeSelect.addEventListener('change', () => {
              document.body.classList.remove(`${GameState.settings.textSize}-text`);
              GameState.settings.textSize = textSizeSelect.value;
              document.body.classList.add(`${GameState.settings.textSize}-text`);
              GameState.save();
            });
          }
          const musicVolume = settingsScreen.querySelector('#music-volume');
          if (musicVolume) {
            musicVolume.addEventListener('input', () => AudioManager.setMusicVolume(musicVolume.value / 100));
          }
          const effectsVolume = settingsScreen.querySelector('#effects-volume');
          if (effectsVolume) {
            effectsVolume.addEventListener('input', () => AudioManager.setEffectsVolume(effectsVolume.value / 100));
          }
          const narrationVolume = settingsScreen.querySelector('#narration-volume');
          if (narrationVolume) {
            narrationVolume.addEventListener('input', () => AudioManager.setNarrationVolume(narrationVolume.value / 100));
          }
        }
  
        // Parent Zone Screen
        const parentZoneScreen = document.getElementById('parent-zone-screen');
        if (parentZoneScreen) {
          const backButtonParentZone = parentZoneScreen.querySelector('.back-button');
          if (backButtonParentZone) {
            backButtonParentZone.addEventListener('click', () => ScreenManager.showScreen('home-screen'));
          }
          this.handleButtonClick('#parent-gate-submit', () => {
            const answer = document.getElementById('parent-gate-answer').value;
            // Replace with your actual parent gate logic
            if (answer === 'secret') {
              parentZoneScreen.querySelector('.parent-gate').classList.add('hidden');
              parentZoneScreen.querySelector('.parent-zone-content').classList.remove('hidden');
            } else {
              alert('Incorrect answer.');
            }
          });
          this.handleButtonClick('.exit-parent-zone', () => {
            parentZoneScreen.querySelector('.parent-gate').classList.remove('hidden');
            parentZoneScreen.querySelector('.parent-zone-content').classList.add('hidden');
            ScreenManager.showScreen('home-screen');
          });
        }
      },
  
      handleButtonClick: function(selector, callback) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          el.addEventListener('click', callback);
        });
      },
  
      updatePlayerInfo: function() {
        const nameElements = document.querySelectorAll('.player-name');
        nameElements.forEach(el => {
          el.textContent = GameState.player.name || 'Player';
        });
        const starCountElements = document.querySelectorAll('.star-count');
        starCountElements.forEach(el => {
          el.textContent = GameState.player.stars || 0;
        });
      },
  
      loadWorldMap: function() {
        const worldsContainer = document.querySelector('#world-map-screen .worlds-container');
        if (worldsContainer && GameData && GameData.worlds) {
          worldsContainer.innerHTML = ''; // Clear previous content
          for (const worldId in GameData.worlds) {
            const world = GameData.worlds[worldId];
            const worldDiv = document.createElement('div');
            worldDiv.classList.add('world');
            worldDiv.dataset.world = worldId;
            worldDiv.innerHTML = `
              <div class="world-icon">
                <img src="assets/images/ui/${world.icon}" alt="${world.name}">
              </div>
              <div class="world-info">
                <h3>${world.name}</h3>
                <p>${world.ageRange}</p>
              </div>
            `;
            worldsContainer.appendChild(worldDiv);
          }
          // Re-attach event listeners after dynamically loading worlds
          this.setupEventListeners();
        }
      },
  
      loadLevelSelection: function(worldId) {
        GameState.currentWorldId = worldId;
        const levelSelectionScreen = document.getElementById('level-selection-screen');
        const levelsContainer = levelSelectionScreen.querySelector('.levels-container');
        const worldNameHeader = levelSelectionScreen.querySelector('.world-name');
  
        if (levelSelectionScreen && levelsContainer && worldNameHeader && GameData && GameData.worlds && GameData.worlds[worldId] && GameData.worlds[worldId].levels) {
          worldNameHeader.textContent = GameData.worlds[worldId].name;
          levelsContainer.innerHTML = ''; // Clear previous levels
          const levels = GameData.worlds[worldId].levels;
          levels.forEach((level, index) => {
            const levelButton = document.createElement('button');
            levelButton.classList.add('level-button');
            levelButton.textContent = `Level ${index + 1}`;
            levelButton.addEventListener('click', () => {
              this.loadLevel(worldId, index);
            });
            levelsContainer.appendChild(levelButton);
          });
        }
      },
  
      loadLevel: function(worldId, levelIndex) {
        GameState.startLevel(worldId, levelIndex);
        const currentActivity = GameState.getCurrentActivity();
        if (currentActivity) {
          this.loadActivity(currentActivity);
          ScreenManager.showScreen('activity-screen');
        }
      },
  
      loadActivity: function(activityData) {
        const activityContainer = document.querySelector('#activity-screen .activity-container');
        const activityNameHeader = document.querySelector('#activity-screen .activity-name');
        const progressIndicator = document.querySelector('#activity-screen .progress-indicator');
  
        if (activityContainer && activityNameHeader && progressIndicator) {
          activityContainer.innerHTML = ''; // Clear previous activity
          activityNameHeader.textContent = activityData.type.toUpperCase(); // Or a more user-friendly name
          progressIndicator.querySelector('.current-step').textContent = GameState.session.currentActivityIndex + 1;
          progressIndicator.querySelector('.total-steps').textContent = GameState.session.currentLevelActivities.length;
  
          if (window.Activities && window.Activities.getActivityHandler) {
            const activityHandler = window.Activities.getActivityHandler(GameState.progress.currentWorld, activityData.type);
            if (activityHandler && activityHandler.render) {
              activityHandler.render(activityData, activityContainer);
            } else {
              console.error(`No render function found for activity type: ${activityData.type}`);
              activityContainer.textContent = 'Error loading activity.';
            }
          } else {
            console.error('Activities object or getActivityHandler not found.');
            activityContainer.textContent = 'Error loading activity handlers.';
          }
          // Enable submit button once activity is loaded
          const submitButton = document.querySelector('#activity-screen .submit-button');
          if (submitButton) {
            submitButton.disabled = false;
          }
        }
      },
  
      loadRewardScreen: function() {
        const rewardScreen = document.getElementById('reward-screen');
        if (rewardScreen) {
          // You can add logic here to display the number of stars earned in this level
        }
      },
  
      showHelpOverlay: function(message) {
        const helpOverlay = document.createElement('div');
        helpOverlay.classList.add('help-overlay');
        helpOverlay.innerHTML = `
          <div class="help-content">
            <button class="close-help">X</button>
            <p>${message}</p>
          </div>
        `;
        document.body.appendChild(helpOverlay);
  
        // Set up close button
        helpOverlay.querySelector('.close-help').addEventListener('click', () => {
          helpOverlay.remove();
        });
      },
  
      // More UI functions as needed
    };
  
    // Initialize UI when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
      UI.init();
    });
  
    // Make UI globally accessible
    window.UI = UI;
  
  })();

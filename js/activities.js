/**
 * activities.js
 * Contains the logic for different math activities.
 */

(function() {
    'use strict';
  
    const Activities = {
      getActivityHandler: function(worldId, activityType) {
        switch (activityType) {
          case 'number-recognition':
            return this.numberRecognitionActivity;
          case 'counting':
            return this.countingActivity;
          case 'sequencing':
            return this.sequencingActivity;
          case 'addition':
            return this.additionActivity;
          case 'subtraction':
            return this.subtractionActivity;
          case 'multiplication':
            return this.multiplicationActivity;
          case 'division':
            return this.divisionActivity;
          default:
            console.warn(`Activity type "${activityType}" not found.`);
            return null;
        }
      },
  
      numberRecognitionActivity: {
        render: function(activityData, container) {
          // Example: Display a number and ask the user to identify it
          const number = activityData.number;
          container.innerHTML = `
            <p class="question">What number is this?</p>
            <div class="number-display">${number}</div>
            <input type="number" id="answer">
          `;
        },
        checkAnswer: function(activityData) {
          const userAnswer = document.getElementById('answer').value;
          return parseInt(userAnswer) === activityData.number;
        },
        showFeedback: function(isCorrect, container) {
          container.innerHTML += `<p class="feedback">${isCorrect ? 'Correct!' : 'Try again.'}</p>`;
        }
      },
  
      countingActivity: {
        render: function(activityData, container) {
          // Example: Display a set of objects to count
          const count = activityData.count;
          let itemsHtml = '';
          for (let i = 0; i < count; i++) {
            itemsHtml += '<span class="counting-item">O</span> '; // Replace with actual image/element
          }
          container.innerHTML = `
            <p class="question">How many objects are there?</p>
            <div class="counting-items">${itemsHtml}</div>
            <input type="number" id="answer">
          `;
        },
        checkAnswer: function(activityData) {
          const userAnswer = document.getElementById('answer').value;
          return parseInt(userAnswer) === activityData.count;
        },
        showFeedback: function(isCorrect, container) {
          container.innerHTML += `<p class="feedback">${isCorrect ? 'Correct!' : 'Try again.'}</p>`;
        }
      },
  
      sequencingActivity: {
        render: function(activityData, container) {
          // Placeholder for sequencing activity rendering
          container.innerHTML = '<p>Sequencing activity will go here.</p><input type="text" id="answer">';
        },
        checkAnswer: function(activityData) {
          return document.getElementById('answer').value.toLowerCase() === 'placeholder answer';
        },
        showFeedback: function(isCorrect, container) {
          container.innerHTML += `<p class="feedback">${isCorrect ? 'Correct!' : 'Try again.'}</p>`;
        }
      },
  
      additionActivity: {
        render: function(activityData, container) {
          const num1 = activityData.num1;
          const num2 = activityData.num2;
          container.innerHTML = `<p class="question">What is ${num1} + ${num2}?</p><input type="number" id="answer">`;
        },
        checkAnswer: function(activityData) {
          const userAnswer = document.getElementById('answer').value;
          return parseInt(userAnswer) === activityData.num1 + activityData.num2;
        },
        showFeedback: function(isCorrect, container) {
          container.innerHTML += `<p class="feedback">${isCorrect ? 'Correct!' : 'Try again.'}</p>`;
        }
      },
  
      subtractionActivity: {
        render: function(activityData, container) {
          const num1 = activityData.num1;
          const num2 = activityData.num2;
          container.innerHTML = `<p class="question">What is ${num1} - ${num2}?</p><input type="number" id="answer">`;
        },
        checkAnswer: function(activityData) {
          const userAnswer = document.getElementById('answer').value;
          return parseInt(userAnswer) === activityData.num1 - activityData.num2;
        },
        showFeedback: function(isCorrect, container) {
          container.innerHTML += `<p class="feedback">${isCorrect ? 'Correct!' : 'Try again.'}</p>`;
        }
      },
  
      multiplicationActivity: {
        render: function(activityData, container) {
          // Placeholder
          container.innerHTML = '<p>Multiplication activity will go here.</p><input type="text" id="answer">';
        },
        checkAnswer: function(activityData) {
          return document.getElementById('answer').value.toLowerCase() === 'placeholder answer';
        },
        showFeedback: function(isCorrect, container) {
          container.innerHTML += `<p class="feedback">${isCorrect ? 'Correct!' : 'Try again.'}</p>`;
        }
      },
  
      divisionActivity: {
        render: function(activityData, container) {
          // Placeholder
          container.innerHTML = '<p>Division activity will go here.</p><input type="text" id="answer">';
        },
        checkAnswer: function(activityData) {
          return document.getElementById('answer').value.toLowerCase() === 'placeholder answer';
        },
        showFeedback: function(isCorrect, container) {
          container.innerHTML += `<p class="feedback">${isCorrect ? 'Correct!' : 'Try again.'}</p>`;
        }
      },
    };
  
    window.Activities = Activities;
  
  })();
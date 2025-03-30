/**
 * data.js
 * Contains the game data, including worlds, levels, and activities.
 */

(function() {
    'use strict';
  
    const GameData = {
      worlds: {
        'counting-cove': {
          name: 'Counting Cove',
          ageRange: 'Ages 2-3',
          icon: 'counting-cove-icon.png',
          levels: [
            {
              activities: [
                { type: 'counting', count: 3 },
                { type: 'number-recognition', number: 1 },
                { type: 'counting', count: 5 },
              ],
            },
            {
              activities: [
                { type: 'number-recognition', number: 2 },
                { type: 'counting', count: 2 },
                { type: 'number-recognition', number: 3 },
              ],
            },
            // Add more levels for Counting Cove
          ],
        },
        'number-neighborhood': {
          name: 'Number Neighborhood',
          ageRange: 'Ages 3-4',
          icon: 'number-neighborhood-icon.png',
          levels: [
            {
              activities: [
                { type: 'number-recognition', number: 4 },
                { type: 'sequencing', sequence: [1, 2, 3] }, // You'll need to define how 'sequence' data looks
                { type: 'counting', count: 7 },
              ],
            },
            // Add more levels for Number Neighborhood
          ],
        },
        'addition-avenue': {
          name: 'Addition Avenue',
          ageRange: 'Ages 4-5',
          icon: 'addition-avenue-icon.png',
          levels: [
            {
              activities: [
                { type: 'addition', num1: 1, num2: 1 },
                { type: 'counting', count: 4 },
                { type: 'addition', num1: 2, num2: 1 },
              ],
            },
            // Add more levels for Addition Avenue
          ],
        },
        'subtraction-street': {
          name: 'Subtraction Street',
          ageRange: 'Ages 5-6',
          icon: 'subtraction-street-icon.png',
          levels: [
            {
              activities: [
                { type: 'subtraction', num1: 3, num2: 1 },
                { type: 'number-recognition', number: 7 },
                { type: 'subtraction', num1: 5, num2: 2 },
              ],
            },
            // Add more levels for Subtraction Street
          ],
        },
        'math-mountain': {
          name: 'Math Mountain',
          ageRange: 'Ages 6-7',
          icon: 'math-mountain-icon.png',
          levels: [
            {
              activities: [
                { type: 'multiplication', num1: 2, num2: 3 }, // You'll need to define how multiplication/division data looks
                { type: 'division', num1: 6, num2: 2 },
                { type: 'addition', num1: 4, num2: 3 },
              ],
            },
            // Add more levels for Math Mountain
          ],
        },
      },
    };
  
    window.GameData = GameData;
  
  })();
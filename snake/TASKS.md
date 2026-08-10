# Snake Game Full Task List

This list covers all necessary tasks to build a complete, functional, and playable 2D Snake game.

## Phase 1: Setup and Data Structures (The Foundation)

1. Grid Setup: Define the fixed size of the 2D game grid (e.g., 20 columns x 20 rows).

2. Snake Initialization: Create the core data structure (an array or list of integer coordinate pairs) to represent the snake's segments.

3. Food Initialization: Define a single set of coordinates for the food item.

4. Game State Initialization: Set initial variables: score ($0$), high score ($0$), initial direction (e.g., Right), and the initial game speed/delay value.

## Phase 2: The Core Game Engine (The Loop)

1. Implement the Game Loop: Create the continuous loop (using requestAnimationFrame or setInterval) that orchestrates all game activity.

2. Manage Timing and Speed: Implement logic to ensure the game logic (movement) only executes at a consistent rate (e.g., 5-10 times per second) regardless of CPU speed.

3. Handle User Input: Capture keyboard events (Arrow Keys/WASD) to set the snake's intended next direction.

3.1. Crucial Sub-task: Implement the guard clause to prevent immediate 180-degree turns (e.g., if moving Right, ignore the Left input).

4. Move the Snake (The Shift):

4.1. Calculate the snake's new head position based on the current direction.

4.2. Add the new head position to the front of the snake's segment list.

4.3. Remove the last element (the tail) from the list, unless food was eaten this cycle.

## Phase 3: Game Logic and Rules

1. Eating Logic: Check for a coordinate match between the snake's new head position and the food's position.

2. Length Increase: If food is eaten, skip removing the tail segment in the Move step (Task 8).

3. Random Food Generation: If food is eaten, calculate a new set of random integer coordinates for the next food item, ensuring it does not spawn on any existing snake segment.

4. Self-Collision Detection: Check if the new head coordinate matches the coordinates of any existing body segment.

5. Wall Collision Detection: Check if the new head coordinate is outside the defined grid boundaries.

5.1. Alternative/Feature: Implement Boundary Wrapping using modulo arithmetic if the snake is allowed to appear on the opposite side of the wall it hits.

6. Die Logic: If any collision (Self or Wall) is detected, stop the game loop and transition to the Game Over state.

## Phase 4: Rendering and User Interface

1. Render the Game World: Clear the screen/canvas and redraw all current elements: grid, snake segments (distinguishing the head), and the food item.

2. Display Score and High Score: Render the current score and a persistent high score visibly on the screen.

3. Game State Screens: Implement visual screens for managing game flow:

3.1. Start/Title Screen: Waits for user confirmation to begin.

3.2. Pause Screen (Optional): Shows the "Paused" state.

3.3. Game Over Screen: Displays the final score, a message, and offers a Restart option.
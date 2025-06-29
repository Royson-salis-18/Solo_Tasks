# Solo Tasks - Flask Todo App

A beautiful, gamified todo application built with Flask and modern web technologies.

## Features

- ✨ Beautiful cyberpunk-inspired UI with neon effects
- 🎮 Gamification system with levels and power ratings
- 📱 Responsive design for all devices
- 🔄 Real-time task management
- 🎯 Task filtering (All, Active, Completed)
- 🌟 Interactive background grid with mouse effects

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Application

```bash
python app.py
```

### 3. Access the App

Open your browser and go to: `http://localhost:5000`

## API Endpoints

- `GET /` - Main application page
- `GET /tasks` - Get all tasks
- `POST /add` - Add a new task
- `PUT /tasks/<id>` - Update task completion status
- `DELETE /tasks/<id>` - Delete a task

## Project Structure

```
web todo/
├── app.py              # Flask application
├── requirements.txt    # Python dependencies
├── static/
│   ├── styles.css     # CSS styles
│   └── script.js      # Frontend JavaScript
└── templates/
    └── index.html     # Main HTML template
```

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with cyberpunk theme
- **Icons**: Font Awesome
- **Fonts**: Rajdhani, Orbitron (Google Fonts)

## Features in Detail

### Gamification System
- **Levels**: Gain levels by completing tasks (5 tasks per level)
- **Power Ratings**: E → D → C → B → A → S based on your level
- **Progress Bar**: Visual representation of progress to next level

### Interactive Background
- **Neon Grid**: Responsive grid that reacts to mouse movement
- **Trail Effects**: Beautiful neon trail following your cursor
- **Neighbor Lighting**: Adjacent squares light up when hovering

### Task Management
- **Add Tasks**: Simple input with Enter key or Add button
- **Complete Tasks**: Click on task text to toggle completion
- **Delete Tasks**: Click trash icon to remove tasks
- **Filter Tasks**: View All, Active, or Completed tasks

## Development

The app uses in-memory storage for simplicity. For production use, consider implementing a proper database like SQLite, PostgreSQL, or MongoDB.

## License

This project is open source and available under the MIT License. 
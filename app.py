from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory storage for tasks (in a real app, you'd use a database)
tasks = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add', methods=['POST'])
def add():
    try:
        data = request.get_json()
        task_text = data.get('task', '').strip()
        
        if not task_text:
            return jsonify({'error': 'Task text is required'}), 400
        
        # Create a new task with an ID
        new_task = {
            'id': len(tasks) + 1,  # Simple ID generation
            'text': task_text,
            'completed': False
        }
        
        tasks.append(new_task)
        return jsonify({'status': 'ok', 'task': new_task})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/tasks')
def get_tasks():
    return jsonify(tasks)

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        data = request.get_json()
        completed = data.get('completed', False)
        
        # Find and update the task
        for task in tasks:
            if task['id'] == task_id:
                task['completed'] = completed
                return jsonify({'status': 'ok', 'task': task})
        
        return jsonify({'error': 'Task not found'}), 404
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        # Find and remove the task
        for i, task in enumerate(tasks):
            if task['id'] == task_id:
                deleted_task = tasks.pop(i)
                return jsonify({'status': 'ok', 'task': deleted_task})
        
        return jsonify({'error': 'Task not found'}), 404
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 
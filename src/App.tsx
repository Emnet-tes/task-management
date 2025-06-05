import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface Toast {
  id: number;
  message: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Buy groceries', completed: false },
    { id: 2, title: 'Read a book', completed: true }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast helpers
  const showToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now(),
        title: newTaskTitle.trim(),
        completed: false
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      showToast('Task created successfully!');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
    showToast('Task deleted successfully!');
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  const saveEdit = (id: number) => {
    if (editingTitle.trim()) {
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, title: editingTitle.trim() } : task
      ));
      setEditingId(null);
      setEditingTitle('');
      showToast('Task edited successfully!');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in"
          >
            {toast.message}
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Task Management</h1>
        
        {/* Add Task Form */}
        <form onSubmit={addTask} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={!newTaskTitle.trim()}
            >
              Add Task
            </button>
          </div>
        </form>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div className="flex items-center gap-3 w-full">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                {editingId === task.id ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.title}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {editingId === task.id ? (
                  <>
                    <button
                      onClick={() => saveEdit(task.id)}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                      disabled={!editingTitle.trim()}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(task)}
                      className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Toast animation keyframes */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease;
        }
      `}</style>
    </div>
  )
}

export default App

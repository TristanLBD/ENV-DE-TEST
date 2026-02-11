import React, { useEffect, useState } from 'react';
import { useTaskStore, Task } from '../store/taskStore';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { tasks, getTasks, deleteTask, updateTask, loading } = useTaskStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task._id, { status: newStatus });
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  if (loading && tasks.length === 0) {
    return <div className="text-center py-10">Loading tasks...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          data-testid="addTaskButton"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No tasks found. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <TaskForm
          isOpen={isFormOpen}
          onClose={closeForm}
          taskToEdit={editingTask}
        />
      )}
    </div>
  );
};

export default Dashboard;
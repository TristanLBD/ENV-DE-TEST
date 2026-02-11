import React from 'react';
import { Task } from '../store/taskStore';
import { Calendar, Tag as TagIcon, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  return (
      <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                  <button onClick={() => onToggleStatus(task)} className="mt-1">
                      {task.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                      )}
                  </button>
                  <div>
                      <h3
                          className={clsx(
                              "text-lg font-medium text-gray-900",
                              task.status === "completed" && "line-through text-gray-500",
                          )}
                      >
                          {task.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                  </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                  <span className={clsx("px-2 py-1 text-xs font-medium rounded-full", priorityColors[task.priority])}>
                      {task.priority}
                  </span>
                  {task.dueDate && (
                      <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </div>
                  )}
              </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                  <span
                      key={tag._id}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: tag.color + "20", color: tag.color }}
                  >
                      <TagIcon className="h-3 w-3 mr-1" />
                      {tag.name}
                  </span>
              ))}
          </div>

          {task.subtasks.length > 0 && (
              <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{
                              width: `${(task.subtasks.filter((st) => st.completed).length / task.subtasks.length) * 100}%`,
                          }}
                      ></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 text-right">
                      {task.subtasks.filter((st) => st.completed).length}/{task.subtasks.length} subtasks
                  </p>
              </div>
          )}

          <div className="mt-4 flex justify-end space-x-2">
              <button
                  onClick={() => onEdit(task)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                  data-testid="EditTaskBtn"
              >
                  Edit
              </button>
              <button
                  onClick={() => onDelete(task._id)}
                  className="text-sm text-red-600 hover:text-red-800"
                  data-testid="DeleteTaskBtn"
              >
                  Delete
              </button>
          </div>
      </div>
  );
};

export default TaskCard;

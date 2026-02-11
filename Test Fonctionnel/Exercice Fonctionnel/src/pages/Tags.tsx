import React, { useEffect, useState } from 'react';
import { useTaskStore, Tag } from '../store/taskStore';
import { Plus, Trash, Tag as TagIcon } from 'lucide-react';

const Tags: React.FC = () => {
  const { tags, getTags, createTag, deleteTag } = useTaskStore();
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');

  useEffect(() => {
    getTags();
  }, [getTags]);

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagName.trim()) {
      await createTag({ name: newTagName, color: newTagColor });
      setNewTagName('');
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (window.confirm('Are you sure? This will remove the tag from all tasks.')) {
      await deleteTag(id);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Tags</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Tag</h2>
        <form onSubmit={handleCreateTag} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              name="tag-name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <input
              type="color"
              className="mt-1 block h-9 w-20 border border-gray-300 rounded-md shadow-sm p-1"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Tag
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tags.map((tag) => (
          <div key={tag._id} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center">
              <span
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: tag.color }}
              ></span>
              <span className="font-medium text-gray-900">{tag.name}</span>
            </div>
            <button
              onClick={() => handleDeleteTag(tag._id)}
              className="text-gray-400 hover:text-red-500"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tags;
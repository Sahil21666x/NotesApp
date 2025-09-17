import { useState } from 'react';
import { format } from 'date-fns';
import { Pin, Archive, Trash2, Edit, MoreVertical } from 'lucide-react';
import { notesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const NoteCard = ({ note, onUpdate, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePin = async () => {
    setIsLoading(true);
    try {
      const response = await notesAPI.togglePin(note._id);
      onUpdate(response.data.note);
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Failed to update note');
    } finally {
      setIsLoading(false);
      setIsMenuOpen(false);
    }
  };

  const handleToggleArchive = async () => {
    setIsLoading(true);
    try {
      const response = await notesAPI.toggleArchive(note._id);
      onUpdate(response.data.note);
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Failed to update note');
    } finally {
      setIsLoading(false);
      setIsMenuOpen(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setIsLoading(true);
      try {
        await notesAPI.deleteNote(note._id);
        onDelete(note._id);
        toast.success('Note deleted successfully');
      } catch (error) {
        toast.error('Failed to delete note');
      } finally {
        setIsLoading(false);
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 relative group"
      style={{ backgroundColor: note.color || '#ffffff' }}
    >
      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute top-2 right-2">
          <Pin className="h-4 w-4 text-yellow-500 fill-current" />
        </div>
      )}

      {/* Menu button */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 hover:bg-gray-100 rounded-full"
            disabled={isLoading}
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border">
              <div className="py-1">
                <button
                  onClick={handleTogglePin}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  disabled={isLoading}
                >
                  <Pin className="h-4 w-4 mr-2" />
                  {note.isPinned ? 'Unpin' : 'Pin'}
                </button>
                <button
                  onClick={handleToggleArchive}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  disabled={isLoading}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  {note.isArchived ? 'Unarchive' : 'Archive'}
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Note content */}
      <div className="pr-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {note.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
          {note.content}
        </p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{note.category}</span>
          <span>{format(new Date(note.updatedAt), 'MMM d, yyyy')}</span>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;

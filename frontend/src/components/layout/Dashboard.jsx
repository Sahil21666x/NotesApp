import { useState, useEffect } from 'react';
import { Plus, Search, TrendingUp, Archive, Pin } from 'lucide-react';
import { notesAPI } from '../../services/api';
import NoteCard from '../notes/NoteCard';
import NoteForm from '../notes/NoteForm';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [recentNotes, setRecentNotes] = useState([]);
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pinned: 0,
    archived: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent notes
      const recentResponse = await notesAPI.getNotes({ 
        page: 1, 
        limit: 6, 
        isArchived: false 
      });
      setRecentNotes(recentResponse.data.notes);

      // Fetch pinned notes
      const pinnedResponse = await notesAPI.getNotes({ 
        page: 1, 
        limit: 4, 
        isArchived: false 
      });
      const pinned = pinnedResponse.data.notes.filter(note => note.isPinned);
      setPinnedNotes(pinned);

      // Calculate stats
      const totalResponse = await notesAPI.getNotes({ page: 1, limit: 1 });
      const archivedResponse = await notesAPI.getNotes({ 
        page: 1, 
        limit: 1, 
        isArchived: true 
      });

      setStats({
        total: totalResponse.data.pagination.total,
        pinned: pinned.length,
        archived: archivedResponse.data.pagination.total,
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = () => {
    setIsFormOpen(true);
  };

  const handleSaveNote = async (noteData) => {
    try {
      const response = await notesAPI.createNote(noteData);
      setRecentNotes([response.data.note, ...recentNotes.slice(0, 5)]);
      if (response.data.note.isPinned) {
        setPinnedNotes([response.data.note, ...pinnedNotes.slice(0, 3)]);
        setStats(prev => ({ ...prev, pinned: prev.pinned + 1 }));
      }
      setStats(prev => ({ ...prev, total: prev.total + 1 }));
      toast.success('Note created successfully');
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Failed to create note');
    }
  };

  const handleUpdateNote = (updatedNote) => {
    setRecentNotes(notes => 
      notes.map(note => note._id === updatedNote._id ? updatedNote : note)
    );
    setPinnedNotes(notes => 
      notes.map(note => note._id === updatedNote._id ? updatedNote : note)
    );
  };

  const handleDeleteNote = (noteId) => {
    setRecentNotes(notes => notes.filter(note => note._id !== noteId));
    setPinnedNotes(notes => notes.filter(note => note._id !== noteId));
    setStats(prev => ({ ...prev, total: prev.total - 1 }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your notes today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Notes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Pin className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pinned Notes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pinned}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Archive className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Archived</p>
              <p className="text-2xl font-bold text-gray-900">{stats.archived}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleCreateNote}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            New Note
          </button>
        </div>
      </div>

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Pinned Notes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pinnedNotes.map(note => (
              <NoteCard
                key={note._id}
                note={note}
                onUpdate={handleUpdateNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Notes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Notes</h2>
        </div>
        {recentNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentNotes.map(note => (
              <NoteCard
                key={note._id}
                note={note}
                onUpdate={handleUpdateNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 mb-4">
              <Plus className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notes yet
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by creating your first note.
            </p>
            <button
              onClick={handleCreateNote}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create your first note
            </button>
          </div>
        )}
      </div>

      {/* Note Form Modal */}
      <NoteForm
        onSave={handleSaveNote}
        onCancel={() => setIsFormOpen(false)}
        isOpen={isFormOpen}
      />
    </div>
  );
};

export default Dashboard;

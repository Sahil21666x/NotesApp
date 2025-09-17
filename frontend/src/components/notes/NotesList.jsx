import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import { notesAPI, tenantsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import NoteCard from './NoteCard';
import NoteForm from './NoteForm';
import toast from 'react-hot-toast';

const NotesList = () => {
  const { user, refreshProfile } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showArchived, setShowArchived] = useState(false);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showUpgradeOffer, setShowUpgradeOffer] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNotes();
    fetchCategories();
  }, [searchTerm, selectedCategory, showArchived, currentPage]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        search: searchTerm || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        isArchived: showArchived,
      };

      const response = await notesAPI.getNotes(params);
      setNotes(response.data.notes);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await notesAPI.getCategories();
      setCategories(['All', ...response.data.categories]);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsFormOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
        const response = await notesAPI.updateNote(editingNote._id, noteData);
        setNotes(notes.map(note => 
          note._id === editingNote._id ? response.data.note : note
        ));
        toast.success('Note updated successfully');
      } else {
        try {
          const response = await notesAPI.createNote(noteData);
          setNotes([response.data.note, ...notes]);
          setShowUpgradeOffer(false);
          toast.success('Note created successfully');
        } catch (error) {
          if (error.response?.status === 402) {
            setShowUpgradeOffer(true);
            toast.error(error.response.data?.message || 'Upgrade required');
          } else {
            throw error;
          }
        }
      }
      setIsFormOpen(false);
      setEditingNote(null);
    } catch (error) {
      toast.error('Failed to save note');
    }
  };

  const handleUpgrade = async () => {
    if (!user?.tenant?.slug) return;
    try {
      await tenantsAPI.upgrade(user.tenant.slug);
      // Refresh user profile to get updated plan
      await refreshProfile();
      // Refresh notes after upgrade
      await fetchNotes();
      toast.success('Upgraded to Pro successfully');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Upgrade failed');
    }
  };

  const handleUpdateNote = (updatedNote) => {
    setNotes(notes.map(note => 
      note._id === updatedNote._id ? updatedNote : note
    ));
  };

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(note => note._id !== noteId));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleToggleArchived = () => {
    setShowArchived(!showArchived);
    setCurrentPage(1);
  };

  if (loading && notes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {showArchived ? 'Archived Notes' : 'My Notes'}
          </h1>
          <p className="text-gray-600">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </p>
        </div>
        <button
          onClick={handleCreateNote}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          New Note
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* View Mode */}
        <div className="flex border border-gray-300 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        {/* Archive Toggle */}
        <button
          onClick={handleToggleArchived}
          className={`px-4 py-2 rounded-lg border ${
            showArchived 
              ? 'bg-gray-100 text-gray-700 border-gray-300' 
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4 inline mr-2" />
          {showArchived ? 'Show Active' : 'Show Archived'}
        </button>
      </div>

      {/* Upgrade banner when hitting free-plan limit */}
      {showUpgradeOffer && user?.tenant?.plan === 'free' && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
          <div className="flex items-center justify-between">
            <p>You have reached the Free plan limit (3 notes). Upgrade to Pro to continue adding notes.</p>
            <button onClick={handleUpgrade} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Upgrade to Pro</button>
          </div>
        </div>
      )}

      {/* Notes Grid/List */}
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {showArchived ? 'No archived notes' : 'No notes yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {showArchived 
              ? 'You haven\'t archived any notes yet.' 
              : 'Get started by creating your first note.'
            }
          </p>
          {!showArchived && (
            <button
              onClick={handleCreateNote}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create your first note
            </button>
          )}
          {/* Upgrade hint for Free plan */}
          {!showArchived && user?.tenant?.plan === 'free' && (
            <div className="mt-4">
              <button onClick={handleUpgrade} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Upgrade to Pro
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {notes.map(note => (
              <NoteCard
                key={note._id}
                note={note}
                onUpdate={handleUpdateNote}
                onDelete={handleDeleteNote}
                onEdit={handleEditNote}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border rounded-md ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Note Form Modal */}
      <NoteForm
        note={editingNote}
        onSave={handleSaveNote}
        onCancel={() => {
          setIsFormOpen(false);
          setEditingNote(null);
        }}
        isOpen={isFormOpen}
      />
    </div>
  );
};

export default NotesList;

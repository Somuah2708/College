import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert, Modal, Switch, ActivityIndicator } from 'react-native';
import { X, Plus, Search, BookOpen, Calendar, Tag, Star, CreditCard as Edit3, Trash2, Save, ListFilter as Filter, Clock, Heart, Target, Lightbulb, Brain, FileText, Bookmark, Archive, Share, Eye, EyeOff, Lock, CircleCheck as CheckSquare, Image as ImageIcon, Link, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';

interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  is_favorite: boolean;
  is_private: boolean;
  color_theme: string;
  note_type: 'note' | 'journal' | 'idea' | 'task' | 'research';
  created_at: string;
  updated_at: string;
  word_count: number;
  reading_time: number;
}

interface NotesJournalProps {
  onClose: () => void;
}

export default function NotesJournal({ onClose }: NotesJournalProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showAddNote, setShowAddNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    category: 'personal',
    tags: [] as string[],
    is_favorite: false,
    is_private: false,
    color_theme: '#3B82F6',
    note_type: 'note' as const
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [searchQuery, selectedCategory, selectedType, notes]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Please sign in to access your notes');
        setNotes([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setNotes(data || []);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes. Please try again.');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const filterNotes = () => {
    let filtered = notes;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(note => note.note_type === selectedType);
    }

    setFilteredNotes(filtered);
  };

  const addNote = async () => {
    if (!noteForm.title.trim() || !noteForm.content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to create notes');
        return;
      }

      const wordCount = noteForm.content.trim().split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute

      const { error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: noteForm.title,
          content: noteForm.content,
          category: noteForm.category,
          tags: noteForm.tags,
          is_favorite: noteForm.is_favorite,
          is_private: noteForm.is_private,
          color_theme: noteForm.color_theme,
          note_type: noteForm.note_type,
          word_count: wordCount,
          reading_time: readingTime
        });

      if (error) {
        throw error;
      }

      await fetchNotes();
      resetForm();
      setShowAddNote(false);
      Alert.alert('Success', 'Note saved successfully!');
    } catch (error) {
      console.error('Error adding note:', error);
      Alert.alert('Error', 'Failed to save note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateNote = async () => {
    if (!editingNote) return;

    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to update notes');
        return;
      }

      const wordCount = noteForm.content.trim().split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));

      const { error } = await supabase
        .from('notes')
        .update({
          title: noteForm.title,
          content: noteForm.content,
          category: noteForm.category,
          tags: noteForm.tags,
          is_favorite: noteForm.is_favorite,
          is_private: noteForm.is_private,
          color_theme: noteForm.color_theme,
          note_type: noteForm.note_type,
          word_count: wordCount,
          reading_time: readingTime
        })
        .eq('id', editingNote.id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      await fetchNotes();
      setEditingNote(null);
      resetForm();
      setShowAddNote(false);
      Alert.alert('Success', 'Note updated successfully!');
    } catch (error) {
      console.error('Error updating note:', error);
      Alert.alert('Error', 'Failed to update note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = (noteId: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) {
                Alert.alert('Authentication Required', 'Please sign in to delete notes');
                return;
              }

              const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id', noteId)
                .eq('user_id', user.id);

              if (error) {
                throw error;
              }

              await fetchNotes();
              Alert.alert('Success', 'Note deleted successfully!');
            } catch (error) {
              console.error('Error deleting note:', error);
              Alert.alert('Error', 'Failed to delete note. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const toggleFavorite = async (noteId: string, currentStatus: boolean) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to favorite notes');
        return;
      }

      const { error } = await supabase
        .from('notes')
        .update({ is_favorite: !currentStatus })
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      await fetchNotes();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const editNote = (note: Note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags,
      is_favorite: note.is_favorite,
      is_private: note.is_private,
      color_theme: note.color_theme,
      note_type: note.note_type
    });
    setShowAddNote(true);
  };

  const resetForm = () => {
    setNoteForm({
      title: '',
      content: '',
      category: 'personal',
      tags: [],
      is_favorite: false,
      is_private: false,
      color_theme: '#3B82F6',
      note_type: 'note'
    });
    setEditingNote(null);
    setNewTag('');
  };

  const addTag = () => {
    if (newTag.trim() && !noteForm.tags.includes(newTag.trim())) {
      setNoteForm({
        ...noteForm,
        tags: [...noteForm.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNoteForm({
      ...noteForm,
      tags: noteForm.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'journal': return BookOpen;
      case 'idea': return Lightbulb;
      case 'task': return CheckSquare;
      case 'research': return Brain;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'journal': return '#10B981';
      case 'idea': return '#F59E0B';
      case 'task': return '#EF4444';
      case 'research': return '#8B5CF6';
      default: return '#3B82F6';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academics': return '#3B82F6';
      case 'personal': return '#10B981';
      case 'career': return '#8B5CF6';
      case 'research': return '#EF4444';
      case 'ideas': return '#F59E0B';
      case 'tasks': return '#06B6D4';
      default: return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const categories = [
    { key: 'all', label: 'All Categories', count: notes.length },
    { key: 'academics', label: 'Academics', count: notes.filter(n => n.category === 'academics').length },
    { key: 'personal', label: 'Personal', count: notes.filter(n => n.category === 'personal').length },
    { key: 'career', label: 'Career', count: notes.filter(n => n.category === 'career').length },
    { key: 'research', label: 'Research', count: notes.filter(n => n.category === 'research').length },
    { key: 'ideas', label: 'Ideas', count: notes.filter(n => n.category === 'ideas').length },
    { key: 'tasks', label: 'Tasks', count: notes.filter(n => n.category === 'tasks').length }
  ];

  const noteTypes = [
    { key: 'all', label: 'All Types', count: notes.length },
    { key: 'note', label: 'Notes', count: notes.filter(n => n.note_type === 'note').length },
    { key: 'journal', label: 'Journal', count: notes.filter(n => n.note_type === 'journal').length },
    { key: 'idea', label: 'Ideas', count: notes.filter(n => n.note_type === 'idea').length },
    { key: 'task', label: 'Tasks', count: notes.filter(n => n.note_type === 'task').length },
    { key: 'research', label: 'Research', count: notes.filter(n => n.note_type === 'research').length }
  ];

  const colorThemes = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', 
    '#06B6D4', '#EC4899', '#84CC16', '#F97316', '#6366F1'
  ];

  const renderAddNoteModal = () => (
    <Modal
      visible={showAddNote}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        setShowAddNote(false);
        resetForm();
      }}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {editingNote ? 'Edit Note' : 'Create New Note'}
          </Text>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => {
              setShowAddNote(false);
              resetForm();
            }}
          >
            <X size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          {/* Note Type Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Note Type</Text>
            <View style={styles.typeSelector}>
              {['note', 'journal', 'idea', 'task', 'research'].map((type) => {
                const TypeIcon = getTypeIcon(type);
                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      noteForm.note_type === type && styles.selectedTypeButton,
                      { backgroundColor: noteForm.note_type === type ? getTypeColor(type) : '#F3F4F6' }
                    ]}
                    onPress={() => setNoteForm({...noteForm, note_type: type as any})}
                  >
                    <TypeIcon size={16} color={noteForm.note_type === type ? '#FFFFFF' : '#6B7280'} />
                    <Text style={[
                      styles.typeButtonText,
                      { color: noteForm.note_type === type ? '#FFFFFF' : '#6B7280' }
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.titleInput}
              value={noteForm.title}
              onChangeText={(text) => setNoteForm({...noteForm, title: text})}
              placeholder="Enter note title..."
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Content */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Content</Text>
            <TextInput
              style={styles.contentInput}
              value={noteForm.content}
              onChangeText={(text) => setNoteForm({...noteForm, content: text})}
              placeholder="Write your note content here..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categorySelector}>
              {['personal', 'academics', 'career', 'research', 'ideas', 'tasks'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    noteForm.category === category && styles.selectedCategoryButton,
                    { backgroundColor: noteForm.category === category ? getCategoryColor(category) : '#F3F4F6' }
                  ]}
                  onPress={() => setNoteForm({...noteForm, category})}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    { color: noteForm.category === category ? '#FFFFFF' : '#6B7280' }
                  ]}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tags */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tags</Text>
            <View style={styles.tagsContainer}>
              {noteForm.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)}>
                    <X size={14} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={styles.addTagContainer}>
              <TextInput
                style={styles.tagInput}
                value={newTag}
                onChangeText={setNewTag}
                placeholder="Add a tag..."
                placeholderTextColor="#9CA3AF"
                onSubmitEditing={addTag}
              />
              <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
                <Plus size={16} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Color Theme */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Color Theme</Text>
            <View style={styles.colorSelector}>
              {colorThemes.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    noteForm.color_theme === color && styles.selectedColorButton
                  ]}
                  onPress={() => setNoteForm({...noteForm, color_theme: color})}
                >
                  {noteForm.color_theme === color && (
                    <CheckSquare size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Settings */}
          <View style={styles.settingsGroup}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Star size={20} color="#F59E0B" />
                <Text style={styles.settingLabel}>Mark as Favorite</Text>
              </View>
              <Switch
                value={noteForm.is_favorite}
                onValueChange={(value) => setNoteForm({...noteForm, is_favorite: value})}
                trackColor={{ false: '#E5E7EB', true: '#F59E0B' }}
                thumbColor={noteForm.is_favorite ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Lock size={20} color="#EF4444" />
                <Text style={styles.settingLabel}>Private Note</Text>
              </View>
              <Switch
                value={noteForm.is_private}
                onValueChange={(value) => setNoteForm({...noteForm, is_private: value})}
                trackColor={{ false: '#E5E7EB', true: '#EF4444' }}
                thumbColor={noteForm.is_private ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: noteForm.color_theme }]}
            onPress={editingNote ? updateNote : addNote}
            disabled={loading}
          >
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>
              {editingNote ? 'Update Note' : 'Save Note'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderNoteCard = (note: Note) => (
    <View key={note.id} style={[styles.noteCard, { borderLeftColor: note.color_theme }]}>
      <View style={styles.noteHeader}>
        <View style={styles.noteHeaderLeft}>
          <View style={[styles.noteTypeIcon, { backgroundColor: `${getTypeColor(note.note_type)}15` }]}>
            {React.createElement(getTypeIcon(note.note_type), { 
              size: 16, 
              color: getTypeColor(note.note_type) 
            })}
          </View>
          <View style={styles.noteTitleContainer}>
            <Text style={styles.noteTitle} numberOfLines={1}>{note.title}</Text>
            <View style={styles.noteMetaRow}>
              <Text style={styles.noteDate}>{formatDate(note.updated_at)}</Text>
              <Text style={styles.noteStats}>{note.word_count} words • {note.reading_time} min read</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.noteHeaderRight}>
          {note.is_favorite && (
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
          )}
          {note.is_private && (
            <Lock size={16} color="#6B7280" />
          )}
          <TouchableOpacity
            style={styles.noteMenuButton}
            onPress={() => {
              Alert.alert(
                'Note Options',
                'Choose an action',
                [
                  { text: 'Edit', onPress: () => editNote(note) },
                  { text: 'Toggle Favorite', onPress: () => toggleFavorite(note.id, note.is_favorite) },
                  { text: 'Delete', onPress: () => deleteNote(note.id), style: 'destructive' },
                  { text: 'Cancel', style: 'cancel' }
                ]
              );
            }}
          >
            <MoreHorizontal size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.noteContent} numberOfLines={4}>
        {note.content}
      </Text>

      <View style={styles.noteFooter}>
        <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(note.category)}15` }]}>
          <Text style={[styles.categoryBadgeText, { color: getCategoryColor(note.category) }]}>
            {note.category}
          </Text>
        </View>
        
        <View style={styles.tagsContainer}>
          {note.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={styles.noteTag}>
              <Text style={styles.noteTagText}>#{tag}</Text>
            </View>
          ))}
          {note.tags.length > 2 && (
            <Text style={styles.moreTags}>+{note.tags.length - 2}</Text>
          )}
        </View>
      </View>
    </View>
  );

  const favoriteNotes = notes.filter(note => note.is_favorite);
  const recentNotes = notes.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Notes & Journal</Text>
          <Text style={styles.subtitle}>Capture ideas, track progress, and reflect on your journey</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddNote(true)}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <FileText size={20} color="#3B82F6" />
          <Text style={styles.statValue}>{notes.length}</Text>
          <Text style={styles.statLabel}>Total Notes</Text>
        </View>
        <View style={styles.statCard}>
          <Star size={20} color="#F59E0B" />
          <Text style={styles.statValue}>{favoriteNotes.length}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        <View style={styles.statCard}>
          <Calendar size={20} color="#10B981" />
          <Text style={styles.statValue}>{notes.filter(n => n.note_type === 'journal').length}</Text>
          <Text style={styles.statLabel}>Journal Entries</Text>
        </View>
        <View style={styles.statCard}>
          <Lightbulb size={20} color="#8B5CF6" />
          <Text style={styles.statValue}>{notes.filter(n => n.note_type === 'idea').length}</Text>
          <Text style={styles.statLabel}>Ideas</Text>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes, content, or tags..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.filterButton,
                selectedCategory === category.key && styles.activeFilterButton
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Text style={[
                styles.filterText,
                selectedCategory === category.key && styles.activeFilterText
              ]}>
                {category.label} ({category.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeFiltersContainer}>
          {noteTypes.map((type) => (
            <TouchableOpacity
              key={type.key}
              style={[
                styles.typeFilterButton,
                selectedType === type.key && styles.activeTypeFilterButton
              ]}
              onPress={() => setSelectedType(type.key)}
            >
              <Text style={[
                styles.typeFilterText,
                selectedType === type.key && styles.activeTypeFilterText
              ]}>
                {type.label} ({type.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.notesContainer} showsVerticalScrollIndicator={false}>
        {/* Recent Notes */}
        {selectedCategory === 'all' && selectedType === 'all' && searchQuery === '' && recentNotes.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.recentTitle}>Recent Notes</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentContainer}>
              {recentNotes.map((note) => (
                <TouchableOpacity
                  key={note.id}
                  style={[styles.recentCard, { backgroundColor: `${note.color_theme}15` }]}
                  onPress={() => editNote(note)}
                >
                  <View style={styles.recentCardHeader}>
                    {React.createElement(getTypeIcon(note.note_type), { 
                      size: 20, 
                      color: note.color_theme 
                    })}
                    {note.is_favorite && (
                      <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    )}
                  </View>
                  <Text style={styles.recentCardTitle} numberOfLines={2}>{note.title}</Text>
                  <Text style={styles.recentCardContent} numberOfLines={3}>{note.content}</Text>
                  <Text style={styles.recentCardDate}>{formatDate(note.updated_at)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* All Notes */}
        <View style={styles.allNotesSection}>
          <View style={styles.allNotesHeader}>
            <Text style={styles.allNotesTitle}>
              {filteredNotes.length} {filteredNotes.length === 1 ? 'Note' : 'Notes'}
            </Text>
            <View style={styles.viewModeToggle}>
              <TouchableOpacity
                style={[styles.viewModeButton, viewMode === 'grid' && styles.activeViewMode]}
                onPress={() => setViewMode('grid')}
              >
                <Text style={[styles.viewModeText, viewMode === 'grid' && styles.activeViewModeText]}>Grid</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.viewModeButton, viewMode === 'list' && styles.activeViewMode]}
                onPress={() => setViewMode('list')}
              >
                <Text style={[styles.viewModeText, viewMode === 'list' && styles.activeViewModeText]}>List</Text>
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Loading notes...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <FileText size={48} color="#EF4444" />
              <Text style={styles.errorTitle}>Error Loading Notes</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchNotes}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredNotes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <BookOpen size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No notes found</Text>
              <Text style={styles.emptyText}>
                {searchQuery || selectedCategory !== 'all' || selectedType !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first note to get started'}
              </Text>
              <TouchableOpacity
                style={styles.createFirstButton}
                onPress={() => setShowAddNote(true)}
              >
                <Plus size={16} color="#3B82F6" />
                <Text style={styles.createFirstText}>Create Note</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={viewMode === 'grid' ? styles.notesGrid : styles.notesList}>
              {filteredNotes.map((note) => renderNoteCard(note))}
            </View>
          )}
        </View>
      </ScrollView>

      {renderAddNoteModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  filtersContainer: {
    marginBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  typeFiltersContainer: {
    flexDirection: 'row',
  },
  typeFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 6,
  },
  activeTypeFilterButton: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  typeFilterText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeTypeFilterText: {
    color: '#FFFFFF',
  },
  notesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  recentSection: {
    marginBottom: 24,
  },
  recentTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  recentContainer: {
    paddingHorizontal: 8,
  },
  recentCard: {
    width: 200,
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentCardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  recentCardContent: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  recentCardDate: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  allNotesSection: {
    flex: 1,
  },
  allNotesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  allNotesTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  viewModeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeViewMode: {
    backgroundColor: '#3B82F6',
  },
  viewModeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeViewModeText: {
    color: '#FFFFFF',
  },
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  notesList: {
    flex: 1,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    width: '48%',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  noteHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  noteTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  noteTitleContainer: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  noteMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginRight: 8,
  },
  noteStats: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  noteHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteMenuButton: {
    padding: 4,
    marginLeft: 8,
  },
  noteContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  noteTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
  },
  noteTagText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  moreTags: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  createFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  createFirstText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    marginLeft: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    flex: 1,
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTypeButton: {
    // Style handled by backgroundColor in component
  },
  typeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 6,
  },
  titleInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  contentInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    minHeight: 200,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryButton: {
    // Style handled by backgroundColor in component
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginRight: 4,
  },
  addTagContainer: {
    flexDirection: 'row',
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    marginRight: 8,
  },
  addTagButton: {
    backgroundColor: '#3B82F615',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorButton: {
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginLeft: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});
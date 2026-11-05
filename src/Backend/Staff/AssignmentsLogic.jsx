import { useState, useEffect, useCallback } from 'react';
import supabaseClient from '../../config/supabaseClient';

export const useAssignmentsLogic = () => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('Status');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State for Creating New Task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Mathematics');
  const [showNewTaskSubjectDropdown, setShowNewTaskSubjectDropdown] = useState(false);
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskGuidelines, setNewTaskGuidelines] = useState('');

  // Toast Notification State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const curriculumSubjects = [
    'Numeracy',
    'Literacy',
    'Rhymes',
    'General Paper',
    'CRS',
    'Mathematics',
    'English language',
    'Basic science',
    'Social studies',
    'History',
    'Yoruba',
    'Creative & Cultural Arts',
    'Vocational Studies',
    'Security Education',
    'Quantitative Reasoning',
    'Verbal Reasoning',
    'Physical Health Education'
  ];

  const statusOptions = ['All Status', 'Active', 'Closed'];

  const getSubjectTagColor = (subject) => {
    const sub = (subject || '').toUpperCase();
    if (sub.includes('MATH')) return 'bg-sky-100 text-sky-700';
    if (sub.includes('SCIENCE')) return 'bg-purple-100 text-purple-700';
    return 'bg-indigo-100 text-indigo-700';
  };

  const getStatusTagColor = (status) => {
    const stat = (status || '').toUpperCase();
    if (stat === 'ACTIVE') return 'bg-emerald-100 text-emerald-700';
    return 'bg-rose-100 text-rose-700';
  };

  // Fetch Assignments
  const fetchAssignments = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const { data: assignmentsData, error } = await supabaseClient
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (assignmentsData) {
        const formatted = assignmentsData.map((item) => {
          const createdDate = item.created_at ? new Date(item.created_at).toLocaleDateString() : 'RECENT';
          const dueDate = item.due_date ? new Date(item.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

          return {
            id: item.id,
            title: item.title,
            subject: (item.subject || 'GENERAL').toUpperCase(),
            status: (item.status || 'ACTIVE').toUpperCase(),
            subjectTagColor: getSubjectTagColor(item.subject),
            statusTagColor: getStatusTagColor(item.status),
            createdText: `CREATED ${createdDate}`,
            dueText: `DUE ${dueDate}`,
            guidelines: item.description || 'No guidelines provided.'
          };
        });

        setAssignments(formatted);
      }
    } catch (err) {
      console.error('Error fetching assignments:', err.message);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments(false);
  }, [fetchAssignments]);

  // Create New Assignment Task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskDueDate) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();

      let creatorId = null;
      if (user) {
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (profile) creatorId = profile.id;
      }

      const newRecord = {
        title: newTaskTitle,
        subject: newTaskSubject.toUpperCase(),
        description: newTaskGuidelines || 'Follow instructions provided by instructor.',
        grade_level: '',
        due_date: new Date(newTaskDueDate).toISOString(),
        created_by: creatorId,
        status: 'ACTIVE'
      };

      const { error } = await supabaseClient
        .from('assignments')
        .insert([newRecord]);

      if (error) throw error;

      triggerToast('Homework task published successfully!');
      setShowCreateModal(false);
      setNewTaskTitle('');
      setNewTaskDueDate('');
      setNewTaskGuidelines('');
      await fetchAssignments(true);
    } catch (err) {
      console.error('Error creating task:', err.message);
      triggerToast(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAssignments = assignments.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatusFilter === 'Status' || selectedStatusFilter === 'All Status' || item.status.toLowerCase() === selectedStatusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const activeTasksCount = assignments.filter(a => a.status === 'ACTIVE').length;
  const completedTasksCount = assignments.filter(a => a.status === 'CLOSED' || a.status === 'COMPLETED').length;

  return {
    assignments,
    filteredAssignments,
    isLoading,
    isSubmitting,
    searchQuery,
    setSearchQuery,
    selectedStatusFilter,
    setSelectedStatusFilter,
    showStatusDropdown,
    setShowStatusDropdown,
    statusOptions,
    curriculumSubjects,
    showCreateModal,
    setShowCreateModal,
    newTaskTitle,
    setNewTaskTitle,
    newTaskSubject,
    setNewTaskSubject,
    showNewTaskSubjectDropdown,
    setShowNewTaskSubjectDropdown,
    newTaskDueDate,
    setNewTaskDueDate,
    newTaskGuidelines,
    setNewTaskGuidelines,
    handleCreateTask,
    activeTasksCount,
    completedTasksCount,
    showToast,
    toastMessage
  };
};
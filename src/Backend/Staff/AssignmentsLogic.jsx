import { useState, useEffect, useCallback } from 'react';
import supabaseClient from '../../config/supabaseClient';

export const useAssignmentsLogic = () => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGrading, setIsGrading] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('Subject');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('Status');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeReviewTask, setActiveReviewTask] = useState(null);
  const [taskSubmissions, setTaskSubmissions] = useState([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  // Form State for Creating New Task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Mathematics');
  const [showNewTaskSubjectDropdown, setShowNewTaskSubjectDropdown] = useState(false);
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskGuidelines, setNewTaskGuidelines] = useState('');

  // Toast / Feedback Notification State
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

  const subjectOptions = ['All Subjects', ...curriculumSubjects];
  const statusOptions = ['All Status', 'Active', 'Draft', 'Closed'];

  // Helper for dynamic Subject Tag colors
  const getSubjectTagColor = (subject) => {
    const sub = (subject || '').toUpperCase();
    if (sub.includes('MATH')) return 'bg-sky-100 text-sky-700';
    if (sub.includes('SCIENCE')) return 'bg-purple-100 text-purple-700';
    if (sub.includes('FRENCH')) return 'bg-amber-100 text-amber-700';
    return 'bg-indigo-100 text-indigo-700';
  };

  // Helper for dynamic Status Tag colors
  const getStatusTagColor = (status) => {
    const stat = (status || '').toUpperCase();
    if (stat === 'ACTIVE') return 'bg-emerald-100 text-emerald-700';
    if (stat === 'DRAFT') return 'bg-slate-100 text-slate-600';
    return 'bg-rose-100 text-rose-700';
  };

  // 1. Fetch Assignments and dynamically calculate class submissions
  const fetchAssignments = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();

      let targetGrade = 'GRADE 6';
      if (user) {
        const { data: prof } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (prof && (prof.grade || prof.role_title)) {
          const match = `${prof.grade} ${prof.role_title}`.match(/Grade\s*(\d+)/i);
          if (match) targetGrade = `GRADE ${match[1]}`;
        }
      }

      // Fetch count of total pupils in educator's grade
      const { count: totalPupilsCount } = await supabaseClient
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'pupil')
        .ilike('grade', `%${targetGrade}%`);

      const totalClassCount = totalPupilsCount || 32;

      // Fetch assignments
      const { data: assignmentsData, error } = await supabaseClient
        .from('assignments')
        .select(`
          *,
          assignment_submissions (id, status, score)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (assignmentsData) {
        const formatted = assignmentsData.map((item) => {
          const submissionsList = item.assignment_submissions || [];
          const submittedCount = submissionsList.filter(s => s.status === 'submitted' || s.status === 'graded').length;
          
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
            rawDueDate: item.due_date,
            submittedCount: submittedCount,
            totalCount: totalClassCount,
            guidelines: item.description || 'No guidelines provided.',
            submissions: submissionsList
          };
        });

        setAssignments(formatted);
      }
    } catch (err) {
      console.error('Error fetching assignments:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // 2. Fetch specific task submissions for the Review Modal
  const fetchTaskSubmissions = async (assignmentId) => {
    setIsLoadingSubmissions(true);
    try {
      const { data, error } = await supabaseClient
        .from('assignment_submissions')
        .select(`
          *,
          profiles:pupil_id (full_name, avatar_url)
        `)
        .eq('assignment_id', assignmentId);

      if (error) throw error;

      if (data) {
        const formattedSubs = data.map(s => ({
          id: s.id,
          name: s.profiles?.full_name || 'Pupil',
          avatar: s.profiles?.avatar_url || null,
          status: s.status === 'graded' ? 'Graded' : (s.status === 'submitted' ? 'Submitted' : 'Pending Review'),
          grade: s.score !== null && s.score !== undefined ? `${s.score}/10` : '—',
          score: s.score || '',
          submissionText: s.submission_text || 'No written response',
          fileUrl: s.file_url
        }));
        setTaskSubmissions(formattedSubs);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err.message);
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  // Open Review Modal
  const handleOpenReview = (task) => {
    setActiveReviewTask(task);
    setShowReviewModal(true);
    fetchTaskSubmissions(task.id);
  };

  // 3. Create New Assignment Task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskDueDate) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();

      const newRecord = {
        title: newTaskTitle,
        subject: newTaskSubject.toUpperCase(),
        description: newTaskGuidelines || 'Follow instructions provided by instructor.',
        grade_level: 'GRADE 6',
        due_date: new Date(newTaskDueDate).toISOString(),
        created_by: user ? user.id : null,
        status: 'ACTIVE'
      };

      const { error } = await supabaseClient
        .from('assignments')
        .insert([newRecord])
        .select();

      if (error) throw error;

      // Log system activity for admin audit dashboard
      await supabaseClient.from('system_activity_logs').insert([
        {
          user_id: user ? user.id : null,
          action: `Created Assignment: ${newTaskTitle} (${newTaskSubject})`,
          ip_address: '197.210.54.12',
          status: 'Success',
          created_at: new Date().toISOString()
        }
      ]);

      triggerToast('Homework assignment published successfully!');
      setShowCreateModal(false);
      setNewTaskTitle('');
      setNewTaskDueDate('');
      setNewTaskGuidelines('');
      await fetchAssignments();
    } catch (err) {
      console.error('Error creating task:', err.message);
      triggerToast(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Grade a pupil submission
  const handleGradeSubmission = async (submissionId, scoreValue) => {
    setIsGrading(true);
    try {
      const { error } = await supabaseClient
        .from('assignment_submissions')
        .update({
          score: parseFloat(scoreValue),
          status: 'graded',
          graded_at: new Date().toISOString()
        })
        .eq('id', submissionId);

      if (error) throw error;

      triggerToast('Grade recorded successfully!');
      if (activeReviewTask) {
        await fetchTaskSubmissions(activeReviewTask.id);
        await fetchAssignments();
      }
    } catch (err) {
      console.error('Error grading submission:', err.message);
      triggerToast('Failed to record grade.');
    } finally {
      setIsGrading(false);
    }
  };

  // Filter assignments
  const filteredAssignments = assignments.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubjectFilter === 'Subject' || selectedSubjectFilter === 'All Subjects' || item.subject.toLowerCase() === selectedSubjectFilter.toLowerCase();
    const matchesStatus = selectedStatusFilter === 'Status' || selectedStatusFilter === 'All Status' || item.status.toLowerCase() === selectedStatusFilter.toLowerCase();
    return matchesSearch && matchesSubject && matchesStatus;
  });

  // Calculate Header Metrics Dynamically
  const activeTasksCount = assignments.filter(a => a.status === 'ACTIVE').length;
  const gradingQueueCount = assignments.reduce((acc, curr) => {
    const pendingSubs = (curr.submissions || []).filter(s => s.status === 'submitted').length;
    return acc + pendingSubs;
  }, 0);
  const completedTasksCount = assignments.filter(a => a.status === 'CLOSED' || a.status === 'COMPLETED').length;

  return {
    assignments,
    filteredAssignments,
    isLoading,
    isSubmitting,
    isGrading,
    searchQuery,
    setSearchQuery,
    selectedSubjectFilter,
    setSelectedSubjectFilter,
    selectedStatusFilter,
    setSelectedStatusFilter,
    showSubjectDropdown,
    setShowSubjectDropdown,
    showStatusDropdown,
    setShowStatusDropdown,
    curriculumSubjects,
    subjectOptions,
    statusOptions,
    showCreateModal,
    setShowCreateModal,
    showReviewModal,
    setShowReviewModal,
    activeReviewTask,
    handleOpenReview,
    taskSubmissions,
    isLoadingSubmissions,
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
    handleGradeSubmission,
    activeTasksCount,
    gradingQueueCount,
    completedTasksCount,
    showToast,
    toastMessage
  };
};
import { useState, useEffect } from 'react';
import  supabaseClient  from '../../config/supabaseClient';

export const useAcademicApprovalLogic = () => {
  const [activeFilter, setActiveFilter] = useState('Pending Review');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionsList, setSubmissionsList] = useState([]);
  
  // Term window countdown state
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [showGradingBanner, setShowGradingBanner] = useState(false);

  const filterOptions = [
    'Pending Review',
    'Approved Reports',
    'Reset History',
    'All Submissions',
  ];

  // Fetch live submissions and active term info from Supabase
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch academic approvals
      const { data: subData, error: subError } = await supabaseClient
        .from('academic_approvals')
        .select(`
          id,
          class_name,
          subject,
          status,
          submitted_at,
          educator_id,
          profiles:educator_id (full_name, avatar_url)
        `)
        .order('submitted_at', { ascending: false });

      if (subError) throw subError;

      const formattedData = (subData || []).map((item) => ({
        id: item.id,
        subject: item.subject || 'General Assessment',
        className: item.class_name || 'N/A',
        subClass: '',
        pupilsCount: 0,
        teacherName: item.profiles?.full_name || 'Assigned Educator',
        teacherAvatar: item.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        submissionDate: item.submitted_at ? new Date(item.submitted_at).toLocaleDateString() : 'Recent',
        averageScore: 'N/A',
        status: item.status || 'Pending',
      }));

      setSubmissionsList(formattedData);

      // 2. Fetch active term end date from academic_sessions table
      const { data: sessionData, error: sessionError } = await supabaseClient
        .from('academic_sessions')
        .select('term_end_date')
        .eq('is_active', true)
        .single();

      if (!sessionError && sessionData?.term_end_date) {
        const endDate = new Date(sessionData.term_end_date);
        const today = new Date();
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setDaysRemaining(diffDays);
        // ONLY display when it is 12 days or fewer to the end of the term
        setShowGradingBanner(diffDays <= 12 && diffDays >= 0);
      } else {
        setShowGradingBanner(false);
      }
    } catch (err) {
      console.error('Error fetching academic data:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const { error } = await supabaseClient
        .from('academic_approvals')
        .update({ status: 'Approved', reviewed_at: new Date() })
        .eq('id', id);

      if (error) throw error;

      setSubmissionsList((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, status: 'Approved' } : sub))
      );
      setSelectedSubmission(null);
    } catch (err) {
      console.error('Error approving report:', err.message);
    }
  };

  const handleBulkApprove = async () => {
    try {
      const pendingIds = submissionsList
        .filter((s) => s.status === 'Pending' || s.status === 'Reviewing')
        .map((s) => s.id);

      if (pendingIds.length === 0) return;

      const { error } = await supabaseClient
        .from('academic_approvals')
        .update({ status: 'Approved', reviewed_at: new Date() })
        .in('id', pendingIds);

      if (error) throw error;

      setSubmissionsList((prev) =>
        prev.map((sub) => ({ ...sub, status: 'Approved' }))
      );
    } catch (err) {
      console.error('Error bulk approving reports:', err.message);
    }
  };

  const handleResetScoreSheet = async (id) => {
    try {
      const { error } = await supabaseClient
        .from('academic_approvals')
        .update({ status: 'Rejected', reviewed_at: new Date() })
        .eq('id', id);

      if (error) throw error;

      setSubmissionsList((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, status: 'Rejected' } : sub))
      );
      setShowResetConfirm(null);
      setSelectedSubmission(null);
    } catch (err) {
      console.error('Error resetting score sheet:', err.message);
    }
  };

  const filteredSubmissions = submissionsList.filter((sub) => {
    const matchesSearch =
      sub.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.subject.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'Pending Review')
      return matchesSearch && (sub.status === 'Pending' || sub.status === 'Reviewing');
    if (activeFilter === 'Approved Reports') return matchesSearch && sub.status === 'Approved';
    if (activeFilter === 'Reset History')
      return matchesSearch && (sub.status === 'Rejected' || sub.status === 'Reset / Returned');
    return matchesSearch;
  });

  const countPending = submissionsList.filter((s) => s.status === 'Pending').length;
  const countReviewing = submissionsList.filter((s) => s.status === 'Reviewing').length;
  const countApproved = submissionsList.filter((s) => s.status === 'Approved').length;
  const countRejected = submissionsList.filter(
    (s) => s.status === 'Rejected' || s.status === 'Reset / Returned'
  ).length;

  return {
    activeFilter,
    setActiveFilter,
    isFilterDropdownOpen,
    setIsFilterDropdownOpen,
    searchQuery,
    setSearchQuery,
    selectedSubmission,
    setSelectedSubmission,
    showResetConfirm,
    setShowResetConfirm,
    filterOptions,
    filteredSubmissions,
    countPending,
    countReviewing,
    countApproved,
    countRejected,
    isLoading,
    showGradingBanner,
    daysRemaining,
    handleApprove,
    handleBulkApprove,
    handleResetScoreSheet,
  };
};
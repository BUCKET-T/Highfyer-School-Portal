import { useState, useEffect, useCallback } from 'react';
import supabaseClient from '../../config/supabaseClient';

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
  const fetchData = useCallback(async () => {
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
          term,
          academic_session,
          submitted_at,
          educator_id,
          profiles:educator_id (full_name, avatar_url)
        `)
        .order('submitted_at', { ascending: false });

      if (subError) throw subError;

      // 2. Fetch all student grades for averages & pupil count calculation
      const { data: allGrades } = await supabaseClient
        .from('student_grades')
        .select('subject, term, academic_session, ca_score, exam_score, total_score');

      const formattedData = (subData || []).map((item) => {
        const matchingGrades = (allGrades || []).filter(
          (g) =>
            g.subject?.toUpperCase() === item.subject?.toUpperCase() &&
            g.term === item.term &&
            g.academic_session === item.academic_session
        );

        const pupilsCount = matchingGrades.length;
        const totalSum = matchingGrades.reduce(
          (acc, curr) => acc + (Number(curr.total_score) || (Number(curr.ca_score) || 0) + (Number(curr.exam_score) || 0)),
          0
        );
        const avgScore = pupilsCount > 0 ? `${Math.round(totalSum / pupilsCount)}%` : 'N/A';

        return {
          id: item.id,
          subject: item.subject || 'General Assessment',
          className: item.class_name || 'N/A',
          subClass: '',
          term: item.term,
          academicSession: item.academic_session,
          pupilsCount,
          teacherName: item.profiles?.full_name || 'Assigned Educator',
          teacherAvatar: item.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          submissionDate: item.submitted_at ? new Date(item.submitted_at).toLocaleDateString() : 'Recent',
          averageScore: avgScore,
          status: item.status || 'PENDING',
        };
      });

      setSubmissionsList(formattedData);

      // 3. Fetch active term end date
      const { data: sessionData, error: sessionError } = await supabaseClient
        .from('academic_sessions')
        .select('term_end_date')
        .eq('is_active', true)
        .maybeSingle();

      if (!sessionError && sessionData?.term_end_date) {
        const endDate = new Date(sessionData.term_end_date);
        const today = new Date();
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setDaysRemaining(diffDays);
        setShowGradingBanner(diffDays <= 12 && diffDays >= 0);
      } else {
        setShowGradingBanner(false);
      }
    } catch (err) {
      console.error('Error fetching academic data:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

const handleApprove = async (id) => {
    try {
      const { error } = await supabaseClient
        .from('academic_approvals')
        .update({ 
          status: 'APPROVED', 
          reviewed_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      setSubmissionsList((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, status: 'APPROVED' } : sub))
      );
      setSelectedSubmission(null);
    } catch (err) {
      console.error('Error approving report:', err.message);
      alert('Failed to approve report: ' + err.message);
    }
  };

  const handleResetScoreSheet = async (id) => {
    try {
      const targetSub = submissionsList.find((s) => s.id === id);
      if (!targetSub) return;

      // 1. Update status to REJECTED without touching reviewed_by
      const { data: updatedApproval, error: approvalErr } = await supabaseClient
        .from('academic_approvals')
        .update({ 
          status: 'REJECTED', 
          reviewed_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select();

      if (approvalErr) throw approvalErr;

      // 2. Unlock student grades by setting is_finalized to false
      if (updatedApproval && updatedApproval.length > 0) {
        const target = updatedApproval[0];
        await supabaseClient
          .from('student_grades')
          .update({ is_finalized: false })
          .eq('subject', target.subject.toUpperCase())
          .eq('term', target.term);
      }

      setSubmissionsList((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, status: 'REJECTED' } : sub))
      );
      
      setShowResetConfirm(null);
      setSelectedSubmission(null);
      await fetchData();
    } catch (err) {
      console.error('Error resetting score sheet:', err.message);
      alert('Failed to reset score sheet: ' + err.message);
    }
  };

  const filteredSubmissions = submissionsList.filter((sub) => {
    const matchesSearch =
      sub.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const statusUpper = sub.status.toUpperCase();

    if (activeFilter === 'Pending Review')
      return matchesSearch && (statusUpper === 'PENDING' || statusUpper === 'REVIEWING');
    if (activeFilter === 'Approved Reports') return matchesSearch && statusUpper === 'APPROVED';
    if (activeFilter === 'Reset History')
      return matchesSearch && (statusUpper === 'REJECTED' || statusUpper === 'RESET / RETURNED');
    return matchesSearch;
  });

  const countPending = submissionsList.filter((s) => s.status.toUpperCase() === 'PENDING').length;
  const countReviewing = submissionsList.filter((s) => s.status.toUpperCase() === 'REVIEWING').length;
  const countApproved = submissionsList.filter((s) => s.status.toUpperCase() === 'APPROVED').length;
  const countRejected = submissionsList.filter(
    (s) => s.status.toUpperCase() === 'REJECTED' || s.status.toUpperCase() === 'RESET / RETURNED'
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
    handleResetScoreSheet,
  };
};
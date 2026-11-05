import { useState, useEffect, useCallback } from 'react';
import supabaseClient from '../../config/supabaseClient';

export const useGradebookLogic = () => {
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  
  // Selection & Curriculum Subjects
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  
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

  const [searchQuery, setSearchQuery] = useState('');
  const [currentTerm, setCurrentTerm] = useState('Term 1');
  const [academicSession, setAcademicSession] = useState('2025/2026');
  const [educatorClass, setEducatorClass] = useState('Grade 6');

  // Approval Status Tracking
  const [approvalStatus, setApprovalStatus] = useState('Loading...');
  const [isApprovedOrSubmitted, setIsApprovedOrSubmitted] = useState(false);

  // Modals & Toast State
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // Fetch Active Academic Session, Term, Pupils, Existing Grades, & Approval Status
  const fetchGradebookData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      let className = 'Grade 6';

      if (user) {
        const { data: prof } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (prof?.grade) className = prof.grade;
      }
      setEducatorClass(className);

      // Fetch active academic session and term from backend `academic_sessions` table[cite: 14]
// Fetch active academic session and term from backend `academic_sessions` table
      const { data: activeSessionRecord, error: sessionErr } = await supabaseClient
        .from('academic_sessions')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      let activeTerm = 'Term 1';
      let activeSessionName = '2025/2026';

      if (!sessionErr && activeSessionRecord) {
        if (activeSessionRecord.term_name) activeTerm = activeSessionRecord.term_name;
        if (activeSessionRecord.session_name) activeSessionName = activeSessionRecord.session_name;
      }

      setCurrentTerm(activeTerm);
      setAcademicSession(activeSessionName);
      setApprovalStatus(`Inputting ${activeTerm}`);

      // Fetch Approval Status for this Subject & Class
      const { data: approvalRecord } = await supabaseClient
        .from('academic_approvals')
        .select('*')
        .eq('class_name', className)
        .eq('subject', selectedSubject.toUpperCase())
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (approvalRecord) {
        if (approvalRecord.status === 'APPROVED') {
          setApprovalStatus('Approved');
          setIsApprovedOrSubmitted(true);
        } else if (approvalRecord.status === 'PENDING') {
          setApprovalStatus('Submitted for Approval');
          setIsApprovedOrSubmitted(true);
        } else {
          setApprovalStatus(`Inputting ${activeTerm}`);
          setIsApprovedOrSubmitted(false);
        }
      }

      // Fetch all pupils assigned to this educator's class along with backend avatar_url
      const { data: pupils, error: pupilErr } = await supabaseClient
        .from('profiles')
        .select('id, full_name, avatar_url, grade')
        .eq('role', 'pupil')
        .ilike('grade', `%${className}%`)
        .order('full_name', { ascending: true });

      if (pupilErr) throw pupilErr;

      // Fetch existing grade entries for this subject, term, and session
      const { data: existingGrades, error: gradesErr } = await supabaseClient
        .from('student_grades')
        .select('*')
        .eq('subject', selectedSubject.toUpperCase())
        .eq('term', activeTerm)
        .eq('academic_session', activeSessionName);

      if (gradesErr) throw gradesErr;

      const gradeMap = new Map();
      if (existingGrades) {
        existingGrades.forEach(g => gradeMap.set(g.pupil_id, g));
      }

      // Combine pupils with existing grade data
      const combined = (pupils || []).map((pupil, index) => {
        const existing = gradeMap.get(pupil.id);
        const ca = existing?.ca_score !== undefined && existing?.ca_score !== null ? existing.ca_score : '';
        const exam = existing?.exam_score !== undefined && existing?.exam_score !== null ? existing.exam_score : '';
        const remarks = existing?.remarks || '';

        return {
          id: pupil.id,
          gradeRecordId: existing?.id || null,
          name: pupil.full_name,
          rollNo: `G6-${String(index + 1).padStart(3, '0')}`,
          avatarUrl: pupil.avatar_url || null,
          caScore: ca,
          examScore: exam,
          remarks: remarks,
          isFinalized: existing?.is_finalized || false
        };
      });

      setGrades(combined);
    } catch (err) {
      console.error('Error loading gradebook:', err.message);
      triggerToast(`Failed to load gradebook: ${err.message}`);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, [selectedSubject]);

  useEffect(() => {
    fetchGradebookData(false);
  }, [fetchGradebookData]);

  // Score handlers
  const handleScoreChange = (id, field, value) => {
    if (isApprovedOrSubmitted) return;
    const numValue = value === '' ? '' : Math.max(0, Math.min(field === 'caScore' ? 30 : 70, Number(value)));
    setGrades(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: numValue } : item))
    );
  };

  const handleRemarksChange = (id, newRemarks) => {
    if (isApprovedOrSubmitted) return;
    setGrades(prev =>
      prev.map(item => (item.id === id ? { ...item, remarks: newRemarks } : item))
    );
  };

  // Dynamic Grade Calculations
  const calculatedGrades = grades.map(item => {
    const ca = Number(item.caScore) || 0;
    const exam = Number(item.examScore) || 0;
    const total = ca + exam;

    let letterGrade = 'F';
    if (total >= 75) letterGrade = 'A';
    else if (total >= 65) letterGrade = 'B';
    else if (total >= 50) letterGrade = 'C';
    else if (total >= 40) letterGrade = 'D';

    return { ...item, total, letterGrade };
  });

  const filteredGrades = calculatedGrades.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const overallTotalSum = calculatedGrades.reduce((acc, curr) => acc + curr.total, 0);
  const subjectAverage = calculatedGrades.length > 0 ? Math.round(overallTotalSum / calculatedGrades.length) : 0;

  const topPerformer = calculatedGrades.length > 0
    ? calculatedGrades.reduce((prev, current) => (prev.total > current.total ? prev : current), calculatedGrades[0])
    : null;

  // Save Draft to `student_grades`
  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const recordsToUpsert = calculatedGrades.map(g => ({
        ...(g.gradeRecordId ? { id: g.gradeRecordId } : {}),
        pupil_id: g.id,
        subject: selectedSubject.toUpperCase(),
        term: currentTerm,
        academic_session: academicSession,
        ca_score: g.caScore === '' ? null : Number(g.caScore),
        exam_score: g.examScore === '' ? null : Number(g.examScore),
        total_score: g.total,
        letter_grade: g.letterGrade,
        remarks: g.remarks,
        is_finalized: false
      }));

      const { error } = await supabaseClient
        .from('student_grades')
        .upsert(recordsToUpsert, { onConflict: 'pupil_id, subject, term, academic_session' });

      if (error) throw error;

      setShowDraftModal(true);
      await fetchGradebookData(true);
    } catch (err) {
      console.error('Error saving draft:', err.message);
      triggerToast(`Error saving draft: ${err.message}`);
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Finalize & Submit to `academic_approvals`
  const handleFinalizeGrades = async () => {
    setIsFinalizing(true);
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();

      const recordsToUpsert = calculatedGrades.map(g => ({
        ...(g.gradeRecordId ? { id: g.gradeRecordId } : {}),
        pupil_id: g.id,
        subject: selectedSubject.toUpperCase(),
        term: currentTerm,
        academic_session: academicSession,
        ca_score: g.caScore === '' ? 0 : Number(g.caScore),
        exam_score: g.examScore === '' ? 0 : Number(g.examScore),
        total_score: g.total,
        letter_grade: g.letterGrade,
        remarks: g.remarks,
        is_finalized: true
      }));

      const { error: gradesError } = await supabaseClient
        .from('student_grades')
        .upsert(recordsToUpsert, { onConflict: 'pupil_id, subject, term, academic_session' });

      if (gradesError) throw gradesError;

      const approvalPayload = {
        educator_id: user?.id || null,
        class_name: educatorClass,
        subject: selectedSubject.toUpperCase(),
        status: 'PENDING',
        submitted_at: new Date().toISOString()
      };

      const { error: approvalError } = await supabaseClient
        .from('academic_approvals')
        .upsert([approvalPayload], { onConflict: 'class_name, subject' });

      if (approvalError) throw approvalError;

      setShowFinalizeModal(true);
      await fetchGradebookData(true);
    } catch (err) {
      console.error('Error finalizing grades:', err.message);
      triggerToast(`Error finalizing grades: ${err.message}`);
    } finally {
      setIsFinalizing(false);
    }
  };

  // CSV Exporter
  const handleExportCSV = () => {
    const headers = ['Pupil Name', 'Roll No', 'C.A (30)', 'Exam (70)', 'Total (100)', 'Grade', 'Remarks'];
    const rows = calculatedGrades.map(g => [
      `"${g.name}"`,
      `"${g.rollNo}"`,
      g.caScore,
      g.examScore,
      g.total,
      g.letterGrade,
      `"${g.remarks}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedSubject}_Gradebook_${educatorClass}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportModal(true);
  };

  return {
    selectedSubject,
    setSelectedSubject,
    showSubjectDropdown,
    setShowSubjectDropdown,
    curriculumSubjects,
    grades,
    filteredGrades,
    isLoading,
    isSavingDraft,
    isFinalizing,
    searchQuery,
    setSearchQuery,
    subjectAverage,
    topPerformer,
    approvalStatus,
    isApprovedOrSubmitted,
    currentTerm,
    academicSession,
    showDraftModal,
    setShowDraftModal,
    showExportModal,
    setShowExportModal,
    showFinalizeModal,
    setShowFinalizeModal,
    showToast,
    toastMessage,
    handleScoreChange,
    handleRemarksChange,
    handleSaveDraft,
    handleFinalizeGrades,
    handleExportCSV
  };
};
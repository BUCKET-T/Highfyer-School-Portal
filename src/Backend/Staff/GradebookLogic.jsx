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
    'Numeracy', 'Literacy', 'Rhymes', 'General Paper', 'CRS',
    'Mathematics', 'English language', 'Basic science', 'Social studies',
    'History', 'Yoruba', 'Creative & Cultural Arts', 'Vocational Studies',
    'Security Education', 'Quantitative Reasoning', 'Verbal Reasoning',
    'Physical Health Education'
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [currentTerm, setCurrentTerm] = useState('Term 1');
  const [academicSession, setAcademicSession] = useState('2025/2026');
  const [educatorClass, setEducatorClass] = useState('Grade 6');

  // Control Flags from Academic Sessions Table
  const [isScoreEntryOpen, setIsScoreEntryOpen] = useState(true);

  // Approval Status Tracking
  const [approvalStatus, setApprovalStatus] = useState('Inputting Term 1');
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

      // Fetch active academic session and term settings
      const { data: activeSessionRecord, error: sessionErr } = await supabaseClient
        .from('academic_sessions')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      let activeTerm = 'Term 1';
      let activeSessionName = '2025/2026';
      let scoreOpen = true;

      if (!sessionErr && activeSessionRecord) {
        if (activeSessionRecord.term_name) activeTerm = activeSessionRecord.term_name;
        if (activeSessionRecord.session_name) activeSessionName = activeSessionRecord.session_name;
        if (activeSessionRecord.score_entry_open !== undefined) scoreOpen = activeSessionRecord.score_entry_open;
        
        // Check date deadline if set
        if (activeSessionRecord.score_entry_deadline) {
          const deadlinePassed = new Date() > new Date(activeSessionRecord.score_entry_deadline);
          if (deadlinePassed) scoreOpen = false;
        }
      }

      setCurrentTerm(activeTerm);
      setAcademicSession(activeSessionName);
      setIsScoreEntryOpen(scoreOpen);
      setApprovalStatus(scoreOpen ? `Inputting ${activeTerm}` : 'Score Entry Closed');

      // If score entry is turned off by admin, clear grades to trigger UI empty state
      if (!scoreOpen) {
        setGrades([]);
        setIsLoading(false);
        return;
      }

      // Fetch Approval Status
      const { data: approvalRecord } = await supabaseClient
        .from('academic_approvals')
        .select('*')
        .eq('class_name', className)
        .eq('subject', selectedSubject.toUpperCase())
        .eq('term', activeTerm)
        .eq('academic_session', activeSessionName)
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
        }
      }

      // Fetch Pupils
      const { data: pupils, error: pupilErr } = await supabaseClient
        .from('profiles')
        .select('id, full_name, avatar_url, grade')
        .eq('role', 'pupil')
        .ilike('grade', `%${className}%`)
        .order('full_name', { ascending: true });

      if (pupilErr) throw pupilErr;

      // Fetch Grades
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

      const combined = (pupils || []).map((pupil, index) => {
        const existing = gradeMap.get(pupil.id);
        return {
          id: pupil.id,
          gradeRecordId: existing?.id || null,
          name: pupil.full_name,
          rollNo: `G6-${String(index + 1).padStart(3, '0')}`,
          avatarUrl: pupil.avatar_url || null,
          caScore: existing?.ca_score ?? '',
          examScore: existing?.exam_score ?? '',
          remarks: existing?.remarks || '',
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

  const handleScoreChange = (id, field, value) => {
    if (!isScoreEntryOpen || isApprovedOrSubmitted) return;
    const numValue = value === '' ? '' : Math.max(0, Math.min(field === 'caScore' ? 30 : 70, Number(value)));
    setGrades(prev => prev.map(item => (item.id === id ? { ...item, [field]: numValue } : item)));
  };

  const handleRemarksChange = (id, newRemarks) => {
    if (!isScoreEntryOpen || isApprovedOrSubmitted) return;
    setGrades(prev => prev.map(item => (item.id === id ? { ...item, remarks: newRemarks } : item)));
  };

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

  const handleSaveDraft = async () => {
    if (!isScoreEntryOpen) {
      triggerToast('Score entry window is closed by administration.');
      return;
    }
    setIsSavingDraft(true);
    try {
      for (const g of calculatedGrades) {
        const payload = {
          pupil_id: g.id,
          subject: selectedSubject.toUpperCase(),
          term: currentTerm,
          academic_session: academicSession,
          ca_score: g.caScore === '' ? null : Number(g.caScore),
          exam_score: g.examScore === '' ? null : Number(g.examScore),
          remarks: g.remarks,
          is_finalized: false
        };

        if (g.gradeRecordId) {
          const { error } = await supabaseClient.from('student_grades').update(payload).eq('id', g.gradeRecordId);
          if (error) throw error;
        } else {
          const { data, error } = await supabaseClient.from('student_grades').insert([payload]).select();
          if (error) throw error;
          if (data && data[0]) g.gradeRecordId = data[0].id;
        }
      }
      setShowDraftModal(true);
      await fetchGradebookData(true);
    } catch (err) {
      triggerToast(`Error saving draft: ${err.message}`);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleFinalizeGrades = async () => {
    if (!isScoreEntryOpen) {
      triggerToast('Score entry window is closed by administration.');
      return;
    }
    setIsFinalizing(true);
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();

      for (const g of calculatedGrades) {
        const payload = {
          pupil_id: g.id,
          subject: selectedSubject.toUpperCase(),
          term: currentTerm,
          academic_session: academicSession,
          ca_score: g.caScore === '' ? 0 : Number(g.caScore),
          exam_score: g.examScore === '' ? 0 : Number(g.examScore),
          remarks: g.remarks,
          is_finalized: true
        };

        if (g.gradeRecordId) {
          const { error } = await supabaseClient.from('student_grades').update(payload).eq('id', g.gradeRecordId);
          if (error) throw error;
        } else {
          const { data, error } = await supabaseClient.from('student_grades').insert([payload]).select();
          if (error) throw error;
          if (data && data[0]) g.gradeRecordId = data[0].id;
        }
      }

      const approvalPayload = {
        educator_id: user?.id || null,
        class_name: educatorClass,
        subject: selectedSubject.toUpperCase(),
        status: 'PENDING',
        term: currentTerm,
        academic_session: academicSession,
        submitted_at: new Date().toISOString()
      };

      const { error: approvalError } = await supabaseClient.from('academic_approvals').insert([approvalPayload]);
      if (approvalError) throw new Error(`Approval Error: ${approvalError.message}`);

      setShowFinalizeModal(true);
      await fetchGradebookData(true);
    } catch (err) {
      triggerToast(err.message);
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Pupil Name', 'Roll No', 'C.A (30)', 'Exam (70)', 'Total (100)', 'Grade', 'Remarks'];
    const rows = calculatedGrades.map(g => [
      `"${g.name}"`, `"${g.rollNo}"`, g.caScore, g.examScore, g.total, g.letterGrade, `"${g.remarks}"`
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
    selectedSubject, setSelectedSubject,
    showSubjectDropdown, setShowSubjectDropdown,
    curriculumSubjects, grades, filteredGrades,
    isLoading, isSavingDraft, isFinalizing,
    searchQuery, setSearchQuery,
    subjectAverage, topPerformer,
    approvalStatus, isApprovedOrSubmitted,
    currentTerm, academicSession, isScoreEntryOpen,
    showDraftModal, setShowDraftModal,
    showExportModal, setShowExportModal,
    showFinalizeModal, setShowFinalizeModal,
    showToast, toastMessage,
    handleScoreChange, handleRemarksChange,
    handleSaveDraft, handleFinalizeGrades, handleExportCSV
  };
};
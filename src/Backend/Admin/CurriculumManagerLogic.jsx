import { useState, useEffect } from 'react';
import  supabaseClient  from '../../config/supabaseClient';

export const useCurriculumManagerLogic = () => {
  const [selectedGrade, setSelectedGrade] = useState('Grade 1');
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');

  // 12-Week Topics State (Week 1 to Week 12)
  const [weeklyTopics, setWeeklyTopics] = useState(
    Array.from({ length: 12 }, (_, i) => ({ week: i + 1, title: '', description: '' }))
  );

  const [learningObjectives, setLearningObjectives] = useState([]);
  const [newObjective, setNewObjective] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
  const [isTermDropdownOpen, setIsTermDropdownOpen] = useState(false);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);

  const gradeOptions = [
    'Pre School', 'KG 1', 'KG 2', 'Nursery 1', 'Nursery 2', 
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'
  ];

  const termOptions = ['Term 1', 'Term 2', 'Term 3'];

  const subjectOptions = [
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
    'Physical Health Education',
    'Civic Education',
    'Religious and national Value'
  ];

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  // Fetch curriculum record from Supabase
  useEffect(() => {
    const fetchCurriculum = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabaseClient
          .from('class_curricula')
          .select('*')
          .eq('grade', selectedGrade)
          .eq('term_name', selectedTerm)
          .eq('subject_name', selectedSubject)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          if (data.weekly_topics && typeof data.weekly_topics === 'object') {
            const loadedWeeks = Array.from({ length: 12 }, (_, i) => {
              const wkKey = `week_${i + 1}`;
              return {
                week: i + 1,
                title: data.weekly_topics[wkKey]?.title || '',
                description: data.weekly_topics[wkKey]?.description || '',
              };
            });
            setWeeklyTopics(loadedWeeks);
          } else {
            setWeeklyTopics(Array.from({ length: 12 }, (_, i) => ({ week: i + 1, title: '', description: '' })));
          }

          setLearningObjectives(data.learning_objectives || []);
          setPdfFileName(data.syllabus_pdf_url || '');
        } else {
          setWeeklyTopics(Array.from({ length: 12 }, (_, i) => ({ week: i + 1, title: '', description: '' })));
          setLearningObjectives([]);
          setPdfFileName('');
        }
      } catch (err) {
        console.error('Error fetching curriculum:', err.message);
        showToast('Failed to fetch curriculum from Supabase.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurriculum();
  }, [selectedGrade, selectedTerm, selectedSubject]);

  const handleWeekChange = (weekNumber, field, value) => {
    setWeeklyTopics((prev) =>
      prev.map((wk) => (wk.week === weekNumber ? { ...wk, [field]: value } : wk))
    );
  };

  const handleAddObjective = (e) => {
    e.preventDefault();
    if (!newObjective.trim()) return;
    setLearningObjectives([...learningObjectives, newObjective.trim()]);
    setNewObjective('');
  };

  const handleRemoveObjective = (indexToRemove) => {
    setLearningObjectives(learningObjectives.filter((_, idx) => idx !== indexToRemove));
  };

  // Save Curriculum to Supabase
  const handleSaveCurriculum = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const weeklyTopicsPayload = {};
      weeklyTopics.forEach((wk) => {
        weeklyTopicsPayload[`week_${wk.week}`] = {
          title: wk.title,
          description: wk.description,
        };
      });

      const payload = {
        grade: selectedGrade,
        term_name: selectedTerm,
        subject_name: selectedSubject,
        weekly_topics: weeklyTopicsPayload,
        learning_objectives: learningObjectives,
        syllabus_pdf_url: pdfFileName,
        updated_at: new Date(),
      };

      const { error } = await supabaseClient
        .from('class_curricula')
        .upsert(payload, { onConflict: 'grade,term_name,subject_name' });

      if (error) throw error;

      showToast('Curriculum successfully saved to database!');
    } catch (err) {
      console.error('Error saving curriculum:', err.message);
      showToast(err.message || 'Error saving curriculum records.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return {
    selectedGrade, setSelectedGrade,
    selectedTerm, setSelectedTerm,
    selectedSubject, setSelectedSubject,
    weeklyTopics, handleWeekChange,
    learningObjectives, newObjective, setNewObjective,
    handleAddObjective, handleRemoveObjective,
    pdfFileName, setPdfFileName,
    saving, isLoading, toast,
    isGradeDropdownOpen, setIsGradeDropdownOpen,
    isTermDropdownOpen, setIsTermDropdownOpen,
    isSubjectDropdownOpen, setIsSubjectDropdownOpen,
    gradeOptions, termOptions, subjectOptions,
    handleSaveCurriculum,
  };
};
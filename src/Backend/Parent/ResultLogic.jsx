import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabaseClient from '../../config/supabaseClient';

export const useResultLogic = () => {
  const navigate = useNavigate();
  const [wards, setWards] = useState([]);
  const [currentWard, setCurrentWard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [termOptions, setTermOptions] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null); // { session_name, term_name }
  const [termGrades, setTermGrades] = useState([]);
  const [classPositionText, setClassPositionText] = useState('Calculating...');
  const [classSize, setClassSize] = useState(0);

  // Synchronize active ward with localStorage shared across dashboard tabs
  useEffect(() => {
    const fetchSessionWards = async () => {
      try {
        const storedChildren = localStorage.getItem('parent_children');
        const storedSelectedId = localStorage.getItem('selected_parent_child');

        const { data: authData } = await supabaseClient.auth.getUser();
        const userEmail = authData?.user?.email;

        if (userEmail) {
          const { data: linkedWards, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('email', userEmail)
            .eq('role', 'pupil');

          if (!error && linkedWards && linkedWards.length > 0) {
            setWards(linkedWards);
            localStorage.setItem('parent_children', JSON.stringify(linkedWards));

            const active = linkedWards.find((w) => w.id === storedSelectedId) || linkedWards[0];
            setCurrentWard(active);
            localStorage.setItem('selected_parent_child', active.id);
          } else if (storedChildren) {
            const parsedChildren = JSON.parse(storedChildren);
            setWards(parsedChildren);
            if (parsedChildren.length > 0) {
              const active = parsedChildren.find((w) => w.id === storedSelectedId) || parsedChildren[0];
              setCurrentWard(active);
            }
          } else {
            navigate('/parent/login');
          }
        } else {
          navigate('/parent/login');
        }
      } catch (err) {
        console.error('Error loading session:', err);
        navigate('/parent/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionWards();
  }, [navigate]);

  // Fetch academic sessions from Supabase
  useEffect(() => {
    const fetchAcademicSessions = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('academic_sessions')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const options = data.map((sess) => ({
            id: sess.id,
            session_name: sess.session_name,
            term_name: sess.term_name,
            is_active: sess.is_active,
            label: `${sess.term_name}, ${sess.session_name} Academic Session`,
          }));

          setTermOptions(options);

          // Default to active session, or the first one in the list
          const activeSess = options.find((o) => o.is_active) || options[0];
          setSelectedTerm(activeSess);
        } else {
          // Fallback if table is empty
          const fallback = {
            id: 'default-1',
            session_name: '2027/2028',
            term_name: 'Term 3',
            label: 'Term 3, 2027/2028 Academic Session',
          };
          setTermOptions([fallback]);
          setSelectedTerm(fallback);
        }
      } catch (err) {
        console.error('Error fetching academic sessions:', err);
      }
    };

    fetchAcademicSessions();
  }, []);

  // Fetch student grades and calculate dynamic class ranking position based on selected session/term
  useEffect(() => {
    const fetchData = async () => {
      if (!currentWard || !selectedTerm) return;
      setIsDataLoading(true);

      try {
        const cleanGrade = currentWard.grade ? String(currentWard.grade).trim() : '';

        // 1. Fetch all pupils in the same grade/class
        const { data: classmates, error: classError } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('role', 'pupil');

        const matchedClassmates = !classError && classmates 
          ? classmates.filter(p => p.grade && p.grade.trim().toLowerCase() === cleanGrade.toLowerCase())
          : [currentWard];

        const totalClassmates = matchedClassmates.length > 0 ? matchedClassmates.length : 1;
        setClassSize(totalClassmates);

        // 2. Fetch all student grades
        const { data: allGrades, error: gradesError } = await supabaseClient
          .from('student_grades')
          .select('*');

        if (!gradesError && allGrades) {
          // Filter by term and academic session
          const termFilteredGrades = allGrades.filter((item) => {
            const itemTerm = (item.term || '').trim().toLowerCase();
            const targetTerm = (selectedTerm.term_name || '').trim().toLowerCase();
            const itemSession = (item.academic_session || '').trim();
            const targetSession = (selectedTerm.session_name || '').trim();

            const matchesTerm = itemTerm.includes(targetTerm) || targetTerm.includes(itemTerm);
            const matchesSession = !itemSession || itemSession === targetSession;

            return matchesTerm && matchesSession;
          });

          // Compute average score per pupil for this session/term
          const pupilAverages = {};
          termFilteredGrades.forEach((row) => {
            const pId = row.pupil_id;
            const ca = Number(row.ca_score) || 0;
            const exam = Number(row.exam_score) || 0;
            const total = Number(row.total_score) || (ca + exam);

            if (!pupilAverages[pId]) {
              pupilAverages[pId] = { totalScore: 0, count: 0 };
            }
            pupilAverages[pId].totalScore += total;
            pupilAverages[pId].count += 1;
          });

          const pupilAvgMap = {};
          Object.keys(pupilAverages).forEach((pId) => {
            pupilAvgMap[pId] = pupilAverages[pId].totalScore / pupilAverages[pId].count;
          });

          const rankedPupils = matchedClassmates.map((p) => ({
            id: p.id,
            avg: pupilAvgMap[p.id] || 0,
          })).sort((a, b) => b.avg - a.avg);

          const wardRankIndex = rankedPupils.findIndex((p) => p.id === currentWard.id);
          const calculatedPosition = wardRankIndex !== -1 ? wardRankIndex + 1 : 1;

          const getOrdinalSuffix = (n) => {
            const s = ['th', 'st', 'nd', 'rd'];
            const v = n % 100;
            return n + (s[(v - 20) % 10] || s[v] || 'th');
          };

          const wardGrades = termFilteredGrades.filter((item) => item.pupil_id === currentWard.id);

          if (wardGrades.length > 0) {
            setClassPositionText(`${getOrdinalSuffix(calculatedPosition)} out of ${totalClassmates} Pupils`);
          } else {
            setClassPositionText('No Records Yet');
          }

          const colors = ['#0EA5E9', '#10B981', '#A855F7', '#F59E0B', '#EC4899', '#6366F1'];

          const formattedSubjects = wardGrades.map((gradeRow, idx) => {
            const ca = Number(gradeRow.ca_score) || 0;
            const exam = Number(gradeRow.exam_score) || 0;
            const total = Number(gradeRow.total_score) || (ca + exam);
            const subName = gradeRow.subject || 'Subject';

            return {
              id: gradeRow.id || `sub-${idx}`,
              name: subName,
              fullName: subName,
              caScore: ca,
              examScore: exam,
              cumulative: total,
              grade: gradeRow.letter_grade || (total >= 70 ? 'A' : total >= 60 ? 'B' : 'C'),
              remark: gradeRow.remarks && gradeRow.remarks !== 'EMPTY' ? gradeRow.remarks : (total >= 70 ? 'Excellent' : 'Very Good'),
              fill: colors[idx % colors.length],
            };
          });

          setTermGrades(formattedSubjects);
        } else {
          setTermGrades([]);
          setClassPositionText('No Records Yet');
        }
      } catch (err) {
        console.error('Error fetching result data:', err);
        setTermGrades([]);
        setClassPositionText('No Records Yet');
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, [currentWard, selectedTerm]);

  const totalCumulativeSum = termGrades.reduce((acc, curr) => acc + curr.cumulative, 0);
  const cumulativeAverage = termGrades.length > 0 ? (totalCumulativeSum / termGrades.length).toFixed(1) + '%' : '0.0%';

  return {
    wards,
    currentWard,
    isLoading,
    isDataLoading,
    termOptions,
    selectedTerm,
    setSelectedTerm,
    termGrades,
    classSize,
    classPositionText,
    cumulativeAverage,
  };
};
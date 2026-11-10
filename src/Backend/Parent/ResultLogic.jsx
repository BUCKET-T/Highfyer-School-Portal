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
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [termGrades, setTermGrades] = useState([]);
  const [classPositionText, setClassPositionText] = useState('Calculating...');
  const [classSize, setClassSize] = useState(0);
  const [classEducator, setClassEducator] = useState({ name: 'School Educator', initials: 'SE', avatar_url: null });

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

  // Fetch academic sessions from Supabase and default to the latest created / active session
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
            parent_portal_open: sess.parent_portal_open !== undefined ? Boolean(sess.parent_portal_open) : true,
            label: `${sess.term_name}, ${sess.session_name} Academic Session`,
            created_at: sess.created_at,
          }));

          setTermOptions(options);

          // Default strictly to the latest created session
          const latestSess = options[0];
          setSelectedTerm(latestSess);
        } else {
          const fallback = {
            id: 'default-1',
            session_name: '2027/2028',
            term_name: 'Term 1',
            is_active: true,
            parent_portal_open: true,
            label: 'Term 1, 2027/2028 Academic Session',
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

  // Fetch student grades, class rankings, and accurately matched class educator
  useEffect(() => {
    const fetchData = async () => {
      if (!currentWard || !selectedTerm) return;
      setIsDataLoading(true);

      try {
        const cleanWardGrade = currentWard.grade ? String(currentWard.grade).trim().toLowerCase() : '';
        const wardGradeNum = cleanWardGrade.replace(/[^0-9]/g, '');

        // 1. Fetch class educators and match precisely against assigned_classes or role_title
        const { data: educators, error: edError } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('role', 'educator');

        if (!edError && educators && educators.length > 0) {
          const matchedEd = educators.find((ed) => {
            const assigned = ed.assigned_classes ? String(ed.assigned_classes).toLowerCase() : '';
            const roleTitle = ed.role_title ? String(ed.role_title).toLowerCase() : '';
            
            return (
              assigned.includes(cleanWardGrade) ||
              roleTitle.includes(cleanWardGrade) ||
              (wardGradeNum && (assigned.includes(wardGradeNum) || roleTitle.includes(wardGradeNum))) ||
              (cleanWardGrade.includes('pre') && (assigned.includes('pre') || roleTitle.includes('pre')))
            );
          });

          if (matchedEd && matchedEd.full_name) {
            const name = matchedEd.full_name;
            const parts = name.split(' ');
            const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2).toUpperCase();
            setClassEducator({ 
              name, 
              initials, 
              avatar_url: matchedEd.avatar_url || null 
            });
          } else {
            setClassEducator({ 
              name: 'School Educator', 
              initials: 'SE', 
              avatar_url: null 
            });
          }
        }

        // Check if portal is locked by admin
        const isPortalOpen = selectedTerm.parent_portal_open !== false;
        if (!isPortalOpen) {
          setTermGrades([]);
          setClassPositionText('Restricted');
          setIsDataLoading(false);
          return;
        }

        // 2. Fetch all pupils in the same grade/class
        const { data: classmates, error: classError } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('role', 'pupil');

        const matchedClassmates = !classError && classmates 
          ? classmates.filter(p => {
              const pGrade = p.grade ? String(p.grade).trim().toLowerCase() : '';
              return pGrade === cleanWardGrade;
            })
          : [currentWard];

        const totalClassmates = matchedClassmates.length > 0 ? matchedClassmates.length : 1;
        setClassSize(totalClassmates);

        // 3. Fetch all student grades
        const { data: allGrades, error: gradesError } = await supabaseClient
          .from('student_grades')
          .select('*');

        if (!gradesError && allGrades) {
          const termFilteredGrades = allGrades.filter((item) => {
            const itemTerm = (item.term || '').trim().toLowerCase();
            const targetTerm = (selectedTerm.term_name || '').trim().toLowerCase();
            const itemSession = (item.academic_session || '').trim();
            const targetSession = (selectedTerm.session_name || '').trim();

            const matchesTerm = itemTerm.includes(targetTerm) || targetTerm.includes(itemTerm);
            const matchesSession = !itemSession || itemSession === targetSession;

            return matchesTerm && matchesSession;
          });

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
    classEducator,
  };
};
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabaseClient from '../../config/supabaseClient';

export const useMyCourseLogic = () => {
  const navigate = useNavigate();
  const [wards, setWards] = useState([]);
  const [currentWard, setCurrentWard] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [courses, setCourses] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [expandedCourseId, setExpandedCourseId] = useState(null);

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

  // Fetch all curricula and match flexibly
  useEffect(() => {
    const fetchCurricula = async () => {
      if (!currentWard) return;
      setIsDataLoading(true);

      try {
        const rawGrade = currentWard.grade ? String(currentWard.grade).trim() : '';
        // Extract number if grade is like "Grade 2" or "2"
        const gradeNumber = rawGrade.replace(/[^0-9]/g, '');
        
        console.log('Active Ward Grade:', rawGrade, '| Extracted Number:', gradeNumber, '| Term:', selectedTerm);

        // Fetch all curricula rows to perform reliable client-side matching
        const { data, error } = await supabaseClient
          .from('class_curricula')
          .select('*');

        console.log('All Curricula from DB:', data, 'Error:', error);

        if (!error && data) {
          const matchedCourses = data.filter((item) => {
            const itemGrade = item.grade ? String(item.grade).trim().toLowerCase() : '';
            const itemTerm = item.term_name ? String(item.term_name).trim().toLowerCase() : '';
            
            const targetGradeLower = rawGrade.toLowerCase();
            const targetTermLower = selectedTerm.trim().toLowerCase();

            // Match grade either by exact substring/equality or number match
            const matchesGrade = 
              itemGrade.includes(targetGradeLower) || 
              targetGradeLower.includes(itemGrade) ||
              (gradeNumber && itemGrade.includes(gradeNumber));

            const matchesTerm = itemTerm === targetTermLower;

            return matchesGrade && matchesTerm;
          });

          console.log('Filtered Courses to Render:', matchedCourses);
          setCourses(matchedCourses);
          if (matchedCourses.length > 0) {
            setExpandedCourseId(matchedCourses[0].id);
          } else {
            setExpandedCourseId(null);
          }
        } else {
          setCourses([]);
          setExpandedCourseId(null);
        }
      } catch (err) {
        console.error('Error fetching class curricula:', err);
        setCourses([]);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchCurricula();
  }, [currentWard, selectedTerm]);

  const handleSelectWard = (wardId) => {
    const selected = wards.find((w) => w.id === wardId);
    if (selected) {
      setCurrentWard(selected);
      localStorage.setItem('selected_parent_child', selected.id);
    }
    setIsDropdownOpen(false);
  };

  const toggleCourse = (id) => {
    setExpandedCourseId(expandedCourseId === id ? null : id);
  };

  const getInitials = (name) => {
    if (!name) return 'P';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const filteredCourses = courses.filter(
    (course) =>
      !searchQuery ||
      (course.subject_name && course.subject_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.grade && course.grade.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return {
    wards,
    currentWard,
    isDropdownOpen,
    setIsDropdownOpen,
    isLoading,
    isDataLoading,
    courses: filteredCourses,
    selectedTerm,
    setSelectedTerm,
    searchQuery,
    setSearchQuery,
    expandedCourseId,
    toggleCourse,
    handleSelectWard,
    getInitials,
  };
};
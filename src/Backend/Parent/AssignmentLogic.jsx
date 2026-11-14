import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabaseClient from '../../config/supabaseClient';

export const useAssignmentLogic = () => {
  const navigate = useNavigate();
  const [wards, setWards] = useState([]);
  const [currentWard, setCurrentWard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [selectedTaskForSubmission, setSelectedTaskForSubmission] = useState(null);
  const [submissionNote, setSubmissionNote] = useState('');

  // Helper to check if a due date has passed
  const isPastDue = (dueDateStr) => {
    if (!dueDateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

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

  // Fetch assignments filtered by ward grade level from Supabase
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!currentWard) return;
      setIsDataLoading(true);

      try {
        const cleanGrade = currentWard.grade ? String(currentWard.grade).trim() : '';
        const gradeNumber = cleanGrade.replace(/[^0-9]/g, '');

        const { data, error } = await supabaseClient
          .from('assignments')
          .select('*');

        if (!error && data) {
          const matchedAssignments = data.filter((item) => {
            const itemGrade = item.grade_level ? String(item.grade_level).trim().toLowerCase() : '';
            const targetGradeLower = cleanGrade.toLowerCase();

            return (
              itemGrade.includes(targetGradeLower) ||
              targetGradeLower.includes(itemGrade) ||
              (gradeNumber && itemGrade.includes(gradeNumber)) ||
              !itemGrade
            );
          });

          const formattedTasks = matchedAssignments.map((task) => {
            let statusVal = (task.status || 'pending').toLowerCase();
            
            // If it's pending/active but the due date has passed, mark it as overdue/archived
            if (statusVal !== 'completed' && task.due_date && isPastDue(task.due_date)) {
              statusVal = 'overdue';
            }

            const isArchived = statusVal === 'completed' || statusVal === 'overdue' || statusVal === 'archived';

            return {
              id: task.id,
              subject: (task.subject || 'GENERAL').toUpperCase(),
              subjectFull: task.subject || 'General Studies',
              title: task.title || 'Assignment Task',
              description: task.description || 'Complete the assigned workbook exercises.',
              dueDate: task.due_date ? new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Due Soon',
              dueTime: task.due_date ? new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'BY 4:00 PM',
              status: statusVal,
              isArchived,
            };
          });

          setTasks(formattedTasks);
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setTasks([]);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchAssignments();
  }, [currentWard]);

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTaskForSubmission) return;

    try {
      await supabaseClient.from('assignment_submissions').insert([
        {
          assignment_id: selectedTaskForSubmission.id,
          pupil_id: currentWard.id,
          notes: submissionNote,
          status: 'submitted',
        },
      ]);
    } catch (err) {
      console.log('Submission log info:', err);
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTaskForSubmission.id
          ? { ...t, status: 'completed', isArchived: true, dueDate: 'Submitted', dueTime: 'JUST NOW' }
          : t
      )
    );

    setSelectedTaskForSubmission(null);
    setSubmissionNote('');
  };

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const overdueCount = tasks.filter((t) => t.status === 'overdue').length;

  const displayedTasks = tasks.filter((task) =>
    activeTab === 'ACTIVE' ? !task.isArchived : task.isArchived
  );

  return {
    wards,
    currentWard,
    isLoading,
    isDataLoading,
    tasks,
    displayedTasks,
    activeTab,
    setActiveTab,
    pendingCount,
    completedCount,
    overdueCount,
    selectedTaskForSubmission,
    setSelectedTaskForSubmission,
    submissionNote,
    setSubmissionNote,
    handleConfirmSubmit,
  };
};
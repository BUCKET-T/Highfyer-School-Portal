import { useState, useEffect, useCallback } from 'react';
import supabaseClient from '../../config/supabaseClient';

export const useSchoolBroadcastsLogic = () => {
  // Form States
  const [targetAudience, setTargetAudience] = useState('All Staff Members');
  const [category, setCategory] = useState('Urgent Directive');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);

  // Custom Dropdown States
  const [isAudienceDropdownOpen, setIsAudienceDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Loading & Notification States
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  // Broadcast History State
  const [broadcastsList, setBroadcastsList] = useState([]);

const audienceOptions = [
    'All Staff Members',
    'Academic Staff Only',
    'Parent Feed (Portal)'
  ];

  const categoryOptions = [
    'Urgent Directive',
    'Policy Update',
    'School Event',
    'General News'
  ];

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  }, []);

  const fetchBroadcasts = useCallback(async () => {
    setIsLoadingHistory(true);
    
    const timeoutPromise = new Promise((resolve) => 
      setTimeout(() => resolve({ data: [], error: null }), 4000)
    );

    try {
      const fetchPromise = supabaseClient
        .from('school_broadcasts')
        .select('*')
        .order('created_at', { ascending: false });

      const result = await Promise.race([fetchPromise, timeoutPromise]);
      const { data, error } = result;

      if (error) throw error;
      setBroadcastsList(data || []);
    } catch (err) {
      console.error('Error fetching broadcasts:', err.message);
      showToast('Failed to fetch broadcast history.', 'error');
      setBroadcastsList([]);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [showToast]);

  // Fetch Broadcasts History on Mount with useCallback dependency included
  useEffect(() => {
    fetchBroadcasts();
  }, [fetchBroadcasts]);

  // Handle Push Broadcast
  const handlePushBroadcast = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast('Please fill in both the broadcast title and message content.', 'error');
      return;
    }

    setIsPublishing(true);

    try {
      const newBroadcastPayload = {
        title: title.trim(),
        category: category,
        target_audience: targetAudience,
        content: content.trim(),
        attachment_url: attachedFile ? attachedFile.name : null,
        created_at: new Date()
      };

      const { data, error } = await supabaseClient
        .from('school_broadcasts')
        .insert([newBroadcastPayload])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setBroadcastsList([data[0], ...broadcastsList]);
      }

      setTitle('');
      setContent('');
      setAttachedFile(null);
      showToast('Broadcast published successfully and pushed to the feed!');
    } catch (err) {
      console.error('Error publishing broadcast:', err.message);
      showToast(err.message || 'Failed to publish broadcast.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        showToast('File size exceeds the 10MB limit.', 'error');
        return;
      }
      setAttachedFile(file);
    }
  };

  return {
    targetAudience, setTargetAudience,
    category, setCategory,
    title, setTitle,
    content, setContent,
    attachedFile, setAttachedFile,
    isAudienceDropdownOpen, setIsAudienceDropdownOpen,
    isCategoryDropdownOpen, setIsCategoryDropdownOpen,
    audienceOptions, categoryOptions,
    broadcastsList, isPublishing, isLoadingHistory,
    toast, handlePushBroadcast, handleFileChange
  };
};
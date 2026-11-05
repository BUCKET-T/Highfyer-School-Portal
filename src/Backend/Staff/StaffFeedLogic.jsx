import { useState, useEffect, useCallback } from 'react';
import supabaseClient from '../../config/supabaseClient';

export const useStaffFeedLogic = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [acknowledgedPosts, setAcknowledgedPosts] = useState({});

  const upcomingMeetings = [
    {
      title: 'Departmental Sync',
      time: '10:00 AM TODAY',
      location: 'BOARDROOM A',
    },
    {
      title: 'PTA Preparation',
      time: '02:30 PM TOMORROW',
      location: 'LIBRARY',
    },
  ];

  // Fetch broadcasts and join with profiles table using created_by UUID
  const fetchBroadcasts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from('school_broadcasts')
        .select(`
          *,
          profiles:created_by (
            full_name,
            role_title,
            role,
            avatar_url
          )
        `)
        .or('target_audience.ilike.%Staff Members%,target_audience.ilike.%Parent Feed%,target_audience.ilike.%Academic Staff%')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedAnnouncements = data.map((item, index) => {
          const audience = item.target_audience || 'All Staff Members';
          let categoryTag = item.category || 'General News';
          
          let badgeColor = 'bg-sky-100 text-sky-700 border-sky-200';
          if (categoryTag.toLowerCase().includes('urgent')) {
            badgeColor = 'bg-rose-100 text-rose-700 border-rose-200';
          } else if (categoryTag.toLowerCase().includes('policy')) {
            badgeColor = 'bg-amber-100 text-amber-700 border-amber-200';
          } else if (categoryTag.toLowerCase().includes('event')) {
            badgeColor = 'bg-purple-100 text-purple-700 border-purple-200';
          }

          // Use publisher profile details if available, with clean fallbacks
          const authorProfile = item.profiles;
          const authorName = authorProfile?.full_name || 'Admin Office';
          const authorRole = authorProfile?.role_title || authorProfile?.role || audience.toUpperCase();
          const authorAvatar = authorProfile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

          return {
            id: item.id || index,
            author: authorName,
            role: authorRole.toUpperCase(),
            avatar: authorAvatar,
            timeAgo: new Date(item.created_at).toLocaleDateString() === new Date().toLocaleDateString() ? 'TODAY' : 'RECENT',
            badgeText: categoryTag.toUpperCase(),
            badgeColor: badgeColor,
            title: item.title,
            content: item.content,
            acknowledgedCount: 24,
            commentsCount: 3,
            category: categoryTag.toLowerCase().includes('urgent') ? 'urgent' : 'social',
            targetAudience: audience
          };
        });
        setAnnouncements(formattedAnnouncements);
      }
    } catch (err) {
      console.error('Error fetching broadcasts:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBroadcasts();
  }, [fetchBroadcasts]);

  // Filter & Search announcements logic
  const filteredAnnouncements = announcements.filter((item) => {
    const matchesCategory =
      activeFilter === 'ALL' ||
      (activeFilter === 'URGENT' && item.category === 'urgent') ||
      (activeFilter === 'SOCIAL' && item.category === 'social');

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleAcknowledge = (id) => {
    setAcknowledgedPosts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    setAnnouncements(prev => prev.map(item => {
      if (item.id === id) {
        const isAck = acknowledgedPosts[id];
        return {
          ...item,
          acknowledgedCount: isAck ? item.acknowledgedCount - 1 : item.acknowledgedCount + 1
        };
      }
      return item;
    }));
  };

  return {
    announcements,
    upcomingMeetings,
    isLoading,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    acknowledgedPosts,
    filteredAnnouncements,
    handleAcknowledge
  };
};
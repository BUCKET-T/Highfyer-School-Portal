import { useState, useEffect, useMemo } from 'react';
import supabaseClient from '../../config/supabaseClient';

export const useFeedLogic = () => {
  const [rawBroadcasts, setRawBroadcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPostModal, setSelectedPostModal] = useState(null);

  useEffect(() => {
    const fetchBroadcasts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabaseClient
          .from('school_broadcasts')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const parentFeedData = data.filter((item) => {
            const target = (item.target_audience || '').toLowerCase();
            return (
              target.includes('parent') ||
              target.includes('portal') ||
              target.includes('all') ||
              target === ''
            );
          });
          setRawBroadcasts(parentFeedData);
        } else {
          setRawBroadcasts([]);
        }
      } catch (err) {
        console.error('Error fetching school broadcasts:', err);
        setRawBroadcasts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBroadcasts();
  }, []);

  const formattedPosts = useMemo(() => {
    return rawBroadcasts.map((item) => {
      const categoryName = item.category || 'General News';
      const catLower = categoryName.toLowerCase();

      let categoryStyle = 'bg-sky-100 text-sky-700 border-sky-200';
      if (catLower.includes('urgent') || catLower.includes('directive')) {
        categoryStyle = 'bg-red-100 text-red-700 border-red-200';
      } else if (catLower.includes('event')) {
        categoryStyle = 'bg-emerald-100 text-emerald-700 border-emerald-200';
      } else if (catLower.includes('health') || catLower.includes('safety')) {
        categoryStyle = 'bg-purple-100 text-purple-700 border-purple-200';
      } else if (catLower.includes('academic') || catLower.includes('calendar')) {
        categoryStyle = 'bg-amber-100 text-amber-700 border-amber-200';
      }

      let formattedDate = 'RECENT NOTICE';
      if (item.created_at) {
        const parsedDate = new Date(item.created_at);
        if (!isNaN(parsedDate.getTime())) {
          formattedDate = parsedDate.toLocaleDateString('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
          }).toUpperCase();
        }
      }

      const contentText = item.content || '';
      const summaryText = contentText.length > 140 ? `${contentText.slice(0, 140)}...` : contentText;

      return {
        id: item.id,
        title: item.title || 'Untitled Announcement',
        category: categoryName,
        categoryStyle,
        date: formattedDate,
        author: 'School Administration',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        summary: summaryText,
        content: contentText,
        attachmentUrl: item.attachment_url || null,
        isImportant: catLower.includes('urgent') || catLower.includes('directive'),
      };
    });
  }, [rawBroadcasts]);

  const filteredPosts = useMemo(() => {
    return formattedPosts.filter((post) => {
      const matchesCategory = selectedCategory === 'ALL' || post.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [formattedPosts, selectedCategory, searchQuery]);

  return {
    filteredPosts,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedPostModal,
    setSelectedPostModal,
  };
};
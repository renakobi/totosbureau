import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

export interface Comment {
  id: number;
  postId: number;
  user: string;
  avatar: string;
  content: string;
  time: string;
  createdAt: string;
}

export interface CommunityPost {
  id: number;
  user: string;
  avatar: string;
  time: string;
  content: string;
  image?: string | null;
  likes: number;
  comments: number;
  isLiked: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  userId?: string;
  commentList?: Comment[];
}

interface CommunityContextType {
  posts: CommunityPost[];
  pendingPosts: CommunityPost[];
  comments: Comment[];
  addPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'status'>) => void;
  approvePost: (postId: number) => void;
  rejectPost: (postId: number) => void;
  deletePost: (postId: number) => void;
  likePost: (postId: number) => void;
  addComment: (postId: number, content: string) => void;
  getCommentsForPost: (postId: number) => Comment[];
  getCommentCountForPost: (postId: number) => number;
  isLoggedIn: boolean;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

interface CommunityProviderProps {
  children: React.ReactNode;
}

export const CommunityProvider: React.FC<CommunityProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [pendingPosts, setPendingPosts] = useState<CommunityPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const { currentUser } = useUser();

  // Check if user is logged in
  const isLoggedIn = !!currentUser;

  // Load posts from localStorage on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('totos-bureau-community-posts');
    const savedPendingPosts = localStorage.getItem('totos-bureau-pending-posts');
    const savedComments = localStorage.getItem('totos-bureau-community-comments');
    
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (error) {
        console.error('Error loading community posts:', error);
      }
    }
    
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (error) {
        console.error('Error loading community comments:', error);
      }
    }
    
    if (savedPendingPosts) {
      try {
        setPendingPosts(JSON.parse(savedPendingPosts));
      } catch (error) {
        console.error('Error loading pending posts:', error);
      }
    } else {
      // Start with empty community posts - posts will be added by users
      setPosts([]);
    }
  }, []);

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem('totos-bureau-community-posts', JSON.stringify(posts));
  }, [posts]);

  // Save pending posts to localStorage whenever pending posts change
  useEffect(() => {
    localStorage.setItem('totos-bureau-pending-posts', JSON.stringify(pendingPosts));
  }, [pendingPosts]);

  // Save comments to localStorage whenever comments change
  useEffect(() => {
    localStorage.setItem('totos-bureau-community-comments', JSON.stringify(comments));
  }, [comments]);

  const addPost = (postData: Omit<CommunityPost, 'id' | 'createdAt' | 'status'>) => {
    try {
      // Validate required fields
      if (!postData.user || !postData.content) {
        throw new Error('Missing required post fields');
      }

      if (postData.content.trim().length === 0) {
        throw new Error('Post content cannot be empty');
      }

      const newPost: CommunityPost = {
        ...postData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      setPendingPosts(prev => [newPost, ...prev]);
    } catch (error) {
      console.error('Error adding post:', error);
      throw error;
    }
  };

  const approvePost = (postId: number) => {
    const pendingPost = pendingPosts.find(post => post.id === postId);
    if (pendingPost) {
      const approvedPost = { ...pendingPost, status: 'approved' as const };
      setPosts(prev => [approvedPost, ...prev]);
      setPendingPosts(prev => prev.filter(post => post.id !== postId));
    }
  };

  const rejectPost = (postId: number) => {
    setPendingPosts(prev => prev.filter(post => post.id !== postId));
  };

  const deletePost = (postId: number) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const likePost = (postId: number) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  const addComment = (postId: number, content: string) => {
    try {
      // Validate required fields
      if (!content || content.trim().length === 0) {
        throw new Error('Comment content cannot be empty');
      }

      if (!postId || postId <= 0) {
        throw new Error('Invalid post ID');
      }

      const newComment: Comment = {
        id: Date.now(),
        postId: postId,
        user: "Anonymous User",
        avatar: "🐾",
        content: content,
        time: "Just now",
        createdAt: new Date().toISOString()
      };
      
      setComments(prev => [newComment, ...prev]);
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const getCommentsForPost = (postId: number): Comment[] => {
    return comments.filter(comment => comment.postId === postId);
  };

  const getCommentCountForPost = (postId: number): number => {
    return comments.filter(comment => comment.postId === postId).length;
  };

  return (
    <CommunityContext.Provider value={{
      posts,
      pendingPosts,
      comments,
      addPost,
      approvePost,
      rejectPost,
      deletePost,
      likePost,
      addComment,
      getCommentsForPost,
      getCommentCountForPost,
      isLoggedIn
    }}>
      {children}
    </CommunityContext.Provider>
  );
};

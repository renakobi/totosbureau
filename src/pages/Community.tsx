import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, PawPrint, Star, Users, Camera, Send, Check, X, Eye, Trash2, AlertCircle } from "lucide-react";
import SEO from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { useCommunity } from "@/contexts/CommunityContext";
import { useUser } from "@/contexts/UserContext";
import { containsInappropriateContent, getFilteredMessage, testProfanityFilter } from "@/utils/profanityFilter";
import { sanitizeComment, containsMaliciousContent } from "@/utils/sanitization";

const Community = () => {
  const [newPost, setNewPost] = useState("");
  const [newComment, setNewComment] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
  const { toast } = useToast();
  const { posts, addPost, likePost, addComment, getCommentsForPost, getCommentCountForPost, isLoggedIn } = useCommunity();
  const { currentUser, isAdmin } = useUser();

  const handleCreatePost = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please sign in to create a post.",
        variant: "destructive"
      });
      return;
    }

    if (newPost.trim()) {
      // Check for malicious content
      if (containsMaliciousContent(newPost)) {
        toast({
          title: "Invalid Content",
          description: "Your post contains potentially harmful content. Please revise your message.",
          variant: "destructive"
        });
        return;
      }

      // Check for inappropriate content
      if (containsInappropriateContent(newPost)) {
        toast({
          title: "Inappropriate Content",
          description: "Your post contains inappropriate language. Please revise your message.",
          variant: "destructive"
        });
        return;
      }

      const userDisplayName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Anonymous User";
      const userAvatar = currentUser ? "👤" : "🐾";
      
      addPost({
        user: userDisplayName,
        avatar: userAvatar,
        time: "Just now",
        content: sanitizeComment(newPost),
        image: selectedImage,
        likes: 0,
        comments: 0,
        isLiked: false,
        userId: currentUser?.id
      });
      
      setNewPost("");
      setSelectedImage(null);
      toast({
        title: "Post Submitted!",
        description: "Your post is pending approval and will appear once reviewed.",
      });
    } else {
      toast({
        title: "Empty Post",
        description: "Please write something before posting.",
        variant: "destructive"
      });
    }
  };

  const handleLikePost = (postId: number) => {
    likePost(postId);
  };

  const handleAddComment = (postId: number) => {
    if (newComment.trim()) {
      // Check for malicious content
      if (containsMaliciousContent(newComment)) {
        toast({
          title: "Invalid Content",
          description: "Your comment contains potentially harmful content. Please revise your message.",
          variant: "destructive"
        });
        return;
      }

      // Check for inappropriate content
      if (containsInappropriateContent(newComment)) {
        toast({
          title: "Inappropriate Content",
          description: "Your comment contains inappropriate language. Please revise your message.",
          variant: "destructive"
        });
        return;
      }

      addComment(postId, sanitizeComment(newComment));
      setNewComment("");
      toast({
        title: "Comment Added!",
        description: "Your comment has been posted.",
      });
    } else {
      toast({
        title: "Empty Comment",
        description: "Please write something before commenting.",
        variant: "destructive"
      });
    }
  };

  const handleSharePost = (postId: number) => {
    if (navigator.share) {
      navigator.share({
        title: "Check out this post from Toto's Bureau Community",
        text: "Join our pet community!",
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Post link copied to clipboard.",
      });
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleComments = (postId: number) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/15 via-background to-amber-50/10">
      <SEO 
        title="Pet Community - Toto's Bureau"
        description="Join our vibrant pet community! Share photos, stories, and connect with thousands of happy pet parents."
        keywords="pet community, pet parents, pet photos, pet stories, pet care tips"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <PawPrint className="h-8 w-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Pet Community
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect with thousands of pet parents, share your pet's journey, and discover amazing stories from our community!
          </p>
          
          {!isLoggedIn && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Sign in to create posts</span>
              </div>
              <p className="text-sm text-amber-700 mt-2">
                You can view posts, like them, and add comments. Sign in to create new posts.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Post */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Share Your Pet's Story</h3>
                <div className="space-y-4">
                  <Textarea
                    placeholder={isLoggedIn ? "What's your pet up to today?" : "Sign in to share your pet's story"}
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[100px]"
                    disabled={!isLoggedIn}
                  />
                  
                  {selectedImage && (
                    <div className="relative">
                      <img 
                        src={selectedImage} 
                        alt="Selected" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setSelectedImage(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                      disabled={!isLoggedIn}
                    />
                    <label htmlFor="photo-upload">
                      <Button variant="outline" size="sm" asChild disabled={!isLoggedIn}>
                        <span>
                          <Camera className="h-4 w-4 mr-2" />
                          Photo
                        </span>
                      </Button>
                    </label>
                    <Button 
                      size="sm" 
                      className="flex-1" 
                      onClick={handleCreatePost}
                      disabled={!isLoggedIn}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Posts Feed */}
          <div className="lg:col-span-2 space-y-6">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <PawPrint className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
                  <p className="text-muted-foreground">Be the first to share your pet's story!</p>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    {/* Post Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-2xl">{post.avatar}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">{post.user}</div>
                        <div className="text-sm text-muted-foreground">{post.time}</div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleSharePost(post.id)}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Post Content */}
                    <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>
                    
                    {/* Post Image */}
                    {post.image && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img 
                          src={post.image} 
                          alt="Pet photo" 
                          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center gap-6">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center gap-2 ${post.isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                      >
                        <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        {post.likes}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {getCommentCountForPost(post.id)}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSharePost(post.id)}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Comments Section */}
                    {showComments[post.id] && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="space-y-3 mb-4">
                          {getCommentsForPost(post.id).length === 0 ? (
                            <div className="text-center py-4 text-muted-foreground">
                              No comments yet. Be the first to comment!
                            </div>
                          ) : (
                            getCommentsForPost(post.id).map((comment) => (
                              <div key={comment.id} className="flex items-start gap-3">
                                <div className="text-lg">{comment.avatar}</div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{comment.user}</div>
                                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                                  <div className="text-xs text-muted-foreground mt-1">{comment.time}</div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-lg">🐾</div>
                          <Input
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                          />
                          <Button 
                            size="sm" 
                            onClick={() => handleAddComment(post.id)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Community;
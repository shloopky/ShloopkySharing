import React, { useState, useEffect } from 'react';
import { User, LogOut, Send, Hash, MessageSquare, UserCircle, Paperclip, Shield, Trash2, Ban } from 'lucide-react';

// Supabase configuration placeholder
const SUPABASE_URL = 'https://nrpiojdaltgfgswvhrys.supabase.coL';
const SUPABASE_ANON_KEY = 'sb_publishable_nu-if7EcpRJkKD9bXM97Rg__X3ELLW7';

const SoyjackKeep = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [posts, setPosts] = useState([]);
  const [selectedHashtag, setSelectedHashtag] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [commentText, setCommentText] = useState({});
  const [attachments, setAttachments] = useState([]);
  
  // Auth states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  // Admin functionality
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // Mock user database (replace with Supabase)
  const [userDatabase] = useState([
    { 
      id: 1, 
      email: 'admin@soyjak.keep', 
      password: 'admin123', 
      username: 'KeepLord', 
      isAdmin: true 
    },
    { 
      id: 2, 
      email: 'user@test.com', 
      password: 'test123', 
      username: 'ChudWarrior', 
      isAdmin: false 
    }
  ]);

  useEffect(() => {
    // Posts will start empty - no mock data
    setPosts([]);
  }, [user]);

  // Supabase integration functions
  const initSupabase = () => {
    console.log('Initialize Supabase with your credentials');
  };

  const handleSignUp = () => {
    if (!email || !password || !username) {
      alert('All fields are required for registration');
      return;
    }
    
    // Check if user already exists
    const existingUser = userDatabase.find(u => u.email === email);
    if (existingUser) {
      alert('User already exists! Please login instead.');
      return;
    }
    
    // In real implementation, add to Supabase
    alert('Registration successful! You can now login with your credentials.');
    setView('login');
    setEmail('');
    setPassword('');
    setUsername('');
  };

  const handleLogin = () => {
    if (!email || !password) {
      alert('Email and password are required');
      return;
    }
    
    // Check credentials against user database
    const foundUser = userDatabase.find(u => u.email === email && u.password === password);
    if (!foundUser) {
      alert('Invalid credentials! Create an account first or use correct login details.');
      return;
    }
    
    setUser(foundUser);
    setView('forum');
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
    setShowAdminPanel(false);
  };

  const extractHashtags = (text) => {
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    return text.match(hashtagRegex) || [];
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    
    const hashtags = extractHashtags(newPost);
    const post = {
      id: Date.now(),
      userId: user.id,
      user: user.username,
      content: newPost,
      hashtags: hashtags.map(h => h.slice(1)),
      timestamp: 'Just now',
      comments: [],
      attachments: attachments.map(file => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file) // In real app, upload to Supabase storage
      }))
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
    setAttachments([]);
  };

  const handleAddComment = async (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;
    
    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, comments: [...p.comments, { 
            id: Date.now(), 
            user: user.username, 
            userId: user.id,
            text 
          }] }
        : p
    ));
    setCommentText({ ...commentText, [postId]: '' });
  };

  // Admin functions
  const handleDeletePost = (postId) => {
    if (!user.isAdmin) return;
    setPosts(posts.filter(p => p.id !== postId));
  };

  const handleDeleteComment = (postId, commentId) => {
    if (!user.isAdmin) return;
    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, comments: p.comments.filter(c => c.id !== commentId) }
        : p
    ));
  };

  const allHashtags = [...new Set(posts.flatMap(p => p.hashtags))];
  const filteredPosts = selectedHashtag 
    ? posts.filter(p => p.hashtags.includes(selectedHashtag))
    : posts;

  const renderHashtag = (tag) => (
    <span
      key={tag}
      onClick={() => setSelectedHashtag(tag === selectedHashtag ? null : tag)}
      className={`inline-block px-3 py-1 mr-2 mb-2 rounded-full text-sm cursor-pointer transition-all ${
        selectedHashtag === tag
          ? 'bg-gradient-to-r from-green-600 to-yellow-500 text-white shadow-lg'
          : 'bg-white/40 backdrop-blur-sm text-green-800 hover:bg-white/60'
      }`}
    >
      #{tag}
    </span>
  );

  const renderAttachment = (attachment, index) => (
    <div key={index} className="flex items-center gap-2 p-2 bg-white/40 rounded-lg">
      <Paperclip size={16} className="text-green-700" />
      <span className="text-sm text-green-800 truncate">{attachment.name}</span>
      {attachment.type.startsWith('image/') && (
        <img 
          src={attachment.url} 
          alt={attachment.name}
          className="w-16 h-16 object-cover rounded"
        />
      )}
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-yellow-300 to-orange-300 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-yellow-600 bg-clip-text text-transparent mb-2">
                SOYJAK KEEP
              </h1>
              <p className="text-green-700 italic text-sm">
                "The fortress of eternal soy and chudly discourse"
              </p>
              <p className="text-orange-600 text-xs mt-1">
                Est. 2024 | A bastion of authentic posting
              </p>
            </div>

            {view === 'login' ? (
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email (try: admin@soyjak.keep)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur border border-white/60 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <input
                  type="password"
                  placeholder="Password (try: admin123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur border border-white/60 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  onClick={handleLogin}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-yellow-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Enter the Keep
                </button>
                <button
                  onClick={() => setView('signup')}
                  className="w-full py-3 bg-white/50 backdrop-blur text-green-700 rounded-xl font-semibold border border-white/60 hover:bg-white/70 transition-all"
                >
                  Request Membership
                </button>
                <div className="text-center text-xs text-green-600 mt-4">
                  <p>Demo accounts:</p>
                  <p>Admin: admin@soyjak.keep / admin123</p>
                  <p>User: user@test.com / test123</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Choose your warrior name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur border border-white/60 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur border border-white/60 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <input
                  type="password"
                  placeholder="Secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSignUp()}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur border border-white/60 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  onClick={handleSignUp}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-yellow-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Join the Garrison
                </button>
                <button
                  onClick={() => setView('login')}
                  className="w-full py-3 bg-white/50 backdrop-blur text-green-700 rounded-xl font-semibold border border-white/60 hover:bg-white/70 transition-all"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Decorative Keep Towers */}
        <div className="fixed bottom-0 left-0 w-32 h-64 bg-gradient-to-t from-stone-500/40 to-transparent backdrop-blur-sm border-l-4 border-r-4 border-stone-400/60 rounded-t-lg"></div>
        <div className="fixed bottom-0 right-0 w-32 h-64 bg-gradient-to-t from-stone-500/40 to-transparent backdrop-blur-sm border-l-4 border-r-4 border-stone-400/60 rounded-t-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-yellow-300 to-orange-300 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-yellow-600 bg-clip-text text-transparent">
                SOYJAK KEEP
              </h1>
              <p className="text-green-700 italic mt-1">The last bastion of authentic posting</p>
            </div>
            <div className="flex items-center gap-4">
              {user.isAdmin && (
                <button
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/70 backdrop-blur rounded-full text-white hover:bg-red-500 transition-all"
                >
                  <Shield size={20} />
                  <span className="text-sm font-medium">Admin</span>
                </button>
              )}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur rounded-full">
                <UserCircle className="text-green-600" size={20} />
                <span className="text-green-700 font-medium">{user.username}</span>
                {user.isAdmin && <Shield className="text-red-500" size={16} />}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 bg-gradient-to-r from-green-600 to-yellow-500 text-white rounded-full hover:shadow-lg transition-all hover:scale-110"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Panel */}
      {showAdminPanel && user.isAdmin && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-red-500/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-300/50 p-6">
            <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
              <Shield size={24} />
              Keep Administration Panel
            </h3>
            <p className="text-red-600 text-sm">
              As KeepLord, you can moderate posts and comments by clicking the delete buttons that appear on content.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Hashtags Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="text-green-600" size={24} />
              <h2 className="text-xl font-bold text-green-700">Trending Causes</h2>
            </div>
            <div className="space-y-2">
              {allHashtags.map(tag => renderHashtag(tag))}
              {allHashtags.length === 0 && (
                <p className="text-green-600 text-sm italic">No causes rallied yet</p>
              )}
            </div>
            {selectedHashtag && (
              <button
                onClick={() => setSelectedHashtag(null)}
                className="w-full mt-4 py-2 bg-white/40 backdrop-blur text-green-700 rounded-xl text-sm hover:bg-white/60 transition-all"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-6">
          {/* Create Post */}
          <div className="bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6">
            <h3 className="text-lg font-bold text-green-700 mb-4">Rally the Keep</h3>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your thoughts, warrior! Use #hashtags to rally causes..."
              className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur border border-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
              rows="3"
            />
            
            {/* File Upload */}
            <div className="mt-3">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur text-green-700 rounded-xl text-sm hover:bg-white/70 transition-all cursor-pointer"
              >
                <Paperclip size={16} />
                Add Attachments
              </label>
            </div>

            {/* Attachment Preview */}
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white/40 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Paperclip size={16} className="text-green-700" />
                      <span className="text-sm text-green-800 truncate">{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleCreatePost}
              className="mt-3 px-6 py-2 bg-gradient-to-r from-green-600 to-yellow-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <Send size={18} />
              Post to Keep
            </button>
          </div>

          {/* Posts */}
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-yellow-400 flex items-center justify-center text-white font-bold shadow-lg">
                  {post.user[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-green-700">{post.user}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-600">{post.timestamp}</span>
                      {user.isAdmin && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete Post (Admin)"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-800 mb-3">{post.content}</p>

                  {/* Attachments */}
                  {post.attachments && post.attachments.length > 0 && (
                    <div className="mb-3 grid grid-cols-2 gap-2">
                      {post.attachments.map((attachment, index) => (
                        <div key={index}>
                          {attachment.type.startsWith('image/') ? (
                            <img 
                              src={attachment.url} 
                              alt={attachment.name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ) : (
                            renderAttachment(attachment, index)
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mb-4">
                    {post.hashtags.map(tag => renderHashtag(tag))}
                  </div>

                  {/* Comments */}
                  {post.comments.length > 0 && (
                    <div className="space-y-3 mb-4 pl-4 border-l-2 border-green-300">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="bg-white/40 backdrop-blur rounded-xl p-3">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-green-700 text-sm">{comment.user}</p>
                            {user.isAdmin && (
                              <button
                                onClick={() => handleDeleteComment(post.id, comment.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                                title="Delete Comment (Admin)"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                          <p className="text-gray-700 text-sm">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText[post.id] || ''}
                      onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      placeholder="Rally to this cause..."
                      className="flex-1 px-4 py-2 rounded-xl bg-white/50 backdrop-blur border border-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-yellow-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                    >
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredPosts.length === 0 && (
            <div className="bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-12 text-center">
              <p className="text-green-700 text-lg italic">The Keep awaits your first rally call, warrior!</p>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Keep Towers */}
      <div className="fixed bottom-0 left-0 w-24 h-48 bg-gradient-to-t from-stone-500/40 to-transparent backdrop-blur-sm border-l-4 border-r-4 border-stone-400/60 rounded-t-lg hidden lg:block"></div>
      <div className="fixed bottom-0 right-0 w-24 h-48 bg-gradient-to-t from-stone-500/40 to-transparent backdrop-blur-sm border-l-4 border-r-4 border-stone-400/60 rounded-t-lg hidden lg:block"></div>
    </div>
  );
};

export default SoyjackKeep;

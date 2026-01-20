import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState({ 
    name: localStorage.getItem('chat_name') || '', 
    pfp: localStorage.getItem('chat_pfp') || 'https://api.dicebear.com/7.x/bottts/svg?seed=default' 
  });
  const [isSetup, setIsSetup] = useState(!user.name);
  const scrollRef = useRef();

  // Fetch initial messages and subscribe to changes
  useEffect(() => {
    fetchMessages();
    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, 
        (payload) => setMessages((prev) => [...prev, payload.new]))
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
    setMessages(data || []);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await supabase.from('messages').insert([{ 
      display_name: user.name, 
      pfp_url: user.pfp, 
      content: newMessage 
    }]);
    setNewMessage('');
  };

  const filteredMessages = messages.filter(m => 
    m.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isSetup) {
    return (
      <div className="setup-screen">
        <h2>Choose a temporary identity</h2>
        <input placeholder="Display Name" onChange={e => setUser({...user, name: e.target.value})} />
        <input placeholder="PFP Image URL" onChange={e => setUser({...user, pfp: e.target.value})} />
        <button onClick={() => { localStorage.setItem('chat_name', user.name); setIsSetup(false); }}>Join Chat</button>
      </div>
    );
  }

  return (
    <div className="discord-theme">
      <div className="sidebar"># global-chat</div>
      <div className="main-chat">
        <div className="header">
          <input 
            type="text" 
            placeholder="Search messages..." 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="message-list">
          {filteredMessages.map((msg) => (
            <div key={msg.id} className="message">
              <img src={msg.pfp_url} alt="pfp" className="avatar" />
              <div className="msg-content">
                <span className="username">{msg.display_name}</span>
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
        <form onSubmit={sendMessage} className="input-area">
          <input 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            placeholder={`Message #global-chat`} 
          />
        </form>
      </div>
    </div>
  );
}

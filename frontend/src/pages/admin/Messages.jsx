import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MailOpen, Trash2, Loader2, Calendar } from 'lucide-react';
import { getMessages, markRead, deleteMessage } from '../../services/api';
import toast from 'react-hot-toast';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    getMessages()
      .then((res) => setMessages(res.data.messages))
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (msg) => {
    setSelected(msg);
    if (!msg.read) {
      try {
        await markRead(msg._id);
        setMessages((prev) => prev.map((m) => m._id === msg._id ? { ...m, read: true } : m));
      } catch {}
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    setDeleting(id);
    try {
      await deleteMessage(id);
      toast.success('Message deleted');
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-dark">Messages</h2>
          <p className="text-gray-500">
            {messages.length} total · {unreadCount > 0 && (
              <span className="text-primary font-semibold">{unreadCount} unread</span>
            )}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : messages.length === 0 ? (
        <div className="card p-16 text-center">
          <Mail size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No messages yet</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleSelect(msg)}
                className={`card p-4 cursor-pointer transition-all hover:shadow-md ${
                  selected?._id === msg._id ? 'ring-2 ring-primary' : ''
                } ${!msg.read ? 'border-l-4 border-l-primary' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                    !msg.read ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium text-sm ${!msg.read ? 'text-dark' : 'text-gray-600'}`}>
                        {msg.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        {!msg.read ? <Mail size={12} className="text-primary" /> : <MailOpen size={12} />}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{msg.email}</p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">{msg.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detail */}
          <div>
            {selected ? (
              <motion.div
                key={selected._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6 sticky top-6"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-dark text-xl">{selected.name}</h3>
                    <a href={`mailto:${selected.email}`} className="text-primary text-sm hover:underline">
                      {selected.email}
                    </a>
                  </div>
                  <button
                    onClick={() => handleDelete(selected._id)}
                    disabled={deleting === selected._id}
                    className="p-2 rounded-lg bg-red/10 text-red hover:bg-red hover:text-white transition-all"
                  >
                    {deleting === selected._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>

                {selected.subject && (
                  <div className="mb-4">
                    <span className="text-xs font-semibold uppercase text-gray-400">Subject</span>
                    <p className="font-medium text-dark">{selected.subject}</p>
                  </div>
                )}

                <div className="mb-6">
                  <span className="text-xs font-semibold uppercase text-gray-400">Message</span>
                  <p className="text-gray-700 mt-1 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-400 border-t pt-4">
                  <Calendar size={12} />
                  {new Date(selected.createdAt).toLocaleString()}
                </div>

                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message'}`}
                  className="btn-primary mt-4 w-full text-center block"
                >
                  Reply via Email
                </a>
              </motion.div>
            ) : (
              <div className="card p-16 text-center text-gray-300">
                <MailOpen size={48} className="mx-auto mb-3" />
                <p>Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

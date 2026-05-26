import React, { useState, useEffect } from 'react';
import { Search, FileUp, Activity, User, Home, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const actions = [
    { id: 1, title: 'Jane Doe (Patient)', description: 'CL-JD-0001', icon: <User className="w-4 h-4" />, action: () => navigate('/dashboard/clinical') },
    { id: 2, title: 'Go to Home', description: 'Navigate to landing page', icon: <Home className="w-4 h-4" />, action: () => navigate('/') },
    { id: 3, title: 'Recent Lab Results', description: 'View system records', icon: <Activity className="w-4 h-4" />, action: () => navigate('/dashboard/clinical') },
    { id: 4, title: 'Biometric Setup', description: 'Enable FaceID/TouchID', icon: <Key className="w-4 h-4" />, action: () => alert('Biometric setup coming soon') },
  ];

  const filteredActions = actions.filter((action) =>
    action.title.toLowerCase().includes(search.toLowerCase()) || action.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden max-w-2xl gap-0 shadow-2xl border-none">
        <div className="flex items-center px-4 border-b">
          <Search className="w-5 h-5 text-gray-500 shrink-0" />
          <input
            className="flex h-16 w-full rounded-md bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Type a command or search for a patient (e.g. Jane Doe)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-500">
            <span className="text-xs">ESC</span>
          </kbd>
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filteredActions.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No results found.</div>
          ) : (
            <div className="space-y-1">
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Suggestions</div>
              {filteredActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => runCommand(action.action)}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded bg-white border border-gray-200 text-gray-600 shrink-0 shadow-sm">
                    {action.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{action.title}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t bg-gray-50 p-2 text-xs text-gray-500 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <span>Navigate using</span>
                <kbd className="inline-flex rounded border px-1.5 font-mono text-[10px] font-medium">↑</kbd>
                <kbd className="inline-flex rounded border px-1.5 font-mono text-[10px] font-medium">↓</kbd>
            </div>
            <span>Powered by AI Studio</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { AuthScreen } from './screens/AuthScreen.jsx';
import { ChatWorkspace } from './screens/ChatWorkspace.jsx';

export function App() {
  const [session, setSession] = useState(null);

  if (!session) {
    return <AuthScreen onAuthenticated={setSession} />;
  }

  return <ChatWorkspace />;
}

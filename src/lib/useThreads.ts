import { useState, useCallback } from 'react';

interface Thread {
  id: string;
  title: string;
  createdAt: string;
  lastUpdated: string;
}

interface UseThreadsReturn {
  threads: Thread[];
  currentThread: Thread | null;
  isLoading: boolean;
  error: string | null;
  createThread: (title: string) => Promise<void>;
  deleteThread: (threadId: string) => Promise<void>;
  setCurrentThread: (thread: Thread | null) => void;
}

export const useThreads = (): UseThreadsReturn => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createThread = useCallback(async (title: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error('Failed to create thread');
      }

      const newThread = await response.json();
      setThreads(prev => [...prev, newThread]);
      setCurrentThread(newThread);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteThread = useCallback(async (threadId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/threads/${threadId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete thread');
      }

      setThreads(prev => prev.filter(thread => thread.id !== threadId));
      if (currentThread?.id === threadId) {
        setCurrentThread(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [currentThread]);

  return {
    threads,
    currentThread,
    isLoading,
    error,
    createThread,
    deleteThread,
    setCurrentThread,
  };
}; 
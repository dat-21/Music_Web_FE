import { Toaster as HotToaster } from 'react-hot-toast';

export const Toaster = () => {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        className:
          'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 shadow-lg',
        style: {
          borderRadius: '0.75rem',
          padding: '16px',
        },
        success: {
          iconTheme: {
            primary: 'var(--color-accent-neon)',
            secondary: 'var(--color-bg-primary)',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--color-accent-glow)',
            secondary: 'var(--color-bg-primary)',
          },
        },
      }}
    />
  );
};

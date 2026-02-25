'use client';

import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-sand-200 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-risk-high/30 hover:text-risk-high"
    >
      Log out
    </button>
  );
}

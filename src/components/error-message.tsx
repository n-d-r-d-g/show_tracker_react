import { PropsWithChildren } from 'react';

export function ErrorMessage({ children }: PropsWithChildren) {
  return (
    <div className="text-xs text-red-800 dark:text-red-300">{children}</div>
  );
}

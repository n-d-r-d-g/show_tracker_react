import { FormEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

function SignIn() {
  const { t: tSignIn } = useTranslation('signIn');
  const { signIn } = useAuth();

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e?.preventDefault?.();

      const formTarget = e.target as HTMLFormElement;
      const username = (
        formTarget.elements.namedItem('username') as HTMLInputElement
      ).value;
      const password = (
        formTarget.elements.namedItem('password') as HTMLInputElement
      ).value;

      signIn({ username, password });
    },
    [signIn]
  );

  return (
    <>
      <h1>{tSignIn('title')}</h1>
      <p>{tSignIn('description')}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">{tSignIn('username')}</label>
        <input name="username" />
        <label htmlFor="password">{tSignIn('password')}</label>
        <input name="password" type="password" />
        <button>{tSignIn('signIn')}</button>
      </form>
    </>
  );
}

export default SignIn;

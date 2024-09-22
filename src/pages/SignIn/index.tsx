import { FormEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../hooks/useAuth';
import DefaultLayout from '../../layouts/DefaultLayout';

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
    <DefaultLayout className="w-80">
      <h1 className="text-4xl sm:text-4xl text-center">{tSignIn('title')}</h1>
      <p className="text-center font-light italic text-neutral-600 dark:text-neutral-300">
        {tSignIn('description')}
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col items-start gap-4"
      >
        <div className="w-full flex flex-col items-start gap-1">
          <Label htmlFor="username">{tSignIn('username')}</Label>
          <Input name="username" placeholder={tSignIn('username')} />
        </div>
        <div className="w-full flex flex-col items-start gap-1">
          <Label htmlFor="password">{tSignIn('password')}</Label>
          <Input
            name="password"
            type="password"
            placeholder={tSignIn('password')}
          />
        </div>
        <Button className="w-full mt-2">{tSignIn('signIn')}</Button>
      </form>
    </DefaultLayout>
  );
}

export default SignIn;

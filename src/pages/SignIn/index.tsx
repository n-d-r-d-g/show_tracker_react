import { ErrorMessage } from '@/components/error-message';
import { cn } from '@/lib/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../hooks/useAuth';
import DefaultLayout from '../../layouts/DefaultLayout';

type FormValues = {
  username: string;
  password: string;
};

function SignIn() {
  const { t: tCommon } = useTranslation('common');
  const { t: tSignIn } = useTranslation('signIn');
  const { signIn } = useAuth();

  const schema = yup
    .object({
      username: yup.string().required(),
      password: yup.string().required(),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<FormValues>({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(
    ({ username, password }: FormValues) => {
      console.log('vals :>> ', { username, password });

      signIn({ username, password });
    },
    [signIn]
  );
  console.log('isDirty :>> ', isDirty);
  return (
    <DefaultLayout className="w-80">
      <h1 className="text-4xl sm:text-4xl text-center">{tSignIn('title')}</h1>
      <p className="text-center font-light italic text-neutral-600 dark:text-neutral-300">
        {tSignIn('description')}
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 flex flex-col items-start gap-4"
      >
        <div className="w-full flex flex-col items-start gap-1">
          <Label
            htmlFor="username"
            className={cn(errors.username && 'text-red-800 dark:text-red-300')}
          >{`${tSignIn('username')}*`}</Label>
          <Input
            placeholder={tSignIn('username')}
            aria-invalid={!!errors.username}
            className={cn(
              errors.username && 'border-red-800 dark:border-red-300'
            )}
            {...register('username')}
          />
          <ErrorMessage>
            {errors.username?.type === 'required' &&
              tCommon('errors.form.required')}
          </ErrorMessage>
        </div>
        <div className="w-full flex flex-col items-start gap-1">
          <Label
            htmlFor="password"
            className={cn(errors.password && 'text-red-800 dark:text-red-300')}
          >{`${tSignIn('password')}*`}</Label>
          <Input
            type="password"
            placeholder={tSignIn('password')}
            aria-invalid={!!errors.password}
            className={cn(
              errors.password && 'border-red-800 dark:border-red-300'
            )}
            {...register('password')}
          />
          <ErrorMessage>
            {errors.password?.type === 'required' &&
              tCommon('errors.form.required')}
          </ErrorMessage>
        </div>
        <div className="w-full max-w-full flex flex-col gap-1">
          <Button className="w-full mt-2" disabled={!isValid}>
            {tSignIn('signIn')}
          </Button>
          <div
            aria-live="assertive"
            className="text-xs text-red-800 dark:text-red-300"
          >
            {Object.keys(errors).length > 0 &&
              tCommon('errors.formContainsErrors')}
          </div>
        </div>
      </form>
    </DefaultLayout>
  );
}

export default SignIn;

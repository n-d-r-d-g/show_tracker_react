import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function Error() {
  const { t: tError } = useTranslation('error');
  return (
    <>
      <h1>{tError('title')}</h1>
      <p>{tError('description')}</p>
      <Link to="/">{tError('goHome')}</Link>
    </>
  );
}

export default Error;

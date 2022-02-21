import { Link } from 'react-router-dom';

function Error() {
  return (
    <>
      <h1>Oops you got yourself in a bit of a mess...</h1>
      {"Don't sweat it.. Just "}
      <Link to="/">go home</Link>
    </>
  );
}

export default Error;

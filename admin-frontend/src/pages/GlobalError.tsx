import { useRouteError } from 'react-router-dom';
import { IErrorResponse } from '../types/auth.types';
import NotFoundPage from './NotFoundPage';
import ForbiddenPage from './ForbiddenPage';

function GlobalError() {
  const error = useRouteError();
  const errorResponse = error as IErrorResponse;

  const hasStatus = errorResponse && typeof errorResponse.status === 'number';

  if (hasStatus) {
    switch (errorResponse.status) {
      case 403:
        return <ForbiddenPage />;
      case 404:
        return <NotFoundPage />;
      default:
        return (
          <div>
            <h1>Error {errorResponse.status}</h1>
            <p>An unexpected error occurred with status code {errorResponse.status}.</p>
          </div>
        );
    }
  }

  return (
    <div>
      <h1>Something went wrong!</h1>
      {error ? (
        <div>
          <p>An unexpected error occurred.</p>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      ) : (
        <p>Sorry, there was a problem loading this page.</p>
      )}
    </div>
  );
}

export default GlobalError;

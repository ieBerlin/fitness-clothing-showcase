import { useRouteError } from "react-router-dom";

function GlobalError() {
  const error = useRouteError();

  return (
    <div>
      <h1>Something went wrong!</h1>
      {error ? (
        <div>
          <p>{"An unexpected error occurred."}</p>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      ) : (
        <p>Sorry, there was a problem loading this page.</p>
      )}
    </div>
  );
}

export default GlobalError;

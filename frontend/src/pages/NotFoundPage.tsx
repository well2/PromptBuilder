import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
      <h1 className="text-6xl font-extrabold text-primary-600 sm:text-8xl">404</h1>
      <h2 className="mt-4 text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">Page not found</h2>
      <p className="mt-4 text-lg text-gray-500 max-w-md">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div className="mt-8">
        <Link to="/">
          <Button variant="primary" size="lg">
            Go back home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

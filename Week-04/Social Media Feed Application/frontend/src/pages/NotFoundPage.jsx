import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
        <Compass className="h-8 w-8" />
      </div>
      <p className="mt-5 text-sm font-bold uppercase tracking-widest text-indigo-600">
        404 Error
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
        Sorry, the page you are looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        to="/"
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home Feed</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;


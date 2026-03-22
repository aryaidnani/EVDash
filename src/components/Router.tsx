import { useState, useEffect, ReactNode } from 'react';

type RouteConfig = {
  [key: string]: ReactNode;
};

interface RouterProps {
  routes: RouteConfig;
  defaultRoute?: string;
}

export function Router({ routes, defaultRoute = '/' }: RouterProps) {
  const [currentPath, setCurrentPath] = useState(
    window.location.hash.slice(1) || defaultRoute
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || defaultRoute);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [defaultRoute]);

  return <>{routes[currentPath] || routes[defaultRoute]}</>;
}

export function navigate(path: string) {
  window.location.hash = path;
}

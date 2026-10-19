import { useEffect, useState } from 'react';
import { getPublicSchool } from '../api/school.api';

// The school's public name/headline for the landing page. Cached in memory for the session
// (not in browser storage) so Navbar, Footer and Homepage share one request.
let cached = null;
let inflight = null;

export function usePublicSchool() {
  const [school, setSchool] = useState(cached);

  useEffect(() => {
    if (cached) return undefined;
    let live = true;
    inflight ||= getPublicSchool()
      .then(({ data }) => { cached = data.school || null; return cached; })
      .catch(() => null)
      .finally(() => { inflight = null; });
    inflight.then((s) => { if (live) setSchool(s); });
    return () => { live = false; };
  }, []);

  return school;
}

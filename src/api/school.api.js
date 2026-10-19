import api from './axios';

export const checkSchoolExists = () => api.get('/school/exists');
export const getPublicSchool = () => api.get('/school/public');
export const setupSchool = (data) => api.post('/school/setup', data);
export const getSchool = () => api.get('/school');
export const updateSchool = (data) => api.put('/school', data);
export const deleteSchool = (confirm) => api.delete('/school', { data: { confirm } });

// Rename / delete by uid
export const renameClass = (uid, name) => api.patch(`/school/classes/${uid}`, { name });
export const renameArm = (uid, name) => api.patch(`/school/arms/${uid}`, { name });
export const renameSubject = (uid, name) => api.patch(`/school/subjects/${uid}`, { name });
export const renameOptionalSubject = (uid, name) => api.patch(`/school/optional-subjects/${uid}`, { name });
export const deleteClass = (uid) => api.delete(`/school/classes/${uid}`);
export const deleteArm = (uid) => api.delete(`/school/arms/${uid}`);
export const deleteClassArm = (uid) => api.delete(`/school/class-arms/${uid}`);
export const deleteSubject = (uid) => api.delete(`/school/subjects/${uid}`);
export const deleteOptionalSubject = (uid) => api.delete(`/school/optional-subjects/${uid}`);

export const getAcademicTerms = () => api.get('/school/academic-terms');
export const setAcademicTerm = (data) => api.put('/school/academic-term', data);

// Turn the wizard's draft (what the UI collects) into the payload the API expects.
export function buildSetupPayload(wizard) {
  const info = wizard.info || {};
  const full = (c, a) => `${c} ${a}`;

  const classArms = [];
  const arms = new Set();
  (wizard.arms || []).forEach((g) => {
    g.armNames.forEach((arm) => {
      arms.add(arm);
      classArms.push({ class_name: g.className, arm_name: arm, full_class_name: full(g.className, arm) });
    });
  });

  const group = (list, field) => {
    const map = new Map();
    (list || []).forEach((item) => {
      item[field].forEach((subject) => {
        if (!map.has(subject)) map.set(subject, []);
        map.get(subject).push(full(item.className, item.armName));
      });
    });
    return [...map].map(([subject_name, class_arms]) => ({ subject_name, class_arms }));
  };

  return {
    school: {
      name: (info.name || '').trim(),
      phone: (info.phone || '').trim(),
      email: (info.email || '').trim(),
      motto: (info.motto || '').trim(),
      logo: info.logoUrl || null,
      description: (info.description || '').trim(),
      headline: (info.HeadLine || '').trim(),
      address: (info.address || '').trim(),
    },
    classes: wizard.classes || [],
    arms: [...arms],
    classArms,
    subjects: group(wizard.subjects, 'offerSubject'),
    optionalSubjects: group(wizard.optionalSubject, 'optionalSubject'),
  };
}

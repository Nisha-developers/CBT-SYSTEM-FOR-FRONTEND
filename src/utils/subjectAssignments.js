export function groupSubjectAssignments(list, field) {
  const grouped = new Map();
  (Array.isArray(list) ? list : []).forEach((item) => {
    const subjects = Array.isArray(item?.[field]) ? item[field] : [];
    subjects.forEach((subject) => {
      if (!grouped.has(subject)) grouped.set(subject, new Set());
      grouped.get(subject).add(`${item.className} ${item.armName}`);
    });
  });

  return [...grouped].map(([subject_name, classArms]) => ({
    subject_name,
    classArms: [...classArms],
  }));
}

export function subjectIsOfferedInClass(subject, selectedClass, classArms) {
  if (!selectedClass || !Array.isArray(subject?.classArmIds) || !Array.isArray(classArms)) {
    return false;
  }
  return subject.classArmIds.some((classArmId) =>
    classArms.some((classArm) =>
      String(classArm.id) === String(classArmId) &&
      String(classArm.classId) === String(selectedClass.id)
    )
  );
}

export function formatSubjectClassArms(ids, classArms) {
  const availableArms = Array.isArray(classArms) ? classArms : [];
  const assignedIds = [...new Set((Array.isArray(ids) ? ids : []).map(String))];
  const assigned = assignedIds
    .map((id) => availableArms.find((classArm) => String(classArm.id) === id))
    .filter(Boolean);
  if (!assigned.length) return 'No arms assigned';

  const byClass = new Map();
  assigned.forEach((classArm) => {
    const classId = String(classArm.classId);
    if (!byClass.has(classId)) byClass.set(classId, { name: classArm.className, arms: [] });
    byClass.get(classId).arms.push(classArm);
  });

  return [...byClass.values()].map(({ name, arms }) => {
    const allClassArms = availableArms.filter((classArm) => String(classArm.classId) === String(arms[0].classId));
    return allClassArms.length > 0 && arms.length === allClassArms.length
      ? `${name}: All arms offering`
      : `${name}: ${arms.map((classArm) => `Arm ${classArm.armName}`).join(', ')}`;
  }).join('; ');
}

export function formatSubjectArmsForClass(ids, classId, classArms) {
  if (classId == null || !Array.isArray(classArms)) return 'Arm assignments unavailable';

  const classArmsInClass = classArms.filter(
    (classArm) => String(classArm.classId) === String(classId)
  );
  if (!classArmsInClass.length) return 'Arm assignments unavailable';

  const assignedIds = new Set((Array.isArray(ids) ? ids : []).map(String));
  const assignedArms = classArmsInClass.filter((classArm) => assignedIds.has(String(classArm.id)));
  if (!assignedArms.length) return 'No arms assigned';
  if (assignedArms.length === classArmsInClass.length) return 'All arms offering';

  return assignedArms.map((classArm) => `Arm ${classArm.armName}`).join(', ');
}

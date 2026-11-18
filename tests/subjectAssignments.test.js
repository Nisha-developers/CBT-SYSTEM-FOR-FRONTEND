import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatSubjectClassArms,
  formatSubjectArmsForClass,
  groupSubjectAssignments,
  subjectIsOfferedInClass,
} from '../src/utils/subjectAssignments.js';

const classArms = [
  { id: 'ss1-a', classId: 'ss1', className: 'SS1', armName: 'A', fullName: 'SS1 A' },
  { id: 'ss1-b', classId: 'ss1', className: 'SS1', armName: 'B', fullName: 'SS1 B' },
  { id: 'ss2-a', classId: 'ss2', className: 'SS2', armName: 'A', fullName: 'SS2 A' },
];

test('setup payload groups one subject across selected arms without duplicates', () => {
  assert.deepEqual(groupSubjectAssignments([
    { className: 'SS1', armName: 'A', offerSubject: ['Mathematics', 'English'] },
    { className: 'SS1', armName: 'B', offerSubject: ['Mathematics'] },
    { className: 'SS1', armName: 'A', offerSubject: ['Mathematics'] },
  ], 'offerSubject'), [
    { subject_name: 'Mathematics', classArms: ['SS1 A', 'SS1 B'] },
    { subject_name: 'English', classArms: ['SS1 A'] },
  ]);
});

test('class-wide exam subject options include a subject offered by any arm in that class', () => {
  const english = { classArmIds: ['ss1-a'] };
  assert.equal(subjectIsOfferedInClass(english, { id: 'ss1' }, classArms), true);
  assert.equal(subjectIsOfferedInClass(english, { id: 'ss2' }, classArms), false);
});

test('assignment labels show selected arms or all arms and handle no assignment', () => {
  assert.equal(formatSubjectClassArms(['ss1-a'], classArms), 'SS1: Arm A');
  assert.equal(formatSubjectClassArms(['ss1-a', 'ss1-b'], classArms), 'SS1: All arms offering');
  assert.equal(formatSubjectClassArms([], classArms), 'No arms assigned');
});

test('exam config arm labels are scoped to the exam class', () => {
  assert.equal(formatSubjectArmsForClass(['ss1-a'], 'ss1', classArms), 'Arm A');
  assert.equal(formatSubjectArmsForClass(['ss1-a', 'ss1-b'], 'ss1', classArms), 'All arms offering');
  assert.equal(formatSubjectArmsForClass(['ss1-a', 'ss2-a'], 'ss1', classArms), 'Arm A');
});

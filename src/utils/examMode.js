import { getExamMode } from '../api/exam.api';
import { useExamModeStore } from '../store/useExamModeStore';

export const WAITING_PATH = '/student/waiting';
export const takePath = (examId) => `/student/exams/${examId}/take`;

const OFF = { active: false, phase: 'off', examId: null };

let loading = null;
export function loadExamMode() {
  if (!loading) {
    loading = getExamMode()
      .then(({ data }) => useExamModeStore.getState().setMode(data.examMode))
      .catch(() => {
        if (!useExamModeStore.getState().loaded) useExamModeStore.getState().setMode(OFF);
      })
      .finally(() => { loading = null; });
  }
  return loading;
}

export function lockedRedirect(mode, pathname) {
  if (!mode?.active) return pathname === WAITING_PATH ? '/student/dashboard' : null;
  if (mode.phase === 'in_exam') {
    const own = takePath(mode.examId);
    return pathname.toLowerCase() === own.toLowerCase() ? null : own;
  }
  return pathname === WAITING_PATH ? null : WAITING_PATH;
}

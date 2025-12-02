//localStore를 사용하여 틀린 문제 목록 관리하는 서비스
const STORAGE_KEY = 'wrongProblems';

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function readRaw() {
  const raw = localStorage.getItem(STORAGE_KEY) || '[]';
  return safeParse(raw);
}

function write(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    console.error('오답 문제 저장 실패:', e);
    return false;
  }
}

/**
 * 모든 잘못된 항목 가져오기.
 * 형태: { subject: 'os'|'ds'|'web', id: number, difficulty: string, ts?: number }
 */
export function getAll() {
  return readRaw();
}

export function setAll(list) {
  if (!Array.isArray(list)) throw new Error('setAll expects an array');
  return write(list);
}

export function clear() {
  return write([]);
}

export function getBySubject(subject) {
  return readRaw().filter((e) => e.subject === subject);
}

/**
 * 과목별 및 난이도별로 잘못된 항목 보기
 */
export function getBySubjectAndDifficulty(subject, difficulty) {
  return readRaw().filter((e) => 
    e.subject === subject && 
    e.difficulty === difficulty
  );
}

export function exists(subject, id) {
  return readRaw().some((e) => e.subject === subject && e.id === id);
}

/**
 *잘못된 항목을 추가. 중복 항목(subject+id )은 추가하지 않음.
 * 항목: { subject, id, difficulty, ts? }
 *항목이 잘못되었거나 중복된 경우 거짓을 반환
 */
export function add(entry) {
  if (!entry || !entry.subject || typeof entry.id === 'undefined' || !entry.difficulty) return false;
  const list = readRaw();
  const found = list.find((e) => e.subject === entry.subject && e.id === entry.id);
  if (found) return false;
  const newEntry = { ...entry, ts: entry.ts || Date.now() };
  list.push(newEntry);
  return write(list);
}

export function remove(subject, id) {
  const list = readRaw();
  const filtered = list.filter((e) => !(e.subject === subject && e.id === id));
  return write(filtered);
}

export default {
  getAll,
  setAll,
  clear,
  getBySubject,
  getBySubjectAndDifficulty,
  exists,
  add,
  remove,
};

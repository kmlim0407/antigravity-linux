import { redis } from "@/lib/makeup";

// ──────────────────────────────────────────
// Types
// ──────────────────────────────────────────

export type Point = { x: number; y: number };

export type Stroke = {
  points: Point[];
  color: string;
  width: number;
  opacity?: number;  // 0~1, 하이라이터용 (기본 1)
  penStyle?: "ballpoint" | "fountain";  // 만년필: 얇고 반투명, 테이퍼드
};

export type PageAnnotation = {
  pageIndex: number;
  strokes: Stroke[];
  updatedAt: string;
};

export type PageCorrection = {
  pageIndex: number;
  strokes: Stroke[];
  updatedAt: string;
};

export type Assignment = {
  id: string;
  studentId: string;
  pdfUrl: string;
  title: string;
  pageCount?: number;
  createdAt: string;
};

// ──────────────────────────────────────────
// Redis Keys
// ──────────────────────────────────────────

const ASSIGNMENTS_KEY = "prints:assignments";
const ASSIGNMENT_PREFIX = "prints:assignment:";
const ANNOTATION_PREFIX = "prints:annotation:";
const CORRECTION_PREFIX = "prints:correction:";
const STUDENT_ASSIGNMENTS_PREFIX = "prints:student:";

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────

export function nanoid(): string {
  return (
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10)
  );
}

// ──────────────────────────────────────────
// Assignments
// ──────────────────────────────────────────

export async function listAssignments(): Promise<Assignment[]> {
  const ids = await redis.smembers(ASSIGNMENTS_KEY);
  if (ids.length === 0) return [];
  const assignments: Assignment[] = [];
  for (const id of ids) {
    const a = await redis.get<Assignment>(`${ASSIGNMENT_PREFIX}${id}`);
    if (a) assignments.push(a);
  }
  return assignments.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function listAssignmentsByStudent(
  studentId: string
): Promise<Assignment[]> {
  const ids = await redis.smembers(
    `${STUDENT_ASSIGNMENTS_PREFIX}${studentId}`
  );
  if (ids.length === 0) return [];
  const assignments: Assignment[] = [];
  for (const id of ids) {
    const a = await redis.get<Assignment>(`${ASSIGNMENT_PREFIX}${id}`);
    if (a) assignments.push(a);
  }
  return assignments.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getAssignment(
  id: string
): Promise<Assignment | null> {
  return redis.get<Assignment>(`${ASSIGNMENT_PREFIX}${id}`);
}

export async function createAssignment(data: {
  studentId: string;
  pdfUrl: string;
  title: string;
  pageCount?: number;
}): Promise<Assignment> {
  const id = nanoid();
  const assignment: Assignment = {
    id,
    studentId: data.studentId,
    pdfUrl: data.pdfUrl,
    title: data.title,
    pageCount: data.pageCount,
    createdAt: new Date().toISOString(),
  };
  await redis.set(`${ASSIGNMENT_PREFIX}${id}`, assignment);
  await redis.sadd(ASSIGNMENTS_KEY, id);
  await redis.sadd(`${STUDENT_ASSIGNMENTS_PREFIX}${data.studentId}`, id);
  return assignment;
}

export async function deleteAssignment(id: string): Promise<boolean> {
  const a = await getAssignment(id);
  if (!a) return false;
  await redis.del(`${ASSIGNMENT_PREFIX}${id}`);
  await redis.del(`${ANNOTATION_PREFIX}${id}`);
  await redis.del(`${CORRECTION_PREFIX}${id}`);
  await redis.srem(ASSIGNMENTS_KEY, id);
  await redis.srem(`${STUDENT_ASSIGNMENTS_PREFIX}${a.studentId}`, id);
  return true;
}

// ──────────────────────────────────────────
// Annotations (student solution strokes)
// ──────────────────────────────────────────

export type AnnotationData = Record<number, PageAnnotation>;

export async function getAnnotation(
  assignmentId: string
): Promise<AnnotationData> {
  const data = await redis.get<AnnotationData>(
    `${ANNOTATION_PREFIX}${assignmentId}`
  );
  return data ?? {};
}

export async function setAnnotation(
  assignmentId: string,
  data: AnnotationData
): Promise<void> {
  await redis.set(`${ANNOTATION_PREFIX}${assignmentId}`, data);
}

// ──────────────────────────────────────────
// Corrections (teacher feedback strokes)
// ──────────────────────────────────────────

export type CorrectionData = Record<number, PageCorrection>;

export async function getCorrection(
  assignmentId: string
): Promise<CorrectionData> {
  const data = await redis.get<CorrectionData>(
    `${CORRECTION_PREFIX}${assignmentId}`
  );
  return data ?? {};
}

export async function setCorrection(
  assignmentId: string,
  data: CorrectionData
): Promise<void> {
  await redis.set(`${CORRECTION_PREFIX}${assignmentId}`, data);
}

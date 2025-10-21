import type { User, StudentProfile, FacultyProfile, ParentProfile } from '@prisma/client';

//EXTENDED TYPES 

//student profile plus IDs that connect them to a teacher and a parent
type StudentWithRelations = StudentProfile & {
  teacher_id?: number | null;
  parent_id?: number | null;
};

//parent profile plus a list of their children (students)
type ParentWithChildren = ParentProfile & {
  children?: StudentWithRelations[];
};

//faculty profile plus a list of students they teach
type FacultyWithStudents = FacultyProfile & {
  students?: StudentWithRelations[];
};

//ROLE HELPERS
function isAdmin(user: User | null | undefined): boolean {
  return !!user && user.role === 'admin';
}

function isFaculty(user: User | null | undefined): boolean {
  return !!user && user.role === 'faculty';
}

function isParent(user: User | null | undefined): boolean {
  return !!user && user.role === 'parent';
}

function isStudent(user: User | null | undefined): boolean {
  return !!user && user.role === 'student';
}

//FACULTY PERMISSIONS
export function canUpdateFaculty(currentUser: User | null, facultyUserId: number): boolean {
  if (!currentUser) return false;
  if (isAdmin(currentUser)) return true;
  if (isFaculty(currentUser) && currentUser.id === facultyUserId) return true;
  return false;
}

//STUDENT PERMISSIONS
export function canViewStudent(currentUser: User | null, student: StudentWithRelations): boolean {
  if (!currentUser) return false;
  if (isAdmin(currentUser)) return true;
  if (isFaculty(currentUser) && student.teacher_id === currentUser.id) return true;
  if (isParent(currentUser) && student.parent_id === currentUser.id) return true;
  return false;
}

export function canEditStudent(currentUser: User | null, student: StudentWithRelations): boolean {
  if (!currentUser) return false;
  if (isAdmin(currentUser)) return true;
  if (isParent(currentUser) && student.parent_id === currentUser.id) return true;
  return false;
}

//RELATIONSHIP MANAGEMENT
export function canManageRelationships(currentUser: User | null): boolean {
  return !!currentUser && isAdmin(currentUser);
}

export function canRequestDeletion(currentUser: User | null, student: StudentWithRelations): boolean {
  return !!currentUser && isParent(currentUser) && student.parent_id === currentUser.id;
}

//MESSAGING
export function canMessageParent(currentUser: User | null, parent: ParentWithChildren): boolean {
  if (!currentUser || !isFaculty(currentUser)) return false;
  return parent.children?.some(child => child.teacher_id === currentUser.id) ?? false;
}

export function canMessageFaculty(currentUser: User | null, faculty: FacultyWithStudents): boolean {
  if (!currentUser) return false;
  if (isAdmin(currentUser)) return true;
  if (isParent(currentUser)) {
    return faculty.students?.some(student => student.parent_id === currentUser.id) ?? false;
  }
  return false;
}

//POINT SYSTEM
export function canAwardPoints(currentUser: User | null, student: StudentWithRelations): boolean {
  return !!currentUser && isFaculty(currentUser) && student.teacher_id === currentUser.id;
}

//QUIZZES & ASSIGNMENTS
export function canViewResponses(currentUser: User | null, student: StudentWithRelations): boolean {
  if (!currentUser) return false;
  if (isAdmin(currentUser)) return true;
  if (isFaculty(currentUser) && student.teacher_id === currentUser.id) return true;
  return false;
}

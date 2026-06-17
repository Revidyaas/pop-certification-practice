import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  serverTimestamp, 
  Timestamp 
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";
import { UserProfile, AssessmentRecord, ExamRecord } from "./types";

/**
 * Normalizes a firestore timestamp to ISO string format for local UI state
 */
function toISOString(timestamp: any): string {
  if (!timestamp) return new Date().toISOString();
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toISOString();
  }
  return String(timestamp);
}

/**
 * Saves/creates a User Profile in Firestore
 */
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const path = `users/${profile.userId}`;
  try {
    const docRef = doc(db, "users", profile.userId);
    const existing = await getDoc(docRef);
    if (!existing.exists()) {
      await setDoc(docRef, {
        userId: profile.userId,
        email: profile.email,
        name: profile.name,
        role: profile.role || "student",
        createdAt: serverTimestamp()
      });
    } else {
      // Preserve existing fields, update role if needed
      await setDoc(docRef, {
        ...existing.data(),
        name: profile.name,
        email: profile.email,
      }, { merge: true });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Loads User Profile from Firestore
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        userId: data.userId || userId,
        email: data.email || "",
        name: data.name || "",
        role: data.role || "student"
      };
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

/**
 * Loads Completed Modules (Progress) from Firestore progress subcollection
 */
export async function getCompletedModules(userId: string): Promise<{ [key: string]: boolean }> {
  const path = `users/${userId}/progress/main`;
  try {
    const docRef = doc(db, "users", userId, "progress", "main");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().completedModules || {};
    }
    return {};
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

/**
 * Syncs/saves state of completed modules
 */
export async function saveCompletedModules(userId: string, completedModules: { [key: string]: boolean }): Promise<void> {
  const path = `users/${userId}/progress/main`;
  try {
    const docRef = doc(db, "users", userId, "progress", "main");
    await setDoc(docRef, {
      userId,
      completedModules,
      competencyAverages: {}, // Empty default placeholder required by schema
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Loads all Assessments for a user
 */
export async function getAssessments(userId: string): Promise<AssessmentRecord[]> {
  const path = "assessments";
  try {
    const q = query(collection(db, "assessments"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const list: AssessmentRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        assessmentId: data.assessmentId || docSnap.id,
        userId: data.userId,
        moduleTitle: data.moduleTitle || "Sertifikasi POP",
        status: data.status || "active",
        scenario: data.scenario || "",
        answers: data.answers || [],
        questions: data.questions || [],
        rubricScores: data.rubricScores,
        scoreTotal: data.scoreTotal,
        level: data.level,
        kelebihan: data.kelebihan,
        kekurangan: data.kekurangan,
        perspektif: data.perspektif,
        contohIdeal: data.contohIdeal,
        createdAt: toISOString(data.createdAt)
      });
    });
    // Sort descending by date
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

/**
 * Saves/updates Assessment record
 */
export async function saveAssessmentRecord(record: AssessmentRecord): Promise<void> {
  const path = `assessments/${record.assessmentId}`;
  try {
    const docRef = doc(db, "assessments", record.assessmentId);
    
    // Convert to Firestore structure, preserving timestamp if exists or setting new
    const existing = await getDoc(docRef);
    const createdAt = existing.exists() ? existing.data()?.createdAt : serverTimestamp();

    await setDoc(docRef, {
      assessmentId: record.assessmentId,
      userId: record.userId,
      moduleTitle: record.moduleTitle,
      status: record.status,
      scenario: record.scenario,
      answers: record.answers,
      questions: record.questions,
      rubricScores: record.rubricScores || null,
      scoreTotal: record.scoreTotal || null,
      level: record.level || null,
      kelebihan: record.kelebihan || null,
      kekurangan: record.kekurangan || null,
      perspektif: record.perspektif || null,
      contohIdeal: record.contohIdeal || null,
      createdAt
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Loads all Exam results for a user
 */
export async function getExams(userId: string): Promise<ExamRecord[]> {
  const path = "exams";
  try {
    const q = query(collection(db, "exams"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const list: ExamRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        examId: data.examId || docSnap.id,
        userId: data.userId,
        score: data.score ?? 0,
        competencyLevel: data.competencyLevel || "",
        responses: data.responses || [],
        createdAt: toISOString(data.createdAt)
      });
    });
    // Sort descending by date
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

/**
 * Saves Exam simulation scorecard
 */
export async function saveExamRecord(record: ExamRecord): Promise<void> {
  const path = `exams/${record.examId}`;
  try {
    const docRef = doc(db, "exams", record.examId);
    await setDoc(docRef, {
      examId: record.examId,
      userId: record.userId,
      score: record.score,
      competencyLevel: record.competencyLevel,
      responses: record.responses,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

# Security Specification for POP Pertambangan Firestore Rules

This document outlines the security architecture, invariants, and validation specs to prevent unauthorized writes, identity spoofing, and status alterations.

## Data Invariants

1. **User Profiles (`/users/{userId}`)**:
   - A user can only write their own user profile document.
   - The role field ("student", "instructor", "admin") cannot be modified by the user directly to prevent privilege escalation (privilege lock).
   - Only admin or system triggers can override roles.

2. **Learning Progress (`/users/{userId}/progress/main`)**:
   - Only the authenticated owner of the `userId` in the path is allowed to create, update, or retrieve their learning path records.
   - Values in average competency scores must strictly range from 0 to 100.

3. **Assessments (`/assessments/{assessmentId}`)**:
   - Users can only read and create their own interactive assessments.
   - Only the system or assessor agent can write critical system fields (like AI-suggested evaluations, actual calculated feedback, score total, level, and rubrics). Users cannot self-proclaim themselves "Sangat Kompeten".
   - Active assessments cannot have their core scenario or previous questions modified. Only incremental replies from the user are permitted during the "active" phase.
   - Once an assessment transitions to `status = 'completed'`, it is fully read-only. No further modifications are permitted (Terminal State Locking).

4. **Exams (`/exams/{examId}`)**:
   - Any score must be verified, and the user cannot manipulate the scores directly.
   - All written exams must securely reference `request.auth.uid`.

---

## The "Dirty Dozen" Malicious Payloads

1. **Payload 1: Identity Hijacking (Profile Spoofing)**
   - Attempt to write a user profile at `/users/attacker_user_id` setting `userId` to `target_user_id` to intercept session state.
2. **Payload 2: Role Escalation Attack**
   - Attempt by standard student `user_abc` to update their profile at `/users/user_abc` to set `role: "admin"`.
3. **Payload 3: Arbitrary ID Poisoning**
   - Injecting a 2MB string containing malware payloads into the `{assessmentId}` path parameter rather than a clean UUID.
4. **Payload 4: Learning Progress Trespassing**
   - Attempt by standard student `user_abc` to read the progress of high-performing candidate `user_xyz` at `/users/user_xyz/progress/main`.
5. **Payload 5: Self-Evaluation Score Stuffing**
   - Attempt to self-validate an assessment by creating `/assessments/sess_123` with high competency score totals (`"scoreTotal": 100`) directly from client-side Firestore SDKs.
6. **Payload 6: Post-Assessment Outcome Alteration**
   - Attempt by a candidate to change a completed assessment's status from "Belum Kompeten" to "Sangat Kompeten" after evaluation is posted.
7. **Payload 7: Denial of Wallet (Size Exploit)**
   - Creating a document containing a massive array of 5,000 subfield structures to increase read/write cost dynamically.
8. **Payload 8: Timewalk Timestamp Exploit**
   - Forgery of custom `createdAt` values (e.g., set to year 2035) instead of complying with `request.time` (server timestamp).
9. **Payload 9: Ghost Field Injection**
   - Appending internal key modifiers like `_bypassSecurity: true` or `isPremium: true` to bypass verification checks.
10. **Payload 10: Parent De-synchronization write**
    - Writing a progress document without ensuring proper profile reference existence.
11. **Payload 11: Spoofed Email Verification**
    - Submitting writes while bypassing verification criteria.
12. **Payload 12: Invalid Enum Injector**
    - Writing to the assessment collection with `status: "broken_status"`.

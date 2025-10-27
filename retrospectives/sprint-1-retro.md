# 📝 Sprint 1 Retrospective Report

**Project:** ClubHub  
**Date:** October 22, 2025  
**Sprint Duration:** 2 Weeks  
**Sprint Goal:** Establish project structure, set up environment (React + Express + MongoDB), implement basic Event Management System UI, and initial database schema.

---

## ✅ What Went Well

- The user interface for students (User Page) was successfully completed and fully functional.  
- AI tools (v0 AI, Figma) accelerated the UI/UX design process, saving significant development time.  
- Frontend–backend integration worked smoothly for event browsing and registration.  

---

## ⚠️ What Didn’t Go Well

### 1. Major Merge Conflicts
**Issue:** The team experienced significant merge conflicts when integrating code changes, mainly due to multiple developers working in isolation on shared files.  
**Impact:**
- Development time was lost resolving conflicts instead of building features  
- Risk of introducing bugs or losing work during conflict resolution  
- Team frustration and decreased morale  
- Delayed integration of Event Management System components (REQ-1, REQ-2, REQ-3)

### 2. Vague Trello Task Definitions
**Issue:** Tasks in Trello were insufficiently detailed and lacked clear acceptance criteria, making it difficult to track progress and understand what “done” meant.  
**Impact:**
- Uncertainty about task ownership and responsibilities  
- Difficulty estimating time and effort required  
- Incomplete implementations due to unclear requirements  
- Team members needed extra clarification before picking up tasks  
- The project manager struggled to assess sprint progress accurately  

---

## 🔧 What Could We Improve

### 1. Break Down the “Event Management” Task
- Decompose each user story into technical subtasks (2–4 hours each).  
- Include specific acceptance criteria for each subtask.  
- Define technical dependencies and integration points.  
- Assign clear ownership to individual developers.  
**Benefit:** Clearer task ownership and measurable progress.

### 2. Git Pull from Main Before Branching
All developers must always run `git pull origin main` before creating a new feature branch.  
**Benefit:** Reduces merge conflicts and ensures everyone works on the latest codebase.

### 3. Implement Formal Pull Request (PR) Process
- No direct commits to `main`.  
- All PRs must be reviewed by at least one team member before merging.  
**Benefit:** Improved code quality and early detection of issues.

### 4. Refine Trello Task Descriptions
- Use “Definition of Done” and assign clear owners.  
- Include links to related documents (UI designs, API specs).  
**Benefit:** Faster problem resolution and better team alignment.

---

## 🚀 Action Items for Sprint 2

| Action Item | Owner |
|--------------|--------|
| Design and implement Admin Dashboard UI/UX in Figma, integrate with backend. | Keereemas |
| Build Super Admin module (user permissions, reports, analytics). | Kiattisak, Ratchanon |
| Set up Pull Request (PR) template in GitHub to standardize reviews. | Poramet |
| Add API documentation and update system feature list in SRS. | Saw Thomas |
| Conduct mid-sprint review meeting and daily check-in logs on Discord. | Jomkwan, Nutchanun, Piyapat |
| Improve Trello task structure with smaller subtasks and clearer ownership. | Kiattisak, Ratchanon |
| Write basic backend unit tests for event and user endpoints. | Kiattisak, Ratchanon, Punn |

---
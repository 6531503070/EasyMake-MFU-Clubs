# 🧪 Sprint 2 Test Plan

**Project Name:** ClubHub 
**Date Created:** 21/10/2568 (October 21, 2025)  
**Authors:**  
- Keereemas Sribua  
- Jomkwan Nimphung  
- Poramet Somboonchai  
- Punn Chaiphet  
- Ratchanon Suwatsiriphol  
- Nutchanun Uttama  
- Piyapat Suwancharoen  
- Saw Thomas Maung Maung Kyaw  
- Kiattisak Deeprasert  

---

## 1. Introduction & Scope

This section outlines the specific test cases for the key user stories being developed in Sprint 2.  
Our primary goal is to ensure the **reliability, correctness, and usability** of the new features.  
These detailed test cases will guide both **manual testing efforts** and the **development of automated tests**, minimizing defects and enhancing **user satisfaction**.

---

## 2. Feature: Event Management System

### User Stories & Test Cases

| Test Case ID | Test Description | Precondition | Feature / Requirement | Test Steps | Expected Result | Priority |
|---------------|------------------|---------------|------------------------|-------------|-----------------|-----------|
| TC4.1-01 | Verify that system requires login before accessing ClubHub. | User not logging in. | Login Requirement | 1. Open ClubHub website | System redirects to login page. | High |
| TC4.1-02 | Verify that student can log in successfully. | User account exists. | Login Functionality | 1. Enter valid credentials.<br>2. Click “Login”. | System logs in user and displays event feed. | High |
| TC4.1-03 | Verify that students can view events after login. | User logged in. | View Event Feed | 1. Log in as student.<br>2. Observe the homepage. | Feed shows available events in chronological order. | High |
| TC4.1-04 | Verify that selecting a club shows its modal information. | User logged in; clubs exist. | Club Selection | 1. Click on a club from feed.<br>2. Observe system response. | System displays club modal with details (name, description, events). | Medium |
| TC4.1-05 | Verify that club admin can create a new event. | Logged in as club admin. | Create Event | 1. Navigate to “Create Event”.<br>2. Enter event title, date, time, location, description.<br>3. Click “Save”. | System saves event and displays it on event feed. | High |
| TC4.1-06 | Verify that club admin can edit an existing event. | Logged in as club admin; event exists. | Edit Event | 1. Go to event page.<br>2. Click “Edit”.<br>3. Modify details.<br>4. Save changes. | System updates event info and refreshes feed. | High |
| TC4.1-07 | Verify that club admin can delete an event. | Logged in as club admin; event exists. | Delete Event | 1. Select an event.<br>2. Click “Delete”.<br>3. Confirm deletion. | System removes event from feed. | High |
| TC4.1-08 | Verify that non-admin users cannot edit or delete events. | Logged in as student. | Event Authorization | 1. Open any event.<br>2. Check for edit/delete options. | Edit/Delete buttons not visible or access denied. | High |
| TC4.1-09 | Verify that student can register for an event. | User logged in; event exists. | Event Registration | 1. Open event details.<br>2. Click “Register”. | System confirms registration and stores it in database. | High |
| TC4.1-10 | Verify registration is saved in database. | User has registered for event. | Registration Storage | 1. Check database record / profile. | Registration entry stored and visible in “My Events.” | High |

---

## 3. Feature: Notification System

### User Story
> “As a student, I want to receive real-time notifications on my dashboard and by email when new events, updates, or cancellations occur, so that I can stay informed and never miss important activities.”

### Test Cases

| Test Case ID | Test Description | Precondition | Test Steps | Expected Result | Priority |
|---------------|------------------|---------------|-------------|-----------------|-----------|
| TC4.2-01 | Send notifications for new events | Student has subscribed to a club. | 1. Club admin adds new event.<br>2. Student checks dashboard and email. | Notification and email appear. | High |
| TC4.2-02 | Send notifications for updates | Event exists, students subscribed. | 1. Club admin updates event.<br>2. Student checks dashboard/email. | Updated notification received. | High |
| TC4.2-03 | Send notifications for cancellations | Event exists, students subscribed. | 1. Club admin cancels event.<br>2. Student checks dashboard/email. | Cancellation notification received. | High |
| TC4.2-04 | Subscribe to notifications | Student account exists. | 1. Student logs in.<br>2. Clicks “Subscribe”. | Subscription confirmed. | Medium |
| TC4.2-05 | Unsubscribe from notifications | Student already subscribed. | 1. Student logs in.<br>2. Clicks “Unsubscribe”. | Subscription removed. | Medium |
| TC4.2-06 | Notification timing | Notification system active. | 1. Club admin adds event.<br>2. Measure delay. | Delivered within seconds. | High |
| TC4.2-07 | Email delivery verification | Student subscribed with valid email. | 1. Admin adds event.<br>2. Check inbox. | Email received with correct timestamp. | High |
| TC4.2-08 | Dashboard notification display | Student subscribed and logged in. | 1. Admin adds event.<br>2. Observe dashboard. | Notification appears instantly. | High |
| TC4.2-09 | Notification filter | Two students: one subscribed, one not. | 1. Admin adds event.<br>2. Compare results. | Only subscribed student receives it. | High |

---

## 4. Feature: AI Recommendation Engine

### User Story
> “As an MFU student, I want a personalized list of recommended activities and similar clubs based on my interests, follows, and participation.”

### Test Cases (Summary)

- Personalized event feed appears after login.  
- Dynamic updates when following a new club.  
- Default recommendations for new users.  
- Updates after interaction.  
- Excludes past events.  
- Localization (TH/EN).  
- Deduplication of recommendations.  
- Real-time refresh after data change.  
- Secure, PDPA-compliant payloads.  
- Handles AI service outage gracefully.

---

## 5. System Features

### 5.1 Event Management System
**Description:** Club admins can create, update, delete events; students can browse, view, register.  
**Functional Requirements:**  
- REQ-1: Create/Edit/Delete events.  
- REQ-2: Display events in chronological order.  
- REQ-3: Allow registration and store in DB.  
- REQ-4: Restrict edit/delete to admins.

### 5.2 Notification System
**Description:** Keep students informed of event updates via dashboard and email.  
**Functional Requirements:**  
- REQ-5: Send notifications for new events/updates/cancellations.  
- REQ-6: Allow subscription/unsubscription.  
- REQ-7: Send notifications immediately.

### 5.3 AI Recommendation Engine
**Description:** Suggest events using AI based on interests and history.  
**Functional Requirements:**  
- REQ-8: Track interests and participation.  
- REQ-9: Recommend relevant events via AI.  
- REQ-10: Update dynamically when new data appears.

---

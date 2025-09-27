# E-Government Citizen Services Portal

## Project Overview
The **E-Government Citizen Services Portal** is a web application designed to allow citizens to access government services online, eliminating the need to visit government offices physically. Services include passport renewal, national ID updates, business licenses, land registration, and more.

This project has three main user sides:
1. **Citizen Side:** For normal users to apply for services.
2. **Officer Side:** For government employees to review and process requests.
3. **Admin Side:** For managers to oversee departments, officers, and generate reports.

The project is built with **Node.js**, **PostgreSQL**, and **EJS** templates. The frontend is simple but clean, using **Bootstrap** or **Tailwind CSS**. Optionally, SPA frameworks (React/Angular/Vue) can be used for enhanced citizen dashboards.

---

## Main Goals
- Allow citizens to submit requests for government services online.
- Allow officers to review, approve, or reject applications.
- Enable admins to manage users, departments, and generate statistics and reports.

---

## Features

### 1. Login & User Types
- **Citizens:** Normal users applying for services.
- **Officers:** Government employees who review requests.
- **Department Heads:** Manage officers within their department.
- **Admins:** Manage the entire system.

### 2. Profiles
- **Citizen Profile:** Name, National ID, Date of Birth, Contact Info.
- **Officer Profile:** Name, Department, Job Title.

### 3. Service Requests
- Departments offer specific services (e.g., Passport Renewal under Interior).
- Citizens fill forms and upload necessary documents.
- Request workflow: **Submitted → Under Review → Approved/Rejected**.

### 4. Document Upload
- Citizens can upload PDFs, JPGs, or other supported files for their application.

### 5. Payments (Simulated)
- Some services require a fee.
- Display a simulated payment success page.

### 6. Search & Filter
Officers and admins can search requests by:
- Name
- Request ID
- Status
- Service Type
- Date Range

### 7. Notifications
- Citizens receive notifications (in-app or email) when the status of their request changes.

### 8. Reports & Statistics
Admins can view:
- Number of requests per department
- Approved vs Rejected requests
- Total service fees collected

### 9. Multiple Departments
- Officers see only requests related to their department.
- Admin sees all requests across all departments.

---

## Frontend (EJS Templates)
- **Citizen Pages:** Login, Register, Dashboard, Apply for Service, View Request Status, Profile.
- **Officer Pages:** Login, Dashboard, Review Requests, Request Details with Documents, Approve/Reject Form.
- **Admin Pages:** Manage Departments, Services, Users, Reports (tables and charts).

**Design Guidelines:**
- Clear, simple, and user-friendly interface.
- Use **Bootstrap** for styling.


---

## Sample Database Structure

### Tables:
1. `users`: Stores all users (citizens, officers, admins).
2. `departments`: Contains all government departments.
3. `services`: Lists services under each department.
4. `requests`: Tracks all service requests by citizens.
5. `documents`: Uploaded files linked to requests.
6. `payments`: Payment details for service requests.
7. `notifications`: Messages sent to users regarding request updates.

---

## Technology Stack
- **Backend:** Node.js, Express.js
- **Frontend:** EJS Templates, Bootstrap/Tailwind CSS
- **Database:** PostgreSQL

---

## Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd e-gov-portal

```
Visit http://localhost:3000 to access the portal.



## Screenshots
![Landing Page Desktop](/public/images/screenshot.JPG)

## ✍️ Author

**Somaya Ataie**  
[GitHub Profile](https://github.com/somayaataee)



##  Deployed (Render)


[🔗 [Open live demo — https://e-goverment-portal-1.onrender.com](https://e-goverment-portal-1.onrender.com/)]


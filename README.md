# Aptitude Test Management System 📝

A backend-focused project for managing online aptitude tests, built with **Spring Boot**, **Hibernate**, and **Oracle SQL**.  
This system handles user authentication, question storage, CRUD operations, and includes dynamic subject-wise weightage functionality.

---

## 🚀 Features

- User authentication (signup & login)
- Store and manage test questions in Oracle SQL
- CRUD (Create, Read, Update, Delete) operations using Spring Boot
- Subject-wise weightage functionality to calculate marks dynamically
- RESTful API design
- API testing and debugging with Postman
- Database migration from NoSQL (MongoDB) to Oracle SQL

---

## 🛠️ Tech Stack

| Technology            | Purpose                                                      |
| -------------------- | ------------------------------------------------------------- |
| Java & Spring Boot   | Build backend RESTful services                                |
| Hibernate            | Object-Relational Mapping (ORM) for database interactions     |
| Oracle SQL           | Relational database management system                         |
| Postman              | API testing and debugging                                     |
| Maven / Gradle       | Dependency and Spring Boot dependencies management            |

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HarshitaKhare28/Project.git
Open the project in your IDE (e.g., IntelliJ, Eclipse, VS Code).

Configure the database:

    Update application.properties with your Oracle SQL credentials.
    spring.datasource.url=jdbc:oracle:thin:@localhost:1521:xe
    spring.datasource.username=YOUR_DB_USERNAME
    spring.datasource.password=YOUR_DB_PASSWORD
    spring.jpa.hibernate.ddl-auto=update

Install dependencies & build:

    mvn clean install

or if using Gradle:

    gradle build

Run the application:

    mvn spring-boot:run

or:

    gradle bootRun

### 📌 Project Modules

✅ User Module:

- Signup & Login APIs
- Store user responses in DB

✅ Question Module:

 - CRUD operations for aptitude test questions
 - Store subject-wise questions in Oracle SQL

✅ Weightage Module:

 - Marks calculation based on predefined subject weightage

### 🧪 API Testing

All APIs are tested and validated using Postman.
You can import the Postman collection (if added) to test endpoints easily.

### ✨ Learnings

 - Backend RESTful API design with Spring Boot
 - Using Hibernate for ORM and managing entity relationships
 - Migrating data from NoSQL to SQL database
 - API testing with Postman
 - Managing dependencies with Maven/Gradle
 - Implementing business logic like subject-wise weightage

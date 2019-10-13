# Subscription Service - Users Microservice
## Description
Users Owner Microservice:
- can register users to the system
- can unsubscribe from the service
- can update the users properties

## Routes
|METHOD|ROUTE              |REQUEST BODY                               |DESCRIPTION             |
|------|-------------------|-------------------------------------------|------------------------|
|GET   |/users             |                                           |Get all the users       |
|POST  |/users             |{ first_name, last_name, email, password } |Register a project owner|
|GET   |/users/:id         |                                           |Get the project owner   |
|DELETE|/users/:id         |                                           |Delete the project owner|
|PATCH |/users/:id/password|{ newPassword, oldPassword }               |Update password         |
|PATCH |/users/:id/email   |{ email, password }                        |Update email            |

## ENV variables
|NAME      |description              |
|----------|-------------------------|
|PGHOST    |postgre sql host         |
|PGUSER    |postgre sql username     |
|PGDATABASE|postgre sql database name|
|PGPASSWORD|postgre sql password     |
|PGPORT    |postgre sql port         |
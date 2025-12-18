# COMPLETE SPRING BOOT CAR RENTAL SYSTEM - IMPLEMENTATION GUIDE

## TABLE OF CONTENTS
1. Service Layer Implementation
2. Controller Layer Implementation
3. Security Configuration
4. Exception Handling
5. Mappers (Entity ↔ DTO)
6. Scheduled Jobs
7. WebSocket Configuration
8. Utility Classes
9. Configuration Files
10. Main Application Class

---

# 1. SERVICE LAYER IMPLEMENTATION

## AuthService.java
**Location:** `src/main/java/com/carrental/service/AuthService.java`

**Purpose:** Handle user authentication and authorization

**Methods to Implement:**

### register(RegisterRequest request)
- **What it does:** Creates new user account
- **Steps:**
  1. Check if username already exists (throw exception if yes)
  2. Check if email already exists (throw exception if yes)
  3. Hash the password using BCryptPasswordEncoder
  4. Create User entity with role = USER
  5. Set onlineStatus = LOGGED_OUT
  6. Save user to database
  7. Generate JWT token
  8. Convert User entity to UserResponse DTO
  9. Return AuthResponse (token + user info)

### login(LoginRequest request)
- **What it does:** Authenticates user and returns JWT token
- **Steps:**
  1. Find user by username (throw exception if not found)
  2. Verify password matches using passwordEncoder.matches()
  3. If password wrong, throw UnauthorizedException
  4. Update user onlineStatus = ACTIVE
  5. Update lastActivity = now
  6. Save user
  7. Generate JWT token
  8. Log worker action if user is WORKER or ADMIN
  9. Convert to UserResponse DTO
  10. Return AuthResponse (token + user info)

### logout(Long userId)
- **What it does:** Logs out user
- **Steps:**
  1. Find user by userId
  2. Update onlineStatus = LOGGED_OUT
  3. Update lastActivity = now
  4. Save user
  5. Log worker action if user is WORKER or ADMIN

### getCurrentUser(Long userId)
- **What it does:** Get current logged-in user details
- **Steps:**
  1. Find user by userId (throw exception if not found)
  2. Convert to UserResponse DTO
  3. Return UserResponse

---

## UserService.java
**Location:** `src/main/java/com/carrental/service/UserService.java`

**Purpose:** Manage user profile and information

**Methods to Implement:**

### getUserById(Long userId)
- **What it does:** Get user details by ID
- **Steps:**
  1. Find user by userId (throw exception if not found)
  2. Convert to UserResponse DTO
  3. Return UserResponse

### updateProfile(Long userId, UpdateProfileRequest request)
- **What it does:** Update user profile information
- **Steps:**
  1. Find user by userId
  2. Update email if provided (check if new email already exists)
  3. Update username if provided (check if new username already exists)
  4. Save user
  5. Convert to UserResponse DTO
  6. Return UserResponse

### updatePassword(Long userId, String oldPassword, String newPassword)
- **What it does:** Change user password
- **Steps:**
  1. Find user by userId
  2. Verify oldPassword matches current password
  3. If wrong, throw BadRequestException
  4. Hash newPassword
  5. Update user passwordHash
  6. Save user

### getAllUsers(Pageable pageable)
- **What it does:** Get all users (ADMIN only)
- **Steps:**
  1. Fetch all users from database with pagination
  2. Convert each User entity to UserResponse DTO
  3. Return Page<UserResponse>

### getUsersByRole(Role role)
- **What it does:** Get all users by specific role
- **Steps:**
  1. Find users by role
  2. Convert to UserResponse DTOs
  3. Return List<UserResponse>

### deleteUser(Long userId)
- **What it does:** Delete user account (ADMIN only)
- **Steps:**
  1. Find user by userId
  2. Check if user has active reservations (throw exception if yes)
  3. Delete user from database
  4. Log admin action

### updateUserRole(Long userId, Role newRole)
- **What it does:** Change user role (ADMIN only)
- **Steps:**
  1. Find user by userId
  2. Update role
  3. Save user
  4. Log admin action
  5. Return UserResponse

---

## CarService.java
**Location:** `src/main/java/com/carrental/service/CarService.java`

**Purpose:** Manage car inventory and availability

**Methods to Implement:**

### getAllCars(CarFilterRequest filter, Pageable pageable)
- **What it does:** Get all cars with optional filters and pagination
- **Steps:**
  1. Build Specification based on filters:
     - searchText: search in make/model (case-insensitive)
     - isForRent: filter by rental/sale
     - minPrice/maxPrice: price range
     - minYear/maxYear: year range
     - make: exact make match
     - model: exact model match
     - availableOnly: only available cars
  2. Apply specification to repository query
  3. Convert each Car entity to CarResponse DTO
  4. For each car, get first image as mainImageUrl
  5. Return PageResponse<CarResponse>

### getCarById(Long carId)
- **What it does:** Get detailed car information with availability
- **Steps:**
  1. Find car by carId (throw exception if not found)
  2. Get all images for this car
  3. Calculate unavailable dates:
     - Get all active reservations for this car
     - Get all active missions for this car
     - Merge all dates into unavailableDates list
  4. Convert to CarDetailResponse DTO
  5. Return CarDetailResponse

### searchCars(String searchText, Pageable pageable)
- **What it does:** Search cars by text in make/model
- **Steps:**
  1. Call repository searchByText method
  2. Convert to CarResponse DTOs
  3. Return PageResponse<CarResponse>

### getAvailableDates(Long carId, LocalDate startDate, LocalDate endDate)
- **What it does:** Get available dates for a car in date range
- **Steps:**
  1. Find car by carId
  2. Get all reservations for this car in date range
  3. Get all missions for this car in date range
  4. Create list of all dates in range
  5. Remove occupied dates (reservations + missions)
  6. Return List<LocalDate> of available dates

### createCar(CarCreateRequest request)
- **What it does:** Create new car (ADMIN only)
- **Steps:**
  1. Validate request data
  2. Create Car entity from DTO
  3. Set isAvailable = true by default
  4. Save car to database
  5. Log admin action
  6. Convert to CarResponse DTO
  7. Return CarResponse

### updateCar(Long carId, CarCreateRequest request)
- **What it does:** Update car information (ADMIN only)
- **Steps:**
  1. Find car by carId
  2. Update fields from request
  3. Save car
  4. Log admin action
  5. Convert to CarResponse DTO
  6. Return CarResponse

### deleteCar(Long carId)
- **What it does:** Delete car (ADMIN only)
- **Steps:**
  1. Find car by carId
  2. Check if car has active reservations (throw exception if yes)
  3. Check if car has active missions (throw exception if yes)
  4. Delete all car images
  5. Delete car from database
  6. Log admin action

### toggleCarAvailability(Long carId, Boolean isAvailable)
- **What it does:** Set car as available/unavailable (WORKER/ADMIN)
- **Steps:**
  1. Find car by carId
  2. Update isAvailable field
  3. Save car
  4. Log worker action
  5. Return CarResponse

### uploadCarImage(Long carId, MultipartFile file)
- **What it does:** Upload image for car
- **Steps:**
  1. Find car by carId
  2. Validate file (check if image, check size)
  3. Generate unique filename
  4. Save file to storage (local or cloud)
  5. Create CarImage entity with image URL
  6. Save to database
  7. Return image URL

### deleteCarImage(Long imageId)
- **What it does:** Delete car image
- **Steps:**
  1. Find image by imageId
  2. Delete file from storage
  3. Delete image record from database

---

## RequestService.java
**Location:** `src/main/java/com/carrental/service/RequestService.java`

**Purpose:** Handle reservation requests and approval workflow

**Methods to Implement:**

### createRequest(Long userId, ReservationRequest request)
- **What it does:** User creates a reservation request
- **Steps:**
  1. Validate dates (startDate before endDate, both in future)
  2. Find user by userId
  3. Find car by carId from request
  4. Check if car exists and is for rent
  5. Check if car is available (isAvailable = true)
  6. Check for overlapping reservations:
     - Call reservationRepository.findOverlappingReservations()
     - If overlaps exist, throw exception "Car not available for these dates"
  7. Check for overlapping missions (car on maintenance)
  8. Create Request entity:
     - Set user, car, startDate, endDate
     - Set requestStatus = PENDING
     - Set createdAt = now
  9. Save request to database
  10. Convert to RequestResponse DTO
  11. Return RequestResponse

### getMyRequests(Long userId)
- **What it does:** Get all requests for current user
- **Steps:**
  1. Find all requests by userId
  2. Convert each to RequestResponse DTO
  3. Include car details (make, model)
  4. Return List<RequestResponse>

### getRequestById(Long requestId)
- **What it does:** Get request details
- **Steps:**
  1. Find request by requestId (throw exception if not found)
  2. Convert to RequestResponse DTO
  3. Return RequestResponse

### getPendingRequests(Pageable pageable)
- **What it does:** Get all pending requests (WORKER/ADMIN)
- **Steps:**
  1. Find all requests with status = PENDING
  2. Sort by createdAt (oldest first)
  3. Convert to RequestResponse DTOs
  4. Return PageResponse<RequestResponse>

### acceptRequest(Long requestId, Long workerId)
- **What it does:** Worker accepts a request and creates reservation
- **Steps:**
  1. Find request by requestId
  2. Check if already accepted/declined
  3. Update request status = ACCEPTED
  4. Save request
  5. Create Reservation:
     - Set user from request
     - Set car from request
     - Set worker (by workerId)
     - Set startDate, endDate from request
     - Set status = ACTIVE
     - Set paymentStatus = UNPAID
  6. Save reservation
  7. Log worker action (ACCEPT_REQUEST)
  8. Convert to ReservationResponse DTO
  9. Return ReservationResponse

### declineRequest(Long requestId, Long workerId, String reason)
- **What it does:** Worker declines a request
- **Steps:**
  1. Find request by requestId
  2. Check if already accepted/declined
  3. Update request status = DECLINED
  4. Save request
  5. Log worker action (DECLINE_REQUEST) with reason
  6. Optionally: Send notification to user

### autoAcceptOldRequests()
- **What it does:** Automatically accept requests older than 15 minutes
- **Steps:**
  1. Calculate cutoffTime = now - 15 minutes
  2. Find all PENDING requests created before cutoffTime
  3. For each request:
     - Call acceptRequest() with workerId = null (system auto-accept)
     - Update request status = ACCEPTED
     - Create reservation with worker = null
  4. Log how many requests were auto-accepted

### cancelRequest(Long requestId, Long userId)
- **What it does:** User cancels their own request
- **Steps:**
  1. Find request by requestId
  2. Check if request belongs to this user
  3. Check if status is PENDING (can't cancel accepted/declined)
  4. Delete request from database

---

## ReservationService.java
**Location:** `src/main/java/com/carrental/service/ReservationService.java`

**Purpose:** Manage confirmed reservations

**Methods to Implement:**

### getAllReservations(Pageable pageable)
- **What it does:** Get all reservations (WORKER/ADMIN)
- **Steps:**
  1. Fetch all reservations with pagination
  2. Convert to ReservationResponse DTOs
  3. Include user details, car details, worker details
  4. Return PageResponse<ReservationResponse>

### getMyReservations(Long userId)
- **What it does:** Get user's own reservations
- **Steps:**
  1. Find all reservations by userId
  2. Sort by startDate (upcoming first)
  3. Convert to ReservationResponse DTOs
  4. Return List<ReservationResponse>

### getReservationById(Long reservationId)
- **What it does:** Get reservation details
- **Steps:**
  1. Find reservation by reservationId (throw exception if not found)
  2. Convert to ReservationResponse DTO
  3. Return ReservationResponse

### updateReservationStatus(Long reservationId, ReservationStatus newStatus, Long workerId)
- **What it does:** Update reservation status (WORKER/ADMIN)
- **Steps:**
  1. Find reservation by reservationId
  2. Update status to newStatus (COMPLETED, CANCELLED)
  3. Save reservation
  4. Log worker action
  5. Return ReservationResponse

### updatePaymentStatus(Long reservationId, PaymentStatus newStatus, Long workerId)
- **What it does:** Update payment status (WORKER/ADMIN)
- **Steps:**
  1. Find reservation by reservationId
  2. Update paymentStatus to newStatus (PAID, PARTIAL)
  3. Save reservation
  4. Log worker action
  5. Return ReservationResponse

### getReservationsByCarId(Long carId)
- **What it does:** Get all reservations for a specific car
- **Steps:**
  1. Find all reservations by carId
  2. Filter by status = ACTIVE
  3. Convert to ReservationResponse DTOs
  4. Return List<ReservationResponse>

### cancelReservation(Long reservationId, Long userId)
- **What it does:** User cancels their reservation
- **Steps:**
  1. Find reservation by reservationId
  2. Check if belongs to this user
  3. Check if startDate hasn't passed yet
  4. Update status = CANCELLED
  5. Save reservation
  6. Optionally: Handle refund logic

---

## MissionService.java
**Location:** `src/main/java/com/carrental/service/MissionService.java`

**Purpose:** Manage car missions (maintenance, repairs, etc.)

**Methods to Implement:**

### createMission(MissionRequest request, Long workerId)
- **What it does:** Create new mission (WORKER/ADMIN)
- **Steps:**
  1. Find car by carId from request
  2. Find worker by workerId
  3. Create Mission entity:
     - Set car, worker
     - Set missionText from request
     - Set startDate = now
     - Set finishDate = null (active mission)
  4. Update car isAvailable = false (car unavailable during mission)
  5. Save mission
  6. Save car
  7. Log worker action (CREATE_MISSION)
  8. Convert to MissionResponse DTO
  9. Return MissionResponse

### getActiveMissions()
- **What it does:** Get all active missions (finishDate = null)
- **Steps:**
  1. Call repository.findActiveMissions()
  2. Convert to MissionResponse DTOs
  3. Include car details, worker details
  4. Return List<MissionResponse>

### getMyMissions(Long workerId)
- **What it does:** Get missions assigned to specific worker
- **Steps:**
  1. Find missions by workerId
  2. Filter where finishDate = null (active only)
  3. Convert to MissionResponse DTOs
  4. Return List<MissionResponse>

### getMissionsByCarId(Long carId)
- **What it does:** Get all missions for specific car
- **Steps:**
  1. Find missions by carId
  2. Filter active missions
  3. Convert to MissionResponse DTOs
  4. Return List<MissionResponse>

### completeMission(Long missionId, Long workerId)
- **What it does:** Mark mission as complete and delete it
- **Steps:**
  1. Find mission by missionId
  2. Get car from mission
  3. Update car isAvailable = true (car back to work)
  4. Save car
  5. Delete mission from database (as per your requirement)
  6. Log worker action (COMPLETE_MISSION)

### updateMission(Long missionId, String newText)
- **What it does:** Update mission text
- **Steps:**
  1. Find mission by missionId
  2. Update missionText
  3. Save mission
  4. Return MissionResponse

### deleteMission(Long missionId)
- **What it does:** Delete mission (car back to work)
- **Steps:**
  1. Find mission by missionId
  2. Get car from mission
  3. Check if there are other active missions for this car
  4. If no other missions, update car isAvailable = true
  5. Save car
  6. Delete mission
  7. Log action

---

## WorkerLogService.java
**Location:** `src/main/java/com/carrental/service/WorkerLogService.java`

**Purpose:** Log worker and admin actions

**Methods to Implement:**

### logAction(Long workerId, ActionType actionType, String details)
- **What it does:** Create log entry for worker action
- **Steps:**
  1. Find worker by workerId
  2. Create WorkerLog entity:
     - Set worker, actionType
     - Set actionTime = now
     - Set actionDate = today
     - Set details (optional description)
  3. Save log to database

### getLogsByWorkerId(Long workerId, Pageable pageable)
- **What it does:** Get logs for specific worker (ADMIN)
- **Steps:**
  1. Find logs by workerId with pagination
  2. Sort by actionTime DESC (most recent first)
  3. Return Page<WorkerLog>

### getLogsByDate(LocalDate date)
- **What it does:** Get all logs for specific date (ADMIN)
- **Steps:**
  1. Find logs by actionDate
  2. Sort by actionTime
  3. Return List<WorkerLog>

### getLogsByActionType(ActionType actionType, Pageable pageable)
- **What it does:** Get logs filtered by action type (ADMIN)
- **Steps:**
  1. Find logs by actionType
  2. Sort by actionTime DESC
  3. Return Page<WorkerLog>

### getAllLogs(Pageable pageable)
- **What it does:** Get all worker logs (ADMIN)
- **Steps:**
  1. Fetch all logs with pagination
  2. Sort by actionTime DESC
  3. Return Page<WorkerLog>

---

## WebSocketService.java
**Location:** `src/main/java/com/carrental/service/WebSocketService.java`

**Purpose:** Handle real-time online status updates

**Methods to Implement:**

### updateUserStatus(Long userId, OnlineStatus status)
- **What it does:** Update user online status
- **Steps:**
  1. Find user by userId
  2. Update onlineStatus
  3. Update lastActivity = now
  4. Save user
  5. Broadcast status change to all connected workers via WebSocket

### handleHeartbeat(Long userId)
- **What it does:** Handle user heartbeat ping
- **Steps:**
  1. Find user by userId
  2. Update lastActivity = now
  3. If status was INACTIVE, change to ACTIVE
  4. Save user
  5. Broadcast status update if changed

### checkInactiveUsers()
- **What it does:** Check for users who became inactive
- **Steps:**
  1. Get all users with status = ACTIVE
  2. For each user:
     - If lastActivity > 2 minutes ago, set status = INACTIVE
     - Save user
     - Broadcast status change

### getOnlineWorkers()
- **What it does:** Get list of online workers (WORKER/ADMIN)
- **Steps:**
  1. Find users by role = WORKER or ADMIN
  2. Filter by onlineStatus = ACTIVE or INACTIVE
  3. Convert to UserResponse DTOs
  4. Return List<UserResponse>

---

## ImageService.java
**Location:** `src/main/java/com/carrental/service/ImageService.java`

**Purpose:** Handle image upload and storage

**Methods to Implement:**

### uploadImage(MultipartFile file, Long carId)
- **What it does:** Upload and store car image
- **Steps:**
  1. Validate file:
     - Check if file is empty
     - Check file type (only images: jpg, png, jpeg)
     - Check file size (max 5MB)
  2. Generate unique filename (UUID + original extension)
  3. Save file to storage:
     - LOCAL: Save to /uploads/cars/ folder
     - CLOUD: Upload to AWS S3 or Cloudinary
  4. Get file URL
  5. Create CarImage entity
  6. Save to database
  7. Return image URL

### deleteImage(Long imageId)
- **What it does:** Delete image file and record
- **Steps:**
  1. Find CarImage by imageId
  2. Get file path from imageUrl
  3. Delete file from storage
  4. Delete CarImage record from database

### getImagesByCarId(Long carId)
- **What it does:** Get all images for a car
- **Steps:**
  1. Find all CarImages by carId
  2. Return List<CarImage>

---

## SchedulerService.java
**Location:** `src/main/java/com/carrental/service/SchedulerService.java`

**Purpose:** Run scheduled background tasks

**Methods to Implement:**

### autoAcceptRequests()
- **What it does:** Auto-accept requests older than 15 minutes
- **Runs:** Every 5 minutes
- **Steps:**
  1. Calculate cutoffTime = now - 15 minutes
  2. Find all PENDING requests older than cutoffTime
  3. For each request:
     - Call requestService.acceptRequest() with workerId = null
  4. Log how many were auto-accepted

### updateInactiveUsers()
- **What it does:** Check and update inactive users
- **Runs:** Every 2 minutes
- **Steps:**
  1. Get all ACTIVE users
  2. For each user:
     - If lastActivity > 2 minutes ago:
       - Update status = INACTIVE
       - Broadcast via WebSocket
  3. Get all INACTIVE users
  4. For each user:
     - If lastActivity > 30 minutes ago:
       - Update status = LOGGED_OUT

---

# 2. CONTROLLER LAYER IMPLEMENTATION

## AuthController.java
**Location:** `src/main/java/com/carrental/controller/AuthController.java`

**Purpose:** Handle authentication endpoints

**Endpoints to Implement:**

### POST /api/auth/register
- **Access:** Public (no authentication)
- **Request Body:** RegisterRequest
- **Response:** AuthResponse
- **What it does:**
  1. Validate request (use @Valid annotation)
  2. Call authService.register(request)
  3. Return 201 CREATED with AuthResponse
- **Error Handling:**
  - Username exists → 409 CONFLICT
  - Email exists → 409 CONFLICT
  - Invalid data → 400 BAD REQUEST

### POST /api/auth/login
- **Access:** Public
- **Request Body:** LoginRequest
- **Response:** AuthResponse
- **What it does:**
  1. Validate request
  2. Call authService.login(request)
  3. Return 200 OK with AuthResponse
- **Error Handling:**
  - User not found → 401 UNAUTHORIZED
  - Wrong password → 401 UNAUTHORIZED

### POST /api/auth/logout
- **Access:** Authenticated users
- **Response:** Success message
- **What it does:**
  1. Get current user ID from JWT token
  2. Call authService.logout(userId)
  3. Return 200 OK

### GET /api/auth/me
- **Access:** Authenticated users
- **Response:** UserResponse
- **What it does:**
  1. Get current user ID from JWT
  2. Call authService.getCurrentUser(userId)
  3. Return 200 OK with UserResponse

---

## UserController.java
**Location:** `src/main/java/com/carrental/controller/UserController.java`

**Purpose:** User profile management

**Endpoints to Implement:**

### GET /api/users/me
- **Access:** USER, WORKER, ADMIN
- **Response:** UserResponse
- **What it does:**
  1. Get userId from JWT
  2. Call userService.getUserById(userId)
  3. Return UserResponse

### PUT /api/users/me
- **Access:** USER, WORKER, ADMIN
- **Request Body:** UpdateProfileRequest
- **Response:** UserResponse
- **What it does:**
  1. Get userId from JWT
  2. Call userService.updateProfile(userId, request)
  3. Return updated UserResponse

### PUT /api/users/me/password
- **Access:** USER, WORKER, ADMIN
- **Request Body:** { oldPassword, newPassword }
- **Response:** Success message
- **What it does:**
  1. Get userId from JWT
  2. Call userService.updatePassword(userId, oldPassword, newPassword)
  3. Return success message

### GET /api/users/{id}
- **Access:** WORKER, ADMIN
- **Path Variable:** userId
- **Response:** UserResponse
- **What it does:**
  1. Call userService.getUserById(id)
  2. Return UserResponse

---

## CarController.java
**Location:** `src/main/java/com/carrental/controller/CarController.java`

**Purpose:** Car browsing and search

**Endpoints to Implement:**

### GET /api/cars
- **Access:** Public or USER
- **Query Params:** page, size, searchText, isForRent, minPrice, maxPrice, etc.
- **Response:** PageResponse<CarResponse>
- **What it does:**
  1. Build CarFilterRequest from query params
  2. Create Pageable from page/size
  3. Call carService.getAllCars(filter, pageable)
  4. Return PageResponse

### GET /api/cars/{id}
- **Access:** Public or USER
- **Path Variable:** carId
- **Response:** CarDetailResponse
- **What it does:**
  1. Call carService.getCarById(carId)
  2. Return CarDetailResponse with images and unavailable dates

### GET /api/cars/search
- **Access:** Public or USER
- **Query Params:** searchText, page, size
- **Response:** PageResponse<CarResponse>
- **What it does:**
  1. Call carService.searchCars(searchText, pageable)
  2. Return PageResponse

### GET /api/cars/{id}/availability
- **Access:** Public or USER
- **Path Variable:** carId
- **Query Params:** startDate, endDate
- **Response:** List<LocalDate> (available dates)
- **What it does:**
  1. Parse startDate and endDate
  2. Call carService.getAvailableDates(carId, startDate, endDate)
  3. Return list of available dates

---

## RequestController.java
**Location:** `src/main/java/com/carrental/controller/RequestController.java`

**Purpose:** Handle reservation requests

**Endpoints to Implement:**

### POST /api/requests
- **Access:** USER, WORKER, ADMIN
- **Request Body:** ReservationRequest
- **Response:** RequestResponse
- **What it does:**
  1. Get userId from JWT
  2. Validate dates (startDate < endDate, both future)
  3. Call requestService.createRequest(userId, request)
  4. Return 201 CREATED with RequestResponse

### GET /api/requests/my
- **Access:** USER, WORKER, ADMIN
- **Response:** List<RequestResponse>
- **What it does:**
  1. Get userId from JWT
  2. Call requestService.getMyRequests(userId)
  3. Return list of user's requests

### GET /api/requests/{id}
- **Access:** USER (own), WORKER, ADMIN
- **Path Variable:** requestId
- **Response:** RequestResponse
- **What it does:**
  1. Call requestService.getRequestById(requestId)
  2. Check authorization (user can only see their own)
  3. Return RequestResponse

### GET /api/requests/pending
- **Access:** WORKER, ADMIN
- **Query Params:** page, size
- **Response:** PageResponse<RequestResponse>
- **What it does:**
  1. Create Pageable
  2. Call requestService.getPendingRequests(pageable)
  3. Return PageResponse

### PUT /api/requests/{id}/accept
- **Access:** WORKER, ADMIN
- **Path Variable:** requestId
- **Response:** ReservationResponse
- **What it does:**
  1. Get workerId from JWT
  2. Call requestService.acceptRequest(requestId, workerId)
  3. Return 200 OK with ReservationResponse

### PUT /api/requests/{id}/decline
- **Access:** WORKER, ADMIN
- **Path Variable:** requestId
- **Request Body:** { reason }
- **Response:** Success message
- **What it does:**
  1. Get workerId from JWT
  2. Call requestService.declineRequest(requestId, workerId, reason)
  3. Return success message

### DELETE /api/requests/{id}
- **Access:** USER (own request)
- **Path Variable:** requestId
- **Response:** Success message
- **What it does:**
  1. Get userId from JWT
  2. Call requestService.cancelRequest(requestId, userId)
  3. Return success message

---

## ReservationController.java
**Location:** `src/main/java/com/carrental/controller/ReservationController.java`

**Purpose:** Manage confirmed reservations

**Endpoints to Implement:**

### GET /api/reservations
- **Access:** WORKER, ADMIN
- **Query Params:** page, size
- **Response:** PageResponse<ReservationResponse>
- **What it does:**
  1. Create Pageable
  2. Call reservationService.getAllReservations(pageable)
  3. Return PageResponse

### GET /api/reservations/my
- **Access:** USER, WORKER, ADMIN
- **Response:** List<ReservationResponse>
- **What it does:**
  1. Get userId from JWT
  2. Call reservationService.getMyReservations(userId)
  3. Return list

### GET /api/reservations/{id}
- **Access:** USER (own), WORKER, ADMIN
- **Path Variable:** reservationId
- **Response:** ReservationResponse
- **What it does:**
  1. Call reservationService.getReservationById(reservationId)
  2. Check authorization
  3. Return ReservationResponse

### PUT /api/reservations/{id}/status
- **Access:** WORKER, ADMIN
- **Path Variable:** reservationId
- **Request Body:** { status }
- **Response:** ReservationResponse
- **What it does:**
  1. Get workerId from JWT
  2. Call reservationService.updateReservationStatus(reservationId, status, workerId)
  3. Return updated ReservationResponse

### PUT /api/reservations/{id}/payment
- **Access:** WORKER, ADMIN
- **Path Variable:** reservationId
- **Request Body:** { paymentStatus }
- **Response:** ReservationResponse
- **What it does:**
  1. Get workerId from JWT
  2. Call reservationService.updatePaymentStatus(reservationId, paymentStatus, workerId)
  3. Return updated ReservationResponse

### DELETE /api/reservations/{id}
- **Access:** USER (own), ADMIN
- **Path Variable:** reservationId
- **Response:** Success message
- **What it does:**
  1. Get userId from JWT
  2. Call reservationService.cancelReservation(reservationId, userId)
  3. Return success message

---

## MissionController.java
**Location:** `src/main/java/com/carrental/controller/MissionController.java`

**Purpose:** Manage car missions

**Endpoints to Implement:**

### POST /api/missions
- **Access:** WORKER, ADMIN
- **Request Body:** MissionRequest
- **Response:** MissionResponse
- **What it does:**
  1. Get workerId from JWT
  2. Validate request
  3. Call missionService.createMission(request, workerId)
  4. Return 201 CREATED with MissionResponse

### GET /api/missions
- **Access:** WORKER, ADMIN
- **Response:** List<MissionResponse>
- **What it does:**
  1. Call missionService.getActiveMissions()
  2. Return list of active missions

### GET /api/missions/my
- **Access:** WORKER, ADMIN
- **Response:** List<MissionResponse>
- **What it does:**
  1. Get workerId from JWT
  2. Call missionService.getMyMissions(workerId)
  3. Return worker's missions

### GET /api/missions/car/{carId}
- **Access:** WORKER, ADMIN
- **Path Variable:** carId
- **Response:** List<MissionResponse>
- **What it does:**
  1. Call missionService.getMissionsByCarId(carId)
  2. Return missions for specific car

### PUT /api/missions/{id}
- **Access:** WORKER, ADMIN
- **Path Variable:** missionId
- **Request Body:** { missionText }
- **Response:** MissionResponse
- **What it does:**
  1. Call missionService.updateMission(missionId, missionText)
  2. Return updated MissionResponse

### DELETE /api/missions/{id}
- **Access:** WORKER, ADMIN
- **Path Variable:** missionId
- **Response:** Success message
- **What it does:**
  1. Get workerId from JWT
  2. Call missionService.completeMission(missionId, workerId)
  3. Return success message

---

## WorkerController.java
**Location:** `src/main/java/com/carrental/controller/WorkerController.java`

**Purpose:** Worker-specific features

**Endpoints to Implement:**

### GET /api/worker/dashboard
- **Access:** WORKER, ADMIN
- **Response:** WorkerDashboardResponse
- **What it does:**
  1. Get workerId from JWT
  2. Get pending requests count
  3. Get active missions count
  4. Get recent 5 pending requests
  5. Get worker's active missions
  6. Build WorkerDashboardResponse
  7. Return response

### GET /api/worker/calendar
- **Access:** WORKER, ADMIN
- **Response:** CalendarResponse
- **What it does:**
  1. Get all cars
  2. For each car:
     - Get active reservations
     - Get active missions
     - Build list of occupied dates
     - Build map of date → reason
  3. Build CalendarResponse
  4. Return response

### GET /api/worker/colleagues
- **Access:** WORKER, ADMIN
- **Response:** List<UserResponse>
- **What it does:**
  1. Call webSocketService.getOnlineWorkers()
  2. Return list with online status

### PUT /api/worker/car/{carId}/availability
- **Access:** WORKER, ADMIN
- **Path Variable:** carId
- **Request Body:** { isAvailable }
- **Response:** CarResponse
- **What it does:**
  1. Get workerId from JWT
  2. Call carService.toggleCarAvailability(carId, isAvailable)
  3. Return updated CarResponse

---

## AdminController.java
**Location:** `src/main/java/com/carrental/controller/AdminController.java`

**Purpose:** Admin-only operations

**Endpoints to Implement:**

### GET /api/admin/logs
- **Access:** ADMIN only
- **Query Params:** page, size, workerId, actionType, date
- **Response:** PageResponse<WorkerLog>
- **What it does:**
  1. Create Pageable
  2. If workerId provided: call workerLogService.getLogsByWorkerId()
  3. If actionType provided: call workerLogService.getLogsByActionType()
  4. If date provided: call workerLogService.getLogsByDate()
  5. Else: call workerLogService.getAllLogs()
  6. Return PageResponse

### GET /api/admin/users
- **Access:** ADMIN only
- **Query Params:** page, size, role
- **Response:** PageResponse<UserResponse>
- **What it does:**
  1. Create Pageable
  2. If role provided: call userService.getUsersByRole(role)
  3. Else: call userService.getAllUsers(pageable)
  4. Return PageResponse

### POST /api/admin/users
- **Access:** ADMIN only
- **Request Body:** CreateUserRequest
- **Response:** UserResponse
- **What it does:**
  1. Validate request
  2. Call userService.createUser(request)
  3. Return 201 CREATED with UserResponse

### PUT /api/admin/users/{id}/role
- **Access:** ADMIN only
- **Path Variable:** userId
- **Request Body:** { role }
- **Response:** UserResponse
- **What it does:**
  1. Call userService.updateUserRole(userId, role)
  2. Return updated UserResponse

### DELETE /api/admin/users/{id}
- **Access:** ADMIN only
- **Path Variable:** userId
- **Response:** Success message
- **What it does:**
  1. Call userService.deleteUser(userId)
  2. Return success message

### POST /api/admin/cars
- **Access:** ADMIN only
- **Request Body:** CarCreateRequest
- **Response:** CarResponse
- **What it does:**
  1. Validate request
  2. Call carService.createCar(request)
  3. Return 201 CREATED with CarResponse

### PUT /api/admin/cars/{id}
- **Access:** ADMIN only
- **Path Variable:** carId
- **Request Body:** CarCreateRequest
- **Response:** CarResponse
- **What it does:**
  1. Call carService.updateCar(carId, request)
  2. Return updated CarResponse

### DELETE /api/admin/cars/{id}
- **Access:** ADMIN only
- **Path Variable:** carId
- **Response:** Success message
- **What it does:**
  1. Call carService.deleteCar(carId)
  2. Return success message

### POST /api/admin/cars/{id}/images
- **Access:** ADMIN only
- **Path Variable:** carId
- **Request Body:** MultipartFile (image)
- **Response:** { imageUrl }
- **What it does:**
  1. Call imageService.uploadImage(file, carId)
  2. Return image URL

### DELETE /api/admin/images/{id}
- **Access:** ADMIN only
- **Path Variable:** imageId
- **Response:** Success message
- **What it does:**
  1. Call imageService.deleteImage(imageId)
  2. Return success message

---

# 3. SECURITY CONFIGURATION

## SecurityConfig.java
**Location:** `src/main/java/com/carrental/config/SecurityConfig.java`

**Purpose:** Configure Spring Security with JWT

**What to Implement:**

### Bean: SecurityFilterChain
- **What it does:** Configure HTTP security
- **Steps:**
  1. Disable CSRF (using JWT, stateless)
  2. Configure CORS
  3. Set session management to STATELESS
  4. Configure authorization rules:
     - /api/auth/** → permitAll (public)
     - /api/cars (GET) → permitAll (public browsing)
     - /api/cars/{id} (GET) → permitAll
     - /api/requests/** → authenticated (USER+)
     - /api/worker/** → hasAnyRole(WORKER, ADMIN)
     - /api/admin/** → hasRole(ADMIN)
  5. Add JWT filter before UsernamePasswordAuthenticationFilter
  6. Configure exception handling

### Bean: PasswordEncoder
- **What it does:** BCrypt password encoder
- **Implementation:** 
  ```java
  return new BCryptPasswordEncoder();
  ```

### Bean: AuthenticationManager
- **What it does:** Handle authentication
- **Implementation:**
  ```java
  return authenticationConfiguration.getAuthenticationManager();
  ```

---

## JwtAuthenticationFilter.java
**Location:** `src/main/java/com/carrental/config/JwtAuthenticationFilter.java`

**Purpose:** Filter to validate JWT tokens

**What to Implement:**

### doFilterInternal()
- **What it does:** Intercept requests and validate JWT
- **Steps:**
  1. Extract JWT token from Authorization header
  2. If token exists:
     - Validate token using JwtTokenProvider
     - Extract userId from token
     - Load user from database
     - Create Authentication object
     - Set authentication in SecurityContext
  3. Continue filter chain

---

## JwtTokenProvider.java
**Location:** `src/main/java/com/carrental/security/JwtTokenProvider.java`

**Purpose:** Generate and validate JWT tokens

**What to Implement:**

### generateToken(User user)
- **What it does:** Create JWT token
- **Steps:**
  1. Set claims (userId, username, role)
  2. Set issuer, issuedAt, expiration
  3. Sign with secret key
  4. Return token string

### validateToken(String token)
- **What it does:** Check if token is valid
- **Steps:**
  1. Parse token
  2. Check signature
  3. Check expiration
  4. Return true if valid, false otherwise

### getUserIdFromToken(String token)
- **What it does:** Extract userId from token
- **Steps:**
  1. Parse token
  2. Get userId claim
  3. Return userId

---

## UserDetailsServiceImpl.java
**Location:** `src/main/java/com/carrental/security/UserDetailsServiceImpl.java`

**Purpose:** Load user for Spring Security

**What to Implement:**

### loadUserByUsername(String username)
- **What it does:** Load user details for authentication
- **Steps:**
  1. Find user by username
  2. Throw UsernameNotFoundException if not found
  3. Create UserPrincipal from User
  4. Return UserDetails

---

## UserPrincipal.java
**Location:** `src/main/java/com/carrental/security/UserPrincipal.java`

**Purpose:** UserDetails implementation

**What to Implement:**

### Create class implementing UserDetails
- **Fields:** userId, username, email, password, role
- **Methods:**
  - getAuthorities() → return role as GrantedAuthority
  - getPassword() → return password
  - getUsername() → return username
  - isAccountNonExpired() → true
  - isAccountNonLocked() → true
  - isCredentialsNonExpired() → true
  - isEnabled() → true

---

## CorsConfig.java
**Location:** `src/main/java/com/carrental/config/CorsConfig.java`

**Purpose:** Configure CORS for frontend

**What to Implement:**

### Bean: CorsConfigurationSource
- **What it does:** Allow frontend to make requests
- **Steps:**
  1. Create CorsConfiguration
  2. Set allowed origins (http://localhost:3000 for development)
  3. Set allowed methods (GET, POST, PUT, DELETE)
  4. Set allowed headers (Authorization, Content-Type)
  5. Set allowCredentials = true
  6. Register for all paths

---

## WebSocketConfig.java
**Location:** `src/main/java/com/carrental/config/WebSocketConfig.java`

**Purpose:** Configure WebSocket for real-time updates

**What to Implement:**

### registerStompEndpoints()
- **What it does:** Configure WebSocket endpoint
- **Steps:**
  1. Add endpoint /ws
  2. Set allowed origins
  3. Enable SockJS fallback

### configureMessageBroker()
- **What it does:** Configure message routing
- **Steps:**
  1. Enable simple broker for /topic
  2. Set application destination prefix /app

---

# 4. EXCEPTION HANDLING

## GlobalExceptionHandler.java
**Location:** `src/main/java/com/carrental/exception/GlobalExceptionHandler.java`

**Purpose:** Handle all exceptions globally

**What to Implement:**

### @ExceptionHandler(ResourceNotFoundException.class)
- **Response:** 404 NOT FOUND
- **Body:** ApiError with message

### @ExceptionHandler(UnauthorizedException.class)
- **Response:** 401 UNAUTHORIZED
- **Body:** ApiError with message

### @ExceptionHandler(BadRequestException.class)
- **Response:** 400 BAD REQUEST
- **Body:** ApiError with message

### @ExceptionHandler(MethodArgumentNotValidException.class)
- **Response:** 400 BAD REQUEST
- **Body:** ApiError with validation errors

### @ExceptionHandler(Exception.class)
- **Response:** 500 INTERNAL SERVER ERROR
- **Body:** ApiError with generic message

---

## Custom Exceptions

### ResourceNotFoundException.java
- **Extends:** RuntimeException
- **Used for:** Entity not found (car, user, request, etc.)

### UnauthorizedException.java
- **Extends:** RuntimeException
- **Used for:** Invalid credentials, access denied

### BadRequestException.java
- **Extends:** RuntimeException
- **Used for:** Invalid data, validation errors

---

## ApiError.java
**Location:** `src/main/java/com/carrental/exception/ApiError.java`

**Purpose:** Standard error response format

**Fields:**
- timestamp (LocalDateTime)
- status (int)
- error (String)
- message (String)
- path (String)
- validationErrors (Map<String, String>) - for validation errors

---

# 5. MAPPERS (Entity ↔ DTO)

## UserMapper.java
**Location:** `src/main/java/com/carrental/dto/mapper/UserMapper.java`

**Purpose:** Convert User entity to UserResponse DTO

**What to Implement:**

### toResponse(User user)
- **What it does:** Convert entity to DTO
- **Steps:**
  1. Create UserResponse
  2. Set userId, username, email, role, onlineStatus
  3. Return UserResponse

### toResponseList(List<User> users)
- **What it does:** Convert list of entities to DTOs
- **Implementation:** Use stream().map().collect()

---

## CarMapper.java
**Location:** `src/main/java/com/carrental/dto/mapper/CarMapper.java`

**Purpose:** Convert Car entity to DTOs

**What to Implement:**

### toResponse(Car car)
- **What it does:** Convert to CarResponse
- **Steps:**
  1. Create CarResponse
  2. Set all basic fields
  3. Get first image as mainImageUrl
  4. Return CarResponse

### toDetailResponse(Car car, List<LocalDate> unavailableDates)
- **What it does:** Convert to CarDetailResponse
- **Steps:**
  1. Create CarDetailResponse
  2. Set all fields
  3. Get all image URLs
  4. Set unavailableDates
  5. Return CarDetailResponse

---

## RequestMapper.java
**Location:** `src/main/java/com/carrental/dto/mapper/RequestMapper.java`

**Purpose:** Convert Request entity to RequestResponse DTO

**What to Implement:**

### toResponse(Request request)
- **What it does:** Convert entity to DTO
- **Steps:**
  1. Create RequestResponse
  2. Set requestId, userId, username
  3. Set carId, carMake, carModel
  4. Set requestStatus, startDate, endDate, createdAt
  5. Return RequestResponse

---

## ReservationMapper.java
**Location:** `src/main/java/com/carrental/dto/mapper/ReservationMapper.java`

**Purpose:** Convert Reservation entity to ReservationResponse DTO

**What to Implement:**

### toResponse(Reservation reservation)
- **What it does:** Convert entity to DTO
- **Steps:**
  1. Create ReservationResponse
  2. Set reservationId, userId, username
  3. Set carId, carMake, carModel
  4. Set workerId, workerUsername (if worker exists)
  5. Set startDate, endDate, paymentStatus, status, createdAt
  6. Return ReservationResponse

---

## MissionMapper.java
**Location:** `src/main/java/com/carrental/dto/mapper/MissionMapper.java`

**Purpose:** Convert Mission entity to MissionResponse DTO

**What to Implement:**

### toResponse(Mission mission)
- **What it does:** Convert entity to DTO
- **Steps:**
  1. Create MissionResponse
  2. Set missionId, carId, carMake, carModel
  3. Set workerId, workerUsername
  4. Set missionText, startDate, finishDate, createdAt
  5. Return MissionResponse

---

# 6. SCHEDULED JOBS

## SchedulerService.java (Expanded)
**Location:** `src/main/java/com/carrental/service/SchedulerService.java`

**Purpose:** Run scheduled background tasks

**Annotations:** @Component, @EnableScheduling

### autoAcceptRequests()
- **Annotation:** @Scheduled(fixedRate = 300000) // 5 minutes
- **What it does:** Auto-accept requests ≥15 minutes old
- **Steps:**
  1. Calculate cutoffTime = now - 15 minutes
  2. Call requestRepository.findPendingRequestsOlderThan(cutoffTime)
  3. For each request:
     - Call requestService.acceptRequest(requestId, null)
  4. Log how many were accepted

### updateInactiveUsers()
- **Annotation:** @Scheduled(fixedRate = 120000) // 2 minutes
- **What it does:** Update user online status
- **Steps:**
  1. Get all ACTIVE users
  2. For each:
     - If lastActivity > 2 min ago → set INACTIVE
  3. Get all INACTIVE users
  4. For each:
     - If lastActivity > 30 min ago → set LOGGED_OUT
  5. Broadcast status changes via WebSocket

---

# 7. WEBSOCKET CONFIGURATION

## WebSocketService.java (Expanded)
**Location:** `src/main/java/com/carrental/service/WebSocketService.java`

**Purpose:** Handle real-time communication

**What to Implement:**

### Broadcasting
- **Destination:** /topic/online-status
- **Message Format:** 
  ```json
  {
    "userId": 10,
    "username": "john_doe",
    "onlineStatus": "ACTIVE"
  }
  ```

### Heartbeat Handler
- **Endpoint:** /app/heartbeat
- **What it does:**
  1. Receive heartbeat from user
  2. Update lastActivity
  3. Update status to ACTIVE if was INACTIVE

---

# 8. UTILITY CLASSES

## DateUtil.java
**Location:** `src/main/java/com/carrental/util/DateUtil.java`

**Purpose:** Date manipulation utilities

**Methods to Implement:**

### getDatesBetween(LocalDate start, LocalDate end)
- **Returns:** List<LocalDate>
- **What it does:** Generate all dates between start and end

### isDateInFuture(LocalDateTime date)
- **Returns:** boolean
- **What it does:** Check if date is after now

### isDateRangeValid(LocalDateTime start, LocalDateTime end)
- **Returns:** boolean
- **What it does:** Check if start before end, both in future

---

## ValidationUtil.java
**Location:** `src/main/java/com/carrental/util/ValidationUtil.java`

**Purpose:** Custom validation logic

**Methods to Implement:**

### isValidEmail(String email)
- **Returns:** boolean
- **What it does:** Validate email format

### isValidPassword(String password)
- **Returns:** boolean
- **What it does:** Check password strength (min 6 chars)

### isValidImageFile(MultipartFile file)
- **Returns:** boolean
- **What it does:** Check if file is image and under size limit

---

## Constants.java
**Location:** `src/main/java/com/carrental/util/Constants.java`

**Purpose:** Application constants

**Constants to Define:**

```java
public class Constants {
    // JWT
    public static final String JWT_SECRET = "your-secret-key-here";
    public static final long JWT_EXPIRATION = 86400000; // 24 hours
    
    // File Upload
    public static final long MAX_FILE_SIZE = 5242880; // 5MB
    public static final String[] ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/jpg"};
    
    // Request Auto-Accept
    public static final int REQUEST_AUTO_ACCEPT_MINUTES = 15;
    
    // Online Status
    public static final int INACTIVE_THRESHOLD_MINUTES = 2;
    public static final int LOGGED_OUT_THRESHOLD_MINUTES = 30;
    
    // Pagination
    public static final int DEFAULT_PAGE_SIZE = 20;
}
```

---

# 9. CONFIGURATION FILES

## application.yml
**Location:** `src/main/resources/application.yml`

**What to Configure:**

```yaml
spring:
  application:
    name: car-rental-system
  
  datasource:
    url: jdbc:postgresql://localhost:5432/car_rental_db
    username: your_username
    password: your_password
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update  # Use 'validate' in production
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  
  servlet:
    multipart:
      max-file-size: 5MB
      max-request-size: 10MB
  
jwt:
  secret: ${JWT_SECRET:your-secret-key-change-in-production}
  expiration: 86400000  # 24 hours

server:
  port: 8080
  error:
    include-message: always
    include-binding-errors: always

logging:
  level:
    com.carrental: DEBUG
    org.springframework.security: DEBUG
```

## application-dev.yml
**Location:** `src/main/resources/application-dev.yml`

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/car_rental_dev
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: create-drop  # Recreate schema on startup

logging:
  level:
    com.carrental: DEBUG
```

## application-prod.yml
**Location:** `src/main/resources/application-prod.yml`

```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    show-sql: false
    hibernate:
      ddl-auto: validate  # Don't modify schema

logging:
  level:
    com.carrental: INFO
```

---

# 10. MAIN APPLICATION CLASS

## CarRentalApplication.java
**Location:** `src/main/java/com/carrental/CarRentalApplication.java`

**What to Implement:**

```java
package com.carrental;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CarRentalApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(CarRentalApplication.class, args);
    }
}
```

---

# 11. POM.XML DEPENDENCIES

**Location:** `pom.xml`

**Dependencies to Add:**

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Boot Starter Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- Spring Boot Starter Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- Spring Boot Starter Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- Spring Boot Starter WebSocket -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-websocket</artifactId>
    </dependency>
    
    <!-- PostgreSQL Driver -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- Spring Boot Starter Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    
    <!-- Spring Security Test -->
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

# 12. IMPLEMENTATION CHECKLIST

## Phase 1: Core Setup ✓
- [x] Entity classes
- [x] Enums
- [x] DTOs
- [x] Repositories

## Phase 2: Security & Auth
- [ ] SecurityConfig
- [ ] JwtTokenProvider
- [ ] JwtAuthenticationFilter
- [ ] UserDetailsServiceImpl
- [ ] UserPrincipal
- [ ] CorsConfig

## Phase 3: Services
- [ ] AuthService
- [ ] UserService
- [ ] CarService
- [ ] RequestService
- [ ] ReservationService
- [ ] MissionService
- [ ] WorkerLogService
- [ ] ImageService
- [ ] WebSocketService
- [ ] SchedulerService

## Phase 4: Controllers
- [ ] AuthController
- [ ] UserController
- [ ] CarController
- [ ] RequestController
- [ ] ReservationController
- [ ] MissionController
- [ ] WorkerController
- [ ] AdminController

## Phase 5: Supporting Components
- [ ] Mappers (5 classes)
- [ ] Exception Handling (GlobalExceptionHandler + custom exceptions)
- [ ] Utility Classes (DateUtil, ValidationUtil, Constants)
- [ ] WebSocket Configuration
- [ ] Configuration Files (application.yml)

## Phase 6: Testing & Deployment
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] API Documentation (Swagger/OpenAPI)
- [ ] Docker Configuration
- [ ] CI/CD Pipeline

---

# 13. TESTING ENDPOINTS

## Using Postman/Insomnia

### 1. Register User
```
POST http://localhost:8080/api/auth/register
Body: {
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Login
```
POST http://localhost:8080/api/auth/login
Body: {
  "username": "john_doe",
  "password": "password123"
}
Response: {
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer",
  "user": {...}
}
```

### 3. Get All Cars
```
GET http://localhost:8080/api/cars?page=0&size=20&isForRent=true
```

### 4. Create Request (Authenticated)
```
POST http://localhost:8080/api/requests
Headers: Authorization: Bearer {token}
Body: {
  "carId": 1,
  "startDate": "2024-12-20T10:00:00",
  "endDate": "2024-12-25T10:00:00"
}
```

### 5. Worker Dashboard
```
GET http://localhost:8080/api/worker/dashboard
Headers: Authorization: Bearer {worker_token}
```

---

# END OF IMPLEMENTATION GUIDE

This document provides the complete roadmap for implementing the Car Rental System. Follow each section step by step, implementing the methods and endpoints as described. Each method includes detailed steps showing exactly what needs to be done

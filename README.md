# TÀI LIỆU PHÂN TÍCH SOURCE CODE BACKEND (CHI TIẾT 166+ FILES)

**Mục đích**: Tài liệu này dùng để tra cứu nhanh chức năng của **TỪNG FILE CODE** trong hệ thống. Dành riêng cho các câu hỏi vấn đáp kiểu "File này ở đâu? Nó làm gì?".

---

# 📊 THỐNG KÊ KỸ THUẬT
- **Tổng số Modules**: 28
- **Tổng số Files Java**: ~166 files
- **Phạm vi**: Toàn bộ thư mục `backend/src/main/java/edu/uth/backend`

---

# 📂 DANH MỤC CHI TIẾT (THEO MODULE)

## 1. Module `config` (Cấu hình hệ thống)
*Chứa các file cài đặt môi trường, bảo mật, và kết nối.*
*   `SecurityConfig.java`: **QUAN TRỌNG NHẤT**. Cấu hình Spring Security (tắt CSRF, chỉnh CORS, phân quyền URL, add JWT Filter).
*   `FirebaseConfig.java`: Kết nối Google Firebase Admin SDK (để verify token Google Login).
*   `WebClientConfig.java`: Cấu hình `WebClient` để gọi API sang AI Service (Python).
*   `WebConfig.java`: Cấu hình chung cho Web MVC.
*   `WebMvcConfig.java`: Cấu hình đường dẫn tĩnh (Static Resources) để phục vụ file upload từ folder `uploads/`.
*   `AsyncConfig.java`: Bật tính năng chạy bất đồng bộ (`@Async`) cho việc gửi email (để không block user).
*   `DataSeeder.java`: Class chạy 1 lần khi start app. Tự động tạo Admin Account và các Roles mặc định nếu chưa có.
*   `VietnamLocalDateTimeSerializer.java`: Format ngày tháng về múi giờ Việt Nam khi trả về JSON.

## 2. Module `entity` (Database Models)
*Định nghĩa cấu trúc bảng dữ liệu (JPA Entities).*
*   `User.java`: Bảng `users`. Chứa email, passwordHash, provider (LOCAL/GOOGLE), firebaseUid.
*   `Role.java`: Bảng `roles`. Chứa tên quyền (ROLE_ADMIN, ROLE_CHAIR...).
*   `Conference.java`: Bảng thông tin hội nghị.
*   `Track.java`: Bảng track (chủ đề) của hội nghị.
*   `Paper.java`: Bảng bài báo khoa học. Chứa title, abstract, path file, trạng thái.
*   `PaperCoAuthor.java`: Bảng phụ lưu đồng tác giả của bài báo.
*   `ReviewAssignment.java`: Bảng trung gian phân công (Paper <-> Reviewer).
*   `Review.java`: Bảng kết quả chấm điểm.
*   `ConflictOfInterest.java`: Bảng ghi nhận xung đột lợi ích.
*   `PasswordResetOtp.java`: Bảng lưu mã OTP reset pass (có thời hạn).
*   `AIFeatureFlag.java`: Bảng bật/tắt tính năng AI dynamic.
*   `AIAuditLog.java`: Bảng log lịch sử gọi AI.
*   `UserActivityHistory.java`: Bảng log hành động user (Login, Submit...).
*   `Discussion.java`: Bảng lưu thảo luận/comment.
*   `BaseEntity.java`: Class cha (MappedSuperclass), chứa `id`, `createdAt`, `updatedAt` tự động.
*   Các Enums: `PaperStatus`, `AssignmentStatus`, `ActivityType`, `AuthProvider`...

## 3. Module `auth` (Xác thực & Phân quyền)
*Xử lý Đăng ký, Đăng nhập, Quên mật khẩu.*
*   `AuthController.java`: Chứa các API `/api/auth/*` (Login, Register, VerifyOTP...).
*   `AuthService.java`: Logic cốt lõi. Hash password, sinh JWT, verify Firebase token.
*   `dto/RegisterRequest.java`, `LoginRequest.java`: Các DTO hứng dữ liệu đầu vào.
*   `dto/AuthResponse.java`: DTO trả về Token + User Info.

## 4. Module `security` (Bảo mật chuyên sâu)
*Các class tiện ích hỗ trợ Spring Security.*
*   `JwtTokenProvider.java`: Sinh ra chuỗi JWT và Verify (giải mã) chuỗi JWT.
*   `JwtAuthFilter.java`: Filter đứng chặn trước mọi request. Nhiệm vụ: Lấy token từ header -> Verify -> Gán User vào Context.
*   `CustomUserDetailsService.java`: Hàm `loadUserByUsername()` chuẩn của Spring, convert `User` (Entity) sang `UserDetails` (Security).
*   `SecurityUtils.java`: Hàm static `getCurrentUserLogin()` để lấy user đang đăng nhập ở bất kỳ đâu trong code.

## 5. Module `submission` (Nộp bài)
*   `SubmissionController.java`: API nộp bài, upload file.
*   `SubmissionService.java`: Logic check deadline, lưu file PDF vào ổ cứng, lưu Paper vào DB.
*   `PaperController.java` & `PaperService.java`: Các thao tác xem/sửa/xóa bài báo.

## 6. Module `assignment` (Phân công)
*   `ReviewAssignmentController.java`: API để Chair phân công Reviewer.
*   `ReviewAssignmentService.java`: Logic phân công. Kiểm tra COI, kiểm tra trùng lặp, gửi email mời.
*   `AIAssignmentService.java`: Logic AI gợi ý Reviewer dựa trên độ tương đồng văn bản (Matching).
*   `ConflictController.java`: API khai báo xung đột lợi ích.

## 7. Module `review` (Chấm điểm)
*   `ReviewController.java`: API nộp kết quả review.
*   `ReviewService.java`: Logic lưu điểm, tính điểm trung bình, cập nhật status Paper.
*   `PaperSynopsisService.java`: Logic AI tóm tắt bài báo giúp Reviewer đọc nhanh.

## 8. Module `decision` (Quyết định)
*   `DecisionController.java`: API ra quyết định (Accept/Reject).
*   `DecisionService.java`: Logic chuyển trạng thái bài báo, gửi email thông báo kết quả hàng loạt.

## 9. Module `ai` (Tích hợp AI)
*   `AIController.java`: API Gateway cho các tính năng AI (Grammar check, Polish...)
*   `AIProxyService.java`: Class quan trọng dùng `WebClient` để bắn request sang Python Backend.
*   `AIGovernanceService.java`: Logic ghi log (Audit) mọi lần gọi AI để kiểm soát chi phí/nội dung.

## 10. Module `admin` (Quản trị)
*   `AdminUserController.java`: API quản lý danh sách User (Block/Unblock).
*   `DashboardStatsController.java`: API lấy số liệu vẽ biểu đồ Dashboard.
*   `dto/DashboardStatsDTO.java`: DTO chứa số liệu tổng hợp.

## 11. Module `repository` (Data Access Layer)
*Gồm 18 interfaces kế thừa `JpaRepository`.*
*   Đây là nơi giao tiếp trực tiếp với Database. Các hàm như `findByEmail`, `countByStatus` được Spring tự động generate SQL.

## 12. Module `common` & `util` (Tiện ích)
*   `FileStorageUtil.java`: Hàm hỗ trợ save file, load file resource.
*   `MailService.java`: Đóng gói logic gửi email SMTP.
*   `OtpUtil.java`: Hàm sinh chuỗi số ngẫu nhiên.

## 13. Các Module khác
*   `proceedings`: Xuất bản kỷ yếu hội nghị.
*   `history`: Lịch sử hoạt động.
*   `backup`: Sao lưu dữ liệu.
*   `discussion`: Tính năng chat/trao đổi.
*   `notification`: Thông báo thời gian thực (nếu có).

---

# 🤖 GIẢI THÍCH CODE HAY (ĐIỂM CỘNG)

## `@Transactional` là gì?
Dùng trong Service. Ví dụ hàm `submitPaper` lưu 3 bảng (Paper, CoAuthor, File). Nếu lưu bảng CoAuthor bị lỗi, `@Transactional` sẽ tự động **Rollback** (xóa) dữ liệu Paper đã lưu trước đó. Đảm bảo data luôn sạch (Atomic).

## `@PreAuthorize("hasRole('ADMIN')")`
Dùng trong Controller. Kiểm tra user có quyền ADMIN mới cho chạy hàm này. Nếu không -> Trả về lỗi 403 Forbidden.

## `FetchType.EAGER` vs `LAZY`
*   `EAGER`: Load cha là load con luôn (VD: Load User load luôn Role). Tốn RAM nhưng tiện.
*   `LAZY`: Load cha chưa load con. Khi nào gọi `user.getPapers()` mới query DB tiếp. Tiết kiệm RAM nhưng dễ dính lỗi `LazyInitializationException` nếu không cẩn thận.

---

**Tài liệu này dùng để trả lời chuyên sâu về CODE. Hãy kết hợp với tài liệu TỔNG QUAN để đạt điểm tối đa!**






# TÀI LIỆU VẤN ĐÁP ĐỒ ÁN - HỆ THỐNG QUẢN LÝ HỘI NGHỊ KHOA HỌC

## MỤC LỤC
1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Kiến trúc Backend](#2-kiến-trúc-backend)
3. [Công nghệ sử dụng](#3-công-nghệ-sử-dụng)
4. [Cấu trúc dự án](#4-cấu-trúc-dự-án)
5. [Luồng xác thực (Authentication)](#5-luồng-xác-thực-authentication)
6. [Luồng nghiệp vụ chính](#6-luồng-nghiệp-vụ-chính)
7. [Cơ sở dữ liệu](#7-cơ-sở-dữ-liệu)
8. [Tích hợp AI Service](#8-tích-hợp-ai-service)
9. [Bảo mật và phân quyền](#9-bảo-mật-và-phân-quyền)
10. [API Endpoints](#10-api-endpoints)

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1. Mục đích
Hệ thống quản lý hội nghị khoa học (Conference Management System) giúp tự động hóa quy trình:
- **Tác giả (Author)**: Nộp bài báo, theo dõi trạng thái, nhận kết quả
- **Người chấm (Reviewer)**: Nhận phân công, chấm điểm, đánh giá bài báo
- **Chủ tọa (Chair)**: Quản lý hội nghị, phân công reviewer, ra quyết định
- **Quản trị (Admin)**: Quản lý người dùng, cấu hình hệ thống

### 1.2. Đặc điểm nổi bật
- **Xác thực đa phương thức**: Local (email/password) + Google OAuth
- **Phân quyền linh hoạt**: Role-based access control (RBAC)
- **Tích hợp AI**: Hỗ trợ tác giả, reviewer, chair bằng Gemini API
- **Double-blind review**: Ẩn danh tác giả và reviewer
- **Quản lý xung đột lợi ích (COI)**: Tự động phát hiện và ngăn chặn
- **Email tự động**: Thông báo qua SMTP
- **Audit logging**: Ghi nhận mọi hành động quan trọng

---

## 2. KIẾN TRÚC BACKEND

### 2.1. Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│              (React + Vite + TailwindCSS)                    │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST API
                       │ JWT Token
┌──────────────────────▼──────────────────────────────────────┐
│                    SPRING BOOT BACKEND                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  CONTROLLER LAYER (API Endpoints)                      │ │
│  │  - AuthController, SubmissionController, etc.          │ │
│  └────────────────────┬───────────────────────────────────┘ │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────────┐ │
│  │  SERVICE LAYER (Business Logic)                        │ │
│  │  - AuthService, SubmissionService, ReviewService       │ │
│  └────────────────────┬───────────────────────────────────┘ │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────────┐ │
│  │  REPOSITORY LAYER (Data Access)                        │ │
│  │  - JPA Repositories (Spring Data JPA)                  │ │
│  └────────────────────┬───────────────────────────────────┘ │
└───────────────────────┼──────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
│  PostgreSQL  │ │   Redis    │ │  Firebase  │
│   Database   │ │   Cache    │ │    Auth    │
└──────────────┘ └────────────┘ └────────────┘
```

### 2.2. Mô hình 3 lớp (3-tier Architecture)

#### **Layer 1: Controller (Presentation Layer)**
- Nhận HTTP request từ frontend
- Validate input (DTO với Bean Validation)
- Gọi Service layer
- Trả về HTTP response (JSON)

**Ví dụ**: `SubmissionController.java`
```java
@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {
    @PostMapping("/submit")
    public ResponseEntity<?> submitPaper(@RequestBody SubmitRequest req) {
        // Validate → Call Service → Return Response
    }
}
```

#### **Layer 2: Service (Business Logic Layer)**
- Xử lý logic nghiệp vụ
- Kiểm tra quyền hạn, điều kiện
- Gọi Repository để truy vấn/lưu dữ liệu
- Gọi các service khác (Email, File Storage, AI)

**Ví dụ**: `SubmissionService.java`
```java
@Service
public class SubmissionService {
    public Paper submitPaper(...) {
        // 1. Validate deadline
        // 2. Check duplicate
        // 3. Save file
        // 4. Save to database
        // 5. Log activity
    }
}
```

#### **Layer 3: Repository (Data Access Layer)**
- Truy vấn database qua JPA
- Không chứa logic nghiệp vụ
- Tự động generate SQL từ method name

**Ví dụ**: `PaperRepository.java`
```java
public interface PaperRepository extends JpaRepository<Paper, Long> {
    List<Paper> findByMainAuthorId(Long authorId);
    boolean existsByMainAuthorIdAndTrackIdAndTitle(...);
}
```

---

## 3. CÔNG NGHỆ SỬ DỤNG

### 3.1. Backend Stack
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Java** | 21 | Ngôn ngữ lập trình chính |
| **Spring Boot** | 3.5.9 | Framework backend |
| **Spring Security** | 6.x | Xác thực và phân quyền |
| **Spring Data JPA** | 3.x | ORM (Object-Relational Mapping) |
| **PostgreSQL** | 15+ | Cơ sở dữ liệu quan hệ |
| **Redis** | 7+ | Cache và session storage |
| **Firebase Admin SDK** | 9.4.2 | Google OAuth authentication |
| **JWT (jjwt)** | 0.12.6 | JSON Web Token |
| **JavaMail** | 2.0.1 | Gửi email SMTP |
| **Flyway** | 10.x | Database migration |
| **Lombok** | 1.18.36 | Giảm boilerplate code |

### 3.2. Dependency chính (pom.xml)
```xml
<dependencies>
    <!-- Spring Boot Starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- Spring Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- PostgreSQL Driver -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.6</version>
    </dependency>
    
    <!-- Firebase Admin SDK -->
    <dependency>
        <groupId>com.google.firebase</groupId>
        <artifactId>firebase-admin</artifactId>
        <version>9.4.2</version>
    </dependency>
</dependencies>
```

---

## 4. CẤU TRÚC DỰ ÁN

### 4.1. Cấu trúc thư mục
```
backend/src/main/java/edu/uth/backend/
├── admin/              # Quản lý admin (dashboard, users)
├── ai/                 # Tích hợp AI service
├── assignment/         # Phân công reviewer
├── audit/              # Audit logging
├── auth/               # Xác thực (login, register, OAuth)
├── backup/             # Backup/restore database
├── cameraready/        # Quản lý camera-ready files
├── common/             # Utilities (Mail, File, OTP)
├── conference/         # Quản lý hội nghị
├── config/             # Cấu hình (Security, Firebase, CORS)
├── decision/           # Quyết định accept/reject
├── discussion/         # Thảo luận giữa reviewers
├── email/              # Email service
├── entity/             # JPA Entities (User, Paper, Review...)
├── exception/          # Exception handlers
├── history/            # User activity history
├── notification/       # Thông báo
├── proceedings/        # Kỷ yếu công khai
├── rbac/               # Role-based access control
├── report/             # Báo cáo thống kê
├── repository/         # JPA Repositories
├── review/             # Chấm điểm bài báo
├── security/           # JWT, Audit Logger
├── submission/         # Nộp bài báo
├── user/               # Quản lý user profile
└── util/               # Utilities
```

### 4.2. Các Entity chính


#### **User (Người dùng)**
```java
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private String passwordHash;  // BCrypt hash
    
    @Enumerated(EnumType.STRING)
    private AuthProvider provider;  // LOCAL hoặc GOOGLE
    
    private String firebaseUid;     // UID từ Firebase
    private String fullName;
    private String affiliation;     // Đơn vị công tác
    private String avatarUrl;
    
    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Role> roles;        // AUTHOR, REVIEWER, CHAIR, ADMIN
}
```

**Quan hệ**:
- 1 User có nhiều Roles (Many-to-Many)
- 1 User có nhiều Papers (One-to-Many)
- 1 User có nhiều ReviewAssignments (One-to-Many)

#### **Conference (Hội nghị)**
```java
@Entity
@Table(name = "conferences")
public class Conference {
    @Id @GeneratedValue
    private Long id;
    
    private String name;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    
    @ManyToOne
    private User organizer;  // Chair tổ chức
    
    // Các deadline quan trọng
    private LocalDateTime submissionDeadline;
    private LocalDateTime reviewDeadline;
    private LocalDateTime cameraReadyDeadline;
    
    private Boolean isBlindReview;  // Double-blind review
    private Boolean isHidden;       // Ẩn khỏi danh sách công khai
    private Boolean isLocked;       // Khóa không cho chỉnh sửa
    
    @OneToMany(mappedBy = "conference")
    private List<Track> tracks;
}
```

**Quan hệ**:
- 1 Conference có nhiều Tracks (One-to-Many)
- 1 Conference thuộc về 1 Organizer/Chair (Many-to-One)

#### **Track (Chủ đề hội nghị)**
```java
@Entity
@Table(name = "tracks")
public class Track {
    @Id @GeneratedValue
    private Long id;
    
    private String name;
    private String description;
    
    @ManyToOne
    private Conference conference;
    
    @OneToMany(mappedBy = "track")
    private List<Paper> papers;
}
```

#### **Paper (Bài báo)**
```java
@Entity
@Table(name = "papers")
public class Paper {
    @Id @GeneratedValue
    private Long id;
    
    private String title;
    private String abstractText;
    private String keywords;
    private String filePath;           // File PDF gốc
    private String cameraReadyPath;    // File PDF camera-ready
    
    @Enumerated(EnumType.STRING)
    private PaperStatus status;  // SUBMITTED, UNDER_REVIEW, ACCEPTED, REJECTED, WITHDRAWN
    
    @ManyToOne
    private User mainAuthor;
    
    @ManyToOne
    private Track track;
    
    @OneToMany(mappedBy = "paper")
    private List<PaperCoAuthor> coAuthors;
}
```

**Trạng thái Paper**:
- `SUBMITTED`: Vừa nộp, chưa phân công reviewer
- `UNDER_REVIEW`: Đang được chấm
- `ACCEPTED`: Được chấp nhận
- `REJECTED`: Bị từ chối
- `WITHDRAWN`: Tác giả rút bài

#### **ReviewAssignment (Phân công chấm bài)**
```java
@Entity
@Table(name = "review_assignments")
public class ReviewAssignment {
    @Id @GeneratedValue
    private Long id;
    
    @ManyToOne
    private Paper paper;
    
    @ManyToOne
    private User reviewer;
    
    @Enumerated(EnumType.STRING)
    private AssignmentStatus status;  // PENDING, ACCEPTED, DECLINED, COMPLETED
    
    private LocalDateTime assignedDate;
    private LocalDateTime dueDate;
    
    @OneToOne(mappedBy = "assignment")
    private Review review;
}
```

**Trạng thái Assignment**:
- `PENDING`: Chờ reviewer xác nhận
- `ACCEPTED`: Reviewer đồng ý chấm
- `DECLINED`: Reviewer từ chối
- `COMPLETED`: Đã nộp review

#### **Review (Đánh giá)**
```java
@Entity
@Table(name = "reviews")
public class Review {
    @Id @GeneratedValue
    private Long id;
    
    @OneToOne
    private ReviewAssignment assignment;
    
    private Integer score;              // Điểm từ -3 đến +3
    private Integer confidenceLevel;    // Độ tự tin 1-5
    
    @Column(columnDefinition = "TEXT")
    private String commentForAuthor;    // Nhận xét cho tác giả
    
    @Column(columnDefinition = "TEXT")
    private String commentForPC;        // Nhận xét nội bộ (Program Committee)
    
    private LocalDateTime submittedAt;
}
```

---

## 5. LUỒNG XÁC THỰC (AUTHENTICATION)

### 5.1. Đăng ký tài khoản LOCAL

**Flow**:
```
1. User nhập email, password, fullName
2. Frontend gửi POST /api/auth/register
3. Backend (AuthService.register):
   a. Validate email chưa tồn tại
   b. Validate password >= 6 ký tự
   c. Hash password bằng BCrypt
   d. Tạo User với provider = LOCAL
   e. Gán role AUTHOR mặc định
   f. [TÙY CHỌN] Tạo Firebase user (nếu config bật)
   g. Phát hành JWT token
4. Frontend lưu token vào localStorage
5. Redirect đến dashboard
```

**Code chi tiết** (`AuthService.java`):
```java
@Transactional
public AuthResponse register(RegisterRequest req) {
    // 1. Chuẩn hóa email
    String email = req.getEmail().trim().toLowerCase();
    
    // 2. Kiểm tra email đã tồn tại
    if (userRepository.existsByEmail(email)) {
        throw new IllegalArgumentException("Email đã tồn tại");
    }
    
    // 3. Validate password
    if (req.getPassword().length() < 6) {
        throw new IllegalArgumentException("Mật khẩu phải >= 6 ký tự");
    }
    
    // 4. Lấy role AUTHOR
    Role authorRole = roleRepository.findByName("ROLE_AUTHOR")
        .orElseGet(() -> roleRepository.save(new Role("ROLE_AUTHOR")));
    
    // 5. Tạo user
    User user = new User();
    user.setEmail(email);
    user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
    user.setFullName(req.getFullName());
    user.setProvider(AuthProvider.LOCAL);
    user.getRoles().add(authorRole);
    
    // 6. Lưu database
    User saved = userRepository.save(user);
    
    // 7. Audit log
    auditLogger.logRegistration(email, getClientIp());
    
    // 8. Phát hành JWT
    return buildAuthResponse(saved);
}
```

**Lưu ý**:
- Password được hash bằng **BCrypt** (không lưu plain text)
- Email được chuẩn hóa (lowercase, trim) để tránh trùng lặp
- Mặc định gán role `ROLE_AUTHOR`
- Có thể tự động tạo Firebase user (config: `app.auth.create-firebase-user`)

### 5.2. Đăng nhập LOCAL

**Flow**:
```
1. User nhập email, password
2. Frontend gửi POST /api/auth/login
3. Backend (AuthService.login):
   a. Chuẩn hóa email
   b. Kiểm tra user tồn tại và provider = LOCAL
   c. Authenticate bằng Spring Security (tự động check password hash)
   d. Phát hành JWT token
   e. Log activity
4. Frontend lưu token
5. Redirect đến dashboard
```

**Code chi tiết**:
```java
public AuthResponse login(LoginRequest req) {
    String email = req.getEmail().trim().toLowerCase();
    
    // 1. Kiểm tra user tồn tại
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new IllegalArgumentException("Email hoặc mật khẩu không đúng"));
    
    // 2. Kiểm tra provider
    if (user.getProvider() != AuthProvider.LOCAL) {
        throw new IllegalArgumentException(
            "Tài khoản này đăng nhập bằng " + user.getProvider());
    }
    
    // 3. Authenticate (Spring Security tự check password)
    try {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, req.getPassword())
        );
        
        // Audit log success
        auditLogger.logLoginSuccess(email, getClientIp());
        
        // Log activity
        activityHistoryService.logActivity(
            user.getId(), ActivityType.LOGIN, EntityType.USER, 
            user.getId(), "Đăng nhập thành công", null, getClientIp()
        );
    } catch (Exception e) {
        // Audit log failure
        auditLogger.logLoginFailure(email, getClientIp(), e.getMessage());
        throw e;
    }
    
    // 4. Phát hành JWT
    return buildAuthResponse(user);
}
```

### 5.3. Đăng nhập Google OAuth

**Flow**:
```
1. User click "Login with Google" trên frontend
2. Frontend mở Firebase Authentication popup
3. User đăng nhập Google → Firebase trả về ID Token
4. Frontend gửi POST /api/auth/firebase-google với idToken
5. Backend (AuthService.loginWithFirebaseGoogle):
   a. Verify ID Token bằng Firebase Admin SDK
   b. Extract email, uid, name, picture từ token
   c. Tìm user trong database:
      - Nếu CHƯA TỒN TẠI: tạo user mới với provider = GOOGLE
      - Nếu ĐÃ TỒN TẠI (LOCAL): merge thành GOOGLE
      - Nếu ĐÃ TỒN TẠI (GOOGLE): cập nhật thông tin
   d. Phát hành JWT token
6. Frontend lưu token
7. Redirect đến dashboard
```

**Code chi tiết**:
```java
@Transactional
public AuthResponse loginWithFirebaseGoogle(FirebaseLoginRequest req) throws Exception {
    // 1. Verify Firebase ID Token
    FirebaseToken decoded = FirebaseAuth.getInstance().verifyIdToken(req.getIdToken());
    
    // 2. Extract thông tin
    String email = decoded.getEmail().trim().toLowerCase();
    String uid = decoded.getUid();
    String name = (String) decoded.getClaims().getOrDefault("name", "");
    String picture = (String) decoded.getClaims().getOrDefault("picture", null);
    
    // 3. Lấy role AUTHOR
    Role authorRole = roleRepository.findByName("ROLE_AUTHOR")
        .orElseGet(() -> roleRepository.save(new Role("ROLE_AUTHOR")));
    
    // 4. Tìm hoặc tạo user
    User user = userRepository.findByEmail(email).orElse(null);
    
    if (user == null) {
        // 4a. Tạo user mới
        user = new User();
        user.setEmail(email);
        user.setProvider(AuthProvider.GOOGLE);
        user.setFirebaseUid(uid);
        user.setFullName(name);
        user.setAvatarUrl(picture);
        user.getRoles().add(authorRole);
        user = userRepository.save(user);
        
        // Log first login
        activityHistoryService.logActivity(
            user.getId(), ActivityType.LOGIN, EntityType.USER,
            user.getId(), "Đăng nhập lần đầu qua Google", null, getClientIp()
        );
    } else {
        // 4b. Merge account (LOCAL → GOOGLE)
        if (user.getProvider() == AuthProvider.LOCAL) {
            user.setProvider(AuthProvider.GOOGLE);
        }
        user.setFirebaseUid(uid);
        if (user.getFullName() == null) user.setFullName(name);
        if (user.getAvatarUrl() == null) user.setAvatarUrl(picture);
        user = userRepository.save(user);
        
        // Log login
        activityHistoryService.logActivity(
            user.getId(), ActivityType.LOGIN, EntityType.USER,
            user.getId(), "Đăng nhập qua Google", null, getClientIp()
        );
    }
    
    // 5. Phát hành JWT
    return buildAuthResponse(user);
}
```

**Lưu ý**:
- Firebase Admin SDK verify token → đảm bảo an toàn
- Hỗ trợ **merge account**: user đăng ký LOCAL có thể đăng nhập Google sau
- Avatar và displayName được đồng bộ từ Google

### 5.4. Quên mật khẩu (Forgot Password)

**Flow 2 bước**:
```
BƯỚC 1: Gửi OTP
1. User nhập email
2. Frontend gửi POST /api/auth/forgot-password
3. Backend:
   a. Kiểm tra email tồn tại (không lộ thông tin)
   b. Tạo OTP 6 số
   c. Hash OTP bằng SHA-256
   d. Lưu hash vào database (bảng password_reset_otp)
   e. Gửi OTP qua email SMTP
4. Frontend hiển thị form nhập OTP

BƯỚC 2: Verify OTP và reset password
5. User nhập OTP
6. Frontend gửi POST /api/auth/verify-otp
7. Backend:
   a. Hash OTP nhập vào
   b. So sánh với hash trong database
   c. Kiểm tra hết hạn (5 phút)
   d. Kiểm tra số lần thử (max 5 lần)
   e. Nếu đúng: tạo verified token
8. Frontend nhận verified token
9. User nhập mật khẩu mới
10. Frontend gửi POST /api/auth/reset-password với token + newPassword
11. Backend:
    a. Verify token
    b. Hash password mới
    c. Cập nhật passwordHash
    d. Đánh dấu token đã dùng
12. Redirect đến login
```

**Lưu ý bảo mật**:
- OTP chỉ lưu **hash** (SHA-256), không lưu plain text
- OTP hết hạn sau **5 phút**
- Giới hạn **5 lần thử** sai
- Verified token hết hạn sau **30 phút**
- Token chỉ dùng **1 lần** (đánh dấu `usedAt`)

### 5.5. JWT Token

**Cấu trúc JWT**:
```json
{
  "header": {
    "alg": "HS512",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user@example.com",
    "userId": 123,
    "roles": ["ROLE_AUTHOR"],
    "iat": 1704067200,
    "exp": 1704153600
  },
  "signature": "..."
}
```

**Thời gian sống**: 24 giờ (config: `app.jwt.expiration-ms`)

**Cách sử dụng**:
1. Frontend lưu token vào `localStorage`
2. Mỗi request gửi header: `Authorization: Bearer <token>`
3. Backend verify token bằng `JwtAuthFilter`
4. Nếu hợp lệ: set `SecurityContext` với user info
5. Nếu hết hạn: trả về 401 Unauthorized

---

## 6. LUỒNG NGHIỆP VỤ CHÍNH

### 6.1. Nộp bài báo (Submit Paper)

**Actor**: Author

**Flow**:

```
1. Author chọn hội nghị và track
2. Điền thông tin: title, abstract, keywords, co-authors
3. Upload file PDF
4. Frontend gửi POST /api/submissions/submit (multipart/form-data)
5. Backend (SubmissionService.submitPaper):
   a. Validate file PDF (size, extension, MIME type)
   b. Kiểm tra duplicate (cùng author + track + title)
   c. Kiểm tra deadline (submissionDeadline)
   d. Kiểm tra conference không bị khóa (isLocked)
   e. Lưu file vào thư mục uploads/submissions/
   f. Tạo Paper entity với status = SUBMITTED
   g. Lưu co-authors vào bảng paper_co_authors
   h. Log activity
6. Trả về Paper object
7. Frontend hiển thị thông báo thành công
```

**Code chi tiết** (`SubmissionService.java`):
```java
@Transactional
public Paper submitPaper(String title, String abstractText, Long authorId, 
                         Long trackId, MultipartFile file, 
                         List<CoAuthorDTO> coAuthors, String keywords) {
    // 1. Validate file
    fileValidationService.validatePdfFile(file);
    
    // 2. Kiểm tra duplicate
    boolean isDuplicate = paperRepo.existsByMainAuthorIdAndTrackIdAndTitle(
        authorId, trackId, title
    );
    if (isDuplicate) {
        throw new IllegalArgumentException("Bạn đã nộp bài này rồi!");
    }
    
    // 3. Lấy author và track
    User author = userRepo.findById(authorId)
        .orElseThrow(() -> new ResourceNotFoundException("User", authorId));
    Track track = trackRepo.findById(trackId)
        .orElseThrow(() -> new ResourceNotFoundException("Track", trackId));
    
    Conference conf = track.getConference();
    
    // 4. Kiểm tra conference locked
    if (conf.getIsLocked() != null && conf.getIsLocked()) {
        throw new IllegalArgumentException("Hội nghị đã bị khóa!");
    }
    
    // 5. Kiểm tra deadline
    if (conf.getSubmissionDeadline() != null && 
        LocalDateTime.now().isAfter(conf.getSubmissionDeadline())) {
        throw new IllegalArgumentException("Đã quá hạn nộp bài!");
    }
    
    // 6. Lưu file
    String fileName = fileStorageUtil.saveFile(file, "submissions");
    
    // 7. Tạo Paper
    Paper paper = new Paper();
    paper.setTitle(title);
    paper.setAbstractText(abstractText);
    paper.setKeywords(keywords);
    paper.setFilePath(fileName);
    paper.setMainAuthor(author);
    paper.setTrack(track);
    paper.setStatus(PaperStatus.SUBMITTED);
    
    Paper saved = paperRepo.save(paper);
    
    // 8. Lưu co-authors
    if (coAuthors != null) {
        for (CoAuthorDTO dto : coAuthors) {
            PaperCoAuthor coAuthor = new PaperCoAuthor();
            coAuthor.setPaper(saved);
            coAuthor.setName(dto.getName());
            coAuthor.setEmail(dto.getEmail());
            coAuthor.setAffiliation(dto.getAffiliation());
            coAuthorRepo.save(coAuthor);
        }
    }
    
    // 9. Log activity
    activityHistoryService.logActivity(
        authorId, ActivityType.SUBMIT_PAPER, EntityType.PAPER,
        saved.getId(), "Nộp bài mới: " + title,
        activityHistoryService.createPaperMetadata(title, conf.getName(), conf.getId()),
        null
    );
    
    return saved;
}
```

**Validation file PDF**:
```java
public void validatePdfFile(MultipartFile file) {
    // 1. Kiểm tra file không rỗng
    if (file.isEmpty()) {
        throw new IllegalArgumentException("File không được để trống!");
    }
    
    // 2. Kiểm tra extension
    String filename = file.getOriginalFilename();
    if (!filename.toLowerCase().endsWith(".pdf")) {
        throw new IllegalArgumentException("Chỉ chấp nhận file PDF!");
    }
    
    // 3. Kiểm tra MIME type
    String contentType = file.getContentType();
    if (!"application/pdf".equals(contentType)) {
        throw new IllegalArgumentException("MIME type không hợp lệ!");
    }
    
    // 4. Kiểm tra size (max 10MB)
    long maxSize = 10 * 1024 * 1024; // 10MB
    if (file.getSize() > maxSize) {
        throw new IllegalArgumentException("File quá lớn (max 10MB)!");
    }
}
```

### 6.2. Phân công reviewer (Assign Reviewer)

**Actor**: Chair

**Flow**:
```
1. Chair xem danh sách papers trong hội nghị
2. Chọn paper cần phân công
3. Chọn reviewer từ danh sách
4. Frontend gửi POST /api/assignments/assign
5. Backend (ReviewAssignmentService.assignReviewer):
   a. Kiểm tra paper và reviewer tồn tại
   b. Kiểm tra conference không bị khóa
   c. Kiểm tra chưa quá deadline
   d. Kiểm tra COI (Conflict of Interest):
      - Tác giả không được tự chấm bài mình
      - Reviewer đã khai báo COI → chặn
      - Cùng affiliation → cảnh báo
   e. Kiểm tra không trùng lặp (1 reviewer chỉ chấm 1 lần)
   f. Tạo ReviewAssignment với status = PENDING
   g. Cập nhật Paper status = UNDER_REVIEW
   h. Gửi email thông báo cho reviewer
6. Trả về ReviewAssignment
7. Frontend hiển thị thông báo thành công
```

**Code chi tiết** (`ReviewAssignmentService.java`):
```java
@Transactional
public ReviewAssignment assignReviewer(Long paperId, Long reviewerId) {
    // 1. Lấy paper và reviewer
    Paper paper = paperRepo.findById(paperId)
        .orElseThrow(() -> new RuntimeException("Bài báo không tồn tại!"));
    User reviewer = userRepo.findById(reviewerId)
        .orElseThrow(() -> new RuntimeException("Reviewer không tồn tại!"));
    
    // 2. Kiểm tra conference locked
    Conference conf = paper.getTrack().getConference();
    if (conf.getIsLocked() != null && conf.getIsLocked()) {
        throw new RuntimeException("Hội nghị đã bị khóa!");
    }
    
    // 3. Kiểm tra deadline
    if (conf.getReviewDeadline() != null && 
        LocalDateTime.now().isAfter(conf.getReviewDeadline())) {
        throw new RuntimeException("Đã quá hạn chấm bài!");
    }
    
    // 4. Kiểm tra COI: Tác giả không tự chấm
    if (paper.getMainAuthor().getId().equals(reviewerId)) {
        throw new RuntimeException("Tác giả không thể tự chấm bài!");
    }
    
    // 5. Kiểm tra COI: Đã khai báo xung đột
    if (coiRepo.existsByPaperIdAndReviewerId(paperId, reviewerId)) {
        throw new RuntimeException("Reviewer đã khai báo xung đột lợi ích!");
    }
    
    // 6. Kiểm tra COI: Cùng affiliation
    String authorAff = paper.getMainAuthor().getAffiliation();
    String reviewerAff = reviewer.getAffiliation();
    if (authorAff != null && reviewerAff != null && 
        authorAff.equalsIgnoreCase(reviewerAff)) {
        throw new RuntimeException("Cảnh báo COI: Cùng đơn vị công tác!");
    }
    
    // 7. Kiểm tra trùng lặp
    if (assignmentRepo.existsByPaperIdAndReviewerId(paperId, reviewerId)) {
        throw new RuntimeException("Reviewer đã được phân công rồi!");
    }
    
    // 8. Tạo assignment
    ReviewAssignment assignment = new ReviewAssignment();
    assignment.setPaper(paper);
    assignment.setReviewer(reviewer);
    assignment.setStatus(AssignmentStatus.PENDING);
    assignment.setAssignedDate(LocalDateTime.now());
    assignment.setDueDate(conf.getReviewDeadline());
    
    ReviewAssignment saved = assignmentRepo.save(assignment);
    
    // 9. Cập nhật paper status
    if (paper.getStatus() == PaperStatus.SUBMITTED) {
        paper.setStatus(PaperStatus.UNDER_REVIEW);
        paperRepo.save(paper);
    }
    
    // 10. Gửi email
    try {
        emailService.sendAssignmentNotification(saved);
    } catch (Exception e) {
        System.err.println("Gửi email thất bại: " + e.getMessage());
    }
    
    return saved;
}
```

**Xử lý COI (Conflict of Interest)**:
- **Level 1**: Tác giả không tự chấm → CHẶN
- **Level 2**: Reviewer khai báo COI → CHẶN
- **Level 3**: Cùng affiliation → CẢNH BÁO (có thể cho phép nếu Chair quyết định)

### 6.3. Chấm bài (Submit Review)

**Actor**: Reviewer

**Flow**:
```
1. Reviewer xem danh sách assignments (status = ACCEPTED hoặc PENDING)
2. Click vào assignment để xem paper
3. Download PDF, đọc bài
4. Điền form review:
   - Score: -3 đến +3 (theo chuẩn EasyChair)
   - Confidence: 1-5
   - Comment for Author: Nhận xét công khai
   - Comment for PC: Nhận xét nội bộ (chỉ Chair xem)
5. Frontend gửi POST /api/reviews/submit
6. Backend (ReviewService.submitReview):
   a. Kiểm tra assignment tồn tại
   b. Kiểm tra conference không bị khóa
   c. Kiểm tra chưa quá deadline
   d. Kiểm tra status != COMPLETED (chưa chấm)
   e. Validate score (-3 đến +3)
   f. Tạo Review entity
   g. Cập nhật assignment status = COMPLETED
   h. Gửi email thông báo cho Chair
7. Trả về Review
8. Frontend hiển thị thông báo thành công
```

**Code chi tiết** (`ReviewService.java`):
```java
@Transactional
public Review submitReview(Long assignmentId, int score, int confidence,
                           String commentAuthor, String commentPC) {
    // 1. Lấy assignment
    ReviewAssignment assignment = assignmentRepo.findById(assignmentId)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy phân công!"));
    
    // 2. Kiểm tra conference locked
    Conference conf = assignment.getPaper().getTrack().getConference();
    if (conf.getIsLocked() != null && conf.getIsLocked()) {
        throw new RuntimeException("Hội nghị đã bị khóa!");
    }
    
    // 3. Kiểm tra deadline
    if (conf.getReviewDeadline() != null && 
        LocalDateTime.now().isAfter(conf.getReviewDeadline())) {
        throw new RuntimeException("Đã quá hạn chấm bài!");
    }
    
    // 4. Kiểm tra đã chấm chưa
    if (assignment.getStatus() == AssignmentStatus.COMPLETED) {
        throw new RuntimeException("Bạn đã chấm bài này rồi!");
    }
    
    // 5. Validate score
    if (score < -3 || score > 3) {
        throw new RuntimeException("Điểm không hợp lệ (phải từ -3 đến +3)!");
    }
    
    // 6. Tạo Review
    Review review = new Review();
    review.setAssignment(assignment);
    review.setScore(score);
    review.setConfidenceLevel(confidence);
    review.setCommentForAuthor(commentAuthor);
    review.setCommentForPC(commentPC);
    review.setSubmittedAt(LocalDateTime.now());
    
    Review saved = reviewRepo.save(review);
    
    // 7. Cập nhật assignment
    assignment.setStatus(AssignmentStatus.COMPLETED);
    assignmentRepo.save(assignment);
    
    // 8. Gửi email cho Chair
    try {
        emailService.sendReviewSubmittedNotification(saved);
    } catch (Exception e) {
        System.err.println("Gửi email thất bại: " + e.getMessage());
    }
    
    return saved;
}
```

**Thang điểm EasyChair**:
- `+3`: Strong Accept
- `+2`: Accept
- `+1`: Weak Accept
- `0`: Borderline
- `-1`: Weak Reject
- `-2`: Reject
- `-3`: Strong Reject

### 6.4. Ra quyết định (Make Decision)

**Actor**: Chair

**Flow**:
```
1. Chair xem danh sách papers với reviews
2. Xem tổng hợp điểm và nhận xét
3. Quyết định ACCEPT hoặc REJECT
4. Frontend gửi POST /api/decisions/make
5. Backend (DecisionService.makeDecision):
   a. Kiểm tra paper tồn tại
   b. Kiểm tra conference không bị khóa
   c. Kiểm tra paper đang UNDER_REVIEW
   d. Kiểm tra đã có đủ reviews (tối thiểu 2)
   e. Cập nhật Paper status = ACCEPTED hoặc REJECTED
   f. Gửi email thông báo cho tác giả
6. Trả về Paper
7. Frontend hiển thị thông báo thành công
```

**Lưu ý**:
- Chair có thể override điểm của reviewers (quyền cuối cùng)
- Nên có ít nhất **2-3 reviews** trước khi quyết định
- Email thông báo sử dụng template khác nhau cho ACCEPT/REJECT

---

## 7. CƠ SỞ DỮ LIỆU

### 7.1. Database Schema

**Các bảng chính**:
```
users                    # Người dùng
roles                    # Vai trò (AUTHOR, REVIEWER, CHAIR, ADMIN)
user_roles               # Many-to-Many: User ↔ Role
conferences              # Hội nghị
tracks                   # Chủ đề hội nghị
papers                   # Bài báo
paper_co_authors         # Đồng tác giả
review_assignments       # Phân công chấm bài
reviews                  # Đánh giá
conflicts_of_interest    # Xung đột lợi ích
audit_logs               # Audit log
user_activity_history    # Lịch sử hoạt động
ai_audit_logs            # AI audit log
ai_feature_flags         # AI feature flags
paper_synopsis           # Tóm tắt AI
email_drafts             # Email drafts AI
discussions              # Thảo luận
password_reset_tokens    # Token reset password
password_reset_otp       # OTP reset password
```

### 7.2. Quan hệ giữa các bảng

```
User (1) ----< (N) Paper [mainAuthor]
User (1) ----< (N) ReviewAssignment [reviewer]
User (1) ----< (N) Conference [organizer]
User (N) ----< (M) Role [user_roles]

Conference (1) ----< (N) Track
Track (1) ----< (N) Paper

Paper (1) ----< (N) PaperCoAuthor
Paper (1) ----< (N) ReviewAssignment
Paper (1) ----< (N) ConflictOfInterest

ReviewAssignment (1) ---- (1) Review
```

### 7.3. Flyway Migration

**Flyway** quản lý database schema version:
- File migration: `src/main/resources/db/migration/V{version}__{description}.sql`
- Tự động chạy khi start application
- Tracking version trong bảng `flyway_schema_history`

**Ví dụ migration**:
```sql
-- V10__create_ai_tables.sql
CREATE TABLE ai_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    feature_name VARCHAR(100),
    action VARCHAR(50),
    input_data TEXT,
    output_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_feature_flags (
    id BIGSERIAL PRIMARY KEY,
    feature_name VARCHAR(100) UNIQUE,
    enabled BOOLEAN DEFAULT true,
    description TEXT
);
```

---

## 8. TÍCH HỢP AI SERVICE

### 8.1. Kiến trúc AI Service

```
Backend (Spring Boot)
    │
    ├─ AIProxyService.java
    │   └─ WebClient → HTTP Request
    │
    └─ AIGovernanceService.java
        └─ Check feature flags, audit log

                ↓ HTTP

AI Service (Python FastAPI)
    │
    ├─ API Endpoints (/api/v1/...)
    │
    ├─ LLM Client (Gemini API)
    │
    └─ NLP Services
        ├─ Abstract Enhancer
        ├─ Keyword Extractor
        ├─ Spell Checker
        ├─ Synopsis Generator
        └─ Email Generator
```

### 8.2. Các tính năng AI

#### **Cho Author**:
1. **Polish Abstract**: Cải thiện abstract
2. **Extract Keywords**: Trích xuất từ khóa
3. **Check Spelling**: Kiểm tra chính tả
4. **Check Language**: Kiểm tra ngôn ngữ

#### **Cho Reviewer**:
1. **Generate Synopsis**: Tạo tóm tắt bài báo
2. **Extract Key Points**: Trích xuất điểm chính

#### **Cho Chair**:
1. **Suggest Assignments**: Gợi ý phân công reviewer
2. **Generate Email Drafts**: Tạo email mẫu
3. **Summarize Reviews**: Tổng hợp reviews

### 8.3. AI Governance

**Feature Flags**:
- Bật/tắt từng tính năng AI
- Lưu trong bảng `ai_feature_flags`

**Audit Logging**:
- Ghi nhận mọi request AI
- Lưu input/output
- Tracking usage

**Data Privacy**:
- Double-blind: Ẩn tên tác giả khi gửi cho AI
- Không lưu trữ dữ liệu nhạy cảm

---

## 9. BẢO MẬT VÀ PHÂN QUYỀN

### 9.1. Spring Security Configuration

**SecurityConfig.java**:
```java
@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**", "/uploads/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/conferences/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/proceedings/**").permitAll()
                // Protected endpoints
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

**Giải thích**:
- `csrf().disable()`: Tắt CSRF (vì dùng JWT, không dùng session)
- `sessionManagement(STATELESS)`: Không lưu session
- `permitAll()`: Cho phép truy cập không cần đăng nhập
- `authenticated()`: Yêu cầu đăng nhập
- `jwtAuthFilter`: Filter verify JWT token

### 9.2. JWT Authentication Filter

**JwtAuthFilter.java**:
```java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response,
                                    FilterChain filterChain) {
        // 1. Lấy token từ header
        String token = extractTokenFromRequest(request);
        
        if (token != null && jwtTokenProvider.validateToken(token)) {
            // 2. Parse token
            String email = jwtTokenProvider.getEmailFromToken(token);
            
            // 3. Load user
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            
            // 4. Set SecurityContext
            UsernamePasswordAuthenticationToken auth = 
                new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
                );
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        
        filterChain.doFilter(request, response);
    }
}
```

### 9.3. Method-level Security

**Sử dụng annotation**:
```java
@PreAuthorize("hasRole('CHAIR')")
public ReviewAssignment assignReviewer(Long paperId, Long reviewerId) {
    // Chỉ Chair mới gọi được
}

@PreAuthorize("hasAnyRole('AUTHOR', 'CHAIR')")
public Paper getPaperById(Long paperId) {
    // Author hoặc Chair mới xem được
}
```

### 9.4. CORS Configuration

**Cho phép frontend gọi API**:
```java
@Bean
CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration cfg = new CorsConfiguration();
    cfg.setAllowedOrigins(List.of("http://localhost:5173"));
    cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    cfg.setAllowedHeaders(List.of("*"));
    cfg.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", cfg);
    return source;
}
```

---

## 10. API ENDPOINTS

### 10.1. Authentication APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/auth/register` | Đăng ký LOCAL | Public |
| POST | `/api/auth/login` | Đăng nhập LOCAL | Public |
| POST | `/api/auth/firebase-google` | Đăng nhập Google | Public |
| POST | `/api/auth/forgot-password` | Gửi OTP | Public |
| POST | `/api/auth/verify-otp` | Verify OTP | Public |
| POST | `/api/auth/reset-password` | Reset password | Public |

### 10.2. Submission APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/submissions/submit` | Nộp bài | AUTHOR |
| GET | `/api/submissions/my-papers` | Danh sách bài của tôi | AUTHOR |
| GET | `/api/submissions/{id}` | Chi tiết bài | AUTHOR/CHAIR |
| PUT | `/api/submissions/{id}` | Sửa bài | AUTHOR |
| DELETE | `/api/submissions/{id}/withdraw` | Rút bài | AUTHOR |

### 10.3. Assignment APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/assignments/assign` | Phân công reviewer | CHAIR |
| GET | `/api/assignments/my-assignments` | Danh sách phân công của tôi | REVIEWER |
| GET | `/api/assignments/paper/{paperId}` | Danh sách phân công của paper | CHAIR |
| PUT | `/api/assignments/{id}/accept` | Chấp nhận phân công | REVIEWER |
| PUT | `/api/assignments/{id}/decline` | Từ chối phân công | REVIEWER |
| DELETE | `/api/assignments/{id}` | Xóa phân công | CHAIR |

### 10.4. Review APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/reviews/submit` | Nộp review | REVIEWER |
| GET | `/api/reviews/paper/{paperId}` | Danh sách reviews của paper | CHAIR |
| GET | `/api/reviews/assignment/{assignmentId}` | Review của assignment | REVIEWER/CHAIR |

### 10.5. AI APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/ai/author/polish-abstract` | Cải thiện abstract | AUTHOR |
| POST | `/api/ai/author/extract-keywords` | Trích xuất từ khóa | AUTHOR |
| POST | `/api/ai/reviewer/generate-synopsis` | Tạo tóm tắt | REVIEWER |
| POST | `/api/ai/chair/suggest-assignments` | Gợi ý phân công | CHAIR |
| POST | `/api/ai/chair/generate-email` | Tạo email mẫu | CHAIR |

---

## KẾT LUẬN

Hệ thống Conference Management System được xây dựng với kiến trúc 3 lớp rõ ràng, sử dụng Spring Boot và các công nghệ hiện đại. Các điểm mạnh:

1. **Bảo mật cao**: JWT + Spring Security + Firebase Auth
2. **Phân quyền linh hoạt**: RBAC với 4 roles
3. **Tích hợp AI**: Hỗ trợ tác giả, reviewer, chair
4. **Audit logging**: Ghi nhận mọi hành động
5. **Email tự động**: Thông báo qua SMTP
6. **COI detection**: Phát hiện xung đột lợi ích
7. **Double-blind review**: Bảo mật danh tính

Hệ thống đã sẵn sàng cho việc triển khai và sử dụng thực tế.

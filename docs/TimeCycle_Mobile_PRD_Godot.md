# Product Requirements Document - TimeCycle Mobile App
## Godot 4.6 Edition | Native iOS & Android

**Version:** 2.0 (Mobile Edition)  
**Engine:** Godot 4.6+  
**Target Platforms:** iOS 14+, Android 11+  
**Status:** Planning Phase  

---

## 1. Executive Summary

**TimeCycle** là native mobile app dành cho iOS & Android giúp người dùng quản lý thời gian và tăng cường năng suất thông qua các chu kỳ luyện tập khoa học.

**Khác với Web App:**
- 🔔 Native notifications & push alerts
- 📱 Full-screen immersive experience
- ⚡ Offline-first functionality
- 🔋 Optimized battery consumption
- 📊 Native device integration (sensors, background)
- 🎵 Rich audio engine integration
- 💾 Secure local storage

---

## 2. Platform Requirements

### iOS Requirements
| Requirement | Specification |
|-------------|---------------|
| **Min Version** | iOS 14.0+ |
| **Device** | iPhone 11+, iPad |
| **Permissions** | Notifications, Audio |
| **Framework** | Godot iOS Export |
| **Signing** | Apple Developer Account |

**iOS-Specific Features:**
- Lock screen timer (Dynamic Island)
- Background task execution
- Siri Shortcuts integration (Phase 2)
- HealthKit sync (Phase 3)
- iCloud backup (Phase 2)

### Android Requirements
| Requirement | Specification |
|-------------|---------------|
| **Min Version** | Android 11 (API 30)+ |
| **Device** | Most Android phones |
| **Permissions** | Notifications, Audio, Sensors |
| **Framework** | Godot Android Export |
| **Signing** | Keystore signing |

**Android-Specific Features:**
- Foreground service for background timer
- Work Scheduling API
- Material 3 design language
- Hardware acceleration
- Gesture navigation support

---

## 3. Architecture Approach: Domain-Driven Design

### Why DDD?
✅ Better separation of concerns  
✅ Testable business logic  
✅ Scalable codebase  
✅ Team communication clarity  
✅ Easy onboarding for new developers  

### Core Domains

```
┌─────────────────────────────────────────────────────┐
│              TimeCycle Mobile App                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐  ┌──────────────┐                │
│  │ Timer Domain │  │ Cycle Domain │                │
│  │              │  │              │                │
│  │ • Timing     │  │ • Phases     │                │
│  │ • Accuracy   │  │ • Templates  │                │
│  │ • States     │  │ • CRUD       │                │
│  └──────────────┘  └──────────────┘                │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐                │
│  │ Session      │  │ Notification │                │
│  │ Domain       │  │ Domain       │                │
│  │              │  │              │                │
│  │ • Recording  │  │ • Local Push │                │
│  │ • Tracking   │  │ • Alerts     │                │
│  │ • History    │  │ • Sounds     │                │
│  └──────────────┘  └──────────────┘                │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐                │
│  │ User Domain  │  │ Analytics    │                │
│  │              │  │ Domain       │                │
│  │ • Settings   │  │ • Stats      │                │
│  │ • Preferences│  │ • Reports    │                │
│  │ • Profile    │  │ • Trends     │                │
│  └──────────────┘  └──────────────┘                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Domain-Driven Folder Structure

```
timecycle-godot/
├── project.godot
├── godot.project
│
├── src/
│   │
│   ├── shared/                          [SHARED KERNEL]
│   │   ├── domain/
│   │   │   ├── value_objects/
│   │   │   │   ├── duration.gd          (Duration VO)
│   │   │   │   ├── phase_name.gd        (Phase Name VO)
│   │   │   │   └── timestamp.gd         (Timestamp VO)
│   │   │   │
│   │   │   ├── repositories/            (Interfaces)
│   │   │   │   ├── cycle_repository.gd
│   │   │   │   ├── session_repository.gd
│   │   │   │   └── user_repository.gd
│   │   │   │
│   │   │   └── events/
│   │   │       ├── domain_event.gd      (Base event)
│   │   │       ├── cycle_created_event.gd
│   │   │       ├── session_started_event.gd
│   │   │       └── timer_completed_event.gd
│   │   │
│   │   ├── application/
│   │   │   ├── dto/                     (Data Transfer Objects)
│   │   │   │   ├── cycle_dto.gd
│   │   │   │   ├── session_dto.gd
│   │   │   │   └── phase_dto.gd
│   │   │   │
│   │   │   └── services/
│   │   │       ├── notification_service.gd
│   │   │       ├── storage_service.gd
│   │   │       ├── audio_service.gd
│   │   │       └── analytics_service.gd
│   │   │
│   │   └── infrastructure/
│   │       ├── persistence/
│   │       │   ├── file_storage.gd
│   │       │   ├── json_serializer.gd
│   │       │   └── memory_repository.gd
│   │       │
│   │       └── external/
│   │           ├── notification_adapter.gd
│   │           ├── audio_adapter.gd
│   │           └── device_adapter.gd
│   │
│   ├── modules/                         [BOUNDED CONTEXTS]
│   │   │
│   │   ├── timer_management/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── timer.gd          (Timer Entity)
│   │   │   │   │   ├── timer_state.gd    (State machine)
│   │   │   │   │   └── phase_progress.gd
│   │   │   │   │
│   │   │   │   ├── value_objects/
│   │   │   │   │   ├── remaining_time.gd
│   │   │   │   │   ├── timer_status.gd
│   │   │   │   │   └── phase_index.gd
│   │   │   │   │
│   │   │   │   ├── services/
│   │   │   │   │   └── timer_domain_service.gd
│   │   │   │   │
│   │   │   │   └── specifications/
│   │   │   │       └── timer_running_spec.gd
│   │   │   │
│   │   │   ├── application/
│   │   │   │   ├── commands/
│   │   │   │   │   ├── start_timer_command.gd
│   │   │   │   │   ├── pause_timer_command.gd
│   │   │   │   │   ├── resume_timer_command.gd
│   │   │   │   │   ├── stop_timer_command.gd
│   │   │   │   │   └── skip_phase_command.gd
│   │   │   │   │
│   │   │   │   ├── queries/
│   │   │   │   │   ├── get_remaining_time_query.gd
│   │   │   │   │   ├── get_current_phase_query.gd
│   │   │   │   │   └── get_timer_status_query.gd
│   │   │   │   │
│   │   │   │   └── handlers/
│   │   │   │       ├── start_timer_handler.gd
│   │   │   │       ├── pause_timer_handler.gd
│   │   │   │       └── timer_tick_handler.gd
│   │   │   │
│   │   │   ├── infrastructure/
│   │   │   │   ├── godot_timer.gd        (Godot Timer wrapper)
│   │   │   │   ├── timer_repository.gd   (Implementation)
│   │   │   │   └── thread_timer.gd       (Accurate timing)
│   │   │   │
│   │   │   └── presentation/
│   │   │       ├── scenes/
│   │   │       │   ├── timer_screen.tscn
│   │   │       │   ├── timer_display.tscn
│   │   │       │   └── phase_indicator.tscn
│   │   │       │
│   │   │       └── controllers/
│   │   │           ├── timer_screen_controller.gd
│   │   │           └── timer_view_model.gd
│   │   │
│   │   ├── cycle_management/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── cycle.gd          (Cycle Aggregate Root)
│   │   │   │   │   ├── phase.gd          (Phase Entity)
│   │   │   │   │   └── cycle_template.gd
│   │   │   │   │
│   │   │   │   ├── value_objects/
│   │   │   │   │   ├── cycle_id.gd
│   │   │   │   │   ├── cycle_name.gd
│   │   │   │   │   └── phase_sequence.gd
│   │   │   │   │
│   │   │   │   ├── services/
│   │   │   │   │   └── cycle_domain_service.gd
│   │   │   │   │
│   │   │   │   └── specifications/
│   │   │   │       ├── valid_cycle_spec.gd
│   │   │   │       └── has_phases_spec.gd
│   │   │   │
│   │   │   ├── application/
│   │   │   │   ├── commands/
│   │   │   │   │   ├── create_cycle_command.gd
│   │   │   │   │   ├── update_cycle_command.gd
│   │   │   │   │   ├── delete_cycle_command.gd
│   │   │   │   │   ├── add_phase_command.gd
│   │   │   │   │   └── clone_cycle_command.gd
│   │   │   │   │
│   │   │   │   ├── queries/
│   │   │   │   │   ├── get_all_cycles_query.gd
│   │   │   │   │   ├── get_cycle_by_id_query.gd
│   │   │   │   │   └── get_templates_query.gd
│   │   │   │   │
│   │   │   │   └── handlers/
│   │   │   │       ├── create_cycle_handler.gd
│   │   │   │       └── clone_cycle_handler.gd
│   │   │   │
│   │   │   ├── infrastructure/
│   │   │   │   └── cycle_repository.gd   (Implementation)
│   │   │   │
│   │   │   └── presentation/
│   │   │       ├── scenes/
│   │   │       │   ├── cycles_list_screen.tscn
│   │   │       │   ├── cycle_detail_screen.tscn
│   │   │       │   └── create_cycle_screen.tscn
│   │   │       │
│   │   │       └── controllers/
│   │   │           ├── cycles_list_controller.gd
│   │   │           └── create_cycle_controller.gd
│   │   │
│   │   ├── session_management/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── practice_session.gd  (Session Aggregate Root)
│   │   │   │   │   ├── phase_record.gd
│   │   │   │   │   └── session_metadata.gd
│   │   │   │   │
│   │   │   │   ├── value_objects/
│   │   │   │   │   ├── session_id.gd
│   │   │   │   │   ├── session_duration.gd
│   │   │   │   │   └── session_status.gd
│   │   │   │   │
│   │   │   │   ├── services/
│   │   │   │   │   └── session_domain_service.gd
│   │   │   │   │
│   │   │   │   └── specifications/
│   │   │   │       └── valid_session_spec.gd
│   │   │   │
│   │   │   ├── application/
│   │   │   │   ├── commands/
│   │   │   │   │   ├── start_session_command.gd
│   │   │   │   │   ├── complete_session_command.gd
│   │   │   │   │   ├── pause_session_command.gd
│   │   │   │   │   └── record_phase_command.gd
│   │   │   │   │
│   │   │   │   ├── queries/
│   │   │   │   │   ├── get_current_session_query.gd
│   │   │   │   │   ├── get_session_history_query.gd
│   │   │   │   │   └── get_daily_stats_query.gd
│   │   │   │   │
│   │   │   │   └── handlers/
│   │   │   │       ├── start_session_handler.gd
│   │   │   │       └── complete_session_handler.gd
│   │   │   │
│   │   │   ├── infrastructure/
│   │   │   │   └── session_repository.gd
│   │   │   │
│   │   │   └── presentation/
│   │   │       └── controllers/
│   │   │           └── session_controller.gd
│   │   │
│   │   ├── notification_management/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── notification.gd
│   │   │   │   │   └── notification_schedule.gd
│   │   │   │   │
│   │   │   │   └── services/
│   │   │   │       └── notification_service.gd
│   │   │   │
│   │   │   ├── application/
│   │   │   │   ├── commands/
│   │   │   │   │   ├── send_notification_command.gd
│   │   │   │   │   └── schedule_notification_command.gd
│   │   │   │   │
│   │   │   │   └── handlers/
│   │   │   │       ├── phase_changed_notification_handler.gd
│   │   │   │       └── session_completed_notification_handler.gd
│   │   │   │
│   │   │   ├── infrastructure/
│   │   │   │   ├── ios_notification_adapter.gd
│   │   │   │   ├── android_notification_adapter.gd
│   │   │   │   └── notification_repository.gd
│   │   │   │
│   │   │   └── presentation/
│   │   │       └── controllers/
│   │   │           └── notification_controller.gd
│   │   │
│   │   └── analytics/
│   │       ├── domain/
│   │       │   ├── entities/
│   │       │   │   ├── daily_stats.gd
│   │       │   │   └── analytics_report.gd
│   │       │   │
│   │       │   └── services/
│   │       │       └── analytics_service.gd
│   │       │
│   │       ├── application/
│   │       │   └── queries/
│   │       │       ├── get_daily_stats_query.gd
│   │       │       ├── get_weekly_stats_query.gd
│   │       │       └── get_analytics_report_query.gd
│   │       │
│   │       ├── infrastructure/
│   │       │   └── analytics_repository.gd
│   │       │
│   │       └── presentation/
│   │           ├── scenes/
│   │           │   └── analytics_screen.tscn
│   │           │
│   │           └── controllers/
│   │               └── analytics_controller.gd
│   │
│   └── presentation/                    [PRESENTATION LAYER]
│       ├── common/
│       │   ├── components/
│       │   │   ├── base_button.tscn
│       │   │   ├── base_input.tscn
│       │   │   ├── circular_progress.tscn
│       │   │   ├── modal.tscn
│       │   │   └── toast.tscn
│       │   │
│       │   ├── styles/
│       │   │   ├── theme.tres
│       │   │   ├── colors.gd              (Color constants)
│       │   │   └── fonts.tres
│       │   │
│       │   └── constants/
│       │       ├── ui_constants.gd
│       │       ├── app_constants.gd
│       │       └── theme_constants.gd
│       │
│       ├── navigation/
│       │   ├── app_router.gd             (Navigation controller)
│       │   ├── screen_names.gd
│       │   └── transition_effects.gd
│       │
│       ├── main_app.tscn                 (Root scene)
│       └── main_app.gd
│
├── assets/
│   ├── sounds/
│   │   ├── phase_start.mp3
│   │   ├── phase_end.mp3
│   │   ├── session_complete.mp3
│   │   └── notification.mp3
│   │
│   ├── images/
│   │   ├── icons/
│   │   ├── backgrounds/
│   │   └── illustrations/
│   │
│   └── fonts/
│       └── Poppins-*.ttf
│
├── tests/
│   ├── unit/
│   │   ├── timer_management/
│   │   │   ├── domain/
│   │   │   │   └── timer_test.gd
│   │   │   │
│   │   │   ├── application/
│   │   │   │   └── start_timer_handler_test.gd
│   │   │   │
│   │   │   └── infrastructure/
│   │   │       └── timer_repository_test.gd
│   │   │
│   │   ├── cycle_management/
│   │   │   ├── domain/
│   │   │   │   └── cycle_test.gd
│   │   │   │
│   │   │   └── application/
│   │   │       └── create_cycle_handler_test.gd
│   │   │
│   │   └── session_management/
│   │       └── domain/
│   │           └── session_test.gd
│   │
│   ├── integration/
│   │   ├── timer_flow_test.gd
│   │   ├── session_flow_test.gd
│   │   └── cycle_flow_test.gd
│   │
│   └── fixtures/
│       ├── cycle_fixtures.gd
│       ├── session_fixtures.gd
│       └── timer_fixtures.gd
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DEVELOPMENT.md
│   ├── DDD_GUIDE.md
│   ├── MOBILE_CONSIDERATIONS.md
│   └── BUILD_AND_DEPLOY.md
│
├── .gitignore
└── README.md
```

---

## 4. Core Features - Mobile-Specific

### 4.1 Timer Management
- **High-Precision Timing**
  - Background thread timer
  - Accuracy: ±500ms over 25 minutes
  - Continues running during:
    - App switching
    - Screen lock/unlock
    - Low power mode (iOS)
  
- **Visual Feedback**
  - Full-screen timer display
  - Circular progress ring
  - Phase indicator
  - Haptic feedback on phase change
  - Adaptive display brightness

### 4.2 Notifications
- **Local Push Notifications**
  - Phase transition alerts
  - Session completion
  - Daily practice reminders (Phase 2)
  - Badge counts

- **In-App Alerts**
  - Toast notifications
  - Modal popups
  - Sound + vibration

### 4.3 Background Execution
- **iOS:**
  - Background task (BGProcessingTask)
  - Timer continues with limited accuracy
  - Wake notification when needed

- **Android:**
  - Foreground service
  - Persistent notification
  - Full timer accuracy

### 4.4 Sensor Integration
- **Accelerometer:**
  - Shake to pause/resume
  - Motion detection (Phase 2)

- **Proximity Sensor:**
  - Detect if held to face (Phase 2)

---

## 5. Mobile Optimization Requirements

### Screen Sizes
- 📱 iPhone: 390px (iPhone 14) - 430px (Max)
- 📱 Small Android: 360px (Pixel 6a)
- 📱 Large Android: 480px+
- 📱 iPad: 768px+

### Performance Targets
| Metric | Target |
|--------|--------|
| **Startup Time** | <2 seconds |
| **Memory (Idle)** | <50MB |
| **Memory (Runtime)** | <100MB |
| **Battery Impact** | <5% per hour |
| **First Frame** | <500ms |

### Battery Optimization
- ✅ Efficient background timer
- ✅ Minimal CPU usage when paused
- ✅ Smart refresh rates (30fps max)
- ✅ Disable animations on low power
- ✅ Aggressive memory cleanup

---

## 6. Data Storage Strategy

### Local Storage (On-Device)
```
User Data:
├── User Settings (JSON)
├── Cycles (SQLite or JSON)
├── Practice Sessions (SQLite)
└── Analytics Cache (JSON)

Capacity: ~100MB available per app
```

### Storage Locations
- **iOS:** `Library/Application Support/TimeCycle/`
- **Android:** `/data/data/com.timecycle.app/files/`

### Backup
- **iOS:** iCloud backup (automatic)
- **Android:** Google Drive backup (Phase 2)

---

## 7. Monetization (Post-MVP)

### Free Tier
- 3 templates
- Basic statistics
- Ads (optional)

### Premium Features (Phase 2)
- Custom audio guides
- Advanced analytics
- Cloud sync
- Ad-free
- Price: $4.99/month or $39.99/year

---

## 8. Launch Requirements

### Build Configuration
- **iOS:**
  - Xcode 15+
  - Swift Playgrounds support
  - Privacy manifest
  
- **Android:**
  - Android Studio latest
  - Min SDK 30
  - Target SDK 34

### App Store Requirements
- **iOS App Store:**
  - Privacy policy
  - Screenshot (6)
  - Promotional artwork (1024x1024)
  - Release notes
  
- **Google Play:**
  - Privacy policy
  - Screenshots (8)
  - Feature graphics
  - Release notes

### Testing Before Launch
- ✅ iOS 14-17 devices
- ✅ Android 11-14 devices
- ✅ Landscape/Portrait
- ✅ Battery usage
- ✅ Notification delivery
- ✅ Data persistence

---

## 9. Godot 4.6 Specific Features

### Utilized Features
| Feature | Usage |
|---------|-------|
| **Scenes** | UI screens, components |
| **Nodes** | Timer, AnimationPlayer |
| **GDScript** | Business logic |
| **AudioStreamPlayer** | Notifications & sounds |
| **Control** | UI framework |
| **Thread** | Background timer |
| **Tween** | Animations |
| **JSON** | Data serialization |

### NOT Using
- ❌ Physics (3D/2D)
- ❌ Canvas rendering
- ❌ OpenGL shaders
- ❌ Multiplayer features

---

## 10. Success Metrics (Mobile-Specific)

### Technical
- ✅ App size: <80MB
- ✅ Cold startup: <2s
- ✅ Crashes: <0.1%
- ✅ Battery drain: <5%/hour
- ✅ Memory: <80MB active

### User Engagement
- ✅ Install base: 10K+ (Month 1)
- ✅ Daily Active: 2K+
- ✅ Session completion: >75%
- ✅ Retention (Day 7): >45%
- ✅ Rating: 4.5+ stars

### Store Performance
- ✅ App Store rank: Top 200 (Productivity)
- ✅ Google Play rank: Top 200
- ✅ Positive reviews: >90%

---

## 11. Release Timeline

| Phase | Duration | Target |
|-------|----------|--------|
| **Alpha** | Week 1-2 | Internal testing |
| **Beta** | Week 3-4 | TestFlight + Google Play beta |
| **Launch** | Week 5 | App Store + Google Play |

---

## Appendix A: Mobile UX Patterns

### Bottom Sheet Navigation
- Cycles list
- Settings
- Analytics

### Full-Screen Immersive Mode
- Timer screen (hide status bar)
- Landscape support

### Gesture Controls
- Swipe left/right for navigation
- Long-press for actions
- Double-tap for quick start

---

**End of Mobile PRD for Godot**

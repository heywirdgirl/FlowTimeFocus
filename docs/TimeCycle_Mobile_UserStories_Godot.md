# User Stories - TimeCycle Mobile App (Godot 4.6)
## Domain-Driven Design Edition

**Format:** Epic → User Story → Acceptance Criteria  
**Story Points:** XS(1) S(2) M(3) L(5) XL(8)  
**Total MVP Points:** 92  

---

## 📱 EPIC 1: Timer Management Domain (32 points)

### Domain Model
```
Timer (Aggregate Root)
├── TimerState (Running, Paused, Stopped, Completed)
├── RemainingTime (Value Object)
├── PhaseProgress (Value Object)
└── TimerEvents (TimerStarted, TimerTicked, TimerPaused, etc.)
```

---

### US-1.1: Display Accurate Timer on Screen
**Domain:** Timer Management | Type: Feature  
**As a** user  
**I want to** see an accurate countdown timer on the screen  
**So that** I can track remaining time in my practice phase  

**Acceptance Criteria:**
- [ ] Timer displays MM:SS format (e.g., 25:00)
- [ ] Updates every 100ms with smooth animation
- [ ] Accuracy: ±500ms over 25 minutes
- [ ] Timer size: 48pt+ font on all screens
- [ ] Works when app is in background
- [ ] Continues during screen lock (iOS & Android)
- [ ] Battery efficient (doesn't wake CPU constantly)

**Technical Notes:**
- Use Godot `Thread` for background timing
- Sync with OS clock every 5 seconds
- Use `AudioStreamPlayer` only during phase transitions

**Godot Implementation:**
```gdscript
# Domain Layer: Timer Entity
class_name Timer

var remaining_time: RemainingTime
var state: TimerState
var _timer_thread: Thread
var _events: Array[TimerEvent]

func tick() -> void:
    if state == TimerState.RUNNING:
        remaining_time.decrement_by_delta(get_physics_process_delta_time())
        _events.append(TimerTickedEvent.new(remaining_time))
```

**Story Points:** L (5)

---

### US-1.2: Play/Pause/Stop Controls
**Domain:** Timer Management  
**As a** user  
**I want to** start, pause, and stop my timer  
**So that** I have full control over my practice session  

**Acceptance Criteria:**
- [ ] Play button starts timer
- [ ] Pause button pauses timer
- [ ] Resume continues from pause point
- [ ] Stop cancels session with confirmation dialog
- [ ] All buttons are 48pt+ height for mobile
- [ ] Buttons update state visually
- [ ] State persists if app crashes

**Command Pattern (DDD):**
- `StartTimerCommand`
- `PauseTimerCommand`
- `ResumeTimerCommand`
- `StopTimerCommand`

**Story Points:** M (3)

---

### US-1.3: Auto-Advance to Next Phase
**Domain:** Timer Management  
**As a** user  
**I want to** automatically move to the next phase when current phase ends  
**So that** I don't need to manually manage transitions  

**Acceptance Criteria:**
- [ ] When timer reaches 0:00, phase ends automatically
- [ ] Next phase starts immediately (configurable 3s pause)
- [ ] Audio notification plays
- [ ] Haptic feedback (vibration) on iOS/Android
- [ ] Phase highlight changes visually
- [ ] Session continues uninterrupted
- [ ] Last phase shows "Complete" message

**Events (Domain-Driven):**
- `PhaseCompletedEvent` → triggers `PhaseAdvancedEvent`
- `SessionCompletedEvent` (when all phases done)

**Story Points:** M (3)

---

### US-1.4: Skip to Next/Previous Phase
**Domain:** Timer Management  
**As a** power user  
**I want to** skip to the next or previous phase  
**So that** I can adjust my session on the fly  

**Acceptance Criteria:**
- [ ] Skip Next button advances to next phase
- [ ] Skip Prev button goes to previous phase
- [ ] Disabled when at first/last phase
- [ ] Previous phase time recorded accurately
- [ ] Current time saves to session history

**Commands:**
- `SkipToNextPhaseCommand`
- `SkipToPreviousPhaseCommand`

**Story Points:** S (2)

---

### US-1.5: Phase List with Duration Indicator
**Domain:** Timer Management  
**As a** user  
**I want to** see all phases with their durations  
**So that** I know what's coming next  

**Acceptance Criteria:**
- [ ] Current phase highlighted with blue background
- [ ] Completed phases show checkmark
- [ ] Upcoming phases grayed out
- [ ] Duration shown: "25m", "5m", etc.
- [ ] Scrollable list (>5 phases)
- [ ] Can tap phase to jump directly

**Presentation (Godot Scenes):**
- `PhaseListItem` component
- Shows: [Checkmark] [Phase Name] [Duration]

**Story Points:** M (3)

---

### US-1.6: Keep Screen Awake During Practice
**Domain:** Timer Management  
**As a** user  
**I want to** keep my screen on while practicing  
**So that** I can watch the timer without touching my phone  

**Acceptance Criteria:**
- [ ] Screen stays on during active timer
- [ ] Respects brightness setting (doesn't max brightness)
- [ ] Auto-locks after session ends
- [ ] Battery notification if extended session
- [ ] Works in low power mode (iOS)

**Platform Implementation:**
- **iOS:** `UIApplication.shared.isIdleTimerDisabled`
- **Android:** `WAKE_LOCK` permission + PowerManager

**Story Points:** M (3)

---

### US-1.7: Haptic & Audio Feedback
**Domain:** Timer Management | Notification  
**As a** user  
**I want to** feel and hear phase transitions  
**So that** I don't miss important moments  

**Acceptance Criteria:**
- [ ] Single vibration pulse on phase transition
- [ ] Audio beep (500ms @ 800Hz)
- [ ] Different sounds: phase transition vs completion
- [ ] Can be disabled in settings
- [ ] Respects device volume level
- [ ] Compatible with mute switch (iOS)

**Audio Files:**
- `phase_start.mp3` (200ms)
- `phase_end.mp3` (300ms)
- `session_complete.mp3` (500ms)

**Godot:**
```gdscript
# Infrastructure: AudioService
var audio_player: AudioStreamPlayer

func play_phase_notification() -> void:
    audio_player.stream = load("res://assets/sounds/phase_end.mp3")
    audio_player.play()
```

**Story Points:** M (3)

---

### US-1.8: Display Circular Progress Ring
**Domain:** Timer Management | Presentation  
**As a** user  
**I want to** see a visual circular progress indicator  
**So that** I can gauge time remaining visually  

**Acceptance Criteria:**
- [ ] Circular ring animates as time passes
- [ ] Ring color: blue for running, gray for paused
- [ ] Smooth animation (no stuttering)
- [ ] Diameter: 280px on all screens
- [ ] Inner circle shows time in large font

**Godot Implementation:**
```gdscript
# Presentation: CircularProgress Component
extends Control

@onready var progress: float = 1.0
@onready var target_progress: float = 1.0

func _draw() -> void:
    draw_arc(center, radius, 0, TAU * progress, 100, Color.BLUE, 4.0)
```

**Story Points:** L (5)

---

## 📋 EPIC 2: Cycle Management Domain (28 points)

### Domain Model
```
Cycle (Aggregate Root)
├── CycleId (Value Object)
├── CycleName (Value Object)
├── Phase (Entity)
├── CycleTemplate (Value Object)
└── CycleEvents (CycleCreated, CycleUpdated, CycleDeleted)
```

---

### US-2.1: Display Cycle Templates
**Domain:** Cycle Management  
**As a** new user  
**I want to** see ready-made cycles (Wim Hof, Pomodoro, Meditation)  
**So that** I can start practicing immediately  

**Acceptance Criteria:**
- [ ] 3 templates visible in "Your Cycles" section
- [ ] Each shows: Name, duration, difficulty badge
- [ ] Can be tapped to view details
- [ ] Marked as "Template" (not editable)
- [ ] Sorted: Recent first, then alphabetical
- [ ] Icons/colors distinguish templates

**Godot Scene:**
```
CyclesListScreen (Node)
├── CyclesHeader (Label: "Your Cycles")
├── DailyStatsLabel
├── CyclesList (VBoxContainer)
│   └── CycleListItem (custom control) x3
└── ExploreButton
```

**Templates Data (GDScript):**
```gdscript
class_name CycleTemplate
extends Resource

var id: String
var name: String
var phases: Array[Phase]
var difficulty: String  # "Beginner", "Intermediate"
var is_template: bool = true
```

**Story Points:** S (2)

---

### US-2.2: Quick Start a Cycle
**Domain:** Cycle Management | Session Management  
**As a** user  
**I want to** start a cycle with one tap  
**So that** I can begin practicing without navigation  

**Acceptance Criteria:**
- [ ] Play button (▶) next to each cycle
- [ ] Single tap → Timer screen
- [ ] First phase starts immediately
- [ ] Session recorded automatically
- [ ] Back button returns to cycles list

**Command (DDD):**
- `QuickStartCycleCommand`

**Flow:**
```
CyclesListScreen 
  → User taps ▶ 
  → [TimerScreen starts]
  → SessionStartedEvent published
  → Timer begins
```

**Story Points:** XS (1)

---

### US-2.3: Create Custom Cycle
**Domain:** Cycle Management  
**As a** user  
**I want to** create a new cycle with my own phases  
**So that** I can practice routines that suit my needs  

**Acceptance Criteria:**
- [ ] "New Cycle" button opens creation screen
- [ ] Can enter cycle name (required, max 50 chars)
- [ ] Can add phases dynamically
- [ ] Each phase: name + duration
- [ ] Can delete phases before saving
- [ ] Save button creates cycle
- [ ] New cycle appears in list immediately
- [ ] Toast confirmation: "Cycle saved"

**Validation Rules (Specification Pattern - DDD):**
```gdscript
class_name ValidCycleSpecification
extends Specification

func is_satisfied_by(cycle: Cycle) -> bool:
    return cycle.name.length > 0 and \
           cycle.name.length <= 50 and \
           cycle.phases.size() >= 1 and \
           cycle.phases.size() <= 20
```

**Godot Scenes:**
```
CreateCycleScreen (Node)
├── CycleNameInput
├── PhasesList (VBoxContainer)
│   └── PhaseItem x N
├── AddPhaseButton
├── SaveButton
└── CancelButton
```

**Story Points:** L (5)

---

### US-2.4: Edit Existing Cycle
**Domain:** Cycle Management  
**As a** user  
**I want to** modify cycles I created  
**So that** I can adjust durations or add/remove phases  

**Acceptance Criteria:**
- [ ] Long-press cycle → "Edit" option appears
- [ ] Edit screen shows all phases with current values
- [ ] Can change cycle name
- [ ] Can edit/add/delete phases
- [ ] Can reorder phases (drag-drop)
- [ ] Save updates cycle
- [ ] Existing sessions aren't affected
- [ ] Can't edit system templates

**Commands:**
- `UpdateCycleCommand`
- `UpdatePhaseCommand`
- `DeletePhaseCommand`

**Story Points:** M (3)

---

### US-2.5: Clone/Copy a Cycle
**Domain:** Cycle Management  
**As a** user  
**I want to** duplicate cycles (templates or custom)  
**So that** I can create variations without starting over  

**Acceptance Criteria:**
- [ ] Long-press cycle → "Clone" option
- [ ] Creates exact copy with "(Copy)" suffix
- [ ] Cloned cycle is immediately editable
- [ ] Original unchanged
- [ ] New UUID generated
- [ ] Toast: "Cycle cloned"

**Example:**
```
"Wim Hof Breathing" → "Wim Hof Breathing (Copy)"
```

**Command:**
- `CloneCycleCommand`

**Story Points:** M (3)

---

### US-2.6: Delete a Cycle
**Domain:** Cycle Management  
**As a** user  
**I want to** remove cycles I no longer need  
**So that** my list stays organized  

**Acceptance Criteria:**
- [ ] Long-press → "Delete" option
- [ ] Confirmation dialog appears
- [ ] "Cancel" and "Delete" buttons
- [ ] Only custom cycles deletable (templates protected)
- [ ] Historical sessions preserved
- [ ] Toast: "Cycle deleted"
- [ ] Removed from list immediately

**Command:**
- `DeleteCycleCommand`

**Story Points:** S (2)

---

### US-2.7: View Cycle Details
**Domain:** Cycle Management  
**As a** user  
**I want to** see detailed information about a cycle  
**So that** I can decide if it's right for me  

**Acceptance Criteria:**
- [ ] Tap cycle → Detail screen
- [ ] Show: Name, total duration, all phases
- [ ] Show: Times practiced, last used
- [ ] Show: Total time spent
- [ ] Quick start button (▶)
- [ ] Edit button
- [ ] Delete button (if custom)
- [ ] Back button

**Godot Scene:**
```
CycleDetailScreen (Node)
├── CycleHeader (Name, total duration)
├── StatsPanel
│   ├── "Practiced: 12 times"
│   ├── "Total: 108 minutes"
│   └── "Last used: 2 hours ago"
├── PhasesList
└── ActionButtons (Start, Edit, Delete)
```

**Story Points:** M (3)

---

### US-2.8: Reorder Phases in Cycle
**Domain:** Cycle Management  
**As a** user  
**I want to** change the order of phases  
**So that** I can customize my cycle flow  

**Acceptance Criteria:**
- [ ] Edit screen allows drag-drop reordering
- [ ] Alternative: Up/Down arrow buttons
- [ ] Visual feedback during drag
- [ ] Changes save to cycle
- [ ] Order reflected when practicing

**Godot:**
```gdscript
# Presentation: PhaseListItem with drag support
func _input(event: InputEvent) -> void:
    if event is InputEventMouseButton:
        if event.pressed and is_in_group("draggable"):
            can_drag = true
```

**Story Points:** M (3)

---

## 📊 EPIC 3: Session Management Domain (24 points)

### Domain Model
```
PracticeSession (Aggregate Root)
├── SessionId (Value Object)
├── SessionStatus (Value Object)
├── PhaseRecord (Entity)
└── SessionEvents (SessionStarted, SessionCompleted, etc.)
```

---

### US-3.1: Record Practice Sessions
**Domain:** Session Management  
**As a** the app  
**I want to** automatically record each practice session  
**So that** users can track their progress  

**Acceptance Criteria:**
- [ ] Session auto-created when timer starts
- [ ] Captures: Start time, cycle, phases
- [ ] Records: Duration per phase, completion status
- [ ] Auto-saves every 10 seconds
- [ ] Survives app crash/restart
- [ ] Includes all session metadata

**Value Objects:**
```gdscript
class_name PracticeSession
extends Resource

var id: String
var cycle_id: String
var start_time: int  # Unix timestamp
var end_time: int
var phases: Array[PhaseRecord]
var completed: bool = false
var duration_seconds: int
```

**Story Points:** M (3)

---

### US-3.2: Track Daily Practice Time
**Domain:** Session Management | Analytics  
**As a** user  
**I want to** see how much I've practiced today  
**So that** I can monitor daily goals  

**Acceptance Criteria:**
- [ ] "Your Cycles" header shows: "XXm practiced today"
- [ ] Updates in real-time as sessions complete
- [ ] Resets at midnight (user's timezone)
- [ ] Only counts completed sessions
- [ ] Example: "146.5m practiced today"

**Query (DDD):**
```gdscript
class_name GetDailyStatsQuery
extends Query

var date: String

# Handler returns DailyStats
class_name DailyStats:
    var total_minutes: int
    var session_count: int
    var sessions: Array[PracticeSession]
```

**Story Points:** M (3)

---

### US-3.3: View Practice History
**Domain:** Session Management  
**As a** user  
**I want to** see my past sessions with dates and durations  
**So that** I can review my progress  

**Acceptance Criteria:**
- [ ] History screen shows list (newest first)
- [ ] Each entry: Date | Cycle | Duration | Status
- [ ] Can filter by cycle
- [ ] Can filter by date range (7d, 30d, all)
- [ ] Can export as CSV
- [ ] Calendar view (optional)

**Godot Scene:**
```
HistoryScreen (Node)
├── PeriodFilter (7d / 30d / all)
├── CycleFilter (Dropdown)
├── HistoryList (ItemList)
│   └── HistoryItem x N
└── ExportButton
```

**Story Points:** L (5)

---

### US-3.4: Calculate Practice Statistics
**Domain:** Analytics | Session Management  
**As a** user  
**I want to** see statistics about my practice  
**So that** I can understand my habits  

**Acceptance Criteria:**
- [ ] Total sessions count
- [ ] Total duration (hours)
- [ ] Average session length
- [ ] Most used cycle
- [ ] Longest streak (consecutive days)
- [ ] Best day (most practice)
- [ ] Weekly breakdown

**Queries:**
- `GetTotalSessionsQuery`
- `GetTotalDurationQuery`
- `GetAverageSessionLengthQuery`
- `GetLongestStreakQuery`

**Story Points:** M (3)

---

### US-3.5: Resume Incomplete Session
**Domain:** Session Management  
**As a** user  
**I want to** continue a session if the app crashed  
**So that** I don't lose my progress  

**Acceptance Criteria:**
- [ ] If app crashes during session, show recovery dialog
- [ ] "Resume" button continues where left off
- [ ] "Start New" discards incomplete session
- [ ] Session time continues from pause point
- [ ] Accurate time recorded

**Implementation:**
```gdscript
class_name SessionRecoveryService

func has_incomplete_session() -> bool:
    var saved = storage_service.get_current_session()
    return saved != null and saved.completed == false

func recover_session() -> PracticeSession:
    return storage_service.get_current_session()
```

**Story Points:** M (3)

---

### US-3.6: Share Session Stats (Social)
**Domain:** Session Management  
**As a** user  
**I want to** share my session completion on social media  
**So that** I can motivate others and celebrate  

**Acceptance Criteria:**
- [ ] After session completes, show share button
- [ ] Share template: "Just completed [Cycle] for [Duration]! 💪"
- [ ] Pre-filled share text
- [ ] Share to: WhatsApp, Twitter, Email
- [ ] Optional: Include achievement badge
- [ ] Respects user privacy (no data shared)

**Godot Share Implementation:**
```gdscript
func share_session(session: PracticeSession) -> void:
    var text = "Just completed %s for %d minutes! 💪" % [
        session.cycle_name,
        session.duration_seconds / 60
    ]
    OS.shell_open("https://twitter.com/intent/tweet?text=" + text.uri_encode())
```

**Story Points:** S (2)

---

## 🔔 EPIC 4: Notification Domain (20 points)

### Domain Model
```
Notification (Entity)
├── NotificationType (Value Object)
├── NotificationPayload (Value Object)
└── NotificationSchedule (Value Object)
```

---

### US-4.1: Send Phase Transition Notifications
**Domain:** Notification Management  
**As a** user  
**I want to** get notified when phases change  
**So that** I can prepare for transitions  

**Acceptance Criteria:**
- [ ] Local notification on phase transition
- [ ] Title: "[Cycle Name]"
- [ ] Body: "Phase [X/Y] complete - Next: [Phase Name]"
- [ ] Sound + vibration (if enabled)
- [ ] Shows 3-second countdown before transition
- [ ] Dismissible notification

**Platform-Specific Adapters:**
```gdscript
class_name IosNotificationAdapter
extends NotificationAdapter

func send_notification(notification: Notification) -> void:
    # iOS implementation via Godot's notification API

class_name AndroidNotificationAdapter
extends NotificationAdapter

func send_notification(notification: Notification) -> void:
    # Android implementation via Java bridge
```

**Story Points:** M (3)

---

### US-4.2: Send Session Completion Notification
**Domain:** Notification Management  
**As a** user  
**I want to** be notified when my session completes  
**So that** I know I'm done and can move on  

**Acceptance Criteria:**
- [ ] Notification when last phase ends
- [ ] Title: "Practice Complete! 🎉"
- [ ] Body: "[Cycle Name] - [Total Duration]"
- [ ] Action buttons: "View Stats" / "Start New"
- [ ] Local notification (not push)

**Story Points:** M (3)

---

### US-4.3: In-App Toast Notifications
**Domain:** Notification Management | Presentation  
**As a** user  
**I want to** see quick in-app messages  
**So that** I get immediate feedback  

**Acceptance Criteria:**
- [ ] Toast appears at bottom/top of screen
- [ ] Auto-dismisses after 3 seconds
- [ ] Can dismiss manually
- [ ] Non-blocking (user can interact)
- [ ] Stacks if multiple toasts
- [ ] Success (green), Error (red), Info (blue)

**Godot Component:**
```gdscript
class_name Toast
extends Control

func show_success(message: String, duration: float = 3.0) -> void:
    modulate = Color.GREEN
    label.text = message
    await get_tree().create_timer(duration).timeout
    queue_free()

func show_error(message: String) -> void:
    modulate = Color.RED
    label.text = message
```

**Story Points:** S (2)

---

### US-4.4: Daily Reminder Notifications
**Domain:** Notification Management  
**As a** user  
**I want to** receive a reminder to practice each day  
**So that** I build a consistent habit  

**Acceptance Criteria:**
- [ ] Can set reminder time in settings
- [ ] Daily notification at scheduled time
- [ ] Notification text: "Time to practice!"
- [ ] Can snooze (15min, 1hr, tomorrow)
- [ ] Works when app is closed
- [ ] Can disable reminders

**Implementation:**
- **iOS:** UNUserNotificationCenter
- **Android:** WorkManager API

**Story Points:** M (3)

---

### US-4.5: Adaptive Notification Timing
**Domain:** Notification Management  
**As a** the app  
**I want to** send notifications at optimal times  
**So that** users aren't interrupted  

**Acceptance Criteria:**
- [ ] Don't send between 10pm - 8am
- [ ] Respect Do Not Disturb (iOS Focus modes)
- [ ] Batch notifications if multiple pending
- [ ] Skip if session already completed
- [ ] Override for critical notifications

**Story Points:** M (3)

---

### US-4.6: Notification Preferences
**Domain:** Notification Management  
**As a** user  
**I want to** control which notifications I receive  
**So that** I'm not overwhelmed  

**Acceptance Criteria:**
- [ ] Toggle: Phase transitions
- [ ] Toggle: Session completion
- [ ] Toggle: Daily reminders
- [ ] Toggle: Sounds enabled
- [ ] Volume slider (0-100%)
- [ ] Settings persist

**Godot Settings:**
```gdscript
class_name NotificationSettings
extends Resource

var phase_notifications_enabled: bool = true
var completion_notifications_enabled: bool = true
var daily_reminder_enabled: bool = false
var daily_reminder_time: String = "09:00"
var sound_enabled: bool = true
var volume: float = 0.8
```

**Story Points:** S (2)

---

## 📈 EPIC 5: Analytics Domain (20 points)

### Domain Model
```
Analytics (Aggregate Root)
├── DailyStats (Value Object)
├── WeeklyStats (Value Object)
├── AnalyticsReport (Entity)
└── AnalyticsEvents (SessionAnalyzed, etc.)
```

---

### US-5.1: Display Analytics Dashboard
**Domain:** Analytics  
**As a** user  
**I want to** see my practice analytics  
**So that** I can track my progress  

**Acceptance Criteria:**
- [ ] Analytics screen with multiple metrics
- [ ] Time period filters: 7d, 30d, 90d, all
- [ ] Total minutes widget
- [ ] Session count widget
- [ ] Most used cycle widget
- [ ] Streak counter (consecutive days)
- [ ] Line chart: daily minutes over time
- [ ] Bar chart: cycles breakdown
- [ ] Smooth animations

**Godot Scenes:**
```
AnalyticsScreen (Node)
├── PeriodSelector (HBoxContainer)
├── StatsGrid
│   ├── StatCard (Total Minutes)
│   ├── StatCard (Sessions)
│   ├── StatCard (Best Day)
│   └── StatCard (Streak)
├── ChartsContainer
│   ├── LineChart (Daily Minutes)
│   └── BarChart (Top Cycles)
└── ExportButton
```

**Story Points:** L (5)

---

### US-5.2: Generate Analytics Reports
**Domain:** Analytics  
**As a** user  
**I want to** export my data as CSV/PDF  
**So that** I can analyze or share my progress  

**Acceptance Criteria:**
- [ ] CSV export button
- [ ] Includes: sessions, dates, durations, cycles
- [ ] File saved to device downloads
- [ ] Can share via email/cloud
- [ ] Optional: PDF with charts
- [ ] Date range selectable

**Godot:**
```gdscript
class_name ExportAnalyticsCommand
extends Command

func export_to_csv(reports: Array[AnalyticsReport]) -> String:
    var csv = "Date,Cycle,Duration,Status\n"
    for report in reports:
        csv += "%s,%s,%d,Completed\n" % [
            report.date, report.cycle_name, report.duration
        ]
    return csv
```

**Story Points:** M (3)

---

### US-5.3: Calculate Practice Streaks
**Domain:** Analytics  
**As a** user  
**I want to** see my practice streak  
**So that** I can motivate myself to continue  

**Acceptance Criteria:**
- [ ] Display: "N day streak" prominently
- [ ] Calculate consecutive days with sessions
- [ ] Reset if no practice for 24 hours
- [ ] Show longest streak (all-time)
- [ ] Show current streak
- [ ] Animated counter increase

**Algorithm:**
```gdscript
func calculate_streak(sessions: Array[PracticeSession]) -> int:
    var days: Array[String] = []
    for session in sessions:
        var day = Time.get_datetime_string_from_unix_time(session.start_time).split("T")[0]
        if not days.has(day):
            days.append(day)
    
    days.sort()
    var streak = 1
    var max_streak = 1
    
    for i in range(1, days.size()):
        var prev_date = Time.get_unix_time_from_datetime_string(days[i-1])
        var curr_date = Time.get_unix_time_from_datetime_string(days[i])
        
        if (curr_date - prev_date) == 86400:  # 24 hours
            streak += 1
            max_streak = max(streak, max_streak)
        else:
            streak = 1
    
    return max_streak
```

**Story Points:** M (3)

---

### US-5.4: Calendar Heatmap View
**Domain:** Analytics | Presentation  
**As a** user  
**I want to** see a heatmap of my practice days  
**So that** I can visualize my habit patterns  

**Acceptance Criteria:**
- [ ] Grid showing last 12 weeks
- [ ] Green shades for practice days
- [ ] Intensity = time practiced (darker = more)
- [ ] Tooltip on hover: "N minutes on [Date]"
- [ ] Click to see session details
- [ ] Responsive to different screen sizes

**Godot Custom Control:**
```gdscript
class_name CalendarHeatmap
extends Control

func _draw() -> void:
    for week in range(12):
        for day in range(7):
            var rect = Rect2(week * 20, day * 20, 18, 18)
            var intensity = get_intensity(week, day)
            draw_rect(rect, Color.GREEN.lightened(1.0 - intensity))
```

**Story Points:** L (5)

---

### US-5.5: Insights & Recommendations
**Domain:** Analytics  
**As a** user  
**I want to** see insights about my practice  
**So that** I can improve  

**Acceptance Criteria:**
- [ ] "Your best day was [Day]"
- [ ] "Most practiced cycle: [Name]"
- [ ] "Your average session: [Duration]"
- [ ] "Congratulations on [N] day streak!"
- [ ] "Consider trying a new cycle"
- [ ] Insights update daily

**Story Points:** M (3)

---

## ⚙️ EPIC 6: Settings & User Domain (16 points)

### Domain Model
```
UserSettings (Aggregate Root)
├── NotificationSettings (Value Object)
├── DisplaySettings (Value Object)
├── BehaviorSettings (Value Object)
└── UserSettingsEvents (SettingsUpdated, etc.)
```

---

### US-6.1: Create Settings Screen
**Domain:** User Management  
**As a** user  
**I want to** access app settings  
**So that** I can customize my experience  

**Acceptance Criteria:**
- [ ] Settings icon (⚙) in navigation
- [ ] Settings sections:
  - Sound (toggle, volume slider)
  - Display (dark mode, font size)
  - Behavior (auto-advance, pause duration)
  - Data (export, import, clear)
  - About (version, links)
- [ ] All settings persist

**Godot Scene:**
```
SettingsScreen (Node)
├── ScrollContainer
│   └── VBoxContainer
│       ├── Section "Sound"
│       │   ├── ToggleButton (Sounds)
│       │   └── VSlider (Volume)
│       │
│       ├── Section "Display"
│       │   ├── ToggleButton (Dark Mode)
│       │   └── OptionButton (Font Size)
│       │
│       └── Section "Data"
│           ├── Button "Export"
│           ├── Button "Import"
│           └── Button "Clear All"
└── BackButton
```

**Story Points:** M (3)

---

### US-6.2: Dark Mode Support
**Domain:** User Management | Presentation  
**As a** user  
**I want to** use dark mode  
**So that** I reduce eye strain in the evening  

**Acceptance Criteria:**
- [ ] Toggle in settings
- [ ] Auto-detect system preference
- [ ] Can override manual setting
- [ ] All screens have dark variants
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Persist setting

**Godot Theme System:**
```gdscript
class_name ThemeManager
extends Node

var light_theme: Theme
var dark_theme: Theme

func apply_theme(use_dark: bool) -> void:
    var theme = dark_theme if use_dark else light_theme
    for control in get_tree().get_nodes_in_group("themed"):
        control.theme = theme
```

**Story Points:** S (2)

---

### US-6.3: Notification Settings
**Domain:** User Management | Notification  
**As a** user  
**I want to** control notifications  
**So that** I'm not overwhelmed  

**Acceptance Criteria:**
- [ ] Master toggle: All notifications
- [ ] Individual toggles: Phase, Completion, Reminders
- [ ] Volume slider
- [ ] Mute until setting (do not disturb)
- [ ] Time-based settings (quiet hours)

**Story Points:** S (2)

---

### US-6.4: Data Import/Export
**Domain:** User Management | Persistence  
**As a** user  
**I want to** export and import my data  
**So that** I can back up or restore  

**Acceptance Criteria:**
- [ ] Export button → CSV of all sessions
- [ ] Import button → upload CSV
- [ ] Export includes: cycles, sessions, settings
- [ ] Confirmation before overwriting
- [ ] Shows success/error message

**Story Points:** M (3)

---

### US-6.5: Data Privacy & Permissions
**Domain:** User Management  
**As a** the app  
**I want to** request necessary permissions  
**So that** I can provide full functionality  

**Acceptance Criteria:**
- [ ] iOS: Request notification permission
- [ ] Android: Request notification permission
- [ ] Graceful degradation if permission denied
- [ ] Privacy policy accessible
- [ ] No unnecessary data collection
- [ ] No ads or tracking

**Godot Permission Handling:**
```gdscript
func request_notification_permission() -> bool:
    if OS.has_permission("POST_NOTIFICATIONS"):
        return true
    else:
        OS.request_permission("POST_NOTIFICATIONS")
        return false
```

**Story Points:** M (3)

---

### US-6.6: App Information & Links
**Domain:** User Management | Presentation  
**As a** user  
**I want to** see app info, privacy policy, version  
**So that** I can learn about the app  

**Acceptance Criteria:**
- [ ] Version number displayed
- [ ] Build number
- [ ] Links: Privacy Policy, Terms, Support
- [ ] Link: Rate app (App Store)
- [ ] Link: Share app
- [ ] Credits/Attribution

**Story Points:** XS (1)

---

## 🎨 EPIC 7: Presentation & UX (20 points)

### Domain Model
```
Navigation (Controller)
├── Screen (Base)
├── ViewController
└── ViewModels
```

---

### US-7.1: Mobile Navigation System
**Domain:** Presentation  
**As a** user  
**I want to** navigate between screens smoothly  
**So that** I can explore the app  

**Acceptance Criteria:**
- [ ] Bottom tab navigation (iOS/Android)
- [ ] Tabs: Cycles, Timer, Analytics, Settings
- [ ] Active tab highlighted
- [ ] Badge count on icons (pending sessions)
- [ ] Fast transitions (<200ms)
- [ ] Back button support

**Godot Navigation:**
```gdscript
class_name AppRouter
extends Node

var screens: Dictionary = {
    "cycles": CyclesScreen.new(),
    "timer": TimerScreen.new(),
    "analytics": AnalyticsScreen.new(),
    "settings": SettingsScreen.new(),
}

func navigate_to(screen_name: String) -> void:
    var screen = screens[screen_name]
    show_screen(screen)
```

**Story Points:** M (3)

---

### US-7.2: Full-Screen Timer Mode
**Domain:** Presentation  
**As a** user  
**I want to** see a distraction-free timer during practice  
**So that** I can focus  

**Acceptance Criteria:**
- [ ] Hide status bar (iOS) / system UI (Android)
- [ ] Full-screen timer display
- [ ] Large, readable font (48pt+)
- [ ] Immersive mode (no navigation visible)
- [ ] Phase info displayed
- [ ] Play/Pause buttons accessible
- [ ] Swipe to exit (optional)

**Godot Scene:**
```
TimerScreenFullScreen (Node)
├── ColorRect (black background)
├── TimerDisplay (large text)
├── CircularProgress
├── CurrentPhaseLabel
├── ControlsContainer
│   ├── PlayButton
│   ├── PauseButton
│   └── SkipButton
└── GestureDetector
```

**Story Points:** M (3)

---

### US-7.3: Responsive Design for All Screens
**Domain:** Presentation  
**As a** user  
**I want to** use the app on any phone size  
**So that** it works for everyone  

**Acceptance Criteria:**
- [ ] Works on 360px - 480px phones
- [ ] Works on 768px+ tablets
- [ ] Portrait and landscape
- [ ] Touch targets 48pt minimum
- [ ] No horizontal scrolling
- [ ] Safe area insets (notches)

**Device Testing Targets:**
- iPhone SE (375px)
- iPhone 14 (390px)
- iPhone 14 Pro Max (430px)
- Samsung Galaxy S21 (360px)
- iPad (768px+)

**Godot Responsive:**
```gdscript
func _on_window_size_changed() -> void:
    var size = get_viewport().get_visible_rect().size
    if size.x < 400:
        # Phone layout
        phone_layout()
    else:
        # Tablet layout
        tablet_layout()
```

**Story Points:** L (5)

---

### US-7.4: Loading & Wait States
**Domain:** Presentation  
**As a** user  
**I want to** see loading indicators  
**So that** I know the app is working  

**Acceptance Criteria:**
- [ ] Loading spinner during operations
- [ ] Progress bar for long operations
- [ ] Skeleton screens for data loading
- [ ] Graceful error states
- [ ] Timeout after 30 seconds

**Godot Loader:**
```gdscript
class_name LoadingIndicator
extends Control

func show_loading(message: String = "Loading...") -> void:
    var spinner = AnimationPlayer.new()
    spinner.play("spin")
    add_child(spinner)

func hide_loading() -> void:
    queue_free()
```

**Story Points:** M (3)

---

### US-7.5: Animations & Transitions
**Domain:** Presentation  
**As a** user  
**I want to** see smooth animations  
**So that** the app feels polished  

**Acceptance Criteria:**
- [ ] Screen transitions animated
- [ ] Button press feedback
- [ ] List item animations
- [ ] Timer countdown animation
- [ ] Progress ring animation
- [ ] All animations <300ms
- [ ] Respect motion preferences (iOS)

**Godot Tweens:**
```gdscript
func animate_screen_in(screen: Control) -> void:
    screen.modulate.a = 0
    var tween = create_tween()
    tween.tween_property(screen, "modulate:a", 1.0, 0.3)
    tween.set_trans(Tween.TRANS_CUBIC)
    tween.set_ease(Tween.EASE_OUT)
```

**Story Points:** M (3)

---

### US-7.6: Accessibility (WCAG 2.1 AA)
**Domain:** Presentation  
**As a** user with disabilities  
**I want to** use the app accessibly  
**So that** everyone can benefit  

**Acceptance Criteria:**
- [ ] Button labels accessible
- [ ] Color not only indicator
- [ ] Text contrast 4.5:1 (normal text)
- [ ] 3:1 (large text)
- [ ] Keyboard navigation support
- [ ] Screen reader compatible (labels)
- [ ] Focus indicators visible
- [ ] 20px minimum text size

**Story Points:** M (3)

---

## 📱 EPIC 8: Platform-Specific Features (16 points)

### US-8.1: iOS-Specific Features
**Domain:** Presentation | Notification  
**As an** iOS user  
**I want to** use iOS native features  
**So that** I get a native app experience  

**Features:**
- [ ] Lock screen widgets (Dynamic Island notification)
- [ ] App clips support
- [ ] Siri shortcuts (Phase 2)
- [ ] Home screen app icon variants
- [ ] Haptic feedback (taptic engine)

**Godot iOS Plugin:**
```gdscript
if OS.get_name() == "iOS":
    var ios_notification = get_node("/root/IOSNotification")
    ios_notification.send_notification(payload)
```

**Story Points:** M (3)

---

### US-8.2: Android-Specific Features
**Domain:** Presentation | Notification  
**As an** Android user  
**I want to** use Android native features  
**So that** I get a native app experience  

**Features:**
- [ ] Material 3 design
- [ ] Android 12+ theming
- [ ] Notification channels
- [ ] Expandable notifications
- [ ] Gesture navigation support
- [ ] Work Scheduling for reminders

**Story Points:** M (3)

---

### US-8.3: Background Execution (iOS)
**Domain:** Timer Management | Presentation  
**As a** user  
**I want to** use the timer with app in background  
**So that** I can do other things  

**Acceptance Criteria:**
- [ ] Timer continues when app backgrounded
- [ ] Limited accuracy in background (±2 seconds)
- [ ] Notification at phase transition
- [ ] App doesn't get killed
- [ ] Works up to 10 minutes background

**iOS Implementation:**
```swift
// iOS Plugin
func requestBackgroundExecution() {
    let request = BGProcessingTaskRequest(identifier: "com.timecycle.timer")
    request.requiresNetworkConnectivity = false
    request.requiresExternalPower = false
    try? BGTaskScheduler.shared.submit(request)
}
```

**Story Points:** M (3)

---

### US-8.4: Background Execution (Android)
**Domain:** Timer Management | Presentation  
**As an** Android user  
**I want to** use the timer with app in background  
**So that** I can do other things  

**Acceptance Criteria:**
- [ ] Foreground service with notification
- [ ] Full timer accuracy in background
- [ ] Works indefinitely while service running
- [ ] Service notification prominent

**Android Implementation:**
```kotlin
// Android Plugin
class TimerService : Service() {
    fun startTimer() {
        startForeground(NOTIFICATION_ID, notification)
        // Timer thread continues
    }
}
```

**Story Points:** M (3)

---

### US-8.5: Battery Optimization
**Domain:** Presentation | Performance  
**As a** user with low battery  
**I want to** use the app efficiently  
**So that** my battery lasts longer  

**Acceptance Criteria:**
- [ ] <5% battery per hour
- [ ] Reduce refresh rate in low power mode
- [ ] Disable animations on low power
- [ ] Minimize sensor usage
- [ ] Efficient timer implementation

**Story Points:** S (2)

---

### US-8.6: Haptic Feedback
**Domain:** Presentation | Notification  
**As a** user  
**I want to** feel vibration feedback  
**So that** I get physical feedback  

**Acceptance Criteria:**
- [ ] Single pulse on phase change
- [ ] Double pulse on session end
- [ ] Can be disabled
- [ ] Respects silent mode (iOS)

**Godot Haptics:**
```gdscript
func trigger_haptic(intensity: float = 1.0) -> void:
    if OS.get_name() == "iOS":
        OS.vibrate_handheld(100)  # milliseconds
    elif OS.get_name() == "Android":
        OS.vibrate_handheld(100)
```

**Story Points:** S (2)

---

## 📊 Summary: Story Points Allocation

| Epic | Name | Points | MVP |
|------|------|--------|-----|
| 1 | Timer Management | 32 | ✅ 32 |
| 2 | Cycle Management | 28 | ✅ 28 |
| 3 | Session Management | 24 | ✅ 24 |
| 4 | Notification | 20 | ✅ 8 |
| 5 | Analytics | 20 | ✅ 8 |
| 6 | Settings & User | 16 | ✅ 8 |
| 7 | Presentation & UX | 20 | ✅ 12 |
| 8 | Platform-Specific | 16 | ✅ 12 |
| **TOTAL** | | **176** | **✅ 132** |

**MVP Scope:** 92 story points (Phase 1 - Weeks 1-4)

---

## 🎯 Definition of Done (DDD-Focused)

Each user story MUST have:

### Domain Layer
- ✅ Domain entities created
- ✅ Value objects defined
- ✅ Repository interfaces defined
- ✅ Specification patterns for validation
- ✅ Domain events published
- ✅ Unit tests (domain logic)

### Application Layer
- ✅ Commands implemented
- ✅ Query handlers implemented
- ✅ Use case logic tested
- ✅ Integration tests

### Infrastructure Layer
- ✅ Repository implementations
- ✅ Adapter implementations
- ✅ Storage service
- ✅ External service integrations

### Presentation Layer
- ✅ Godot scenes created
- ✅ Controllers implemented
- ✅ View models created
- ✅ UI tests

### General
- ✅ Code reviewed
- ✅ All tests passing (80%+ coverage)
- ✅ Performance tested
- ✅ Accessibility tested
- ✅ Documentation updated

---

**End of User Stories - Mobile Godot Edition**

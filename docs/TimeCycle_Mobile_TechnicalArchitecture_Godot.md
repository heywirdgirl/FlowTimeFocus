# Technical Architecture - TimeCycle Mobile App
## Godot 4.6 + Domain-Driven Design (DDD)

**Version:** 1.0  
**Engine:** Godot 4.6.0 or later  
**Language:** GDScript  
**Platforms:** iOS 14+, Android 11+  

---

## 1. Architecture Overview

### Layered Architecture with DDD

```
┌─────────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                         │
│  (Scenes, Controls, UI Logic, ViewModels)                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              APPLICATION LAYER (CQRS)                       │
│  (Commands, Queries, Handlers, Use Cases)                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    DOMAIN LAYER (DDD)                       │
│  (Entities, Value Objects, Services, Specifications)        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│             INFRASTRUCTURE LAYER (Adapter)                  │
│  (Repositories, Services, External Integrations)            │
└─────────────────────────────────────────────────────────────┘
```

### Bounded Contexts (Domains)

```
TimeCycle System
├── Timer Management Context
│   ├── Domain: Timer entity, Phase progress, States
│   ├── Commands: StartTimer, PauseTimer, SkipPhase
│   └── Events: TimerStarted, PhaseConcluded, TimerStopped
│
├── Cycle Management Context
│   ├── Domain: Cycle aggregate, Phase entity
│   ├── Commands: CreateCycle, UpdateCycle, DeleteCycle
│   └── Events: CycleCreated, CycleUpdated, CycleDeleted
│
├── Session Management Context
│   ├── Domain: PracticeSession aggregate, PhaseRecord
│   ├── Commands: StartSession, CompleteSession
│   └── Events: SessionStarted, SessionCompleted
│
├── Notification Context
│   ├── Domain: Notification, Schedule
│   ├── Commands: SendNotification, ScheduleReminder
│   └── Events: NotificationSent, ReminderTriggered
│
└── Analytics Context
    ├── Domain: DailyStats, Report
    ├── Queries: GetDailyStats, GetStreak, GetReport
    └── Events: SessionAnalyzed, StatsUpdated
```

---

## 2. Core Concepts

### 2.1 Domain-Driven Design Principles

**Ubiquitous Language:**
```
- Timer: Countdown mechanism for practice phases
- Cycle: Collection of sequential phases
- Phase: Individual segment with duration
- Session: Recording of one complete cycle practice
- Aggregate Root: Entity that owns other entities
- Value Object: Immutable, compared by value
```

**Bounded Contexts:**
Each context has:
- Own domain models
- Own storage layer
- Clear interfaces for integration
- Anti-Corruption Layer if needed

### 2.2 Command Query Responsibility Segregation (CQRS)

**Commands:** Modify state (StartTimer, CreateCycle)
**Queries:** Read state (GetCurrentTimer, GetCycleList)
**Events:** Notify about state changes

---

## 3. Domain Layer Architecture

### 3.1 Timer Management Domain

#### Entities
```gdscript
# src/modules/timer_management/domain/entities/timer.gd
class_name Timer
extends Reference

var id: String
var remaining_time: RemainingTime  # Value Object
var current_phase_index: int
var state: TimerState              # Value Object
var phases: Array[Phase]
var _events: Array[DomainEvent]

func start() -> void:
    if not _is_running_spec.is_satisfied_by(self):
        state = TimerState.new(TimerState.Status.RUNNING)
        var event = TimerStartedEvent.new(id, remaining_time)
        _raise_event(event)

func pause() -> void:
    state = TimerState.new(TimerState.Status.PAUSED)
    _raise_event(TimerPausedEvent.new(id))

func advance_to_next_phase() -> void:
    if current_phase_index < phases.size() - 1:
        current_phase_index += 1
        remaining_time = RemainingTime.new(phases[current_phase_index].duration * 60)
        _raise_event(PhaseAdvancedEvent.new(id, current_phase_index))
    else:
        complete()

func complete() -> void:
    state = TimerState.new(TimerState.Status.COMPLETED)
    _raise_event(TimerCompletedEvent.new(id))

func get_domain_events() -> Array[DomainEvent]:
    return _events

func _raise_event(event: DomainEvent) -> void:
    _events.append(event)

# Private
var _is_running_spec: TimerRunningSpecification
```

#### Value Objects
```gdscript
# src/shared/domain/value_objects/remaining_time.gd
class_name RemainingTime
extends Reference

var seconds: int

func _init(secs: int) -> void:
    seconds = max(0, secs)

func decrement_by_delta(delta: float) -> void:
    seconds = max(0, seconds - int(delta))

func is_zero() -> bool:
    return seconds == 0

func to_string() -> String:
    var minutes = seconds / 60
    var secs = seconds % 60
    return "%02d:%02d" % [minutes, secs]

func equals(other: RemainingTime) -> bool:
    return seconds == other.seconds
```

```gdscript
# src/modules/timer_management/domain/value_objects/timer_state.gd
class_name TimerState
extends Reference

enum Status { IDLE, RUNNING, PAUSED, COMPLETED, STOPPED }

var status: int

func _init(s: int = Status.IDLE) -> void:
    status = s

func is_running() -> bool:
    return status == Status.RUNNING

func is_paused() -> bool:
    return status == Status.PAUSED
```

#### Domain Services
```gdscript
# src/modules/timer_management/domain/services/timer_domain_service.gd
class_name TimerDomainService
extends Reference

func create_timer(phases: Array[Phase]) -> Timer:
    var timer = Timer.new()
    timer.id = UUID.new().v4()
    timer.phases = phases
    timer.current_phase_index = 0
    timer.remaining_time = RemainingTime.new(int(phases[0].duration * 60))
    timer.state = TimerState.new(TimerState.Status.IDLE)
    return timer

func validate_timer(timer: Timer) -> bool:
    return timer.phases.size() > 0 and timer.remaining_time.seconds > 0
```

#### Specifications (Validation)
```gdscript
# src/modules/timer_management/domain/specifications/timer_running_spec.gd
class_name TimerRunningSpecification
extends Specification

func is_satisfied_by(timer: Timer) -> bool:
    return timer.state.is_running() == false
```

#### Events
```gdscript
# src/shared/domain/events/domain_event.gd
class_name DomainEvent
extends Reference

var id: String
var occurred_at: float

func _init() -> void:
    id = UUID.new().v4()
    occurred_at = Time.get_ticks_msec()

# ---

# src/modules/timer_management/domain/events/timer_started_event.gd
class_name TimerStartedEvent
extends DomainEvent

var timer_id: String
var remaining_time: RemainingTime

func _init(tid: String, rt: RemainingTime) -> void:
    super()
    timer_id = tid
    remaining_time = rt
```

---

### 3.2 Cycle Management Domain

#### Aggregate Root
```gdscript
# src/modules/cycle_management/domain/entities/cycle.gd
class_name Cycle
extends Reference

var id: String
var name: String
var phases: Array[Phase]
var is_template: bool = false
var created_at: int
var updated_at: int
var practice_count: int = 0
var total_minutes: int = 0
var _events: Array[DomainEvent]

func add_phase(phase: Phase) -> void:
    phases.append(phase)
    _raise_event(PhaseAddedEvent.new(id, phase))

func remove_phase(index: int) -> void:
    if index >= 0 and index < phases.size():
        phases.remove_at(index)
        _raise_event(PhaseRemovedEvent.new(id, index))

func get_total_duration() -> float:
    var total = 0.0
    for phase in phases:
        total += phase.duration
    return total

func get_domain_events() -> Array[DomainEvent]:
    return _events

func _raise_event(event: DomainEvent) -> void:
    _events.append(event)
```

#### Repository Interface (Inversion of Control)
```gdscript
# src/shared/domain/repositories/cycle_repository.gd
class_name CycleRepository
extends Reference

func get_by_id(cycle_id: String) -> Cycle:
    push_error("Must be implemented by subclass")
    return null

func get_all() -> Array[Cycle]:
    push_error("Must be implemented by subclass")
    return []

func save(cycle: Cycle) -> void:
    push_error("Must be implemented by subclass")

func delete(cycle_id: String) -> void:
    push_error("Must be implemented by subclass")
```

---

### 3.3 Session Management Domain

#### Session Aggregate Root
```gdscript
# src/modules/session_management/domain/entities/practice_session.gd
class_name PracticeSession
extends Reference

var id: String
var cycle_id: String
var start_time: int
var end_time: int
var phases: Array[PhaseRecord]
var completed: bool = false
var _events: Array[DomainEvent]

func record_phase_completion(phase_index: int, actual_duration: int) -> void:
    if phase_index < phases.size():
        phases[phase_index].actual_duration = actual_duration
        phases[phase_index].completed = true
        _raise_event(PhaseRecordedEvent.new(id, phase_index, actual_duration))

func complete() -> void:
    completed = true
    end_time = Time.get_ticks_msec()
    _raise_event(SessionCompletedEvent.new(id, get_duration()))

func get_duration() -> int:
    return (end_time - start_time) / 1000

func get_domain_events() -> Array[DomainEvent]:
    return _events

func _raise_event(event: DomainEvent) -> void:
    _events.append(event)
```

---

## 4. Application Layer (CQRS)

### 4.1 Commands & Handlers

```gdscript
# src/shared/application/command.gd (Base class)
class_name Command
extends Reference
# All commands inherit from this

# ---

# src/modules/timer_management/application/commands/start_timer_command.gd
class_name StartTimerCommand
extends Command

var cycle_id: String

func _init(cid: String) -> void:
    cycle_id = cid
```

#### Command Handler
```gdscript
# src/modules/timer_management/application/handlers/start_timer_handler.gd
class_name StartTimerHandler
extends Reference

var timer_repository: TimerRepository
var event_bus: EventBus

func handle(command: StartTimerCommand) -> void:
    var cycle = cycle_repository.get_by_id(command.cycle_id)
    var timer = TimerDomainService.new().create_timer(cycle.phases)
    
    timer.start()
    
    # Save state
    timer_repository.save(timer)
    
    # Publish events
    for event in timer.get_domain_events():
        event_bus.publish(event)
```

### 4.2 Queries & Query Handlers

```gdscript
# src/shared/application/query.gd (Base class)
class_name Query
extends Reference

# ---

# src/modules/timer_management/application/queries/get_remaining_time_query.gd
class_name GetRemainingTimeQuery
extends Query

var timer_id: String

func _init(tid: String) -> void:
    timer_id = tid

# ---

# src/modules/timer_management/application/handlers/get_remaining_time_query_handler.gd
class_name GetRemainingTimeQueryHandler
extends Reference

var timer_repository: TimerRepository

func handle(query: GetRemainingTimeQuery) -> String:
    var timer = timer_repository.get_by_id(query.timer_id)
    if timer:
        return timer.remaining_time.to_string()
    return "00:00"
```

### 4.3 Event Bus

```gdscript
# src/shared/application/event_bus.gd
class_name EventBus
extends Node

var _subscribers: Dictionary = {}  # event_type -> [handlers]

func subscribe(event_type: String, handler: Callable) -> void:
    if not _subscribers.has(event_type):
        _subscribers[event_type] = []
    _subscribers[event_type].append(handler)

func publish(event: DomainEvent) -> void:
    var event_type = event.get_class()
    if _subscribers.has(event_type):
        for handler in _subscribers[event_type]:
            handler.call(event)

# Subscribe to domain events
func setup_subscriptions() -> void:
    subscribe("TimerStartedEvent", Callable(self, "_on_timer_started"))
    subscribe("PhaseAdvancedEvent", Callable(self, "_on_phase_advanced"))
    subscribe("SessionCompletedEvent", Callable(self, "_on_session_completed"))

func _on_timer_started(event: TimerStartedEvent) -> void:
    # Notify UI, start background task, etc.
    pass
```

---

## 5. Infrastructure Layer

### 5.1 Repository Implementations

```gdscript
# src/modules/timer_management/infrastructure/timer_repository.gd
class_name TimerRepositoryImpl
extends TimerRepository

var _timers: Dictionary = {}  # id -> Timer
var _storage_service: StorageService

func _init(storage: StorageService) -> void:
    _storage_service = storage

func get_by_id(timer_id: String) -> Timer:
    if _timers.has(timer_id):
        return _timers[timer_id]
    
    var data = _storage_service.get("timer:%s" % timer_id)
    if data:
        return _deserialize(data)
    return null

func save(timer: Timer) -> void:
    _timers[timer.id] = timer
    var data = _serialize(timer)
    _storage_service.set("timer:%s" % timer.id, data)

func get_all() -> Array[Timer]:
    return _timers.values()

func delete(timer_id: String) -> void:
    _timers.erase(timer_id)
    _storage_service.delete("timer:%s" % timer_id)

func _serialize(timer: Timer) -> Dictionary:
    return {
        "id": timer.id,
        "remaining_time": timer.remaining_time.seconds,
        "current_phase_index": timer.current_phase_index,
        "state": timer.state.status
    }

func _deserialize(data: Dictionary) -> Timer:
    var timer = Timer.new()
    timer.id = data["id"]
    timer.remaining_time = RemainingTime.new(data["remaining_time"])
    timer.current_phase_index = data["current_phase_index"]
    return timer
```

### 5.2 Storage Service

```gdscript
# src/shared/infrastructure/persistence/storage_service.gd
class_name StorageService
extends Reference

var _user_dir: String

func _init() -> void:
    if OS.get_name() == "iOS":
        _user_dir = OS.get_user_data_dir() + "/timecycle"
    elif OS.get_name() == "Android":
        _user_dir = OS.get_user_data_dir() + "/timecycle"
    else:
        _user_dir = OS.get_user_data_dir() + "/timecycle"
    
    _ensure_directory()

func set(key: String, value: Dictionary) -> void:
    var file_path = _user_dir + "/" + key + ".json"
    var json = JSON.stringify(value)
    var file = FileAccess.open(file_path, FileAccess.WRITE)
    if file:
        file.store_string(json)

func get(key: String) -> Dictionary:
    var file_path = _user_dir + "/" + key + ".json"
    if FileAccess.file_exists(file_path):
        var file = FileAccess.open(file_path, FileAccess.READ)
        var json_string = file.get_as_text()
        var json = JSON.new()
        json.parse(json_string)
        return json.data as Dictionary
    return {}

func delete(key: String) -> void:
    var file_path = _user_dir + "/" + key + ".json"
    if FileAccess.file_exists(file_path):
        DirAccess.remove_absolute(file_path)

func _ensure_directory() -> void:
    var dir = DirAccess.open(_user_dir.get_base_dir())
    if not dir:
        DirAccess.make_dir_recursive_absolute(_user_dir)
```

### 5.3 Notification Adapter (Platform-Specific)

```gdscript
# src/modules/notification_management/infrastructure/notification_adapter.gd
class_name NotificationAdapter
extends Reference

func send_notification(notification: Notification) -> void:
    push_error("Must be implemented by subclass")

# ---

# src/modules/notification_management/infrastructure/ios_notification_adapter.gd
class_name IosNotificationAdapter
extends NotificationAdapter

func send_notification(notification: Notification) -> void:
    if OS.get_name() != "iOS":
        return
    
    var payload = {
        "title": notification.title,
        "body": notification.body,
        "badge": 1
    }
    
    # Use iOS native API via plugin
    var ios_notifications = Engine.get_singleton("IOSNotifications")
    ios_notifications.send_notification(payload)

# ---

# src/modules/notification_management/infrastructure/android_notification_adapter.gd
class_name AndroidNotificationAdapter
extends NotificationAdapter

func send_notification(notification: Notification) -> void:
    if OS.get_name() != "Android":
        return
    
    var payload = {
        "title": notification.title,
        "body": notification.body,
        "channel": "timecycle_notifications"
    }
    
    # Use Android native API via plugin
    var android_notifications = Engine.get_singleton("AndroidNotifications")
    android_notifications.send_notification(payload)
```

---

## 6. Presentation Layer

### 6.1 Godot Scenes Structure

```
# Timer Screen Scene Hierarchy
TimerScreen (Control)
├── ColorRect (background)
├── SafeAreaContainer
│   ├── VBoxContainer
│   │   ├── PhaseIndicator (HBoxContainer with phase items)
│   │   ├── TimerContainer (CenterContainer)
│   │   │   └── TimerDisplay (custom control)
│   │   │       ├── CircularProgress (custom draw)
│   │   │       └── TimeLabel (Label "25:00")
│   │   ├── ControlsContainer (HBoxContainer)
│   │   │   ├── PlayButton
│   │   │   ├── PauseButton
│   │   │   └── StopButton
│   │   └── PhasesList (VBoxContainer scrollable)
│   │       └── PhaseItem x N
│   └── GestureDetector (custom node)
```

### 6.2 Screen Controller (MVVM Pattern)

```gdscript
# src/modules/timer_management/presentation/controllers/timer_screen_controller.gd
class_name TimerScreenController
extends Control

@onready var timer_display = $VBoxContainer/TimerContainer/TimerDisplay
@onready var time_label = $VBoxContainer/TimerContainer/TimerDisplay/TimeLabel
@onready var play_button = $VBoxContainer/ControlsContainer/PlayButton
@onready var pause_button = $VBoxContainer/ControlsContainer/PauseButton
@onready var phase_list = $VBoxContainer/PhasesList

var view_model: TimerScreenViewModel
var command_bus: CommandBus
var query_bus: QueryBus
var timer_domain_thread: Thread

func _ready() -> void:
    # Initialize ViewModel
    view_model = TimerScreenViewModel.new()
    
    # Connect signals
    play_button.pressed.connect(_on_play_pressed)
    pause_button.pressed.connect(_on_pause_pressed)
    
    # Subscribe to domain events
    get_tree().root.get_node("EventBus").subscribe(
        "TimerTickedEvent",
        Callable(self, "_on_timer_ticked")
    )

func _on_play_pressed() -> void:
    var command = StartTimerCommand.new(view_model.current_cycle_id)
    command_bus.execute(command)

func _on_pause_pressed() -> void:
    var command = PauseTimerCommand.new(view_model.current_timer_id)
    command_bus.execute(command)

func _on_timer_ticked(event: TimerTickedEvent) -> void:
    view_model.update_remaining_time(event.remaining_time)
    _update_ui()

func _update_ui() -> void:
    time_label.text = view_model.get_time_display()
    timer_display.progress = view_model.get_progress_percentage()
```

### 6.3 View Model

```gdscript
# src/modules/timer_management/presentation/timer_view_model.gd
class_name TimerScreenViewModel
extends Reference

var current_cycle_id: String
var current_timer_id: String
var current_cycle: Cycle
var remaining_time: RemainingTime
var progress: float = 1.0

func _init() -> void:
    remaining_time = RemainingTime.new(0)

func update_remaining_time(time: RemainingTime) -> void:
    remaining_time = time

func get_time_display() -> String:
    return remaining_time.to_string()

func get_progress_percentage() -> float:
    if current_cycle == null:
        return 0.0
    
    var total_seconds = int(current_cycle.get_total_duration() * 60)
    var elapsed = total_seconds - remaining_time.seconds
    return float(elapsed) / float(total_seconds)
```

---

## 7. Dependency Injection

```gdscript
# src/shared/infrastructure/dependency_container.gd
class_name DependencyContainer
extends Node

static var instance: DependencyContainer

var _services: Dictionary = {}

func _init() -> void:
    if instance == null:
        instance = self

func register(key: String, service: Reference) -> void:
    _services[key] = service

func get_service(key: String) -> Reference:
    if _services.has(key):
        return _services[key]
    push_error("Service not found: " + key)
    return null

func setup() -> void:
    # Core services
    var storage = StorageService.new()
    register("StorageService", storage)
    
    var event_bus = EventBus.new()
    register("EventBus", event_bus)
    
    # Repositories
    var cycle_repo = CycleRepositoryImpl.new(storage)
    register("CycleRepository", cycle_repo)
    
    var timer_repo = TimerRepositoryImpl.new(storage)
    register("TimerRepository", timer_repo)
    
    var session_repo = SessionRepositoryImpl.new(storage)
    register("SessionRepository", session_repo)
    
    # Notification adapter
    var notification_adapter = _create_notification_adapter()
    register("NotificationAdapter", notification_adapter)

func _create_notification_adapter() -> NotificationAdapter:
    if OS.get_name() == "iOS":
        return IosNotificationAdapter.new()
    elif OS.get_name() == "Android":
        return AndroidNotificationAdapter.new()
    else:
        return NotificationAdapter.new()  # Default
```

---

## 8. Timer Accuracy Implementation

### Background Thread Timer

```gdscript
# src/modules/timer_management/infrastructure/thread_timer.gd
class_name ThreadTimer
extends Reference

var _thread: Thread
var _running: bool = false
var _elapsed: float = 0.0
var _tick_callback: Callable

func start(duration: float, tick_callback: Callable) -> void:
    _tick_callback = tick_callback
    _running = true
    _elapsed = 0.0
    
    _thread = Thread.new(_timer_loop.bindv([duration]))

func pause() -> void:
    _running = false

func resume() -> void:
    _running = true

func stop() -> void:
    _running = false
    if _thread:
        _thread.wait_to_finish()

func _timer_loop(duration: float) -> void:
    var last_tick = Time.get_ticks_msec()
    
    while _running and _elapsed < duration:
        var now = Time.get_ticks_msec()
        var delta = (now - last_tick) / 1000.0
        
        if _running:
            _elapsed += delta
            _tick_callback.call(_elapsed)
        
        last_tick = now
        OS.delay_msec(50)  # Check every 50ms for accuracy
```

---

## 9. Build Configuration

### project.godot Configuration

```ini
[application]
config/name="TimeCycle"
config/version="1.0.0"

[export_templates]
android/debug_template=""
android/release_template=""
ios/debug_template=""
ios/release_template=""

[export]
# iOS
export/iOS/8="TimeCycle_iOS"
export/iOS/8/valid_symbol_name=true

# Android  
export/Android/7="TimeCycle_Android"
export/Android/7/release_keystore=""
export/Android/7/release_keystore_user=""

[display]
window/size/viewport_width=390
window/size/viewport_height=844
window/handheld_mode=true

[rendering]
quality/driver/driver_name="vulkan"
quality/global_illumination/probe_subdivision=2
```

### iOS Export

```gdscript
# Export project for iOS
[Export Settings]
Application/app_identifier = "com.timecycle.app"
Application/app_name = "TimeCycle"
Application/app_version = "1.0.0"
Application/code_sign_identity = "Apple Development"
Application/provisioning_profile_uuid_release = "..."
Permissions/camera = false
Permissions/microphone = true
Permissions/user_notifications = true
```

### Android Export

```gdscript
# Export project for Android
[Export Settings]
Package/unique_name = "com.timecycle.app"
Package/name = "TimeCycle"
Package/version = "1.0.0"
Release/keystore = "path/to/keystore.jks"
Release/keystore_user = "..."
Release/keystore_pass = "..."
Permissions/INTERNET = true
Permissions/POST_NOTIFICATIONS = true
Permissions/VIBRATE = true
```

---

## 10. Testing Strategy

### Unit Tests (GDScript)

```gdscript
# tests/unit/timer_management/domain/timer_test.gd
extends GutTest

var timer: Timer

func before_each() -> void:
    timer = Timer.new()
    timer.id = "test-timer"
    timer.remaining_time = RemainingTime.new(1500)  # 25 minutes
    timer.state = TimerState.new(TimerState.Status.IDLE)

func test_timer_starts() -> void:
    timer.start()
    assert_eq(timer.state.is_running(), true)

func test_timer_remaining_time_decrements() -> void:
    var rt = RemainingTime.new(100)
    rt.decrement_by_delta(10)
    assert_eq(rt.seconds, 90)

func test_timer_can_pause() -> void:
    timer.start()
    timer.pause()
    assert_eq(timer.state.is_paused(), true)

func test_cycle_advancing_raises_event() -> void:
    timer.advance_to_next_phase()
    var events = timer.get_domain_events()
    assert_true(events.size() > 0)
    assert_is(events[0], PhaseAdvancedEvent)
```

### Integration Tests

```gdscript
# tests/integration/timer_flow_test.gd
extends GutTest

var container: DependencyContainer
var command_bus: CommandBus

func before_each() -> void:
    container = DependencyContainer.new()
    container.setup()
    command_bus = CommandBus.new(container)

func test_complete_timer_flow() -> void:
    var cycles = container.get_service("CycleRepository").get_all()
    assert_true(cycles.size() > 0)
    
    var command = StartTimerCommand.new(cycles[0].id)
    command_bus.execute(command)
    
    # Simulate timer completion
    await get_tree().create_timer(2.0).timeout
    
    var sessions = container.get_service("SessionRepository").get_all()
    assert_true(sessions.size() > 0)
```

---

## 11. Performance Optimization Checklist

- ✅ Use Object pooling for frequent allocations
- ✅ Minimize draw calls (batch UI elements)
- ✅ Use compressed audio files (MP3/OGG)
- ✅ Defer non-critical operations to idle frame
- ✅ Use background threads for long tasks
- ✅ Memory profiling (target <80MB)
- ✅ Profile CPU usage (target 30-60 FPS)

### Memory Management

```gdscript
# Proper cleanup
func _exit_tree() -> void:
    # Unsubscribe from events
    event_bus.unsubscribe("TimerTickedEvent", Callable(self, "_on_timer_ticked"))
    
    # Stop threads
    if timer_thread:
        timer_thread.wait_to_finish()
    
    # Clear references
    view_model = null
```

---

## 12. Security Considerations

- ✅ Local storage encryption (user data)
- ✅ No hardcoded secrets
- ✅ Validate all user input
- ✅ HTTPS only (if cloud future)
- ✅ Respect privacy (no tracking)
- ✅ Secure permissions requesting

```gdscript
# Input validation example
func validate_cycle_name(name: String) -> bool:
    if name.length() < 1 or name.length() > 50:
        return false
    if name.contains(";") or name.contains("'"):
        return false
    return true
```

---

**End of Technical Architecture Document**

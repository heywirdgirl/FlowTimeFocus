# Data Schema

Firestore (short):

users/{userId}
- email: string
- createdAt: timestamp

users/{userId}/cycles/{cycleId}
- id: string
- name: string
- phases: [{ id, name, duration_seconds, type }]
- createdAt, updatedAt: timestamp
- isTemplate: boolean

Notes: phases stored as embedded array for simplicity and fast reads.

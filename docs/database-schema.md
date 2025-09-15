# Better Habit - Google Sheets Database Schema

## Overview

Better Habit uses Google Sheets as the primary database with a structure optimized for habit tracking. The database consists of 2 main sheets: `Habits` and `HabitLog`.

## Database Structure

### 1. Habits Sheet

Main table for storing user habit data.

#### Columns Structure

| Column | Type | Description | Example | Required |
|--------|------|-------------|---------|----------|
| `id` | Integer | Unique identifier for habit | `1, 2, 3` | ✅ |
| `display_name` | String | Display name for habit | `"Morning Exercise"` | ✅ |
| `description` | String | Habit description/goal | `"30 minutes workout"` | ❌ |
| `icon_name` | String | Icon name for habit | `"exercise_icon"` | ✅ |
| `category` | String | Habit category | `"Health"` | ✅ |
| `time_of_day` | String | Time of day for habit | `"Morning"` | ✅ |
| `frequency_type` | String | Frequency: "daily", "weekly", "custom" | `"daily"` | ✅ |
| `frequency_days` | String | Days of the week (for weekly/custom) | `"1,2,3,4,5"` | ❌ |
| `reminder_time` | String | Reminder time (HH:MM format) | `"07:00"` | ❌ |
| `is_reminder_on` | Boolean | Reminder active status | `1` or `0` | ✅ |
| `is_active` | Boolean | Habit active status | `1` or `0` | ✅ |
| `created_at` | String | Creation timestamp | `"2024-12-01 10:00:00"` | ✅ |

#### Sample Data

```csv
id,display_name,icon_name,category,time_of_day,frequency_type,frequency_days,reminder_time,is_reminder_on,description,is_active,created_at
1,Morning Exercise,exercise_icon,Health,Morning,daily,,07:00,1,30 minutes workout,1,2024-12-01 10:00:00
2,Read Books,book_icon,Mind,Evening,weekly,"1,2,3,4,5",19:00,1,Read 20 pages,1,2024-12-01 10:00:00
3,No Smoking,no_smoking_icon,To Dont List,All Day,daily,,,1,No smoking today,1,2024-12-01 10:00:00
4,Meditation,meditation_icon,Spiritual,Morning,daily,,06:30,1,15 minutes meditation,1,2024-12-01 10:00:00
5,Drink Water,water_icon,Health,All Day,daily,,,0,8 glasses of water,1,2024-12-01 10:00:00
```

### 2. HabitLog Sheet

Table for storing user habit activity logs.

#### Columns Structure

| Column | Type | Description | Example | Required |
|--------|------|-------------|---------|----------|
| `id` | Integer | Unique identifier for log | `101, 102, 103` | ✅ |
| `habit_id` | Integer | Foreign key to Habits.id | `1, 2, 3` | ✅ |
| `date` | String | Log date (YYYY-MM-DD format) | `"2024-12-22"` | ✅ |
| `completed_value` | Integer | Achieved value (optional) | `35, 25` | ❌ |
| `completed_at` | String | Completion timestamp | `"2024-12-22 07:30:15"` | ✅ |

#### Sample Data

```csv
id,habit_id,date,completed_value,completed_at
101,1,2024-12-22,35,2024-12-22 07:30:15
102,2,2024-12-22,25,2024-12-22 19:45:30
103,3,2024-12-22,,2024-12-22 23:59:59
104,1,2024-12-23,30,2024-12-23 07:15:20
105,4,2024-12-23,15,2024-12-23 06:45:10
106,5,2024-12-23,8,2024-12-23 20:30:00
```

## Data Types & Validation

### Boolean Values
- **Database**: `1` (true) or `0` (false)
- **API Response**: `true` or `false`
- **Validation**: Only accepts `1`, `0`, `true`, `false`

### Date Formats
- **Database**: `YYYY-MM-DD` for date, `YYYY-MM-DD HH:MM:SS` for datetime
- **API**: ISO 8601 format
- **Validation**: Must match specified format

### Frequency Days
- **Format**: Comma-separated string with numbers 1-7
- **Mapping**: 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday, 7=Sunday
- **Example**: `"1,2,3,4,5"` = Monday-Friday

### Time Format
- **Format**: `HH:MM` in 24-hour format
- **Example**: `"07:00"`, `"19:30"`
- **Validation**: Must match regex `^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$`

## API Integration Patterns

### Google Sheets API Endpoints

#### 1. Get All Habits
```typescript
// GET /api/habits
// Response: { data: Habit[] }
```

#### 2. Create Habit
```typescript
// POST /api/habits
// Body: CreateHabitData
// Response: { data: Habit }
```

#### 3. Get Habit Logs
```typescript
// GET /api/habits/[id]/logs
// Response: { data: HabitLog[] }
```

#### 4. Toggle Habit Completion
```typescript
// POST /api/habits/[id]/logs
// Body: { date: string, completedValue?: number }
// Response: { data: HabitLog }
```

### CSV Processing

#### Headers Transformation
```typescript
// Google Sheets headers → API response
"display_name" → "displayName"
"description" → "description"
"icon_name" → "iconName"
"category" → "category"
"time_of_day" → "timeOfDay"
"frequency_type" → "frequencyType"
"frequency_days" → "frequencyDays"
"reminder_time" → "reminderTime"
"is_reminder_on" → "isReminderOn"
"is_active" → "isActive"
"created_at" → "createdAt"
"completed_value" → "completedValue"
"completed_at" → "completedAt"
```

#### Data Type Conversion
```typescript
// String to Number
id: parseInt(row.id)
description: row.description || ""
completedValue: row.completedValue ? parseInt(row.completedValue) : undefined

// String to Boolean
isActive: row.isActive === "1" || row.isActive === true
isReminderOn: row.isReminderOn === "1" || row.isReminderOn === true
```

## Business Rules

### 1. Habit Creation Rules
- `id` must be unique and auto-increment
- `display_name` cannot be empty and maximum 100 characters
- `description` is optional and can be empty
- `category` must be one of: "Spiritual", "Health", "Mind", "To Dont List"
- `time_of_day` must be one of: "Morning", "Afternoon", "Evening", "All Day"
- `frequency_type` only accepts "daily", "weekly", or "custom"

### 2. Habit Log Rules
- `habit_id` must reference existing Habits
- `date` cannot be in the future
- `completed_value` optional, if present must be positive
- One habit can only have one log per day

### 3. Data Integrity Rules
- Cannot delete habit that has logs
- Update habit must maintain reference in HabitLog
- Soft delete using `is_active` flag

## Performance Considerations

### 1. CSV Optimization
- Use CSV format for better performance
- Implement caching with SWR
- Batch operations for multiple updates

### 2. Data Filtering
- Filter `is_active = 1` at API level
- Implement pagination for large data
- Cache frequently accessed data

### 3. Error Handling
- Fallback to authenticated API if CSV fails
- Retry mechanism for network errors
- Graceful degradation for corrupted data

## Migration & Versioning

### 1. Schema Changes
- Always add new columns at the end
- Do not remove existing columns
- Use default values for new columns

### 2. Data Migration
- Backup data before schema changes
- Test migration in staging environment
- Rollback plan if migration fails

### 3. Version Control
- Document all schema changes
- Maintain backward compatibility
- Version API endpoints if necessary

## Security Considerations

### 1. Access Control
- Use service account for API access
- Implement rate limiting
- Validate all input data

### 2. Data Privacy
- Do not expose sensitive data in API response
- Implement data encryption if necessary
- Audit log for data access

### 3. Error Information
- Do not expose internal error details
- Log errors for debugging
- Return user-friendly error messages

## Monitoring & Analytics

### 1. Data Quality
- Monitor data consistency
- Alert for corrupted data
- Regular data validation

### 2. Performance Metrics
- Track API response times
- Monitor error rates
- Measure cache hit rates

### 3. Usage Analytics
- Track habit creation patterns
- Monitor completion rates
- Analyze user engagement

## Best Practices

### 1. Development
- Always use TypeScript interfaces
- Implement proper error handling
- Write comprehensive tests

### 2. Data Management
- Regular data cleanup
- Optimize queries
- Monitor storage usage

### 3. API Design
- Consistent response format
- Proper HTTP status codes
- Comprehensive documentation

---

_Last Updated: September 2025_
_Version: 1.0.0_
_Status: Production Ready_

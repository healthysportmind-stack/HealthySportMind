## Authentication views

### `RegisterView`
- Route: `auth/register/`
- Type: `APIView`
- Method: `POST`
- Purpose: create a new Django `User` and associated `Profile`.
- Behavior:
  - validates `email` and `password`
  - rejects duplicate email
  - creates `User` with `username=email`
  - creates associated `Profile` with optional `name`
  - returns `201` on success with `{ "message": "User created successfully" }`

### `LoginView`
- Route: `auth/login/`
- Type: `APIView`
- Method: `POST`
- Permission: `AllowAny`
- Purpose: authenticate the user and return JWT tokens.
- Behavior:
  - authenticates with `username=email` and `password`
  - returns `access` and `refresh` tokens from `RefreshToken.for_user(user)`
  - returns serialized `user.profile`
  - responds with `400` if credentials are invalid

## RSS proxy view

### `rss_proxy`
- Route: `api/rss/`
- Type: function-based view
- Method: `GET`
- Purpose: proxy and normalize RSS/Atom feeds for the frontend.
- Behavior:
  - requires `?url=` query parameter
  - fetches the feed with a browser-like `User-Agent`
  - parses feed items using `feedparser`
  - extracts image URLs from media fields, enclosures, or HTML content via `extract_image()`
  - returns JSON with `feed_title`, `feed_link`, and `items`
  - returns `400` when `url` is missing and `500` on fetch/parse errors

## Check-in views

### `SubmitCheckInView`
- Route: `api/checkins/submit/`
- Type: `APIView`
- Method: `POST`
- Permission: `IsAuthenticated`
- Purpose: create a new `CheckIn` and generate short-term feedback.
- Behavior:
  - validates incoming check-in payload with `CheckInSerializer`
  - saves a new `CheckIn` tied to `request.user`
  - generates a base message with `generate_post_checkin_message(checkin)`
  - rewrites message tone using `rewrite_message_tone(base_message, tone)`
  - stores the final message in `checkin.post_message`
  - creates a `Feedback` record with `feedback_type="short_term"`
  - returns the saved check-in and final message

### `TodayCheckInView`
- Route: `api/checkins/today/`
- Type: `APIView`
- Method: `GET`
- Permission: `IsAuthenticated`
- Purpose: get today’s check-in and associated feedback.
- Behavior:
  - finds a `CheckIn` for `request.user` created within today’s date range
  - returns `exists: false` when no check-in exists
  - returns `checkin` data and the first related `Feedback` if found

### `LastCheckInView`
- Route: `api/checkins/last/`
- Type: `APIView`
- Method: `GET`
- Permission: `IsAuthenticated`
- Purpose: fetch the most recent check-in and its feedback.
- Behavior:
  - queries the latest `CheckIn` for the user
  - returns `exists: false` when there are no check-ins
  - returns `checkin` data and the first related `Feedback`

## Profile views

### `ProfileMeView`
- Route: `api/profile/me/`
- Type: `generics.RetrieveAPIView`
- Method: `GET`
- Permission: `IsAuthenticated`
- Purpose: return the authenticated user’s profile.
- Behavior:
  - retrieves `request.user.profile`
  - serializes it with `ProfileSerializer`

### `ProfileUpdateView`
- Route: `api/profile/update/`
- Type: `generics.UpdateAPIView`
- Method: `PUT`/`PATCH`
- Permission: `IsAuthenticated`
- Purpose: update fields on the authenticated user’s profile.
- Behavior:
  - updates `request.user.profile` with validated serializer data

## Feedback and insights views

### `SubmitFeedbackView`
- Route: not exposed in a dedicated URLconf here, but present in `backend/api/views.py`
- Type: `APIView`
- Method: `POST`
- Purpose: accept and persist arbitrary `Feedback` submissions.
- Behavior:
  - validates request payload with `FeedbackSerializer`
  - saves feedback tied to `request.user`
  - returns the serialized feedback object

### `WeeklyCheckInView`
- Route: `api/checkins/weekly/`
- Type: `APIView`
- Method: `POST`
- Permission: `IsAuthenticated`
- Purpose: generate a weekly long-term insight message.
- Behavior:
  - generates long-term insight for the last 7 days using `generate_long_term_insight(request.user, 7)`
  - rewrites tone using `rewrite_message_tone(...)`
  - saves a `Feedback` record with `feedback_type="long_term"` and `window_days=7`
  - returns message metadata including `category` and `window_days`

### `MonthlyCheckInView`
- Route: `api/checkins/monthly/`
- Type: `APIView`
- Method: `POST`
- Permission: `IsAuthenticated`
- Purpose: generate a monthly long-term insight message.
- Behavior:
  - generates long-term insight for the last 30 days using `generate_long_term_insight(request.user, 30)`
  - rewrites tone using `rewrite_message_tone(...)`
  - saves a `Feedback` record with `feedback_type="long_term"` and `window_days=30`
  - returns message metadata including `category` and `window_days`

### `LongTermInsightsListView`
- Route: `api/checkins/insights/long-term/`
- Type: `APIView`
- Method: `GET`
- Permission: `IsAuthenticated`
- Purpose: list saved long-term `Feedback` entries.
- Behavior:
  - queries `Feedback` for `request.user` where `feedback_type="long_term"`
  - orders by newest first
  - returns serialized feedback records

## Performance views

### `PerformanceLogListCreateView`
- Route: `api/performance/logs/`
- Type: `generics.ListCreateAPIView`
- Method: `GET` / `POST`
- Permission: `IsAuthenticated`
- Purpose: list and create performance log entries for the authenticated user.
- Behavior:
  - `GET`: returns the user’s `PerformanceLog` objects sorted by `-created_at`
  - `POST`: saves a new `PerformanceLog` tied to `request.user`

## Helper functions

### `extract_image(entry)`
- Purpose: extract an image URL from an RSS/Atom entry.
- Behavior:
  - checks `media_content` and `enclosures`
  - falls back to parsing HTML content for `<img>` tags
  - returns `None` if no image is found

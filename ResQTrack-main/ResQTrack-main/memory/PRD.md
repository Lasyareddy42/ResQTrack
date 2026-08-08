# ResQTrack - Real-Time Disaster Awareness System

## Product Requirements Document

### Original Problem Statement
Build a modern disaster monitoring dashboard called ResQTrack – Real-Time Disaster Awareness System that displays real-time disasters worldwide on an interactive map, shows user live location, and displays detailed disaster information when clicked.

### User Choices
- **Map Provider**: Leaflet with OpenStreetMap tiles (CartoDB Dark Matter theme)
- **Data Sources**: USGS Earthquake API, Weather.gov, NASA FIRMS Wildfire, Volcano data
- **Authentication**: No authentication (public dashboard)
- **Design**: Dark gray tones with subtle gradients, professional analytics dashboard

---

## Architecture

### Backend (FastAPI)
- `/api/earthquakes` - Real-time earthquake data from USGS
- `/api/weather-alerts` - Severe weather alerts from Weather.gov
- `/api/wildfires` - Wildfire data (partially mocked)
- `/api/volcanoes` - Active volcano data (static list)
- `/api/all-disasters` - Aggregated endpoint with statistics

### Frontend (React)
- **Map**: Leaflet with react-leaflet, CartoDB dark tiles
- **Charts**: Chart.js with react-chartjs-2
- **UI Components**: Shadcn/UI (ScrollArea, Badge, Button, Separator, Switch)
- **Styling**: TailwindCSS with custom dark theme

---

## What's Been Implemented (March 2026)

### Core Features ✅
1. **Interactive World Map**
   - Dark theme CartoDB tiles
   - Disaster markers with severity-based colors (red/orange/yellow)
   - Marker clustering for dense areas
   - Heatmap visualization toggle
   - Zoom controls and navigation

2. **User Location**
   - Browser geolocation API integration
   - Blue pulsing marker for user location
   - 500km radius circle indicator
   - Nearby disasters count badge

3. **Sidebar Dashboard**
   - User location coordinates display
   - Disaster details panel (on marker click)
   - Hot Regions quick navigation (Japan, Indonesia, Himalayas, Mediterranean, West Coast USA)
   - Statistics cards (Total, Severe, Moderate, Mild)

4. **Analytics Charts**
   - Magnitude distribution histogram
   - Disaster types donut chart
   - Severity overview bar chart

5. **Filters & Controls**
   - Filter chips for disaster types (Earthquakes, Storms, Wildfires, Volcanoes)
   - Heatmap toggle
   - My Location button

### NEW: Social Media Response System ✅ (Phase 2)
6. **Live Social Response Feed**
   - Auto-generated simulated tweets for each disaster
   - 300+ username pool for realistic variety
   - Tweet cards with: avatar, display name, @username, verified badge, timestamp, message
   - Scrollable social feed container

7. **Credibility Scoring System**
   - Weighted formula: (User Reliability × 0.4) + (Disaster Severity × 0.3) + (Tweet Similarity × 0.3)
   - User reliability scores (50-95) for known usernames
   - Severity weights: Severe=90, Moderate=65, Mild=40
   - Similarity based on tweet count: 5+=90, 3-4=70, 1-2=40
   - Color-coded badges: Green (80+), Yellow (60-79), Red (<60)

8. **Disaster-Specific Message Templates**
   - Earthquake: tremors, aftershocks, emergency alerts
   - Wildfire: smoke, evacuations, fire spread
   - Volcano: eruption warnings, ash advisories, lava flow
   - Storm: flooding, wind damage, power outages

### Data Sources
- **USGS Earthquake API**: Live, real-time earthquake data (~267 events/day)
- **Weather.gov**: Live severe weather alerts (US only)
- **NASA FIRMS**: MOCKED - Sample wildfire data for fire-prone regions
- **Volcano Data**: MOCKED - Static list of 10 known active volcanoes
- **Social Responses**: SIMULATED - Auto-generated tweets (not real social media)

---

## User Personas

1. **Emergency Responders** - Need quick overview of disaster locations and severity
2. **Disaster Monitoring Professionals** - Require detailed analytics and real-time updates
3. **General Public** - Want awareness of nearby disasters and safety information
4. **Social Media Analysts** - Verify credibility of disaster reports

---

## Prioritized Backlog

### P0 (Critical) - DONE ✅
- [x] Real-time earthquake data integration
- [x] Interactive map with markers
- [x] User location detection
- [x] Statistics dashboard

### P1 (High Priority) - DONE ✅
- [x] Disaster type filters
- [x] Heatmap visualization
- [x] Hot regions navigation
- [x] Analytics charts
- [x] Marker clustering
- [x] Social media response system
- [x] Credibility scoring

### P2 (Medium Priority) - Future
- [ ] Push notifications for nearby disasters
- [ ] Historical disaster data archive
- [ ] More data sources (tsunamis, floods)
- [ ] Real NASA FIRMS API integration
- [ ] Real social media API integration (Twitter/X)
- [ ] Weather.gov global coverage

### P3 (Nice to Have)
- [ ] User preferences storage
- [ ] Custom alert radius settings
- [ ] Social sharing features
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Sentiment analysis on tweets

---

## Known Limitations

1. **Mocked Data**: Wildfire and volcano data use static/sample data
2. **Weather Coverage**: Weather.gov only covers US territories
3. **No Authentication**: No user preferences persistence
4. **Real-time Refresh**: Data refreshes every 60 seconds
5. **Social Responses**: SIMULATED tweets, not from real social media APIs

---

## Tech Stack

- **Frontend**: React 19, Leaflet, Chart.js, TailwindCSS, Shadcn/UI
- **Backend**: FastAPI, Python 3.11, httpx
- **Database**: MongoDB (for future use)
- **Design**: Barlow Condensed + Inter fonts, dark theme

---

## Next Action Items

1. Integrate real NASA FIRMS API with API key
2. Add push notifications using Web Push API
3. Integrate real Twitter/X API for social responses
4. Implement disaster detail view with historical data
5. Add export/share functionality
6. Consider adding tsunami data from NOAA

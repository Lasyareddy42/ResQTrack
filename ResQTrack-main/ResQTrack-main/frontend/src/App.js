import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import "@/App.css";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import axios from "axios";
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle,
  useMap,
  ZoomControl
} from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "react-leaflet-markercluster/styles";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { 
  AlertTriangle, 
  Flame, 
  Activity, 
  MapPin, 
  Navigation, 
  Layers, 
  BarChart3,
  Mountain,
  Cloud,
  Target,
  MessageCircle,
  CheckCircle,
  User,
  Shield
} from "lucide-react";
import { ScrollArea } from "./components/ui/scroll-area";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Chart.js defaults for dark theme
ChartJS.defaults.color = "#A1A1AA";
ChartJS.defaults.borderColor = "#27272A";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ==================== USERNAME POOL (300+ usernames) ====================
const usernamePool = [
  "zoe_lines","liam.dev","ethan.codes","mia.travel","alex_pixels","nora_stream","sam_bytes","leo.motion",
  "ella_notes","ryan_wave","lucy.grid","jake.cloud","sophia.spark","noah.tracks","olivia.frames","ava.codes",
  "isabella.notes","logan.wave","amelia.spark","jackson.bytes","harper.stream","mason.grid","ella.pixel",
  "lucas.lines","scarlett.motion","henry.notes","chloe.spark","grace.bytes","owen.wave","lily.frames",
  "aryan_srk","rahul4srk","srkverse","kingkhan.diary","srk_updates24","srkframes","srk_moments",
  "ranbirverse","rk_diaries","ranbir.zone","rkframes","ranbirupdates",
  "ranveer.diaries","veer_updates","ranveer.live","ranveer.zone",
  "aliaframes","alia_daily","alia.vibes","alia_updates",
  "deepika.frames","deepika.lens","dp_diary","dp_updates",
  "charanframes","ramcharan.diary","charan_zone","rc_updates","charan_live",
  "ntr_diaries","tarak_updates","tarak.zone","tarak_live","ntr_world",
  "maheshframes","mahesh.daily","mahesh_zone","mb_updates","superstar_mb",
  "allu_frames","alluarjun_daily","bunny_updates","bunny.zone","aa_moments",
  "prabhas.world","prabhasframes","darling_updates","prabhas_zone","prabhas.lens",
  "yashverse","rockybhai.diary","kgf_moments","yash.daily","rocky_updates",
  "thalapathyframes","vijay_daily","vijay_updates","thalapathy.zone",
  "ajithframes","ajith_updates","ajithverse","ajith_zone",
  "aarav.dev","vihaan.codes","advik.stream","ishaan.grid","arjun.wave","dev.pixel",
  "kabir.notes","reyaan.spark","atharv.bytes","samar.lines","krish.frames",
  "anish.motion","aryav.cloud","harsh.grid","karan.wave","manav.dev","yuvraj.codes",
  "rahul.stream","vishal.pixel","siddharth.bytes","tanay.lines","aditya.frames",
  "kevin.stream","lucas.pixel","ethan.wave","daniel.codes","mason.bytes","oliver.lines",
  "jackson.frames","aiden.grid","logan.dev","james.cloud","henry.stream","samuel.wave",
  "sebastian.pixel","jack.codes","owen.bytes","wyatt.lines","levi.frames","julian.grid",
  "zoey.spark","ella.stream","scarlett.pixel","chloe.wave","penelope.codes",
  "riley.bytes","lillian.lines","natalie.frames","violet.grid","stella.dev",
  "aurora.cloud","savannah.stream","brooklyn.wave","bella.pixel","claire.codes",
  "skylar.bytes","paisley.lines","everly.frames","anna.grid","caroline.dev",
  "techwave01","cloudcoder","dataframesx","pixelrunner","devmatrix","gridlogic",
  "stackvector","bytehorizon","streamsyntax","codespiral","logicpulse",
  "matrixdrift","nodehacker","pixelcircuit","webfusion","scriptnavigator",
  "debugmotion","cloudoperator","devnavigator","syntaxarray",
  "travelwithleo","urbanframes","citypixel","mountainwave","coastlinesdaily",
  "nightframes","sunsetmotion","stormwatcher","earthtracker","globalviewer",
  "mapobserver","satelliteframes","weatherpulse","oceanmotion","naturebytes",
  "wildframe","skyobserver","cloudframes","stormframes","horizonwatch",
  "user_alpha01","user_alpha02","user_alpha03","user_alpha04","user_alpha05",
  "user_beta01","user_beta02","user_beta03","user_beta04","user_beta05",
  "user_gamma01","user_gamma02","user_gamma03","user_gamma04","user_gamma05",
  "observer101","observer102","observer103","observer104","observer105",
  "watcher201","watcher202","watcher203","watcher204","watcher205",
  "citizen_alert1","citizen_alert2","citizen_alert3","citizen_alert4","citizen_alert5",
  "ground_report1","ground_report2","ground_report3","ground_report4","ground_report5",
  "reporter_live1","reporter_live2","reporter_live3","reporter_live4","reporter_live5",
  "newswatch24","globalalert","crisisobserver","stormupdate","quakewatch",
  "floodreport","alertmonitor","weatherobserver","disastertracker","earthalert",
  "geo_viewer","map_explorer","terrainwatch","globalinsight","dataobserver",
  "riskmonitor","impactviewer","hazardtracker","responsewatch","situationalview",
  "bob74","dhruv_dk","seungcheol09","ayaan_k","sophia.w","marcus17","rahul_21","emma_w",
  "alex_reporter","maya_news","sam_onsite","chris_watch","jamie_alert","taylor_live",
  "jordan_update","casey_report","morgan_view","drew_monitor","quinn_track","blake_wire",
  "emergency_feed1","emergency_feed2","emergency_feed3","realtime_alert","instant_news",
  "breaking_now","alert_system","rapid_response","crisis_central","event_tracker",
  "seismic_watch","tremor_alert","quake_monitor","shake_report","tectonic_news",
  "volcano_watch","lava_alert","eruption_news","magma_monitor","ash_tracker",
  "storm_chaser1","storm_chaser2","hurricane_watch","cyclone_alert","tornado_tracker",
  "flood_monitor","rain_watch","deluge_alert","water_level","river_watch",
  "fire_spotter","blaze_alert","wildfire_news","smoke_watch","burn_tracker",
  "rescue_team1","rescue_team2","first_responder","ems_alert","medic_onscene",
  "local_news1","local_news2","community_alert","neighborhood_watch","district_report",
  "global_monitor","world_watch","international_alert","cross_border","regional_news",
  "satellite_eye","drone_view","aerial_watch","sky_monitor","orbit_tracker",
  "data_stream","info_flow","news_pulse","alert_wave","signal_watch",
  "civic_duty","public_safety","community_guard","citizen_watch","people_alert",
  "metro_news","urban_alert","city_watch","downtown_report","suburban_monitor",
  "coastal_watch","beach_alert","shore_monitor","ocean_news","marine_tracker",
  "mountain_watch","alpine_alert","peak_monitor","highland_news","summit_tracker",
  "desert_watch","arid_alert","dune_monitor","sand_news","oasis_tracker",
  "forest_watch","woodland_alert","tree_monitor","jungle_news","canopy_tracker",
  "arctic_watch","polar_alert","ice_monitor","frozen_news","glacier_tracker",
  "tropical_watch","equator_alert","humid_monitor","monsoon_news","rainy_tracker",
  "weather_pro1","weather_pro2","climate_watch","atmosphere_alert","sky_news",
  "tech_alert1","tech_alert2","digital_watch","cyber_monitor","network_news",
  "safety_first","secure_watch","protect_alert","guard_monitor","defense_news"
];

// ==================== USER RELIABILITY SCORES ====================
const userReliabilityScores = {
  "bob74": 60,
  "dhruv_dk": 70,
  "seungcheol09": 65,
  "ayaan_k": 55,
  "sophia.w": 80,
  "marcus17": 75,
  "rahul_21": 68,
  "emma_w": 72,
  "newswatch24": 85,
  "globalalert": 88,
  "crisisobserver": 82,
  "emergency_feed1": 90,
  "emergency_feed2": 90,
  "first_responder": 95,
  "rescue_team1": 92,
  "local_news1": 78,
  "weather_pro1": 85,
  "seismic_watch": 88,
  "volcano_watch": 86,
  "storm_chaser1": 80,
  "fire_spotter": 82
};

// ==================== DISASTER MESSAGE TEMPLATES ====================
const disasterMessages = {
  earthquake: [
    "Strong tremor felt here. Buildings shaking.",
    "Emergency alerts triggered after the earthquake.",
    "Significant shaking reported in the area.",
    "Ground movement detected, people evacuating.",
    "Seismic activity confirmed, stay alert.",
    "Multiple aftershocks expected. Seeking shelter.",
    "Infrastructure damage reported in some areas.",
    "Earthquake just hit, everyone check on neighbors.",
    "Felt the ground shake for several seconds.",
    "Emergency services responding to earthquake damage.",
    "Buildings swaying, everyone stay calm and safe.",
    "Power outages reported after the tremor.",
    "Checking on family after that intense shake.",
    "Roads cracked in several locations.",
    "Tsunami warning issued for coastal areas."
  ],
  wildfire: [
    "Smoke visible on the horizon.",
    "Fire spreading rapidly, evacuations underway.",
    "Air quality deteriorating due to wildfire smoke.",
    "Flames approaching residential areas.",
    "Firefighters battling the blaze.",
    "Mandatory evacuation orders issued.",
    "Roads closed due to fire danger.",
    "Ash falling from the sky, stay indoors.",
    "Wildlife fleeing the fire zone.",
    "Fire crews requesting additional support.",
    "Visibility near zero due to smoke.",
    "Emergency shelters opening for evacuees.",
    "Wind spreading the fire quickly.",
    "Helicopters dropping water on the flames.",
    "Community rallying to support displaced residents."
  ],
  volcano: [
    "Volcanic activity increasing, ash cloud forming.",
    "Eruption warning issued for nearby areas.",
    "Lava flow detected on the mountain.",
    "Seismic activity near the volcano.",
    "Ash fall advisory in effect.",
    "Monitoring stations reporting increased tremors.",
    "Gas emissions rising from the crater.",
    "Evacuation zones expanded around volcano.",
    "Pyroclastic flow danger, stay away.",
    "Volcanic lightning observed in ash cloud.",
    "Ground deformation detected near summit.",
    "Aviation advisory issued due to ash.",
    "Hot springs temperature rising rapidly.",
    "Sulfur smell intensifying in the region.",
    "Historical eruption pattern suggests more activity."
  ],
  storm: [
    "Heavy rain causing flash flooding.",
    "Wind speeds increasing rapidly.",
    "Storm surge warning for coastal areas.",
    "Seek shelter immediately, tornado warning.",
    "Power lines down across the region.",
    "Emergency services stretched thin.",
    "Roads impassable due to flooding.",
    "Lightning strikes causing fires.",
    "Hail damaging vehicles and buildings.",
    "Storm intensity exceeding predictions.",
    "Communication towers affected by weather.",
    "Public transport suspended until storm passes.",
    "Trees falling, stay away from windows.",
    "Storm expected to last several hours.",
    "Basement flooding reported in low areas."
  ],
  weather: [
    "Severe weather alert in effect.",
    "Conditions deteriorating rapidly.",
    "Stay indoors until further notice.",
    "Emergency broadcasts on all channels.",
    "Weather pattern causing widespread concern.",
    "Temperature dropping significantly.",
    "Visibility reduced to near zero.",
    "Ice forming on roads and bridges.",
    "Heavy precipitation expected to continue.",
    "Weather front moving through the area."
  ]
};

// ==================== DISPLAY NAME GENERATOR ====================
const generateDisplayName = (username) => {
  const parts = username.replace(/[._]/g, ' ').split(/(?=[A-Z])|[0-9]+/).filter(Boolean);
  return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ').trim() || username;
};

// ==================== CREDIBILITY CALCULATION ====================
const calculateCredibilityScore = (username, severity, tweetCount) => {
  // User Reliability (0.4 weight)
  const userReliability = userReliabilityScores[username] || 50;
  
  // Disaster Severity Weight (0.3 weight)
  const severityWeights = {
    severe: 90,
    moderate: 65,
    mild: 40
  };
  const severityWeight = severityWeights[severity] || 50;
  
  // Tweet Similarity Score (0.3 weight) - based on tweet count
  let similarityScore;
  if (tweetCount >= 5) {
    similarityScore = 90;
  } else if (tweetCount >= 3) {
    similarityScore = 70;
  } else {
    similarityScore = 40;
  }
  
  // Calculate final score
  const credibility = (userReliability * 0.4) + (severityWeight * 0.3) + (similarityScore * 0.3);
  
  return Math.min(100, Math.max(0, Math.round(credibility)));
};

// ==================== GENERATE SOCIAL RESPONSES ====================
const generateSocialResponses = (disaster) => {
  const type = disaster.type || "earthquake";
  const severity = disaster.severity || "mild";
  const messages = disasterMessages[type] || disasterMessages.earthquake;
  
  // Generate 3-5 tweets
  const tweetCount = Math.floor(Math.random() * 3) + 3; // 3-5 tweets
  const usedUsernames = new Set();
  const responses = [];
  
  // Shuffle and select unique usernames
  const shuffledPool = [...usernamePool].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < tweetCount && i < shuffledPool.length; i++) {
    const username = shuffledPool[i];
    if (usedUsernames.has(username)) continue;
    usedUsernames.add(username);
    
    const message = messages[Math.floor(Math.random() * messages.length)];
    const isVerified = userReliabilityScores[username] >= 75 || Math.random() > 0.7;
    const minutesAgo = Math.floor(Math.random() * 30) + 1;
    
    responses.push({
      username,
      displayName: generateDisplayName(username),
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      verified: isVerified,
      timestamp: `${minutesAgo} min ago`,
      message,
      credibilityScore: calculateCredibilityScore(username, severity, tweetCount)
    });
  }
  
  // Sort by credibility (highest first)
  return responses.sort((a, b) => b.credibilityScore - a.credibilityScore);
};

// ==================== CREDIBILITY COLOR ====================
const getCredibilityColor = (score) => {
  if (score >= 80) return { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" };
  if (score >= 60) return { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" };
  return { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" };
};

// Hot regions data
const HOT_REGIONS = [
  { name: "Japan", lat: 36.2048, lon: 138.2529 },
  { name: "Indonesia", lat: -0.7893, lon: 113.9213 },
  { name: "Himalayas", lat: 27.9881, lon: 86.9250 },
  { name: "Mediterranean", lat: 35.9375, lon: 14.3754 },
  { name: "West Coast USA", lat: 37.7749, lon: -122.4194 },
];

// Create custom marker icons
const createMarkerIcon = (severity) => {
  const colors = {
    severe: "#EF4444",
    moderate: "#F97316",
    mild: "#EAB308"
  };
  
  const sizes = {
    severe: 20,
    moderate: 16,
    mild: 12
  };
  
  const color = colors[severity] || colors.mild;
  const size = sizes[severity] || sizes.mild;
  
  return L.divIcon({
    className: `disaster-marker ${severity}`,
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.3);
      box-shadow: 0 0 ${size}px ${color}80;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// User location marker
const userLocationIcon = L.divIcon({
  className: "user-marker",
  html: `<div class="user-marker"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Get disaster icon component
const getDisasterIcon = (type) => {
  switch (type) {
    case "earthquake":
      return <Activity className="w-4 h-4" />;
    case "wildfire":
      return <Flame className="w-4 h-4" />;
    case "volcano":
      return <Mountain className="w-4 h-4" />;
    case "storm":
    case "weather":
      return <Cloud className="w-4 h-4" />;
    default:
      return <AlertTriangle className="w-4 h-4" />;
  }
};

// Calculate distance between two points (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Map controller component
const MapController = ({ flyToLocation }) => {
  const map = useMap();
  
  useEffect(() => {
    if (flyToLocation) {
      map.flyTo([flyToLocation.lat, flyToLocation.lon], 8, {
        duration: 1.5
      });
    }
  }, [flyToLocation, map]);
  
  return null;
};

// ==================== SOCIAL FEED COMPONENT ====================
const SocialFeed = ({ disaster }) => {
  const socialResponses = useMemo(() => {
    if (disaster.socialResponses && disaster.socialResponses.length > 0) {
      return disaster.socialResponses;
    }
    return generateSocialResponses(disaster);
  }, [disaster]);

  return (
    <div className="social-feed" data-testid="social-feed">
      <h3 className="section-title mb-3">
        <MessageCircle className="text-blue-400" />
        Live Social Response
      </h3>
      <div className="social-feed-container">
        {socialResponses.map((response, index) => {
          const credColor = getCredibilityColor(response.credibilityScore);
          return (
            <div 
              key={`${response.username}-${index}`} 
              className="tweet-card"
              data-testid={`tweet-card-${index}`}
            >
              <div className="tweet-header">
                <img 
                  src={response.profileImage} 
                  alt={response.displayName}
                  className="tweet-avatar"
                />
                <div className="tweet-user-info">
                  <div className="tweet-name-row">
                    <span className="tweet-display-name">{response.displayName}</span>
                    {response.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-400 verified-badge" />
                    )}
                  </div>
                  <span className="tweet-username">@{response.username} • {response.timestamp}</span>
                </div>
              </div>
              <p className="tweet-message">{response.message}</p>
              <div className={`credibility-badge ${credColor.bg} ${credColor.border}`}>
                <Shield className={`w-3 h-3 ${credColor.text}`} />
                <span className={`credibility-score ${credColor.text}`}>
                  Credibility: {response.credibilityScore}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==================== MAIN DASHBOARD COMPONENT ====================
function App() {
  const [disasters, setDisasters] = useState([]);
  const [statistics, setStatistics] = useState({ severe: 0, moderate: 0, mild: 0 });
  const [byType, setByType] = useState({});
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [nearbyDisasters, setNearbyDisasters] = useState([]);
  const [nearestDistance, setNearestDistance] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [filters, setFilters] = useState({
    earthquake: true,
    wildfire: true,
    volcano: true,
    storm: true,
    weather: true
  });
  const [flyToLocation, setFlyToLocation] = useState(null);
  const mapRef = useRef(null);

  // Fetch disaster data
  const fetchDisasters = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/all-disasters`);
      const data = response.data;
      
      setDisasters(data.disasters || []);
      setStatistics(data.statistics || { severe: 0, moderate: 0, mild: 0 });
      setByType(data.by_type || {});
      
      if (userLocation) {
        updateNearbyDisasters(data.disasters || [], userLocation);
      }
    } catch (error) {
      console.error("Error fetching disasters:", error);
    } finally {
      setLoading(false);
    }
  }, [userLocation]);

  const updateNearbyDisasters = (disasterList, location) => {
    const nearby = disasterList
      .map(d => ({
        ...d,
        distance: calculateDistance(location.lat, location.lon, d.latitude, d.longitude)
      }))
      .filter(d => d.distance <= 500)
      .sort((a, b) => a.distance - b.distance);
    
    setNearbyDisasters(nearby);
    
    if (nearby.length > 0) {
      setNearestDistance(nearby[0].distance);
    } else if (disasterList.length > 0) {
      const allWithDistance = disasterList
        .map(d => ({
          ...d,
          distance: calculateDistance(location.lat, location.lon, d.latitude, d.longitude)
        }))
        .sort((a, b) => a.distance - b.distance);
      setNearestDistance(allWithDistance[0].distance);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        () => {
          setUserLocation({ lat: 37.7749, lon: -122.4194 });
        }
      );
    }
  }, []);

  useEffect(() => {
    fetchDisasters();
    const interval = setInterval(fetchDisasters, 60000);
    return () => clearInterval(interval);
  }, [fetchDisasters]);

  useEffect(() => {
    if (userLocation && disasters.length > 0) {
      updateNearbyDisasters(disasters, userLocation);
    }
  }, [userLocation, disasters]);

  const handleDisasterClick = (disaster) => {
    setSelectedDisaster(disaster);
  };

  const handleHotRegionClick = (region) => {
    setFlyToLocation(region);
  };

  const toggleFilter = (type) => {
    setFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const filteredDisasters = disasters.filter(d => {
    if (d.type === "storm" || d.type === "weather") {
      return filters.storm || filters.weather;
    }
    return filters[d.type];
  });

  const magnitudeChartData = {
    labels: ["0-2", "2-4", "4-6", "6-8", "8+"],
    datasets: [{
      label: "Magnitude Distribution",
      data: [
        disasters.filter(d => d.severity_value < 2).length,
        disasters.filter(d => d.severity_value >= 2 && d.severity_value < 4).length,
        disasters.filter(d => d.severity_value >= 4 && d.severity_value < 6).length,
        disasters.filter(d => d.severity_value >= 6 && d.severity_value < 8).length,
        disasters.filter(d => d.severity_value >= 8).length,
      ],
      backgroundColor: ["#EAB308", "#EAB308", "#F97316", "#EF4444", "#EF4444"],
      borderRadius: 4,
    }]
  };

  const typeChartData = {
    labels: ["Earthquakes", "Storms", "Wildfires", "Volcanoes"],
    datasets: [{
      data: [
        byType.earthquake || 0,
        byType.storm || 0,
        byType.wildfire || 0,
        byType.volcano || 0
      ],
      backgroundColor: ["#EF4444", "#3B82F6", "#F97316", "#EAB308"],
      borderWidth: 0,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#27272A" } }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    cutout: "60%",
  };

  return (
    <div className="app-container" data-testid="app-container">
      {/* Sidebar */}
      <aside className="sidebar" data-testid="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title" data-testid="app-title">
            <span className="text-red-500">ResQ</span>Track
          </h1>
          <p className="sidebar-subtitle">Real-Time Disaster Monitoring</p>
        </div>
        
        <ScrollArea className="sidebar-content">
          {/* User Location Section */}
          <div className="sidebar-section">
            <h2 className="section-title">
              <Navigation className="text-blue-500" />
              Your Location
            </h2>
            <div className="info-card" data-testid="user-location-card">
              {userLocation ? (
                <>
                  <div className="info-row">
                    <span className="info-label">Latitude</span>
                    <span className="info-value">{userLocation.lat.toFixed(4)}°</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Longitude</span>
                    <span className="info-value">{userLocation.lon.toFixed(4)}°</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Nearest Disaster</span>
                    <span className="info-value text-severe">
                      {nearestDistance ? `${nearestDistance.toFixed(0)} km` : "N/A"}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-zinc-500 text-sm">Detecting location...</p>
              )}
            </div>
          </div>

          <Separator className="my-4 bg-zinc-800" />

          {/* Disaster Details Section */}
          <div className="sidebar-section">
            <h2 className="section-title">
              <AlertTriangle className="text-red-500" />
              Disaster Details
            </h2>
            {selectedDisaster ? (
              <div className="disaster-detail-section" data-testid="disaster-detail-card">
                <div className="info-card">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge 
                      variant="outline" 
                      className={`disaster-type-badge ${
                        selectedDisaster.type === "earthquake" ? "border-red-500 text-red-500" :
                        selectedDisaster.type === "wildfire" ? "border-orange-500 text-orange-500" :
                        selectedDisaster.type === "volcano" ? "border-yellow-500 text-yellow-500" :
                        "border-blue-500 text-blue-500"
                      }`}
                    >
                      {getDisasterIcon(selectedDisaster.type)}
                      {selectedDisaster.type}
                    </Badge>
                  </div>
                  
                  <h3 className="text-sm font-semibold text-white mb-3 leading-tight">
                    {selectedDisaster.name}
                  </h3>
                  
                  <div className="info-row">
                    <span className="info-label">Location</span>
                    <span className="info-value text-xs">{selectedDisaster.location_name || "Unknown"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Time</span>
                    <span className="info-value text-xs">
                      {new Date(selectedDisaster.time).toLocaleString()}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Severity</span>
                    <span className={`info-value ${
                      selectedDisaster.severity === "severe" ? "text-red-400" :
                      selectedDisaster.severity === "moderate" ? "text-orange-400" : "text-yellow-400"
                    }`}>
                      {selectedDisaster.severity_value.toFixed(1)} ({selectedDisaster.severity})
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Source</span>
                    <span className="info-value">{selectedDisaster.source}</span>
                  </div>
                  
                  <div className={`severity-indicator ${
                    selectedDisaster.severity === "severe" ? "bg-red-500/10 border-red-500/30" :
                    selectedDisaster.severity === "moderate" ? "bg-orange-500/10 border-orange-500/30" :
                    "bg-yellow-500/10 border-yellow-500/30"
                  }`}>
                    <div className="severity-dot" style={{ 
                      backgroundColor: selectedDisaster.severity === "severe" ? "#EF4444" : 
                        selectedDisaster.severity === "moderate" ? "#F97316" : "#EAB308" 
                    }}></div>
                    <span className={`text-xs font-semibold uppercase ${
                      selectedDisaster.severity === "severe" ? "text-red-400" :
                      selectedDisaster.severity === "moderate" ? "text-orange-400" : "text-yellow-400"
                    }`}>
                      {selectedDisaster.severity} Alert
                    </span>
                  </div>
                </div>
                
                {/* Social Feed for Selected Disaster */}
                <SocialFeed disaster={selectedDisaster} />
              </div>
            ) : (
              <div className="info-card">
                <p className="text-zinc-500 text-sm text-center py-4">
                  Click a marker on the map to view details
                </p>
              </div>
            )}
          </div>

          <Separator className="my-4 bg-zinc-800" />

          {/* Hot Regions Section */}
          <div className="sidebar-section">
            <h2 className="section-title">
              <Target className="text-orange-500" />
              Hot Regions
            </h2>
            {HOT_REGIONS.map((region, index) => (
              <div 
                key={index}
                className="hot-region-item"
                onClick={() => handleHotRegionClick(region)}
                data-testid={`hot-region-${region.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="hot-region-dot"></div>
                <span className="hot-region-name">{region.name}</span>
                <MapPin className="w-4 h-4 text-zinc-500" />
              </div>
            ))}
          </div>

          <Separator className="my-4 bg-zinc-800" />

          {/* Statistics Section */}
          <div className="sidebar-section">
            <h2 className="section-title">
              <BarChart3 className="text-blue-500" />
              Statistics
            </h2>
            <div className="stats-grid" data-testid="statistics-grid">
              <div className="stat-card" data-testid="stat-total">
                <div className="stat-value text-white">{disasters.length}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-card stat-card-severe" data-testid="stat-severe">
                <div className="stat-value text-severe">{statistics.severe}</div>
                <div className="stat-label">Severe</div>
              </div>
              <div className="stat-card stat-card-moderate" data-testid="stat-moderate">
                <div className="stat-value text-moderate">{statistics.moderate}</div>
                <div className="stat-label">Moderate</div>
              </div>
              <div className="stat-card stat-card-mild" data-testid="stat-mild">
                <div className="stat-value text-mild">{statistics.mild}</div>
                <div className="stat-label">Mild</div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Map Container */}
      <main className="map-container" data-testid="map-container">
        {loading && (
          <div className="loading-overlay" data-testid="loading-overlay">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading disaster data...</p>
          </div>
        )}

        {/* Filter Chips */}
        <div className="filter-chips" data-testid="filter-chips">
          <button 
            className={`filter-chip ${filters.earthquake ? 'active' : ''}`}
            onClick={() => toggleFilter('earthquake')}
            data-testid="filter-earthquake"
          >
            <Activity className="filter-chip-icon text-red-500" />
            Earthquakes
          </button>
          <button 
            className={`filter-chip ${filters.storm || filters.weather ? 'active' : ''}`}
            onClick={() => { toggleFilter('storm'); toggleFilter('weather'); }}
            data-testid="filter-storm"
          >
            <Cloud className="filter-chip-icon text-blue-500" />
            Storms
          </button>
          <button 
            className={`filter-chip ${filters.wildfire ? 'active' : ''}`}
            onClick={() => toggleFilter('wildfire')}
            data-testid="filter-wildfire"
          >
            <Flame className="filter-chip-icon text-orange-500" />
            Wildfires
          </button>
          <button 
            className={`filter-chip ${filters.volcano ? 'active' : ''}`}
            onClick={() => toggleFilter('volcano')}
            data-testid="filter-volcano"
          >
            <Mountain className="filter-chip-icon text-yellow-500" />
            Volcanoes
          </button>
        </div>

        {/* Nearby Disasters Badge */}
        {nearbyDisasters.length > 0 && (
          <div className="nearby-badge" data-testid="nearby-disasters-badge">
            <AlertTriangle className="w-4 h-4" />
            {nearbyDisasters.length} Disaster{nearbyDisasters.length > 1 ? 's' : ''} within 500km
          </div>
        )}

        {/* Map Controls */}
        <div className="map-controls" data-testid="map-controls">
          <button 
            className={`map-control-btn ${showHeatmap ? 'active' : ''}`}
            onClick={() => setShowHeatmap(!showHeatmap)}
            data-testid="heatmap-toggle"
          >
            <Layers className="w-4 h-4" />
            {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
          </button>
          {userLocation && (
            <button 
              className="map-control-btn"
              onClick={() => setFlyToLocation(userLocation)}
              data-testid="center-location-btn"
            >
              <Navigation className="w-4 h-4" />
              My Location
            </button>
          )}
        </div>

        {/* Leaflet Map */}
        <MapContainer
          center={userLocation ? [userLocation.lat, userLocation.lon] : [20, 0]}
          zoom={3}
          className="map-wrapper"
          zoomControl={false}
          ref={mapRef}
        >
          <ZoomControl position="bottomright" />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          <MapController flyToLocation={flyToLocation} />

          {/* User Location Marker */}
          {userLocation && (
            <>
              <Marker 
                position={[userLocation.lat, userLocation.lon]} 
                icon={userLocationIcon}
              >
                <Popup>
                  <div className="text-center">
                    <strong className="text-blue-400">Your Location</strong>
                    <br />
                    <span className="font-mono text-xs">
                      {userLocation.lat.toFixed(4)}°, {userLocation.lon.toFixed(4)}°
                    </span>
                  </div>
                </Popup>
              </Marker>
              
              <Circle
                center={[userLocation.lat, userLocation.lon]}
                radius={500000}
                pathOptions={{
                  color: "#3B82F6",
                  fillColor: "#3B82F6",
                  fillOpacity: 0.05,
                  weight: 1,
                  dashArray: "5, 5"
                }}
              />
            </>
          )}

          {/* Disaster Markers with Clustering */}
          <MarkerClusterGroup
            chunkedLoading
            showCoverageOnHover={false}
            spiderfyOnMaxZoom={true}
            maxClusterRadius={50}
          >
            {filteredDisasters.map((disaster) => (
              <Marker
                key={disaster.id}
                position={[disaster.latitude, disaster.longitude]}
                icon={createMarkerIcon(disaster.severity)}
                eventHandlers={{
                  click: () => handleDisasterClick(disaster),
                }}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      {getDisasterIcon(disaster.type)}
                      <span className="font-semibold text-xs uppercase">{disaster.type}</span>
                    </div>
                    <h4 className="font-medium text-sm mb-2 leading-tight">{disaster.name}</h4>
                    <div className="text-xs space-y-1 text-zinc-400">
                      <div>Severity: <span className={
                        disaster.severity === "severe" ? "text-red-400" :
                        disaster.severity === "moderate" ? "text-orange-400" : "text-yellow-400"
                      }>{disaster.severity_value.toFixed(1)}</span></div>
                      <div>Time: {new Date(disaster.time).toLocaleString()}</div>
                      <div>Source: {disaster.source}</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>

          {/* Heatmap visualization using circles */}
          {showHeatmap && filteredDisasters.map((disaster) => (
            <Circle
              key={`heat-${disaster.id}`}
              center={[disaster.latitude, disaster.longitude]}
              radius={disaster.severity_value * 50000}
              pathOptions={{
                color: disaster.severity === "severe" ? "#EF4444" :
                       disaster.severity === "moderate" ? "#F97316" : "#EAB308",
                fillColor: disaster.severity === "severe" ? "#EF4444" :
                           disaster.severity === "moderate" ? "#F97316" : "#EAB308",
                fillOpacity: 0.2,
                weight: 0,
              }}
            />
          ))}
        </MapContainer>

        {/* Analytics Panel */}
        <div className="analytics-panel" data-testid="analytics-panel">
          <div className="chart-container" data-testid="magnitude-chart">
            <h4 className="chart-title">Magnitude Distribution</h4>
            <Bar data={magnitudeChartData} options={chartOptions} />
          </div>
          <div className="chart-container" data-testid="type-chart">
            <h4 className="chart-title">Disaster Types</h4>
            <Doughnut data={typeChartData} options={doughnutOptions} />
          </div>
          <div className="chart-container" data-testid="severity-chart">
            <h4 className="chart-title">Severity Overview</h4>
            <Bar 
              data={{
                labels: ["Severe", "Moderate", "Mild"],
                datasets: [{
                  data: [statistics.severe, statistics.moderate, statistics.mild],
                  backgroundColor: ["#EF4444", "#F97316", "#EAB308"],
                  borderRadius: 4,
                }]
              }} 
              options={chartOptions} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

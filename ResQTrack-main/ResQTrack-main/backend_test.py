#!/usr/bin/env python3
"""
ResQTrack Backend API Testing Suite
Tests all disaster monitoring endpoints for functionality and data integrity
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, List, Any

class ResQTrackAPITester:
    def __init__(self, base_url="https://resqtrack-live.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test_name": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        
        if response_data and isinstance(response_data, dict):
            result["data_summary"] = {
                "count": response_data.get("count", 0) or len(response_data.get("disasters", [])),
                "has_disasters": bool(response_data.get("disasters")),
                "has_statistics": bool(response_data.get("statistics"))
            }
        
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    {details}")
        if response_data and isinstance(response_data, dict):
            count = response_data.get("count", 0) or len(response_data.get("disasters", []))
            print(f"    Data: {count} items returned")

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_base}/", timeout=10)
            success = response.status_code == 200
            data = response.json() if success else {}
            
            details = f"Status: {response.status_code}"
            if success and "ResQTrack" in data.get("message", ""):
                details += " - API message correct"
            
            self.log_test("API Root Endpoint", success, details, data)
            return success
        except Exception as e:
            self.log_test("API Root Endpoint", False, f"Error: {str(e)}")
            return False

    def test_earthquakes_endpoint(self):
        """Test earthquakes data endpoint"""
        try:
            response = requests.get(f"{self.api_base}/earthquakes", timeout=30)
            success = response.status_code == 200
            data = response.json() if success else {}
            
            details = f"Status: {response.status_code}"
            if success:
                disasters = data.get("disasters", [])
                if disasters:
                    # Check data structure
                    sample = disasters[0]
                    required_fields = ["id", "name", "type", "latitude", "longitude", "severity", "source"]
                    has_required = all(field in sample for field in required_fields)
                    details += f" - {len(disasters)} earthquakes, structure valid: {has_required}"
                    
                    # Check if data is from USGS
                    usgs_count = len([d for d in disasters if d.get("source") == "USGS"])
                    details += f", USGS source: {usgs_count}/{len(disasters)}"
                else:
                    details += " - No earthquake data returned"
            
            self.log_test("Earthquakes Endpoint", success, details, data)
            return success, data
        except Exception as e:
            self.log_test("Earthquakes Endpoint", False, f"Error: {str(e)}")
            return False, {}

    def test_weather_alerts_endpoint(self):
        """Test weather alerts endpoint"""
        try:
            response = requests.get(f"{self.api_base}/weather-alerts", timeout=30)
            success = response.status_code == 200
            data = response.json() if success else {}
            
            details = f"Status: {response.status_code}"
            if success:
                disasters = data.get("disasters", [])
                details += f" - {len(disasters)} weather alerts"
                if disasters:
                    weather_gov_count = len([d for d in disasters if d.get("source") == "Weather.gov"])
                    details += f", Weather.gov source: {weather_gov_count}/{len(disasters)}"
            
            self.log_test("Weather Alerts Endpoint", success, details, data)
            return success, data
        except Exception as e:
            self.log_test("Weather Alerts Endpoint", False, f"Error: {str(e)}")
            return False, {}

    def test_wildfires_endpoint(self):
        """Test wildfires endpoint (partially mocked)"""
        try:
            response = requests.get(f"{self.api_base}/wildfires", timeout=30)
            success = response.status_code == 200
            data = response.json() if success else {}
            
            details = f"Status: {response.status_code}"
            if success:
                disasters = data.get("disasters", [])
                details += f" - {len(disasters)} wildfires"
                if disasters:
                    nasa_count = len([d for d in disasters if d.get("source") == "NASA FIRMS"])
                    details += f", NASA FIRMS source: {nasa_count}/{len(disasters)} (partially mocked)"
                    
                    # Check for fire-prone regions
                    regions = [d.get("location_name", "") for d in disasters]
                    known_regions = ["Los Angeles", "Sacramento", "Phoenix", "Australia"]
                    has_known = any(region in str(regions) for region in known_regions)
                    details += f", Known fire regions: {has_known}"
            
            self.log_test("Wildfires Endpoint", success, details, data)
            return success, data
        except Exception as e:
            self.log_test("Wildfires Endpoint", False, f"Error: {str(e)}")
            return False, {}

    def test_volcanoes_endpoint(self):
        """Test volcanoes endpoint (static data)"""
        try:
            response = requests.get(f"{self.api_base}/volcanoes", timeout=30)
            success = response.status_code == 200
            data = response.json() if success else {}
            
            details = f"Status: {response.status_code}"
            if success:
                disasters = data.get("disasters", [])
                details += f" - {len(disasters)} volcanoes"
                if disasters:
                    # Check for known volcanoes
                    volcano_names = [d.get("location_name", "") for d in disasters]
                    known_volcanoes = ["Kilauea", "Etna", "Merapi", "Sakurajima"]
                    has_known = any(volcano in str(volcano_names) for volcano in known_volcanoes)
                    details += f", Known volcanoes: {has_known}"
            
            self.log_test("Volcanoes Endpoint", success, details, data)
            return success, data
        except Exception as e:
            self.log_test("Volcanoes Endpoint", False, f"Error: {str(e)}")
            return False, {}

    def test_all_disasters_endpoint(self):
        """Test aggregated disasters endpoint"""
        try:
            response = requests.get(f"{self.api_base}/all-disasters", timeout=45)
            success = response.status_code == 200
            data = response.json() if success else {}
            
            details = f"Status: {response.status_code}"
            if success:
                disasters = data.get("disasters", [])
                statistics = data.get("statistics", {})
                by_type = data.get("by_type", {})
                
                details += f" - {len(disasters)} total disasters"
                
                # Check statistics
                if statistics:
                    severe = statistics.get("severe", 0)
                    moderate = statistics.get("moderate", 0)
                    mild = statistics.get("mild", 0)
                    details += f", Stats: {severe}S/{moderate}M/{mild}Mi"
                
                # Check by type breakdown
                if by_type:
                    eq = by_type.get("earthquake", 0)
                    storm = by_type.get("storm", 0)
                    fire = by_type.get("wildfire", 0)
                    volc = by_type.get("volcano", 0)
                    details += f", Types: {eq}EQ/{storm}ST/{fire}WF/{volc}VO"
                
                # Validate data structure
                if disasters:
                    sample = disasters[0]
                    required_fields = ["id", "name", "type", "latitude", "longitude", "severity", "source"]
                    structure_valid = all(field in sample for field in required_fields)
                    details += f", Structure: {structure_valid}"
            
            self.log_test("All Disasters Endpoint", success, details, data)
            return success, data
        except Exception as e:
            self.log_test("All Disasters Endpoint", False, f"Error: {str(e)}")
            return False, {}

    def test_data_consistency(self, individual_data: Dict):
        """Test data consistency between individual endpoints and aggregated endpoint"""
        try:
            # Get aggregated data
            _, all_data = self.test_all_disasters_endpoint()
            
            if not all_data.get("disasters"):
                self.log_test("Data Consistency", False, "No aggregated data to compare")
                return False
            
            all_disasters = all_data["disasters"]
            
            # Count by type in aggregated data
            eq_count = len([d for d in all_disasters if d["type"] == "earthquake"])
            fire_count = len([d for d in all_disasters if d["type"] == "wildfire"])
            volc_count = len([d for d in all_disasters if d["type"] == "volcano"])
            weather_count = len([d for d in all_disasters if d["type"] in ["storm", "weather"]])
            
            # Compare with individual endpoints
            individual_eq = len(individual_data.get("earthquakes", {}).get("disasters", []))
            individual_fire = len(individual_data.get("wildfires", {}).get("disasters", []))
            individual_volc = len(individual_data.get("volcanoes", {}).get("disasters", []))
            individual_weather = len(individual_data.get("weather", {}).get("disasters", []))
            
            consistency_issues = []
            if eq_count != individual_eq:
                consistency_issues.append(f"Earthquakes: {eq_count} vs {individual_eq}")
            if fire_count != individual_fire:
                consistency_issues.append(f"Wildfires: {fire_count} vs {individual_fire}")
            if volc_count != individual_volc:
                consistency_issues.append(f"Volcanoes: {volc_count} vs {individual_volc}")
            
            success = len(consistency_issues) == 0
            details = "Data counts match" if success else f"Mismatches: {', '.join(consistency_issues)}"
            
            self.log_test("Data Consistency", success, details)
            return success
        except Exception as e:
            self.log_test("Data Consistency", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run complete test suite"""
        print("🔍 Starting ResQTrack Backend API Tests...")
        print("=" * 60)
        
        # Test individual endpoints
        individual_data = {}
        
        # API Root
        self.test_api_root()
        
        # Individual disaster endpoints
        success, data = self.test_earthquakes_endpoint()
        individual_data["earthquakes"] = data
        
        success, data = self.test_weather_alerts_endpoint()
        individual_data["weather"] = data
        
        success, data = self.test_wildfires_endpoint()
        individual_data["wildfires"] = data
        
        success, data = self.test_volcanoes_endpoint()
        individual_data["volcanoes"] = data
        
        # Aggregated endpoint
        self.test_all_disasters_endpoint()
        
        # Data consistency check
        self.test_data_consistency(individual_data)
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed! Backend APIs are working correctly.")
            return 0
        else:
            failed_tests = [r for r in self.test_results if not r["success"]]
            print(f"❌ {len(failed_tests)} tests failed:")
            for test in failed_tests:
                print(f"   - {test['test_name']}: {test['details']}")
            return 1

def main():
    """Main test execution"""
    tester = ResQTrackAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())
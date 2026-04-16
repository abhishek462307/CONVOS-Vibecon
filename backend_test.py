#!/usr/bin/env python3
"""
Backend API Testing for Convos Agentic Commerce Platform
Tests all backend endpoints systematically
"""

import requests
import json
import time
import sys
from datetime import datetime

# Configuration
BASE_URL = "https://supervisor-hub-9.preview.emergentagent.com/api"
SESSION_ID = "test-backend-001"
TIMEOUT = 45  # Extended timeout for AI endpoints

def log_test(test_name, status, details=""):
    """Log test results with timestamp"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    status_symbol = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
    print(f"[{timestamp}] {status_symbol} {test_name}")
    if details:
        print(f"    {details}")
    print()

def test_health_check():
    """Test GET /api/health"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'ok' and 'Convos' in data.get('platform', ''):
                log_test("Health Check", "PASS", f"Response: {data}")
                return True
            else:
                log_test("Health Check", "FAIL", f"Unexpected response: {data}")
                return False
        else:
            log_test("Health Check", "FAIL", f"Status: {response.status_code}, Body: {response.text}")
            return False
            
    except Exception as e:
        log_test("Health Check", "FAIL", f"Exception: {str(e)}")
        return False

def test_seed_products():
    """Test POST /api/products/seed"""
    try:
        response = requests.post(f"{BASE_URL}/products/seed", timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            if 'seeded' in data.get('message', '').lower() or 'already' in data.get('message', '').lower():
                log_test("Seed Products", "PASS", f"Response: {data}")
                return True
            else:
                log_test("Seed Products", "FAIL", f"Unexpected response: {data}")
                return False
        else:
            log_test("Seed Products", "FAIL", f"Status: {response.status_code}, Body: {response.text}")
            return False
            
    except Exception as e:
        log_test("Seed Products", "FAIL", f"Exception: {str(e)}")
        return False

def test_get_products():
    """Test GET /api/products"""
    try:
        response = requests.get(f"{BASE_URL}/products", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                # Check product structure
                product = data[0]
                required_fields = ['id', 'name', 'price', 'category', 'image', 'bargain_enabled', 'bargain_min_price', 'stock']
                missing_fields = [field for field in required_fields if field not in product]
                
                if not missing_fields:
                    log_test("Get Products", "PASS", f"Found {len(data)} products with correct structure")
                    return True, data
                else:
                    log_test("Get Products", "FAIL", f"Missing fields: {missing_fields}")
                    return False, []
            else:
                log_test("Get Products", "FAIL", f"Expected array of products, got: {type(data)}")
                return False, []
        else:
            log_test("Get Products", "FAIL", f"Status: {response.status_code}, Body: {response.text}")
            return False, []
            
    except Exception as e:
        log_test("Get Products", "FAIL", f"Exception: {str(e)}")
        return False, []

def test_ai_chat_search():
    """Test POST /api/ai/chat - Product search"""
    try:
        payload = {
            "session_id": SESSION_ID,
            "message": "Find me a gift under $50"
        }
        
        print(f"    Sending AI chat request (may take 30+ seconds)...")
        response = requests.post(f"{BASE_URL}/ai/chat", 
                               json=payload, 
                               timeout=TIMEOUT,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            data = response.json()
            
            # Check response structure
            if 'response' in data and 'session_id' in data:
                response_data = data['response']
                
                # Check if AI found products
                if 'text' in response_data and response_data['text']:
                    # Check if products were found
                    products_found = response_data.get('products', [])
                    mission_created = response_data.get('mission_created')
                    
                    details = f"AI Response: {response_data['text'][:100]}..."
                    if products_found:
                        details += f" | Found {len(products_found)} products"
                    if mission_created:
                        details += f" | Mission created: {mission_created.get('goal', 'N/A')}"
                    
                    log_test("AI Chat - Search", "PASS", details)
                    return True, data
                else:
                    log_test("AI Chat - Search", "FAIL", f"No text response from AI: {data}")
                    return False, {}
            else:
                log_test("AI Chat - Search", "FAIL", f"Missing required fields in response: {data}")
                return False, {}
        else:
            log_test("AI Chat - Search", "FAIL", f"Status: {response.status_code}, Body: {response.text}")
            return False, {}
            
    except Exception as e:
        log_test("AI Chat - Search", "FAIL", f"Exception: {str(e)}")
        return False, {}

def test_ai_chat_negotiation(products):
    """Test POST /api/ai/chat - Price negotiation"""
    if not products:
        log_test("AI Chat - Negotiation", "FAIL", "No products available for negotiation test")
        return False
        
    try:
        # Find a product that allows bargaining
        bargain_product = None
        for product in products:
            if product.get('bargain_enabled') and product.get('price', 0) > 40:
                bargain_product = product
                break
        
        if not bargain_product:
            log_test("AI Chat - Negotiation", "FAIL", "No suitable products for negotiation found")
            return False
        
        payload = {
            "session_id": SESSION_ID,
            "message": f"Can I get the {bargain_product['name']} for $35?"
        }
        
        print(f"    Sending negotiation request (may take 30+ seconds)...")
        response = requests.post(f"{BASE_URL}/ai/chat", 
                               json=payload, 
                               timeout=TIMEOUT,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            data = response.json()
            
            if 'response' in data and data['response'].get('text'):
                negotiation_result = data['response'].get('negotiation')
                response_text = data['response']['text']
                
                details = f"AI Response: {response_text[:100]}..."
                if negotiation_result:
                    details += f" | Negotiation: {negotiation_result.get('status', 'N/A')} at ${negotiation_result.get('final_price', 'N/A')}"
                
                log_test("AI Chat - Negotiation", "PASS", details)
                return True
            else:
                log_test("AI Chat - Negotiation", "FAIL", f"No proper AI response: {data}")
                return False
        else:
            log_test("AI Chat - Negotiation", "FAIL", f"Status: {response.status_code}, Body: {response.text}")
            return False
            
    except Exception as e:
        log_test("AI Chat - Negotiation", "FAIL", f"Exception: {str(e)}")
        return False

def test_ai_chat_add_to_cart():
    """Test POST /api/ai/chat - Add to cart"""
    try:
        payload = {
            "session_id": SESSION_ID,
            "message": "Add the candle collection to my cart"
        }
        
        print(f"    Sending add to cart request (may take 30+ seconds)...")
        response = requests.post(f"{BASE_URL}/ai/chat", 
                               json=payload, 
                               timeout=TIMEOUT,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            data = response.json()
            
            if 'response' in data and data['response'].get('text'):
                cart_updated = data['response'].get('cart_updated', False)
                cart = data.get('cart', [])
                response_text = data['response']['text']
                
                details = f"AI Response: {response_text[:100]}..."
                if cart_updated:
                    details += f" | Cart updated: {len(cart)} items"
                
                log_test("AI Chat - Add to Cart", "PASS", details)
                return True, len(cart) > 0
            else:
                log_test("AI Chat - Add to Cart", "FAIL", f"No proper AI response: {data}")
                return False, False
        else:
            log_test("AI Chat - Add to Cart", "FAIL", f"Status: {response.status_code}, Body: {response.text}")
            return False, False
            
    except Exception as e:
        log_test("AI Chat - Add to Cart", "FAIL", f"Exception: {str(e)}")
        return False, False

def test_get_missions():
    """Test GET /api/missions"""
    try:
        response = requests.get(f"{BASE_URL}/missions", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                log_test("Get Missions", "PASS", f"Found {len(data)} missions")
                return True
            else:
                log_test("Get Missions", "FAIL", f"Expected array, got: {type(data)}")
                return False
        else:
            log_test("Get Missions", "FAIL", f"Status: {response.status_code}, Body: {response.text}")
            return False
            
    except Exception as e:
        log_test("Get Missions", "FAIL", f"Exception: {str(e)}")
        return False

def test_get_intents():
    """Test GET /api/intents"""
    try:
        response = requests.get(f"{BASE_URL}/intents?limit=10", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                log_test("Get Intents", "PASS", f"Found {len(data)} intent events")
                return True
            else:
                log_test("Get Intents", "FAIL", f"Expected array, got: {type(data)}")
                return False
        else:
            log_test("Get Intents", "FAIL", f"Status: {response.status_code}, Body: {response.text}")
            return False
            
    except Exception as e:
        log_test("Get Intents", "FAIL", f"Exception: {str(e)}")
        return False

def test_get_consumer_matrix():
    """Test GET /api/consumer-matrix"""
    try:
        response = requests.get(f"{BASE_URL}/consumer-matrix", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                log_test("Get Consumer Matrix", "PASS", f"Found {len(data)} consumer profiles")
                return True
            else:
                log_test("Get Consumer Matrix", "FAIL", f"Expected array, got: {type(data)}")
                return False
        else:
            log_test("Get Consumer Matrix", "FAIL", f"Status: {response.status_code}, Body: {response.text}")
            return False
            
    except Exception as e:
        log_test("Get Consumer Matrix", "FAIL", f"Exception: {str(e)}")
        return False

def test_get_stats():
    """Test GET /api/stats"""
    try:
        response = requests.get(f"{BASE_URL}/stats", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ['totalProducts', 'totalConversations', 'totalMissions', 'activeMissions', 'totalIntents', 'avgTrustScore', 'totalBuyers']
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields:
                log_test("Get Stats", "PASS", f"All stats present: {data}")
                return True
            else:
                log_test("Get Stats", "FAIL", f"Missing fields: {missing_fields}")
                return False
        else:
            log_test("Get Stats", "FAIL", f"Status: {response.status_code}, Body: {response.text}")
            return False
            
    except Exception as e:
        log_test("Get Stats", "FAIL", f"Exception: {str(e)}")
        return False

def test_get_cart():
    """Test GET /api/cart"""
    try:
        response = requests.get(f"{BASE_URL}/cart?session_id={SESSION_ID}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'cart' in data and isinstance(data['cart'], list):
                log_test("Get Cart", "PASS", f"Cart has {len(data['cart'])} items")
                return True, len(data['cart']) > 0
            else:
                log_test("Get Cart", "FAIL", f"Invalid cart response: {data}")
                return False, False
        else:
            log_test("Get Cart", "FAIL", f"Status: {response.status_code}, Body: {response.text}")
            return False, False
            
    except Exception as e:
        log_test("Get Cart", "FAIL", f"Exception: {str(e)}")
        return False, False

def test_checkout(has_cart_items):
    """Test POST /api/checkout"""
    if not has_cart_items:
        log_test("Checkout", "FAIL", "Cannot test checkout - cart is empty")
        return False
        
    try:
        payload = {"session_id": SESSION_ID}
        
        response = requests.post(f"{BASE_URL}/checkout", 
                               json=payload, 
                               timeout=15,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            data = response.json()
            if 'url' in data and 'checkout.stripe.com' in data['url']:
                log_test("Checkout", "PASS", f"Stripe checkout URL generated: {data['url'][:50]}...")
                return True
            else:
                log_test("Checkout", "FAIL", f"Invalid checkout response: {data}")
                return False
        else:
            log_test("Checkout", "FAIL", f"Status: {response.status_code}, Body: {response.text}")
            return False
            
    except Exception as e:
        log_test("Checkout", "FAIL", f"Exception: {str(e)}")
        return False

def main():
    """Run all backend tests"""
    print("=" * 60)
    print("CONVOS AGENTIC COMMERCE - BACKEND API TESTING")
    print("=" * 60)
    print(f"Base URL: {BASE_URL}")
    print(f"Session ID: {SESSION_ID}")
    print(f"Timeout: {TIMEOUT}s")
    print()
    
    # Track test results
    results = {}
    products = []
    has_cart_items = False
    
    # Test in order as specified
    print("🔍 TESTING CORE ENDPOINTS...")
    results['health'] = test_health_check()
    results['seed'] = test_seed_products()
    success, products = test_get_products()
    results['products'] = success
    
    print("🤖 TESTING AI CHAT ENDPOINTS...")
    results['ai_search'], _ = test_ai_chat_search()
    results['ai_negotiation'] = test_ai_chat_negotiation(products)
    success, has_items = test_ai_chat_add_to_cart()
    results['ai_add_cart'] = success
    has_cart_items = has_items
    
    print("📊 TESTING DATA ENDPOINTS...")
    results['missions'] = test_get_missions()
    results['intents'] = test_get_intents()
    results['consumer_matrix'] = test_get_consumer_matrix()
    results['stats'] = test_get_stats()
    
    print("🛒 TESTING CART & CHECKOUT...")
    success, has_items = test_get_cart()
    results['cart'] = success
    if has_items:
        has_cart_items = True
    results['checkout'] = test_checkout(has_cart_items)
    
    # Summary
    print("=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name.replace('_', ' ').title()}")
    
    print()
    print(f"OVERALL: {passed}/{total} tests passed ({(passed/total)*100:.1f}%)")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED!")
        return 0
    else:
        print("⚠️  SOME TESTS FAILED")
        return 1

if __name__ == "__main__":
    sys.exit(main())
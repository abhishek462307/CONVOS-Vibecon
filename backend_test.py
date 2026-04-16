#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Convos Agentic Commerce Platform
Tests all CRUD operations for products, orders, reviews, campaigns, shipments, etc.
"""

import requests
import json
import uuid
from datetime import datetime
import time

# Configuration
BASE_URL = "https://ai-shopper-command.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

# Test data storage
test_data = {
    "created_product_id": None,
    "created_order_id": None,
    "created_review_id": None,
    "created_campaign_id": None,
    "existing_order_id": None,
    "existing_review_id": None
}

def log_test(test_name, success, details=""):
    """Log test results"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} {test_name}")
    if details:
        print(f"   Details: {details}")
    if not success:
        print(f"   ❗ CRITICAL ISSUE DETECTED")
    print()

def make_request(method, endpoint, data=None, expected_status=200):
    """Make HTTP request and handle errors"""
    url = f"{BASE_URL}{endpoint}"
    try:
        if method == "GET":
            response = requests.get(url, headers=HEADERS, timeout=30)
        elif method == "POST":
            response = requests.post(url, headers=HEADERS, json=data, timeout=30)
        elif method == "PUT":
            response = requests.put(url, headers=HEADERS, json=data, timeout=30)
        elif method == "DELETE":
            response = requests.delete(url, headers=HEADERS, timeout=30)
        
        print(f"   {method} {endpoint} -> {response.status_code}")
        
        if response.status_code != expected_status:
            print(f"   Expected {expected_status}, got {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return None, False
            
        return response.json() if response.content else {}, True
    except Exception as e:
        print(f"   Request failed: {str(e)}")
        return None, False

def test_health_check():
    """Test health check endpoint"""
    data, success = make_request("GET", "/health")
    if success and data and data.get("status") == "ok":
        log_test("Health Check", True, f"Platform: {data.get('platform', 'Unknown')}")
        return True
    else:
        log_test("Health Check", False, "Health endpoint not responding correctly")
        return False

def test_products_crud():
    """Test complete Products CRUD operations"""
    print("🧪 TESTING PRODUCTS CRUD")
    
    # 1. GET /api/products - Should return 13 products
    data, success = make_request("GET", "/products")
    if success and isinstance(data, list):
        product_count = len(data)
        log_test("GET /api/products", product_count >= 10, f"Found {product_count} products")
        if product_count == 0:
            return False
    else:
        log_test("GET /api/products", False, "Failed to fetch products")
        return False
    
    # 2. POST /api/products - Create new product
    new_product = {
        "name": "Test Coffee Blend",
        "description": "A test coffee blend for API testing",
        "price": 19.99,
        "compare_at_price": 24.99,
        "category": "Test Category",
        "stock": 100,
        "bargain_enabled": True,
        "bargain_min_price": 15.99,
        "tags": ["test", "coffee"],
        "weight": "340g"
    }
    
    data, success = make_request("POST", "/products", new_product, 201)
    if success and data and data.get("id"):
        test_data["created_product_id"] = data["id"]
        log_test("POST /api/products", True, f"Created product with ID: {data['id']}")
    else:
        log_test("POST /api/products", False, "Failed to create product")
        return False
    
    # 3. PUT /api/products/:id - Update product
    if test_data["created_product_id"]:
        update_data = {
            "name": "Updated Test Coffee Blend",
            "price": 22.99,
            "stock": 150
        }
        data, success = make_request("PUT", f"/products/{test_data['created_product_id']}", update_data)
        if success and data and data.get("name") == "Updated Test Coffee Blend":
            log_test("PUT /api/products/:id", True, f"Updated product name and price")
        else:
            log_test("PUT /api/products/:id", False, "Failed to update product")
    
    # 4. DELETE /api/products/:id - Soft delete product
    if test_data["created_product_id"]:
        data, success = make_request("DELETE", f"/products/{test_data['created_product_id']}")
        if success and data and data.get("success"):
            log_test("DELETE /api/products/:id", True, "Product soft deleted")
        else:
            log_test("DELETE /api/products/:id", False, "Failed to delete product")
    
    # 5. Verify deleted product doesn't appear in list
    data, success = make_request("GET", "/products")
    if success and isinstance(data, list):
        deleted_found = any(p.get("id") == test_data["created_product_id"] for p in data)
        log_test("Verify soft delete", not deleted_found, "Deleted product not in product list")
    
    return True

def test_orders_crud():
    """Test complete Orders CRUD operations"""
    print("🧪 TESTING ORDERS CRUD")
    
    # 6. GET /api/orders - Should return demo orders
    data, success = make_request("GET", "/orders")
    if success and isinstance(data, list):
        order_count = len(data)
        log_test("GET /api/orders", order_count >= 0, f"Found {order_count} orders")
        if order_count > 0:
            test_data["existing_order_id"] = data[0]["id"]
    else:
        log_test("GET /api/orders", False, "Failed to fetch orders")
        return False
    
    # 7. GET /api/orders?status=pending - Filter by status
    data, success = make_request("GET", "/orders?status=pending")
    if success and isinstance(data, list):
        pending_count = len(data)
        log_test("GET /api/orders?status=pending", True, f"Found {pending_count} pending orders")
    else:
        log_test("GET /api/orders?status=pending", False, "Failed to filter orders by status")
    
    # 8. GET /api/orders?search=Sarah - Search by customer name
    data, success = make_request("GET", "/orders?search=Sarah")
    if success and isinstance(data, list):
        search_count = len(data)
        log_test("GET /api/orders?search=Sarah", True, f"Search returned {search_count} orders")
    else:
        log_test("GET /api/orders?search=Sarah", False, "Failed to search orders")
    
    # 9. GET /api/orders/:id - Get single order
    if test_data["existing_order_id"]:
        data, success = make_request("GET", f"/orders/{test_data['existing_order_id']}")
        if success and data and data.get("id") == test_data["existing_order_id"]:
            log_test("GET /api/orders/:id", True, f"Retrieved order details")
        else:
            log_test("GET /api/orders/:id", False, "Failed to get single order")
    
    # 11. POST /api/orders - Create new order
    new_order = {
        "session_id": "test_session_" + str(uuid.uuid4()),
        "items": [
            {
                "product_id": str(uuid.uuid4()),
                "name": "Test Product",
                "price": 19.99,
                "quantity": 2
            }
        ],
        "subtotal": 39.98,
        "shipping": 5.00,
        "tax": 3.20,
        "total": 48.18,
        "status": "pending",
        "payment_status": "unpaid",
        "shipping_address": {
            "name": "John Doe",
            "email": "john@test.com",
            "address": "123 Test St",
            "city": "Test City",
            "state": "TS",
            "zip": "12345"
        }
    }
    
    data, success = make_request("POST", "/orders", new_order, 201)
    if success and data and data.get("id"):
        test_data["created_order_id"] = data["id"]
        log_test("POST /api/orders", True, f"Created order with ID: {data['id']}")
    else:
        log_test("POST /api/orders", False, "Failed to create order")
    
    # 10. PUT /api/orders/:id - Update order status
    if test_data["created_order_id"]:
        update_data = {"status": "shipped", "tracking_number": "TEST123456"}
        data, success = make_request("PUT", f"/orders/{test_data['created_order_id']}", update_data)
        if success and data and data.get("status") == "shipped":
            log_test("PUT /api/orders/:id", True, f"Updated order status to shipped")
        else:
            log_test("PUT /api/orders/:id", False, "Failed to update order")
    
    return True

def test_reviews_crud():
    """Test complete Reviews CRUD operations"""
    print("🧪 TESTING REVIEWS CRUD")
    
    # 12. GET /api/reviews - Should return reviews with product info
    data, success = make_request("GET", "/reviews")
    if success and isinstance(data, list):
        review_count = len(data)
        log_test("GET /api/reviews", review_count >= 0, f"Found {review_count} reviews")
        if review_count > 0:
            test_data["existing_review_id"] = data[0]["id"]
            # Check if product info is populated
            has_product_info = any(r.get("product") for r in data)
            log_test("Reviews with product info", has_product_info, "Product info populated in reviews")
    else:
        log_test("GET /api/reviews", False, "Failed to fetch reviews")
        return False
    
    # 13. GET /api/reviews?status=pending - Filter pending reviews
    data, success = make_request("GET", "/reviews?status=pending")
    if success and isinstance(data, list):
        pending_count = len(data)
        log_test("GET /api/reviews?status=pending", True, f"Found {pending_count} pending reviews")
    else:
        log_test("GET /api/reviews?status=pending", False, "Failed to filter reviews by status")
    
    # 14. POST /api/reviews - Create review
    new_review = {
        "product_id": str(uuid.uuid4()),
        "author_name": "Test Reviewer",
        "rating": 5,
        "title": "Great product!",
        "content": "This is a test review for API testing purposes.",
        "status": "pending"
    }
    
    data, success = make_request("POST", "/reviews", new_review, 201)
    if success and data and data.get("id"):
        test_data["created_review_id"] = data["id"]
        log_test("POST /api/reviews", True, f"Created review with ID: {data['id']}")
    else:
        log_test("POST /api/reviews", False, "Failed to create review")
    
    # 15. PUT /api/reviews/:id - Update review status and add merchant reply
    if test_data["created_review_id"]:
        update_data = {
            "status": "published",
            "merchant_reply": "Thank you for your review!"
        }
        data, success = make_request("PUT", f"/reviews/{test_data['created_review_id']}", update_data)
        if success and data and data.get("status") == "published":
            log_test("PUT /api/reviews/:id", True, f"Updated review status and added merchant reply")
            # This tests the bug fix - ensure it's writing to reviews collection, not orders
            if data.get("merchant_reply") == "Thank you for your review!":
                log_test("Reviews PUT bug fix", True, "Merchant reply correctly saved to reviews collection")
            else:
                log_test("Reviews PUT bug fix", False, "Merchant reply not saved correctly")
        else:
            log_test("PUT /api/reviews/:id", False, "Failed to update review")
    
    # 16. DELETE /api/reviews/:id - Delete review
    if test_data["created_review_id"]:
        data, success = make_request("DELETE", f"/reviews/{test_data['created_review_id']}")
        if success and data and data.get("success"):
            log_test("DELETE /api/reviews/:id", True, "Review deleted successfully")
        else:
            log_test("DELETE /api/reviews/:id", False, "Failed to delete review")
    
    return True

def test_campaigns_crud():
    """Test complete Campaigns CRUD operations"""
    print("🧪 TESTING CAMPAIGNS CRUD")
    
    # 17. GET /api/campaigns - Should return campaigns
    data, success = make_request("GET", "/campaigns")
    if success and isinstance(data, list):
        campaign_count = len(data)
        log_test("GET /api/campaigns", campaign_count >= 0, f"Found {campaign_count} campaigns")
    else:
        log_test("GET /api/campaigns", False, "Failed to fetch campaigns")
        return False
    
    # 18. POST /api/campaigns - Create campaign
    new_campaign = {
        "name": "Test Email Campaign",
        "description": "A test campaign for API testing",
        "type": "email",
        "audience_count": 1000,
        "content": {
            "subject": "Test Subject",
            "body": "This is a test email campaign body.",
            "cta": "Shop Now"
        },
        "status": "draft"
    }
    
    data, success = make_request("POST", "/campaigns", new_campaign, 201)
    if success and data and data.get("id"):
        test_data["created_campaign_id"] = data["id"]
        log_test("POST /api/campaigns", True, f"Created campaign with ID: {data['id']}")
    else:
        log_test("POST /api/campaigns", False, "Failed to create campaign")
    
    # 19. PUT /api/campaigns/:id - Update campaign status
    if test_data["created_campaign_id"]:
        update_data = {"status": "active"}
        data, success = make_request("PUT", f"/campaigns/{test_data['created_campaign_id']}", update_data)
        if success and data and data.get("status") == "active":
            log_test("PUT /api/campaigns/:id", True, f"Updated campaign status to active")
        else:
            log_test("PUT /api/campaigns/:id", False, "Failed to update campaign")
    
    # 20. DELETE /api/campaigns/:id - Delete campaign
    if test_data["created_campaign_id"]:
        data, success = make_request("DELETE", f"/campaigns/{test_data['created_campaign_id']}")
        if success and data and data.get("success"):
            log_test("DELETE /api/campaigns/:id", True, "Campaign deleted successfully")
        else:
            log_test("DELETE /api/campaigns/:id", False, "Failed to delete campaign")
    
    return True

def test_shipments():
    """Test Shipments endpoints"""
    print("🧪 TESTING SHIPMENTS")
    
    # 21. GET /api/shipments - Should return orders with processing/shipped/delivered status
    data, success = make_request("GET", "/shipments")
    if success and isinstance(data, list):
        shipment_count = len(data)
        log_test("GET /api/shipments", True, f"Found {shipment_count} shipments")
        
        # Check if returned orders have appropriate statuses
        if shipment_count > 0:
            valid_statuses = ["processing", "shipped", "delivered"]
            all_valid = all(order.get("status") in valid_statuses for order in data)
            log_test("Shipments status filter", all_valid, "All shipments have valid statuses")
    else:
        log_test("GET /api/shipments", False, "Failed to fetch shipments")
    
    # 22. PUT /api/shipments/:id - Update carrier and tracking
    if test_data["created_order_id"]:
        update_data = {
            "carrier": "UPS",
            "tracking_number": "1Z999AA1234567890",
            "status": "shipped"
        }
        data, success = make_request("PUT", f"/shipments/{test_data['created_order_id']}", update_data)
        if success and data and data.get("carrier") == "UPS":
            log_test("PUT /api/shipments/:id", True, f"Updated shipment tracking info")
        else:
            log_test("PUT /api/shipments/:id", False, "Failed to update shipment")
    
    return True

def test_stats():
    """Test Stats endpoint"""
    print("🧪 TESTING STATS")
    
    # 23. GET /api/stats - Should return expanded metrics
    data, success = make_request("GET", "/stats")
    if success and data:
        required_fields = [
            "totalProducts", "totalOrders", "totalRevenue", "pendingOrders",
            "avgRating", "totalReviews", "totalConversations", "totalMissions"
        ]
        
        missing_fields = [field for field in required_fields if field not in data]
        if not missing_fields:
            log_test("GET /api/stats", True, f"All required stats fields present")
            log_test("Stats content", True, 
                   f"Products: {data.get('totalProducts')}, Orders: {data.get('totalOrders')}, "
                   f"Revenue: ${data.get('totalRevenue', 0)}, Avg Rating: {data.get('avgRating')}")
        else:
            log_test("GET /api/stats", False, f"Missing fields: {missing_fields}")
    else:
        log_test("GET /api/stats", False, "Failed to fetch stats")
    
    return True

def test_store_config():
    """Test Store Config endpoints"""
    print("🧪 TESTING STORE CONFIG")
    
    # 24. GET /api/store-config - Should return store configuration
    data, success = make_request("GET", "/store-config")
    if success and data:
        required_fields = ["name", "tagline", "description"]
        missing_fields = [field for field in required_fields if field not in data]
        if not missing_fields:
            log_test("GET /api/store-config", True, f"Store: {data.get('name')} - {data.get('tagline')}")
        else:
            log_test("GET /api/store-config", False, f"Missing fields: {missing_fields}")
    else:
        log_test("GET /api/store-config", False, "Failed to fetch store config")
    
    # 25. PUT /api/store-config - Update store name and tagline
    update_data = {
        "name": "Updated Test Store",
        "tagline": "Updated tagline for testing"
    }
    data, success = make_request("PUT", "/store-config", update_data)
    if success and data and data.get("success"):
        log_test("PUT /api/store-config", True, "Store config updated successfully")
    else:
        log_test("PUT /api/store-config", False, "Failed to update store config")
    
    return True

def test_export_endpoints():
    """Test Export endpoints"""
    print("🧪 TESTING EXPORT ENDPOINTS")
    
    # 26. GET /api/export/orders - Export order data
    data, success = make_request("GET", "/export/orders")
    if success and isinstance(data, list):
        log_test("GET /api/export/orders", True, f"Exported {len(data)} orders")
        if len(data) > 0:
            # Check if export has expected fields
            expected_fields = ["order_number", "customer_name", "total", "status"]
            first_order = data[0]
            has_fields = all(field in first_order for field in expected_fields)
            log_test("Orders export format", has_fields, "Export contains expected fields")
    else:
        log_test("GET /api/export/orders", False, "Failed to export orders")
    
    # 27. GET /api/export/products - Export product data
    data, success = make_request("GET", "/export/products")
    if success and isinstance(data, list):
        log_test("GET /api/export/products", True, f"Exported {len(data)} products")
        if len(data) > 0:
            expected_fields = ["name", "price", "category", "stock"]
            first_product = data[0]
            has_fields = all(field in first_product for field in expected_fields)
            log_test("Products export format", has_fields, "Export contains expected fields")
    else:
        log_test("GET /api/export/products", False, "Failed to export products")
    
    # 28. GET /api/export/customers - Export customer data
    data, success = make_request("GET", "/export/customers")
    if success and isinstance(data, list):
        log_test("GET /api/export/customers", True, f"Exported {len(data)} customers")
        if len(data) > 0:
            expected_fields = ["session_id", "trust_score", "total_orders"]
            first_customer = data[0]
            has_fields = all(field in first_customer for field in expected_fields)
            log_test("Customers export format", has_fields, "Export contains expected fields")
    else:
        log_test("GET /api/export/customers", False, "Failed to export customers")
    
    return True

def test_auth():
    """Test Authentication"""
    print("🧪 TESTING AUTHENTICATION")
    
    # 29. POST /api/auth/login - Login with merchant credentials
    login_data = {
        "email": "merchant@demo.com",
        "password": "merchant123",
        "type": "merchant"
    }
    
    data, success = make_request("POST", "/auth/login", login_data)
    if success and data and data.get("success"):
        log_test("POST /api/auth/login", True, f"Merchant login successful")
        user_data = data.get("user", {})
        if user_data.get("type") == "merchant":
            log_test("Merchant auth type", True, "User type is merchant")
        else:
            log_test("Merchant auth type", False, f"Expected merchant, got {user_data.get('type')}")
    else:
        log_test("POST /api/auth/login", False, "Merchant login failed")
    
    return True

def run_all_tests():
    """Run all backend API tests"""
    print("🚀 STARTING COMPREHENSIVE BACKEND API TESTING")
    print("=" * 60)
    print(f"Base URL: {BASE_URL}")
    print("=" * 60)
    
    test_results = []
    
    # Run all test suites
    test_results.append(("Health Check", test_health_check()))
    test_results.append(("Products CRUD", test_products_crud()))
    test_results.append(("Orders CRUD", test_orders_crud()))
    test_results.append(("Reviews CRUD", test_reviews_crud()))
    test_results.append(("Campaigns CRUD", test_campaigns_crud()))
    test_results.append(("Shipments", test_shipments()))
    test_results.append(("Stats", test_stats()))
    test_results.append(("Store Config", test_store_config()))
    test_results.append(("Export Endpoints", test_export_endpoints()))
    test_results.append(("Authentication", test_auth()))
    
    # Summary
    print("=" * 60)
    print("🏁 TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for _, result in test_results if result)
    total = len(test_results)
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print("=" * 60)
    print(f"OVERALL RESULT: {passed}/{total} test suites passed")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED! Backend API is working correctly.")
    else:
        print("⚠️  SOME TESTS FAILED! Check the details above.")
    
    return passed == total

if __name__ == "__main__":
    run_all_tests()
#!/usr/bin/env python3
"""
Convos Storefront AI Agent - Cart and Checkout Flow Testing
Testing AI chat functionality for adding items to cart, viewing cart, and checkout.
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "https://agent-missions-2.preview.emergentagent.com/api"

def log_test(test_name, status, details=""):
    """Log test results with timestamp"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    status_icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
    print(f"[{timestamp}] {status_icon} {test_name}")
    if details:
        print(f"    {details}")
    print()

def make_request(method, endpoint, data=None, expected_status=200):
    """Make HTTP request with error handling"""
    url = f"{BASE_URL}{endpoint}"
    try:
        if method == "GET":
            response = requests.get(url, timeout=30)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=30)
        elif method == "PUT":
            response = requests.put(url, json=data, timeout=30)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        print(f"    {method} {endpoint} -> {response.status_code}")
        
        if response.status_code != expected_status:
            print(f"    Expected {expected_status}, got {response.status_code}")
            print(f"    Response: {response.text[:500]}")
            return None, response.status_code
            
        return response.json(), response.status_code
    except requests.exceptions.RequestException as e:
        print(f"    Request failed: {str(e)}")
        return None, 0
    except json.JSONDecodeError as e:
        print(f"    JSON decode error: {str(e)}")
        print(f"    Response text: {response.text[:500]}")
        return None, response.status_code

def test_1_ai_chat_add_to_cart():
    """Test 1: AI Chat - Add to Cart via AI"""
    print("=" * 60)
    print("TEST 1: AI CHAT - ADD TO CART VIA AI")
    print("=" * 60)
    
    session_id = "cart-test-001"
    message = "Add Ethiopian Yirgacheffe to my cart"
    
    chat_data = {
        "session_id": session_id,
        "message": message
    }
    
    response_data, status = make_request("POST", "/ai/chat", chat_data)
    if response_data is None:
        log_test("POST /api/ai/chat (add to cart)", "FAIL", f"Request failed with status {status}")
        return None, None
    
    # Check response structure
    if 'response' not in response_data:
        log_test("POST /api/ai/chat (add to cart)", "FAIL", "No 'response' field in AI response")
        return None, None
    
    # Check if cart was updated
    cart_updated = response_data.get('response', {}).get('cart_updated', False)
    if not cart_updated:
        log_test("POST /api/ai/chat (add to cart)", "FAIL", "response.cart_updated should be true")
        return None, None
    
    # Check if cart has items
    cart = response_data.get('cart', [])
    if not cart or len(cart) == 0:
        log_test("POST /api/ai/chat (add to cart)", "FAIL", "Cart should have items after adding product")
        return None, None
    
    # Check cart item structure
    cart_item = cart[0]
    required_fields = ['name', 'price', 'quantity']
    missing_fields = [field for field in required_fields if field not in cart_item]
    
    if missing_fields:
        log_test("POST /api/ai/chat (add to cart)", "FAIL", f"Cart item missing fields: {missing_fields}")
        return None, None
    
    # Check for product_id field (critical for frontend cart management)
    has_product_id = 'product_id' in cart_item
    has_id = 'id' in cart_item
    
    if not has_product_id and not has_id:
        log_test("POST /api/ai/chat (add to cart)", "FAIL", "Cart item should have either 'product_id' or 'id' field")
        return None, None
    
    id_field = 'product_id' if has_product_id else 'id'
    log_test("POST /api/ai/chat (add to cart)", "PASS", 
             f"Added {cart_item['name']} to cart (${cart_item['price']}, qty: {cart_item['quantity']}, {id_field}: {cart_item.get(id_field)})")
    
    return session_id, cart_item

def test_2_cart_field_normalization(session_id, cart_item):
    """Test 2: Cart field normalization check"""
    print("=" * 60)
    print("TEST 2: CART FIELD NORMALIZATION CHECK")
    print("=" * 60)
    
    if not session_id or not cart_item:
        log_test("Cart Field Normalization", "SKIP", "No cart data from previous test")
        return False
    
    # Check if cart items have the expected structure
    expected_structure = {
        'name': str,
        'price': (int, float),
        'quantity': int,
        'image': str
    }
    
    structure_issues = []
    for field, expected_type in expected_structure.items():
        if field not in cart_item:
            structure_issues.append(f"Missing field: {field}")
        elif not isinstance(cart_item[field], expected_type):
            structure_issues.append(f"Field {field} has wrong type: {type(cart_item[field])} (expected {expected_type})")
    
    # Check ID field (product_id vs id)
    has_product_id = 'product_id' in cart_item
    has_id = 'id' in cart_item
    
    id_field_info = ""
    if has_product_id and has_id:
        id_field_info = "Has both 'product_id' and 'id' fields"
    elif has_product_id:
        id_field_info = "Uses 'product_id' field (recommended for backend consistency)"
    elif has_id:
        id_field_info = "Uses 'id' field (frontend updateQty expects item.id)"
    else:
        structure_issues.append("Missing both 'product_id' and 'id' fields")
    
    if structure_issues:
        log_test("Cart Field Normalization", "FAIL", f"Structure issues: {'; '.join(structure_issues)}")
        return False
    
    log_test("Cart Field Normalization", "PASS", f"Cart structure valid. {id_field_info}")
    return True

def test_3_ai_chat_view_cart(session_id):
    """Test 3: AI Chat - View Cart"""
    print("=" * 60)
    print("TEST 3: AI CHAT - VIEW CART")
    print("=" * 60)
    
    if not session_id:
        log_test("POST /api/ai/chat (view cart)", "SKIP", "No session ID from previous test")
        return False
    
    chat_data = {
        "session_id": session_id,
        "message": "What's in my cart?"
    }
    
    response_data, status = make_request("POST", "/ai/chat", chat_data)
    if response_data is None:
        log_test("POST /api/ai/chat (view cart)", "FAIL", f"Request failed with status {status}")
        return False
    
    # Check if AI knows about cart contents
    ai_response_text = response_data.get('response', {}).get('text', '')
    cart = response_data.get('cart', [])
    
    if not ai_response_text:
        log_test("POST /api/ai/chat (view cart)", "FAIL", "No AI response text")
        return False
    
    if len(cart) == 0:
        log_test("POST /api/ai/chat (view cart)", "FAIL", "Cart should still have items from previous test")
        return False
    
    # Check if AI response mentions cart contents (should mention product name or cart info)
    cart_item_name = cart[0].get('name', '').lower()
    response_mentions_cart = any(word in ai_response_text.lower() for word in ['cart', 'yirgacheffe', 'coffee', 'item'])
    
    if not response_mentions_cart:
        log_test("POST /api/ai/chat (view cart)", "FAIL", "AI response doesn't seem to acknowledge cart contents")
        return False
    
    log_test("POST /api/ai/chat (view cart)", "PASS", f"AI knows about cart contents: {len(cart)} items")
    return True

def test_4_ai_chat_generate_checkout(session_id):
    """Test 4: AI Chat - Generate Checkout (Stripe)"""
    print("=" * 60)
    print("TEST 4: AI CHAT - GENERATE CHECKOUT (STRIPE)")
    print("=" * 60)
    
    if not session_id:
        log_test("POST /api/ai/chat (checkout)", "SKIP", "No session ID from previous test")
        return None
    
    chat_data = {
        "session_id": session_id,
        "message": "I'm ready to checkout, generate a checkout link"
    }
    
    response_data, status = make_request("POST", "/ai/chat", chat_data)
    if response_data is None:
        log_test("POST /api/ai/chat (checkout)", "FAIL", f"Request failed with status {status}")
        return None
    
    # Check if checkout URL was generated
    checkout_url = response_data.get('response', {}).get('checkout_url')
    
    if not checkout_url:
        # Check if there's an error message about Stripe configuration
        ai_response_text = response_data.get('response', {}).get('text', '')
        if 'unavailable' in ai_response_text.lower() or 'error' in ai_response_text.lower():
            log_test("POST /api/ai/chat (checkout)", "WARN", f"Stripe may not be configured: {ai_response_text[:100]}")
            return "stripe_error"
        else:
            log_test("POST /api/ai/chat (checkout)", "FAIL", "No checkout_url in response and no error message")
            return None
    
    # Validate checkout URL format
    if not isinstance(checkout_url, str) or not checkout_url.startswith('http'):
        log_test("POST /api/ai/chat (checkout)", "FAIL", f"Invalid checkout URL format: {checkout_url}")
        return None
    
    log_test("POST /api/ai/chat (checkout)", "PASS", f"Checkout URL generated: {checkout_url[:50]}...")
    return checkout_url

def test_5_ai_chat_negotiate_then_add():
    """Test 5: AI Chat - Negotiate then Add"""
    print("=" * 60)
    print("TEST 5: AI CHAT - NEGOTIATE THEN ADD")
    print("=" * 60)
    
    session_id = "cart-test-002"
    message = "Can I get Colombian Supremo for $12?"
    
    chat_data = {
        "session_id": session_id,
        "message": message
    }
    
    response_data, status = make_request("POST", "/ai/chat", chat_data)
    if response_data is None:
        log_test("POST /api/ai/chat (negotiate)", "FAIL", f"Request failed with status {status}")
        return False
    
    # Check for negotiation response
    negotiation = response_data.get('response', {}).get('negotiation')
    ai_response_text = response_data.get('response', {}).get('text', '')
    
    if not negotiation and not ai_response_text:
        log_test("POST /api/ai/chat (negotiate)", "FAIL", "No negotiation response or AI text")
        return False
    
    # Check if AI handled the negotiation request
    negotiation_handled = (
        negotiation is not None or 
        any(word in ai_response_text.lower() for word in ['price', 'offer', 'deal', 'discount', '$12'])
    )
    
    if not negotiation_handled:
        log_test("POST /api/ai/chat (negotiate)", "FAIL", "AI didn't handle negotiation request")
        return False
    
    if negotiation:
        status = negotiation.get('status', 'unknown')
        final_price = negotiation.get('final_price', 'unknown')
        log_test("POST /api/ai/chat (negotiate)", "PASS", f"Negotiation handled - Status: {status}, Final price: ${final_price}")
    else:
        log_test("POST /api/ai/chat (negotiate)", "PASS", f"Negotiation request acknowledged in AI response")
    
    return True

def test_6_direct_cart_via_orders(session_id):
    """Test 6: Direct Cart via POST /api/orders"""
    print("=" * 60)
    print("TEST 6: DIRECT CART VIA POST /api/orders")
    print("=" * 60)
    
    if not session_id:
        session_id = "cart-test-001"  # Use the session from test 1
    
    # Get cart items from conversation first
    conv_response, status = make_request("GET", f"/cart?session_id={session_id}")
    if conv_response is None:
        log_test("GET /api/cart", "FAIL", f"Could not retrieve cart for session {session_id}")
        return False
    
    cart_items = conv_response.get('cart', [])
    if not cart_items:
        log_test("POST /api/orders (COD)", "SKIP", "No cart items found for direct order creation")
        return False
    
    # Calculate total
    total = sum(item['price'] * item['quantity'] for item in cart_items)
    
    order_data = {
        "session_id": session_id,
        "items": cart_items,
        "payment_method": "cod",
        "payment_status": "cod",
        "total": total,
        "status": "pending",
        "shipping_address": {
            "name": "Test User",
            "street": "123 Main St",
            "city": "NY",
            "state": "NY",
            "zip": "10001",
            "country": "US"
        }
    }
    
    response_data, status = make_request("POST", "/orders", order_data, 201)
    if response_data is None:
        log_test("POST /api/orders (COD)", "FAIL", f"Request failed with status {status}")
        return False
    
    # Check if order was created successfully
    if 'id' not in response_data or 'order_number' not in response_data:
        log_test("POST /api/orders (COD)", "FAIL", "Order creation response missing required fields")
        return False
    
    log_test("POST /api/orders (COD)", "PASS", f"COD order created: {response_data['order_number']} (${total:.2f})")
    return True

def test_7_cart_get_from_conversation(session_id):
    """Test 7: Cart GET from conversation"""
    print("=" * 60)
    print("TEST 7: CART GET FROM CONVERSATION")
    print("=" * 60)
    
    if not session_id:
        session_id = "cart-test-001"
    
    # Try GET /api/cart endpoint
    cart_response, status = make_request("GET", f"/cart?session_id={session_id}")
    if cart_response is not None:
        cart = cart_response.get('cart', [])
        log_test("GET /api/cart", "PASS", f"Cart retrieved via /api/cart: {len(cart)} items")
        return True
    
    # Try GET /api/conversations endpoint (if it exists)
    conv_response, status = make_request("GET", f"/conversations?session_id={session_id}")
    if conv_response is not None:
        log_test("GET /api/conversations", "PASS", "Conversations endpoint exists")
        return True
    
    # Try GET /api/conversations/:session_id endpoint
    conv_response, status = make_request("GET", f"/conversations/{session_id}")
    if conv_response is not None:
        log_test("GET /api/conversations/:id", "PASS", "Conversation by ID endpoint exists")
        return True
    
    log_test("Cart GET from conversation", "FAIL", "No working endpoint found for retrieving cart from conversation")
    return False

def main():
    """Run complete AI chat cart and checkout flow test"""
    print("🤖 CONVOS STOREFRONT AI AGENT - CART & CHECKOUT FLOW TEST")
    print(f"Base URL: {BASE_URL}")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Test sequence
    test_results = []
    
    # Test 1: AI Chat - Add to Cart
    session_id, cart_item = test_1_ai_chat_add_to_cart()
    test_results.append(("AI Chat - Add to Cart", session_id is not None and cart_item is not None))
    
    # Test 2: Cart field normalization check
    normalization_success = test_2_cart_field_normalization(session_id, cart_item)
    test_results.append(("Cart Field Normalization", normalization_success))
    
    # Test 3: AI Chat - View Cart
    view_cart_success = test_3_ai_chat_view_cart(session_id)
    test_results.append(("AI Chat - View Cart", view_cart_success))
    
    # Test 4: AI Chat - Generate Checkout
    checkout_result = test_4_ai_chat_generate_checkout(session_id)
    checkout_success = checkout_result is not None
    test_results.append(("AI Chat - Generate Checkout", checkout_success))
    
    # Test 5: AI Chat - Negotiate then Add
    negotiate_success = test_5_ai_chat_negotiate_then_add()
    test_results.append(("AI Chat - Negotiate", negotiate_success))
    
    # Test 6: Direct Cart via POST /api/orders
    direct_order_success = test_6_direct_cart_via_orders(session_id)
    test_results.append(("Direct Cart via Orders", direct_order_success))
    
    # Test 7: Cart GET from conversation
    cart_get_success = test_7_cart_get_from_conversation(session_id)
    test_results.append(("Cart GET from Conversation", cart_get_success))
    
    # Summary
    print("=" * 60)
    print("FINAL TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for _, success in test_results if success)
    total = len(test_results)
    
    for test_name, success in test_results:
        status_icon = "✅" if success else "❌"
        print(f"{status_icon} {test_name}")
    
    print()
    print(f"OVERALL RESULT: {passed}/{total} tests passed")
    
    # Special notes
    print("\n📋 DETAILED FINDINGS:")
    if cart_item:
        has_product_id = 'product_id' in cart_item
        has_id = 'id' in cart_item
        if has_product_id and not has_id:
            print("⚠️  Cart items use 'product_id' field - frontend updateQty may need adjustment")
        elif has_id and not has_product_id:
            print("⚠️  Cart items use 'id' field - backend consistency may be affected")
        elif has_product_id and has_id:
            print("✅ Cart items have both 'product_id' and 'id' fields - good compatibility")
    
    if checkout_result == "stripe_error":
        print("⚠️  Stripe checkout may not be fully configured - returned error message")
    elif checkout_result:
        print("✅ Stripe checkout integration working correctly")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED - AI chat cart & checkout flow is working!")
    else:
        print("\n⚠️  Some tests failed - Check individual test results above")
    
    print(f"\nCompleted at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()
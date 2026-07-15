# 🔌 API Endpoints - Reference Guide

## Orders API

### ✅ 1. إنشاء طلب جديد
```
POST /api/v1/new/order
Auth: Optional (guest or user)

Body:
{
  "shippingInfo": {
    "fullName": "أحمد علي",
    "email": "ahmed@mail.com",
    "address": "شارع الحبيب بورقيبة",
    "city": "تونس",
    "state": "تونس",
    "pincode": "1000",
    "country": "Tunisia",
    "phoneNumber": "21612345678"
  },
  "orderItems": [
    {
      "name": "Samsung Galaxy S21",
      "price": 1200,
      "quantity": 1,
      "image": "https://...",
      "product": "product_id_123",
      "variantId": "variant_456",
      "variantLabel": "Black 256GB",
      "selectedOptions": {
        "size": "",
        "color": "Black"
      },
      "sku": "SGS21-BLK-256"
    }
  ],
  "itemPrice": 1200,
  "taxPrice": 0,
  "shippingPrice": 50,
  "discountPrice": 120,
  "totalPrice": 1130,
  "couponCode": "SAVE10",
  "notes": "",
  "idempotencyKey": "uuid-1234-5678-90ab-cdef"
}

Response Success (201):
{
  "success": true,
  "order": {
    "_id": "order_123",
    "orderStatus": "Pending",
    "stockReserved": true,
    "stockReservedAt": "2024-01-15T10:00:00Z",
    "totalPrice": 1130,
    "notifications": [...]
  },
  "message": "Order created successfully"
}

Response Duplicate (200):
{
  "success": true,
  "order": {...},
  "isDuplicate": true
}

Response Error (400/500):
{
  "success": false,
  "message": "Insufficient stock for Samsung Galaxy"
}
```

---

### ✅ 2. الحصول على تفاصيل طلب واحد
```
GET /api/v1/order/:orderId
Auth: Optional

Response (200):
{
  "success": true,
  "order": {
    "_id": "order_123",
    "orderStatus": "Shipped",
    "user": {
      "_id": "user_456",
      "name": "أحمد",
      "email": "ahmed@mail.com"
    },
    "shippingInfo": {...},
    "orderItems": [...],
    "statusHistory": [
      {
        "status": "Pending",
        "note": "Order created",
        "changedBy": null,
        "changedByRole": "guest",
        "createdAt": "2024-01-15T10:00:00Z"
      },
      {
        "status": "Confirmed",
        "note": "Order confirmed",
        "changedBy": {
          "_id": "admin_789",
          "name": "محمد",
          "email": "admin@mail.com"
        },
        "changedByRole": "admin",
        "createdAt": "2024-01-15T11:30:00Z"
      }
    ],
    "notifications": [...]
  }
}
```

---

### ✅ 3. جميع طلبات المستخدم
```
GET /api/v1/orders/user
Auth: Required (User)

Response (200):
{
  "success": true,
  "orders": [
    {
      "_id": "order_123",
      "orderStatus": "Delivered",
      "totalPrice": 1130,
      "createdAt": "2024-01-15T10:00:00Z",
      "orderItems": [...]
    },
    {
      "_id": "order_124",
      "orderStatus": "Pending",
      "totalPrice": 850,
      "createdAt": "2024-01-16T14:00:00Z",
      "orderItems": [...]
    }
  ]
}
```

---

### ✅ 4. جميع الطلبات (Admin)
```
GET /api/v1/admin/orders
Auth: Required (Admin)

Response (200):
{
  "success": true,
  "orders": [...],
  "totalAmount": 123456.50
}
```

---

### ✅ 5. تحديث حالة الطلب (Admin)
```
PUT /api/v1/admin/order/:orderId
Auth: Required (Admin)

Body:
{
  "status": "Shipped",
  "trackingNumber": "DHL123456789",
  "trackingUrl": "https://dhl.com/track/123456789",
  "courier": "DHL",
  "note": "Shipped via DHL Express"
}

Valid Statuses:
- Pending → Confirmed
- Confirmed → Processing
- Processing → Shipped
- Shipped → Delivered
- Any → Cancelled

Response (200):
{
  "success": true,
  "order": {
    "_id": "order_123",
    "orderStatus": "Shipped",
    "trackingNumber": "DHL123456789",
    "trackingUrl": "https://dhl.com/track/123456789",
    "courier": "DHL",
    "shippedAt": "2024-01-16T14:30:00Z",
    "statusHistory": [
      // ... with tracking updates
    ]
  },
  "message": "Order status updated to Shipped"
}
```

---

### ✅ 6. حذف طلب (Admin)
```
DELETE /api/v1/admin/orderDelete/:orderId
Auth: Required (Admin)

Note: Only pending orders can be deleted

Response (200):
{
  "success": true,
  "message": "Order deleted successfully"
}

Response Error (400):
{
  "success": false,
  "message": "Can only delete pending orders"
}
```

---

## Coupon API

### ✅ 7. التحقق من الكوبون (للطلب)
```
POST /api/v1/coupon/validate
Auth: Optional (User or Guest)

Body:
{
  "code": "SAVE10",
  "orderAmount": 550
}

Response Success (200):
{
  "success": true,
  "discountAmount": 55,
  "coupon": {
    "code": "SAVE10",
    "type": "percent",
    "value": 10
  }
}

Response Error Examples:
{
  "success": false,
  "message": "Invalid coupon code"
}

{
  "success": false,
  "message": "Coupon has expired"
}

{
  "success": false,
  "message": "Minimum order amount is 100"
}

{
  "success": false,
  "message": "Coupon usage limit exceeded"
}

{
  "success": false,
  "message": "You have already used this coupon"
}
```

---

### ✅ 8. الحصول على جميع الكوبونات (Admin)
```
GET /api/v1/admin/coupons
Auth: Required (Admin)

Response (200):
{
  "success": true,
  "coupons": [
    {
      "_id": "coupon_123",
      "code": "SAVE10",
      "type": "percent",
      "value": 10,
      "minOrderAmount": 100,
      "maxDiscount": 50,
      "usageLimit": 100,
      "usedCount": 35,
      "expiresAt": "2024-12-31T23:59:59Z",
      "isActive": true,
      "usedBy": [
        {
          "userId": "user_123",
          "orderId": "order_123",
          "usedAt": "2024-01-15T10:00:00Z"
        }
      ],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### ✅ 9. إنشاء كوبون جديد (Admin)
```
POST /api/v1/admin/coupons
Auth: Required (Admin)

Body:
{
  "code": "NEWYEAR50",
  "type": "fixed",              // "percent" or "fixed"
  "value": 50,                  // 50 JD or 10%
  "minOrderAmount": 200,        // Order must be at least 200
  "maxDiscount": 75,            // For percent: max discount (optional)
  "usageLimit": 50,             // Total uses allowed (optional)
  "expiresAt": "2024-12-31T23:59:59Z",
  "isActive": true
}

Response (201):
{
  "success": true,
  "coupon": {
    "_id": "coupon_124",
    "code": "NEWYEAR50",
    "type": "fixed",
    "value": 50,
    ...
  }
}
```

---

### ✅ 10. حذف كوبون (Admin)
```
DELETE /api/v1/admin/coupon/:couponId
Auth: Required (Admin)

Response (200):
{
  "success": true,
  "message": "Coupon deleted successfully"
}
```

---

## Status Codes

| Code | المعنى | الوضع |
|------|--------|-------|
| 200 | نجاح | ✅ |
| 201 | تم الإنشاء | ✅ |
| 400 | خطأ في المدخلات | ❌ |
| 401 | لم يتم المصادقة | ❌ |
| 403 | لا توجد صلاحيات | ❌ |
| 404 | غير موجود | ❌ |
| 500 | خطأ في السيرفر | ❌ |

---

## Auth Headers

```javascript
// للعمليات المحمية (User):
Authorization: Bearer <JWT_TOKEN>

// للعمليات المحمية (Admin):
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

---

## Common Error Responses

### Invalid Product
```json
{
  "success": false,
  "message": "Product not found for item Samsung Galaxy"
}
```

### Insufficient Stock
```json
{
  "success": false,
  "message": "Insufficient stock for Samsung Galaxy"
}
```

### Invalid Coupon
```json
{
  "success": false,
  "message": "Invalid coupon code"
}
```

### Order Not Found
```json
{
  "success": false,
  "message": "No order found"
}
```

### Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized - Admin access required"
}
```

---

## Example: Complete Order Flow

### 1️⃣ Frontend: Validate Coupon
```javascript
const applyCoupon = async (code) => {
  const response = await axios.post('/api/v1/coupon/validate', {
    code: code,
    orderAmount: 550
  });
  return response.data.discountAmount; // 55
};
```

### 2️⃣ Frontend: Submit Order
```javascript
const confirmOrder = async () => {
  const response = await axios.post('/api/v1/new/order', {
    shippingInfo: {...},
    orderItems: [...],
    itemPrice: 500,
    shippingPrice: 50,
    totalPrice: 550,
    couponCode: 'SAVE10',
    idempotencyKey: 'uuid-...'
  });
  return response.data.order._id;
};
```

### 3️⃣ Backend: Processing
- ✅ Check idempotency key
- ✅ Validate coupon again
- ✅ Normalize items
- ✅ Reserve stock
- ✅ Create order
- ✅ Update coupon usage
- ✅ Send notifications

### 4️⃣ Frontend: Order Created
```javascript
navigate(`/order/${orderId}`);
```

### 5️⃣ Admin: Update Status
```javascript
const updateStatus = async (orderId) => {
  const response = await axios.put(`/api/v1/admin/order/${orderId}`, {
    status: 'Shipped',
    trackingNumber: 'DHL123456',
    trackingUrl: 'https://dhl.com/track/...',
    courier: 'DHL'
  });
};
```

### 6️⃣ Backend: Update + Notify
- ✅ Verify status transition
- ✅ Update order status
- ✅ Record audit trail
- ✅ Send notifications
- ✅ Respond with updated order

### 7️⃣ User: Receives Updates
- Email notification ✉️
- WhatsApp message 📱
- Real-time UI update 🎯

---

**Ready to test? Use Postman collection!**

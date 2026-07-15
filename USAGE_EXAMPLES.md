# 📖 أمثلة عملية - استخدام النظام المحسّن

## 1. 🛒 إنشاء طلب مع Idempotency

### Frontend - OrderConfirm.jsx
```javascript
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

function OrderConfirm() {
  const [idempotencyKey] = useState(() => uuidv4());
  
  const confirmOrder = async () => {
    const orderData = {
      shippingInfo: {...},
      orderItems: [...],
      itemPrice: 500,
      shippingPrice: 50,
      discountPrice: 0,
      totalPrice: 550,
      couponCode: "",
      idempotencyKey  // ✔️ مرسلة مع الطلب
    };

    const response = await dispatch(createOrder(orderData));
    
    if (response.isDuplicate) {
      // طلب مكرر - استخدام الطلب القديم
      navigate(`/order/${response.order._id}`);
    } else {
      // طلب جديد
      navigate(`/order/${response.order._id}`);
    }
  };
}
```

### Backend - Response
```json
{
  "success": true,
  "order": {...},
  "isDuplicate": false  // false = طلب جديد، true = تكرار
}
```

---

## 2. 💰 التحقق من الكوبون

### Frontend
```javascript
const applyCoupon = async () => {
  try {
    // ✔️ التحقق من Backend
    const { data } = await axios.post(`/api/v1/coupon/validate`, {
      code: "SAVE10",
      orderAmount: 550  // subtotal + shipping
    });
    
    // الخصم من Backend، لا نحسبه في Frontend
    setDiscount(data.discountAmount);  // مثلاً: 55 (10% من 550)
    toast.success("تم تطبيق الكوبون!");
  } catch (error) {
    // قد يرجع:
    // - "Invalid coupon code"
    // - "Coupon has expired"
    // - "Minimum order amount is 100"
    // - "Coupon usage limit exceeded"
    // - "You have already used this coupon"
    toast.error(error.response.data.message);
  }
};
```

### Backend - API Response
```json
{
  "success": true,
  "discountAmount": 55,
  "coupon": {
    "code": "SAVE10",
    "type": "percent",
    "value": 10
  }
}
```

### حالات الخطأ
```json
// الكوبون منتهي الصلاحية
{
  "success": false,
  "message": "Coupon has expired"
}

// الحد الأدنى للطلب لم يتحقق
{
  "success": false,
  "message": "Minimum order amount is 100"
}

// المستخدم استخدم الكوبون سابقاً
{
  "success": false,
  "message": "You have already used this coupon"
}

// الكوبون انتهى من الاستخدامات المسموحة
{
  "success": false,
  "message": "Coupon usage limit exceeded"
}
```

---

## 3. 📦 حجز المخزون

### سيناريو:
```
1. المتخزن الأولي: Samsung Galaxy = 10 أجهزة
2. المستخدم A ينشئ طلب: 3 أجهزة
   → المخزون = 7 (حجز فوري)
3. المستخدم B ينشئ طلب: 5 أجهزة
   → المخزون = 2 (حجز فوري)
4. المستخدم C ينشئ طلب: 3 أجهزة
   → خطأ: Insufficient stock!
```

### Database - مثال
```javascript
// قبل الطلب
{
  _id: "product_123",
  name: "Samsung Galaxy",
  stock: 10
}

// بعد إنشاء الطلب
{
  _id: "product_123",
  name: "Samsung Galaxy",
  stock: 7,  // تم تقليله فوراً
  reservedStock: 3  // معلومة إضافية للمراقبة
}
```

---

## 4. 🔄 إلغاء طلب وإرجاع المخزون

### API Request
```javascript
DELETE /api/v1/admin/orderDelete/:orderId

// يعمل فقط إذا كانت الحالة = "Pending"
```

### Backend Logic
```javascript
export const deleteOrder = HandleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  
  if (order.orderStatus !== "Pending") {
    // فقط الطلبات المعلقة يمكن حذفها
    return next(new HandelError("Can only delete pending orders", 400));
  }

  // إرجاع المخزون
  if (order.stockReserved) {
    await releaseStock(order.orderItems);
  }

  // حذف الطلب
  await Order.findByIdAndDelete(req.params.id);
});
```

---

## 5. 📊 عرض سجل الحالات مع من غيّر

### Database - مثال كامل
```javascript
{
  _id: "order_123",
  orderStatus: "Shipped",
  statusHistory: [
    {
      status: "Pending",
      note: "Order created",
      changedBy: null,
      changedByRole: "guest",
      createdAt: "2024-01-15T10:00:00Z"
    },
    {
      status: "Confirmed",
      note: "Order confirmed by store",
      changedBy: "admin_456",  // معرف الـ admin
      changedByRole: "admin",
      createdAt: "2024-01-15T11:30:00Z"
    },
    {
      status: "Processing",
      note: "Order is being prepared",
      changedBy: "admin_456",
      changedByRole: "admin",
      createdAt: "2024-01-15T14:00:00Z"
    },
    {
      status: "Shipped",
      note: "Custom note: Shipped via FedEx",
      changedBy: "admin_456",
      changedByRole: "admin",
      createdAt: "2024-01-16T09:00:00Z"
    }
  ]
}
```

### API Response - مع معلومات من غيّر
```javascript
GET /api/v1/order/order_123

{
  success: true,
  order: {
    _id: "order_123",
    orderStatus: "Shipped",
    statusHistory: [
      {
        status: "Pending",
        note: "Order created",
        changedBy: null,
        changedByRole: "guest"
      },
      {
        status: "Confirmed",
        note: "Order confirmed by store",
        changedBy: {
          _id: "admin_456",
          name: "أحمد علي",
          email: "ahmed@admin.com"
        },
        changedByRole: "admin"
      },
      // ... بقية السجل
    ]
  }
}
```

### Frontend - عرض
```jsx
{order.statusHistory.map((history) => (
  <div key={history.createdAt} className="history-item">
    <strong>{history.status}</strong>
    <p>{history.note}</p>
    <small>
      {history.changedBy 
        ? `تم بواسطة ${history.changedBy.name} في ${new Date(history.createdAt).toLocaleString()}`
        : `طلب أولي في ${new Date(history.createdAt).toLocaleString()}`
      }
    </small>
  </div>
))}
```

---

## 6. 🎟️ إدارة الكوبونات - Admin Panel

### إنشاء كوبون بحماية
```javascript
POST /api/v1/admin/coupons

{
  "code": "SAVE10",
  "type": "percent",        // percent أو fixed
  "value": 10,              // النسبة أو القيمة
  "minOrderAmount": 100,    // الحد الأدنى للطلب
  "maxDiscount": 50,        // أقصى خصم (للـ percent فقط)
  "usageLimit": 100,        // عدد الاستخدامات المسموح
  "expiresAt": "2024-12-31T23:59:59Z",
  "isActive": true
}
```

### عرض الكوبونات مع الإحصائيات
```javascript
GET /api/v1/admin/coupons

{
  success: true,
  coupons: [
    {
      code: "SAVE10",
      type: "percent",
      value: 10,
      minOrderAmount: 100,
      maxDiscount: 50,
      usageLimit: 100,
      usedCount: 35,        // استخدم 35 مرة من 100
      remaining: 65,        // متبقي 65 مرة
      expiresAt: "2024-12-31T23:59:59Z",
      isActive: true,
      usedBy: [
        {
          userId: "user_123",
          orderId: "order_123",
          usedAt: "2024-01-15T10:00:00Z"
        },
        // ...
      ]
    }
  ]
}
```

---

## 7. ⚠️ معالجة الأخطاء - شاملة

### سيناريو: إنشاء طلب مع أخطاء جزئية

```javascript
// Response = الطلب نجح رغم الأخطاء الجزئية
{
  success: true,
  order: {
    _id: "order_123",
    orderStatus: "Pending",
    stockReserved: false,     // فشل الحجز لكن الطلب نجح
    notifications: [
      {
        channel: "email",
        type: "order_created",
        status: "sent",
        recipient: "customer@mail.com",
        error: null,
        sentAt: "2024-01-15T10:00:00Z"
      },
      {
        channel: "whatsapp",
        type: "order_created",
        status: "failed",      // فشل الإرسال
        recipient: "216123456789",
        error: "WhatsApp provider not configured",
        sentAt: "2024-01-15T10:00:01Z"
      },
      {
        channel: "system",
        type: "stock_reservation",
        status: "failed",      // فشل الحجز
        error: "Insufficient stock",
        sentAt: "2024-01-15T10:00:02Z"
      }
    ]
  },
  message: "Order created successfully"  // ✔️ نجح رغم الأخطاء
}
```

### Admin View - السجلات
```javascript
// في لوحة التحكم، يرى Admin:
الطلب #123:
- الحالة: ✔️ نجح
- حجز المخزون: ⚠️ فشل - تنبيه يدوي مطلوب
- البريد الإلكتروني: ✔️ نجح
- WhatsApp: ❌ فشل - تكوين مفقود
```

---

## 8. 🔐 أمان الأسعار

### Frontend - ما قد يحاول المستخدم
```javascript
// قد يفتح Developer Console ويعدل:
const fraudData = {
  itemPrice: 1000,          // في الأصل: 500
  shippingPrice: 0,         // في الأصل: 50
  discountPrice: 1000,      // في الأصل: 0
  totalPrice: 1               // سعر مقلوب!
};
```

### Backend - الحماية
```javascript
// سنتجاهل قيم Frontend تماماً

// نحسب من جديد:
const normalizedItems = await normalizeOrderItems(orderItems);
// السعر من قاعدة البيانات الفعلي

const computedShippingPrice = await calculateShippingFromSettings(...);
// الشحن من إعدادات الموقع

const { discountAmount, coupon } = await validateAndCalculateDiscount(...);
// الكوبون من قاعدة البيانات

// السعر النهائي الصحيح
const computedTotal = computedPrice + computedShipping - discountAmount;
```

### النتيجة
```
المحاولة الاحتيالية ❌ محمية
السعر المحفوظ = السعر الصحيح ✔️
```

---

## 9. 🚀 منع الطلبات المكررة - عملياً

### Scenario
```javascript
// الثانية 1: المستخدم يضغط الزر
confirmOrder();
// isSubmitting = true → الزر معطل

// الثانية 1.5: المستخدم يضغط مرة أخرى بسرعة
confirmOrder();
// يتم التحقق: if (isSubmitting || loading) return;
// لا يتم الإرسال

// الثانية 3: الطلب وصل للـ Backend
// idempotencyKey تحقق:
// - هل موجود مع نفس المفتاح؟
// - لا → إنشاء طلب جديد
// - نعم → رجوع الطلب القديم

// الثانية 4: الرد يصل للـ Frontend
setIsSubmitting(false);
// navigate(/order/123)
// الزر معاود تفعيل
```

---

## 10. 📱 Integration مع Apps أخرى

### Webhook من شركة الشحن
```javascript
// شركة DHL ترسل تحديث
POST /api/v1/webhooks/tracking

{
  "orderId": "order_123",
  "trackingNumber": "123456789",
  "status": "out_for_delivery",
  "location": "Tunis",
  "timestamp": "2024-01-16T14:30:00Z"
}

// Backend:
// 1. تحديث الطلب
// 2. تحديث حالة الشحن
// 3. إرسال إشعار للعميل
```

---

**اختبر هذه الأمثلة مع Postman أو cURL!**

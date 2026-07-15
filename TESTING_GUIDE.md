# 🧪 Testing & Migration Guide

## قبل النشر إلى الإنتاج

### 1. 🔍 فحص البيانات الموجودة

```javascript
// تشغيل بعد تحديث Models في MongoDB

// 1. إضافة الحقول الجديدة للطلبات الموجودة
db.orders.updateMany({}, {
  $set: {
    stockReserved: false,
    stockReservedAt: null,
    couponValidatedAt: null
  }
}, { multi: true });

// 2. إضافة الحقول الجديدة للكوبونات
db.coupons.updateMany({}, {
  $set: {
    usageLimit: null,
    usedCount: 0,
    maxDiscount: null,
    usedBy: []
  }
}, { multi: true });

// 3. التحقق من النتائج
db.orders.findOne({});
db.coupons.findOne({});
```

---

## 🧪 Test Cases

### Test 1: Idempotency Key
```javascript
// ✅ يجب أن يعيد نفس الطلب عند الإرسال المتكرر

const idempotencyKey = "test-uuid-1234";
const orderData = {...};

// الطلب الأول
POST /api/v1/new/order
Body: {...orderData, idempotencyKey}
Response: 201 {order: {...}, isDuplicate: false}

// الطلب الثاني (نفس المفتاح)
POST /api/v1/new/order
Body: {...orderData, idempotencyKey}
Response: 200 {order: {...}, isDuplicate: true}

// يجب أن تكون order._id نفسها في كلا الحالتين
```

---

### Test 2: Stock Reservation
```javascript
// ✅ يجب أن يتم حجز المخزون فوراً

// قبل
GET /api/v1/product/samsung-galaxy
Response: {stock: 10}

// إنشاء طلب (2 وحدة)
POST /api/v1/new/order
Body: {orderItems: [{product: "samsung-galaxy", quantity: 2}]}
Response: {order: {stockReserved: true}}

// بعد
GET /api/v1/product/samsung-galaxy
Response: {stock: 8}  // ✅ انخفض فوراً
```

---

### Test 3: Coupon Validation
```javascript
// ✅ التحقق الشامل من الكوبون

// السيناريو 1: كوبون صحيح
POST /api/v1/coupon/validate
Body: {code: "SAVE10", orderAmount: 500}
Response: 200 {discountAmount: 50, coupon: {...}}

// السيناريو 2: كوبون منتهي الصلاحية
POST /api/v1/coupon/validate
Body: {code: "EXPIRED", orderAmount: 500}
Response: 400 {message: "Coupon has expired"}

// السيناريو 3: المستخدم استخدمه سابقاً
POST /api/v1/coupon/validate
Body: {code: "ONCE_ONLY", orderAmount: 500}
Response: 400 {message: "You have already used this coupon"}

// السيناريو 4: تجاوز الحد الأدنى
POST /api/v1/coupon/validate
Body: {code: "MIN_100", orderAmount: 50}
Response: 400 {message: "Minimum order amount is 100"}

// السيناريو 5: انتهاء الاستخدامات
POST /api/v1/coupon/validate
Body: {code: "LIMITED_50", orderAmount: 500}
Response: 400 {message: "Coupon usage limit exceeded"}
```

---

### Test 4: Audit Trail
```javascript
// ✅ يجب تسجيل من غيّر الحالة

// Admin يحدّث حالة الطلب
PUT /api/v1/admin/order/order-123
Body: {status: "Confirmed"}
Auth: admin token

// التحقق
GET /api/v1/order/order-123
Response:
{
  statusHistory: [
    {
      status: "Pending",
      changedBy: null,
      changedByRole: "guest"
    },
    {
      status: "Confirmed",
      changedBy: {name: "Admin Name"},  // ✅ معرف الـ admin
      changedByRole: "admin"
    }
  ]
}
```

---

### Test 5: Double Submit Prevention
```javascript
// ✅ الزر يجب أن يكون معطل أثناء المعالجة

// في Frontend - افتح Developer Console

// قبل: button disabled = false
confirmOrder();
// أثناء: button disabled = true
// بعد: button disabled = false

// حاول الضغط مرة أخرى أثناء المعالجة
// يجب أن يتم التجاهل (لا يرسل request جديد)
```

---

### Test 6: Stock Release on Cancellation
```javascript
// ✅ يجب إرجاع المخزون عند الإلغاء

// المخزون الحالي: 8
DELETE /api/v1/admin/orderDelete/order-123
Auth: admin token

// المخزون بعد الحذف: 10 (تم إرجاع 2)
GET /api/v1/product/samsung-galaxy
Response: {stock: 10}
```

---

### Test 7: Price Manipulation Protection
```javascript
// ✅ لا يمكن تعديل السعر من Frontend

// محاولة احتيالية:
POST /api/v1/new/order
Body: {
  itemPrice: 500,           // من الحقيقي
  sentPrice: 1,            // مزيف!
  totalPrice: 1            // مزيف!
}

// في Database:
// يتم استخدام:
// itemPrice: 500           // ✅ محسوب من Product
// shippingPrice: 50       // ✅ من Settings
// totalPrice: 550         // ✅ محسوب من Backend
```

---

## 📋 اختبار في Postman

### Import Collection
```json
{
  "info": {
    "name": "Order System Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Order",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/v1/new/order",
        "body": {
          "mode": "raw",
          "raw": "{...}"
        }
      }
    },
    {
      "name": "Validate Coupon",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/v1/coupon/validate",
        "body": {
          "mode": "raw",
          "raw": "{...}"
        }
      }
    }
  ]
}
```

---

## ✅ Checklist قبل النشر

- [ ] تحديث Models في MongoDB
- [ ] اختبار Idempotency
- [ ] اختبار حجز المخزون
- [ ] اختبار التحقق من الكوبونات
- [ ] اختبار Audit Trail
- [ ] اختبار منع الضغط المتكرر
- [ ] اختبار إرجاع المخزون
- [ ] اختبار حماية الأسعار
- [ ] فحص السجلات (logs)
- [ ] اختبار الإشعارات
- [ ] اختبار معالجة الأخطاء
- [ ] التوثيق والتدريب

---

## 🐛 استكشاف الأخطاء

### الطلب لم يُحفظ رغم الاستجابة الناجحة
```
السبب: فشل في saveBeforeSave
الحل: تفعيل validateBeforeSave: false في البيانات الأساسية
```

### المخزون لم ينخفض
```
السبب: faiiled stock reservation (catch معالجة الخطأ)
الحل: تحقق من logs للخطأ المحدد
```

### الكوبون لم يُتحقق
```
السبب: Coupon collection غير موجود
الحل: تأكد من Migration تم تطبيقها
```

### الزر يزال قابل للضغط أثناء المعالجة
```
السبب: isSubmitting state لم يُحدّث
الحل: تحقق من React render
```

---

## 🔄 Rollback إذا حدثت مشكلة

### Scenario: تعطّل جزئي

```javascript
// 1. إيقاف الطلبات الجديدة
db.orders.deleteMany({createdAt: {$gt: ISODate("2024-01-15T10:00:00Z")}});

// 2. إرجاع الكوبونات
db.coupons.updateMany({}, {$set: {usedCount: 0, usedBy: []}});

// 3. إرجاع المخزون
// تشغيل script محاسبة للمخزون
db.products.updateMany({}, function() {
  this.stock = calculateTotalStock(this.variants);
});

// 4. Restart Backend
npm restart
```

---

## 📊 Monitoring

### Log Patterns للبحث عن مشاكل

```bash
# أخطاء المخزون
grep "\[ORDER_CREATE\] Stock reservation failed" logs.txt

# فشل الإشعارات
grep "\[ORDER_CREATE\] Notification failed" logs.txt

# طلبات مكررة
grep "isDuplicate: true" logs.txt

# أخطاء الكوبون
grep "Coupon validation failed" logs.txt
```

---

## 📈 Performance Tips

1. **Index Optimization**
```javascript
// إضافة indexes للـ fast queries
db.orders.createIndex({idempotencyKey: 1}, {unique: true});
db.orders.createIndex({user: 1, createdAt: -1});
db.coupons.createIndex({code: 1, isActive: 1});
db.coupons.createIndex({usedBy.userId: 1});
```

2. **Pagination for Large Datasets**
```javascript
// عند استرجاع Orders - أضف pagination
GET /api/v1/admin/orders?page=1&limit=20
```

3. **Caching**
```javascript
// كاش الكوبونات النشطة
cache.set('active_coupons', coupons, 3600);
```

---

## 🚀 Deployment Checklist

- [ ] تحديث Environment Variables
- [ ] تشغيل Migration Scripts
- [ ] اختبار في Staging
- [ ] Backup قاعدة البيانات
- [ ] تحديث Documentation
- [ ] إشعار الفريق
- [ ] Monitor Logs بعد النشر
- [ ] مراقبة الأداء
- [ ] جهز Rollback Plan

---

**Happy Testing! 🎉**

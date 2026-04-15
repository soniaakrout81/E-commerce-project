import Order from "../models/OrderModel.js";
import Product from "../models/ProductModel.js";
import User from "../models/usersModel.js";
import HandelError from "../utils/handelError.js";
import HandleAsyncError from "../middleware/HandleAsyncError.js";


// craete new order
export const createNewOrder = HandleAsyncError(async (req, res, next) => {

    const { shippingInfo, orderItems, itemPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    const order = await Order.create({

        shippingInfo,
        orderItems,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        user: req.user._id


    });
    res.status(200).json({

        success: true,
        order

    });


});

// geting single order
export const getSingleOrder = HandleAsyncError(async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {

        return next(new HandelError("No order found", 404));

    };
    res.status(200).json({

        success: true,
        order

    });

});

// all my orders
export const allMyOrders = HandleAsyncError(async (req, res, next) => {

    const orders = await Order.find({ user: req.user._id });
    if (!orders) {

        return next(new HandelError("No order found", 404));

    };
    res.status(200).json({

        success: true,
        orders

    });

});

// getting all orders
export const getAllOrders = HandleAsyncError(async (req, res, next) => {

    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach(order => {

        totalAmount += order.totalPrice;

    });
    res.status(200).json({

        success: true,
        orders,
        totalAmount

    });

});

// update order status 
export const updateOrderStatus = HandleAsyncError(async (req, res, next) => {
    console.log("[ADMIN_ORDER_UPDATE] Incoming request", {
        orderId: req.params.id,
        nextStatus: req.body?.status,
        adminId: req.user?._id?.toString?.() || null,
        method: req.method,
        path: req.originalUrl
    });

    const order = await Order.findById(req.params.id);
    if (!order) {
        console.log("[ADMIN_ORDER_UPDATE] Order not found", {
            orderId: req.params.id
        });

        return next(new HandelError("No order found", 404));

    };

    const { status } = req.body;
    const allowedStatuses = ["Processing", "Delivered"];
    console.log("[ADMIN_ORDER_UPDATE] Current order snapshot", {
        orderId: order._id.toString(),
        currentStatus: order.orderStatus,
        nextStatus: status,
        itemsCount: order.orderItems.length
    });

    if (!status || !allowedStatuses.includes(status)) {
        console.log("[ADMIN_ORDER_UPDATE] Invalid status received", {
            orderId: order._id.toString(),
            receivedStatus: status,
            allowedStatuses
        });

        return next(new HandelError("Invalid order status", 400));

    };

    if (order.orderStatus === "Delivered") {
        console.log("[ADMIN_ORDER_UPDATE] Rejecting already delivered order", {
            orderId: order._id.toString(),
            currentStatus: order.orderStatus
        });

        return next(new HandelError("This order has already been delivered", 400));

    };

    if (order.orderStatus === status) {
        console.log("[ADMIN_ORDER_UPDATE] Status unchanged", {
            orderId: order._id.toString(),
            status
        });

        return next(new HandelError("Order status is already up to date", 400));

    };

    if (status === "Delivered") {
        console.log("[ADMIN_ORDER_UPDATE] Marking order as delivered and updating stock", {
            orderId: order._id.toString(),
            items: order.orderItems.map((item) => ({
                productId: item.product?.toString?.() || item.product,
                quantity: item.quantity
            }))
        });

        const stockUpdates = await Promise.all(order.orderItems.map(item => updateQuantity(item.product, item.quantity)));
        const missingProducts = stockUpdates
            .filter((result) => result && result.skipped)
            .map((result) => result.productId);

        if (missingProducts.length > 0) {
            console.warn("[ADMIN_ORDER_UPDATE] Some products were missing during delivery", {
                orderId: order._id.toString(),
                missingProducts
            });
        }
        order.deliveredAt = Date.now();

    };
    order.orderStatus = status;

    await order.save({ validateBeforeSave: false });
    console.log("[ADMIN_ORDER_UPDATE] Order updated successfully", {
        orderId: order._id.toString(),
        updatedStatus: order.orderStatus,
        deliveredAt: order.deliveredAt || null
    });
    res.status(200).json({

        success: true,
        order

    });

});


async function updateQuantity(id, quantity) {
    console.log("[ADMIN_ORDER_UPDATE] Updating product stock", {
        productId: id?.toString?.() || id,
        quantity
    });
    const product = await Product.findById(id);
    if (!product) {
        console.warn("[ADMIN_ORDER_UPDATE] Product not found while updating stock, skipping stock update", {
            productId: id?.toString?.() || id
        });
        return {
            productId: id?.toString?.() || id,
            skipped: true
        };
    }
    const previousStock = product.stock;
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
    console.log("[ADMIN_ORDER_UPDATE] Product stock updated", {
        productId: product._id.toString(),
        previousStock,
        newStock: product.stock
    });
    return {
        productId: product._id.toString(),
        skipped: false
    };
}


// delete order
export const deleteOrder = HandleAsyncError(async (req, res, next) => {

    const order = await Order.findById(req.params.id);
    if (!order) {

        return next(new HandelError("No order found", 404));

    };
    await Order.deleteOne({ _id: req.params.id });
    res.status(200).json({

        success: true,
        messgae: "Order deleted successfully"

    })

});

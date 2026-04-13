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

    const order = await Order.findById(req.params.id);
    if (!order) {

        return next(new HandelError("No order found", 404));

    };

    const { status } = req.body;
    const allowedStatuses = ["Processing", "Delivered"];

    if (!status || !allowedStatuses.includes(status)) {

        return next(new HandelError("Invalid order status", 400));

    };

    if (order.orderStatus === "Delivered") {

        return next(new HandelError("This order has already been delivered", 400));

    };

    if (order.orderStatus === status) {

        return next(new HandelError("Order status is already up to date", 400));

    };

    if (status === "Delivered") {

        await Promise.all(order.orderItems.map(item => updateQuantity(item.product, item.quantity)));
        order.deliveredAt = Date.now();

    };
    order.orderStatus = status;

    await order.save({ validateBeforeSave: false });
    res.status(200).json({

        success: true,
        order

    });

});


async function updateQuantity(id, quantity) {
    const product = await Product.findById(id);
    if (!product) {
        throw new HandelError("Product not found", 404);
    }
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
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

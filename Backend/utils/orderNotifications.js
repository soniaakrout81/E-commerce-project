import SiteSettings from "../models/SiteSettingsModel.js";
import { sendEmail } from "./sendEmail.js";

const WHATSAPP_API_URL = process.env.WHATSAPP_PHONE_NUMBER_ID
  ? `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`
  : "";

const withTimeout = async (promise, timeoutMs = 6000, timeoutMessage = "Notification timed out") =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    }),
  ]);

const buildOrderMessage = ({ type, order, customerName }) => {
  const baseSummary = `Order #${order._id} is now ${order.orderStatus}. Total: ${order.totalPrice}.`;

  switch (type) {
    case "order_created":
      return `Hello ${customerName}, your order #${order._id} has been received successfully. Current status: ${order.orderStatus}. Total: ${order.totalPrice}.`;
    case "status_updated":
      return `Hello ${customerName}, your order #${order._id} status changed to ${order.orderStatus}.${order.trackingNumber ? ` Tracking number: ${order.trackingNumber}.` : ""}${order.trackingUrl ? ` Track here: ${order.trackingUrl}` : ""}`;
    case "order_shipped":
      return `Hello ${customerName}, your order #${order._id} has been shipped.${order.trackingNumber ? ` Tracking number: ${order.trackingNumber}.` : ""}${order.trackingUrl ? ` Track here: ${order.trackingUrl}` : ""}`;
    default:
      return `Hello ${customerName}, ${baseSummary}`;
  }
};

const sendWhatsAppMessage = async ({ to, body }) => {
  if (!process.env.WHATSAPP_ACCESS_TOKEN || !WHATSAPP_API_URL || !to) {
    return { status: "skipped", recipient: to || "", error: "WhatsApp provider not configured" };
  }

  try {
    const response = await fetch(WHATSAPP_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { status: "failed", recipient: to, error: errorText || "WhatsApp request failed" };
    }

    return { status: "sent", recipient: to, error: "" };
  } catch (error) {
    return { status: "failed", recipient: to, error: error.message };
  }
};

export const sendOrderNotifications = async ({ order, user, type }) => {
  const settings = await SiteSettings.findOne();
  const customerName = user?.name || order?.shippingInfo?.fullName || "Customer";
  const customerEmail = user?.email || order?.shippingInfo?.email || "";
  const whatsappTarget = order?.shippingInfo?.phoneNumber || settings?.whatsappPhone || "";
  const message = buildOrderMessage({ type, order, customerName });
  const results = [];

  if (settings?.enableEmailNotifications && customerEmail) {
    try {
      await withTimeout(
        sendEmail({
          email: customerEmail,
          subject: `Order update - ${order._id}`,
          message,
        }),
        6000,
        "Email notification timed out"
      );

      results.push({
        channel: "email",
        type,
        status: "sent",
        recipient: customerEmail,
      });
    } catch (error) {
      results.push({
        channel: "email",
        type,
        status: "failed",
        recipient: customerEmail,
        error: error.message,
      });
    }
  } else {
    results.push({
      channel: "email",
      type,
      status: "skipped",
      recipient: customerEmail,
      error: "Email notifications disabled or recipient missing",
    });
  }

  if (settings?.enableWhatsAppNotifications) {
    const whatsappResult = await withTimeout(
      sendWhatsAppMessage({ to: whatsappTarget, body: message }),
      6000,
      "WhatsApp notification timed out"
    ).catch((error) => ({
      status: "failed",
      recipient: whatsappTarget,
      error: error.message,
    }));
    results.push({
      channel: "whatsapp",
      type,
      ...whatsappResult,
    });
  } else {
    results.push({
      channel: "whatsapp",
      type,
      status: "skipped",
      recipient: whatsappTarget,
      error: "WhatsApp notifications disabled",
    });
  }

  return results;
};

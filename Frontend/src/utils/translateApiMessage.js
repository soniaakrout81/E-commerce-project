import i18n from "../i18n";

const BACKEND_MESSAGE_MAP = {
  "Please sign in to add items to the cart.": "api.cart.signInRequired",
  "Failed to add item to cart. Please try again.": "api.cart.addFailed",
  "Failed to load products. Please try again.": "api.products.loadFailed",
  "Failed to load product details. Please try again.": "api.products.detailsFailed",
  "Failed to submit review. Please try again.": "api.products.reviewFailed",
  "Failed to fetch orders. Please try again.": "api.orders.fetchFailed",
  "Failed to create order. Please try again.": "api.orders.createFailed",
  "Failed to fetch order details. Please try again.": "api.orders.detailsFailed",
  "Registration failed. Please try again.": "api.user.registerFailed",
  "Login failed. Please check your credentials.": "api.user.loginInvalid",
  "Login failed. Please try again.": "api.user.loginFailed",
  "Failed to load profile. Please try again.": "api.user.loadProfileFailed",
  "Logout failed. Please try again.": "api.user.logoutFailed",
  "Failed to update profile. Please try again.": "api.user.updateProfileFailed",
  "Failed to update password. Please try again.": "api.user.updatePasswordFailed",
  "Failed to send reset email. Please try again.": "api.user.forgotPasswordFailed",
  "Failed to reset password. Please try again.": "api.user.resetPasswordFailed",
  "Error while fetching products.": "api.admin.fetchProductsFailed",
  "Error while fetching the product.": "api.admin.fetchProductFailed",
  "Error while creating the product.": "api.admin.createProductFailed",
  "Error while updating the product.": "api.admin.updateProductFailed",
  "Error while deleting the product.": "api.admin.deleteProductFailed",
  "Error while fetching users.": "api.admin.fetchUsersFailed",
  "Error while fetching user.": "api.admin.fetchUserFailed",
  "Error while updating user role.": "api.admin.updateUserRoleFailed",
  "Error while fetching orders.": "api.admin.deleteUserFailed",
  "Error while deleting the user.": "api.admin.fetchOrdersFailed",
  "Error while updating order status.": "api.admin.updateOrderStatusFailed",
  "Error while deleting the order.": "api.admin.deleteOrderFailed",
  "Failed to fetch reviews.": "api.admin.fetchReviewsFailed",
  "Failed to delete review.": "api.admin.deleteReviewFailed",
  "Failed to delete product review.": "api.admin.deleteReviewFailed",
  "Email or Password cannot be empty": "api.backend.emailPasswordRequired",
  "Invalid email or password": "api.backend.invalidCredentials",
  "Successfully Logged out": "api.backend.logoutSuccess",
  "User doesn't exist": "api.backend.userNotFound",
  "Could not save reset token , Please try again later": "api.backend.resetTokenFailed",
  "Email could not be sent, Please try again later": "api.backend.emailSendFailed",
  "Reset Password token is invalid or has been expired": "api.backend.resetTokenInvalid",
  "Password doesn't match": "api.backend.passwordMismatch",
  "Old password is incorrect": "api.backend.oldPasswordIncorrect",
  "Failed to upload avatar": "api.backend.avatarUploadFailed",
  "Profile Updated successfully": "api.backend.profileUpdated",
  "User not found": "api.backend.userNotFoundGeneric",
  "You cannot change your own role!": "api.backend.cannotChangeOwnRole",
  "Unauthorized": "api.backend.unauthorized",
  "You cannot delete yourself!": "api.backend.cannotDeleteSelf",
  "Images are required": "api.backend.imagesRequired",
  "This page doesn't exist": "api.backend.pageNotFound",
  "Product not found": "api.backend.productNotFound",
  "The product has been successfully updated": "api.backend.productUpdated",
  "the product has seccessfully deleted": "api.backend.productDeleted",
  "Please provide all review fields": "api.backend.reviewFieldsRequired",
  "Review updated successfully": "api.backend.reviewUpdated",
  "Review added successfully": "api.backend.reviewAdded",
  "Review not found": "api.backend.reviewNotFound",
  "Review deleted successfully": "api.backend.reviewDeleted"
};

export function tMessage(key, options) {
  return i18n.t(key, options);
}

export function resolveApiMessage(error, fallbackKey, options) {
  const backendMessage =
    error?.response?.data?.message ||
    error?.response?.data?.messgae ||
    error?.message ||
    error?.payload?.message;

  if (backendMessage && BACKEND_MESSAGE_MAP[backendMessage]) {
    return i18n.t(BACKEND_MESSAGE_MAP[backendMessage], options);
  }

  if (fallbackKey) {
    return i18n.t(fallbackKey, options);
  }

  return i18n.t("common.somethingWrong");
}

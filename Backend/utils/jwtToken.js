export const sendToken = (user, statusCode, res) => {

    const token = user.getJWTToken();

    const cookieExpireDays = Number(process.env.EXPIRE_COOKIE) || 7;
    const isProduction = process.env.NODE_ENV === "production";

    const options = {
        expires: new Date(
            Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
    };

    res.status(statusCode)
      .cookie("token", token, options)
      .json({
          success: true,
          user,
          token,
      });
};

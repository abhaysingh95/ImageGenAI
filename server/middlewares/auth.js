import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, Login again" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      // ✅ store safely on req, not req.body
      req.userId = tokenDecode.id;
      return next(); // ✅ only call once
    } else {
      return res.status(401).json({ success: false, message: "Not authorized, Login again" });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default userAuth;

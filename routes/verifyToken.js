import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SEC, async (err, info) => {
      if (err) res.status(401).json('Token is not valid');
      const user = await User.findById(info.id);
      const { password, ...others } = user._doc;
      req.user = others;
      next();
    });
  } else {
    return res.status(401).json('You are not authenticated');
  }
};
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (
      JSON.stringify(req.user._id) === JSON.stringify(req.params.id) ||
      req.user.isAdmin
    ) {
      next();
    } else {
      res.status(403).json('You are not allowed to do that!');
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json('You are not allowed to do that!');
    }
  });
};

export { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };

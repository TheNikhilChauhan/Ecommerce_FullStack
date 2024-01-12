import { isValidObjectId } from "mongoose";

function checkId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    throw new ErrorHandler(`Invalid Object of: ${req.params.id}`, 404);
  }
  next();
}

export default checkId;

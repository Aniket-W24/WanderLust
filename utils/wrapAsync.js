//wrapAsync function to handle async erros
module.exports = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
};

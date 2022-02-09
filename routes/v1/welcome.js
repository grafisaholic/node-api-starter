function Welcome() {
  this.index = (req,res, next) => {
    return res.status(200).json({
      status: 200,
      message: 'Welcome backend api starter, nice to meet you !'
    });
  };
};

module.exports = Welcome;
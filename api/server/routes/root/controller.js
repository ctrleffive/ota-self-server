module.exports = (deps) => {
  return {
    root (req, res) {
      res.status(200).json({
        success: true,
        message: 'api working'
      })
    }
  }
}

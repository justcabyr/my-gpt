export const chatController = async (req, res) => {
  const { prompt } = req.body
  res.status(200).json({ prompt })
}
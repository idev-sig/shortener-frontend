import { Request, Response } from 'express';

const shortenList = async (req: Request, res: Response) => {
  const { url } = req.body;
  const shortUrl = `http://localhost:3000/${url}`;
  res.status(200).json({ shortUrl });
}

export default {
  'GET /api/shorteners': shortenList,
}

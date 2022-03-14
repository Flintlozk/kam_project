import type { NextApiRequest, NextApiResponse } from 'next';

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    console.log(req.body.message);
    res.status(200).json({ name: 'John Doe1' });
  } else {
    console.log(req.query.message);
    res.status(200).json({ name: 'John Doe2' });
  }
};

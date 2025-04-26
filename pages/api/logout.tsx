import { NextApiRequest, NextApiResponse } from 'next';

export default function logout(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.setHeader('Set-Cookie', 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');
    return res.status(200).json({ message: 'Logged out' });
  }

  return res.status(405).end(); // Method Not Allowed
}

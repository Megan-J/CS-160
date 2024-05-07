import type { NextApiRequest, NextApiResponse } from 'next';

type ApiRequest = {
    reportType: string;
    description: string;
    identifier: string;
};

type ApiResponse = {
    message: string;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    if(req.method === 'POST') {
        const { reportType, description, identifier }: ApiRequest = req.body;

        console.log('Received report:', { reportType, description, identifier });

        res.status(200).json({ message: 'Report received successfully' });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
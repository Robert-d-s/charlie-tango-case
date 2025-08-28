/**
 * Next.js API route support: https://nextjs.org/docs/api-routes/introduction
 * @param req {import('next').NextApiRequest}
 * @param res {import('next').NextApiResponse}
 */

export default async function handler(req, res) {
  // Mock response for demo purposes - simulates successful submission
  console.log("Received seller data:", req.body);
  
  // Simulate successful database insertion
  const mockResponse = {
    id: Math.random().toString(36).substr(2, 9),
    ...req.body,
    created_at: new Date().toISOString(),
    status: "submitted"
  };
  
  console.log("Mock response:", mockResponse);
  
  return res.status(200).json({ 
    success: true,
    data: mockResponse,
    message: "Seller information submitted successfully (demo mode)"
  });
}

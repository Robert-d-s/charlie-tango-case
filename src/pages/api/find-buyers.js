import { generateBuyerProfiles } from "@/data/buyerProfiles";

/**
 * Next.js API route support: https://nextjs.org/docs/api-routes/introduction
 * @param req {import('next').NextApiRequest}
 * @param res {import('next').NextApiResponse}
 */
export default function handler(req, res) {
  try {
    console.log("API called with query:", req.query);

    // Find the zip code from the query parameters, and use it to generate a list of (fake) buyer profiles.
    const zipCode = parseInt(req.query.zipCode || "2100");
    const price = parseInt(req.query.price || "3000000");
    const size = parseInt(req.query.size || "67");
    const estateType = req.query.estateType || "1";

    console.log("Parsed values:", { zipCode, price, size, estateType });

    const profilesForZipCode = generateBuyerProfiles({
      zipCode,
      price,
      size,
      estateType,
      minResults: 3,  // Always show at least 3 buyers for demo
      maxResults: 15, // Cap at 15 for better UX
    });

    console.log("Generated profiles count:", profilesForZipCode.length);

    // Set the cache headers, so that the response can be cached
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");

    // Make sure to filter out profiles based on the other query parameters. e.g. minSize, maxPrice, etc.
    return res.status(200).json(profilesForZipCode);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}

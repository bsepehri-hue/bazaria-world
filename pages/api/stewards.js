import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "data", "stewards.json");

  // Ensure file exists
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }

  const raw = fs.readFileSync(filePath, "utf8");
  let stewards = raw ? JSON.parse(raw) : [];

  if (req.method === "GET") {
    // Return all stewards
    return res.status(200).json(stewards);
  }

  if (req.method === "POST") {
    // Add new steward
    const newSteward = {
      ...req.body,
      createdAt: new Date().toISOString(),
      referrals: 0,
    };

    stewards.push(newSteward);
    fs.writeFileSync(filePath, JSON.stringify(stewards, null, 2));

    return res.status(200).json({ message: "Steward added to the scroll." });
  }

  if (req.method === "PATCH") {
    // Update referral count
    const { store_name, increment = 1 } = req.body;

    const idx = stewards.findIndex((s) => s.store_name === store_name);
    if (idx === -1) {
      return res.status(404).json({ message: "Steward not found." });
    }

    stewards[idx].referrals = (stewards[idx].referrals || 0) + increment;
    fs.writeFileSync(filePath, JSON.stringify(stewards, null, 2));

    return res.status(200).json({
      message: "Referral count updated.",
      steward: stewards[idx],
    });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
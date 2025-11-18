
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/lookup", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    const url = "https://login.yahoo.com/account/challenge/username?done=https%3A%2F%2Fwww.yahoo.com%2F&authMechanism=secondary&chllngnm=fail&sessionIndex=Qg--";
    const response = await axios.post(
      url,
      `username=${encodeURIComponent(email)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0",
        },
      }
    );

    const body = response.data;
    const phoneMatch = body.match(/"maskedPhone":"([^"]+)"/);
    const emailMatch = body.match(/"maskedEmail":"([^"]+)"/);

    const maskedPhone = phoneMatch ? phoneMatch[1] : null;
    const maskedEmail = emailMatch ? emailMatch[1] : null;

    return res.json({ ok: true, maskedPhone, maskedEmail });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "Lookup failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Yahoo backend running on ${PORT}`));

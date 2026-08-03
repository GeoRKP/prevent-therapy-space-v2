// Εφάπαξ εγγραφή του φυσικοθεραπευτή στο Google Calendar.
// Τρέχει ΜΙΑ φορά τοπικά:  npm run google:setup
//
// Προαπαιτούμενα (μία φορά, στο https://console.cloud.google.com):
//   1. Δημιουργία project και ενεργοποίηση του "Google Calendar API".
//   2. OAuth consent screen (External, δικός σου λογαριασμός ως test user αρκεί).
//   3. Credentials → OAuth client ID → τύπος "Web application",
//      με authorized redirect URI: http://127.0.0.1:53682/callback
//   4. Βάλε GOOGLE_CLIENT_ID και GOOGLE_CLIENT_SECRET στο .env.local
//
// Το script ανοίγει τη σελίδα συγκατάθεσης, παίρνει refresh token και το
// γράφει αυτόματα στο .env.local. Δεν χρειάζεται να ξανατρέξει ποτέ,
// εκτός αν ανακληθεί η πρόσβαση.

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";

const PORT = 53682;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.freebusy",
].join(" ");

const ENV_PATH = path.join(process.cwd(), ".env.local");

// Απλό διάβασμα .env.local (χωρίς dotenv dependency)
function loadEnvLocal() {
  if (!fs.existsSync(ENV_PATH)) return {};
  const out = {};
  for (const line of fs.readFileSync(ENV_PATH, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

function upsertEnvLocal(key, value) {
  let content = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, "utf8") : "";
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, "m");
  content = re.test(content)
    ? content.replace(re, line)
    : content + (content.endsWith("\n") || content === "" ? "" : "\n") + line + "\n";
  fs.writeFileSync(ENV_PATH, content);
}

const env = { ...loadEnvLocal(), ...process.env };
const clientId = env.GOOGLE_CLIENT_ID;
const clientSecret = env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error(
    "❌ Λείπουν τα GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET από το .env.local.\n" +
      "   Δες τις οδηγίες στην κορυφή αυτού του αρχείου."
  );
  process.exit(1);
}

const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    prompt: "consent",
  });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }

  const code = url.searchParams.get("code");
  if (!code) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Δεν βρέθηκε κωδικός εξουσιοδότησης.");
    return;
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokenRes.ok || !tokens.refresh_token) {
      throw new Error(JSON.stringify(tokens));
    }

    upsertEnvLocal("GOOGLE_REFRESH_TOKEN", tokens.refresh_token);

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      "<body style='font-family:sans-serif;padding:3rem;text-align:center'>" +
        "<h2>✅ Η σύνδεση ολοκληρώθηκε</h2>" +
        "<p>Το refresh token αποθηκεύτηκε στο .env.local. Μπορείτε να κλείσετε αυτή τη σελίδα.</p></body>"
    );

    console.log("\n✅ Το GOOGLE_REFRESH_TOKEN γράφτηκε στο .env.local.");
    console.log(
      "   Σε production (π.χ. Vercel) πρόσθεσε το ίδιο token στα environment variables.\n"
    );
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Σφάλμα κατά την ανταλλαγή token. Δες το τερματικό.");
    console.error("❌ Αποτυχία:", err.message);
  } finally {
    server.close();
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("\n🔗 Άνοιξε τον παρακάτω σύνδεσμο και συνδέσου με τον λογαριασμό Google του ιατρείου:\n");
  console.log(authUrl + "\n");
  // Προσπάθεια αυτόματου ανοίγματος του browser (Windows / macOS / Linux)
  const opener =
    process.platform === "win32"
      ? `start "" "${authUrl}"`
      : process.platform === "darwin"
        ? `open "${authUrl}"`
        : `xdg-open "${authUrl}"`;
  exec(opener, () => {});
});

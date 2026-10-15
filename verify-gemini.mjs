import fs from 'node:fs';

const env = fs.readFileSync('.env.local', 'utf8');
const key = env.match(/^GEMINI_API_KEY\s*=\s*["']?([^\r\n"']+)/m)?.[1]?.trim();
if (!key || key === 'MY_GEMINI_API_KEY') throw new Error('No usable Gemini key is configured.');

const imageUrl = 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80';
const imageResponse = await fetch(imageUrl);
if (!imageResponse.ok) throw new Error(`Sample image fetch failed: HTTP ${imageResponse.status}`);
const mimeType = imageResponse.headers.get('content-type')?.split(';')[0] || 'image/jpeg';
const imageBase64 = Buffer.from(await imageResponse.arrayBuffer()).toString('base64');

const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
  body: JSON.stringify({
    contents: [{ parts: [
      { text: 'Identify the main visible object in the image. Reply with concise JSON containing itemName and wasteCategory chosen from wet_organic, dry_recyclable, hazardous, e_waste, sanitary_residual.' },
      { inline_data: { mime_type: mimeType, data: imageBase64 } },
    ] }],
    generationConfig: { responseMimeType: 'application/json' },
  }),
});

const body = await response.json().catch(() => ({}));
if (!response.ok) throw new Error(`Gemini API returned HTTP ${response.status}: ${body?.error?.message || 'no error details'}`);
const answer = body?.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
if (!answer) throw new Error('Gemini returned no identification text.');
console.log(JSON.stringify({ status: response.status, imageMimeType: mimeType, identification: answer }, null, 2));



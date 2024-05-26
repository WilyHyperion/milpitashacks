import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});
export default async function handler(req, res) {
  let body = req.body;
  if (body === undefined) {
    res.status(400).send("No body");
    return;
  }
  let subject = body.subject;

  let unit = body.unit;
  console.log(frq);
  res.status(200).send(guide);
}
async function generateGuide(word) {
  let othertp = "";
  if (other != "") {
    othertp = other.map((x) => x.question).join(";");
  }
  let r = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: body.temp || 0.1, 
    messages: [
      {
        role: "system",
        content: `Give 5 relevant vocabulary terms along with a very short definition for `{word} '
        . Seperate the term and the respective definition with a hyphen, and at the end of the definition, add a period. Do not include any additional text.',
      },
    ],
  });
}
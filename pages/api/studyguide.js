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
  let subject = body.word;
  console.log(subject);
  let r = await generateGuide(subject);
  console.log(r);
  let object = r.split(';');
  let i = 0;
  for(let o of object){
    console.log(typeof(o));
    object[i] = o.split('+');
    i++;
  }
  console.log(object);
  res.status(200).send(JSON.stringify(object));
}
async function generateGuide(word) {
  
  let r = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature:  0.5, 
    messages: [
      {
        role: "system",
        content: `Give 5 relevant vocabulary terms along with a very short definition for"${word}" 
        . Seperate the term and the respective definition with a plus sign(+), and at the end of the definition, add a semicolon. Do not include any additional text or characters`,
      },
    ],
  });
  return r.choices[0].message.content;
}
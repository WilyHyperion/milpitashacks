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
  let frq = await generateFRQQuestion(subject, unit, body.other, body.temp);
  console.log(frq);
  res.status(200).send(frq);
}
async function generateFRQQuestion(subject, unit, other, temp) {
  let othertp = "";
  if (other != "") {
    othertp = other.map((x) => x.question).join(";");
  }
  let r = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: temp/10.0 || 0.1, 
    messages: [
      {
        role: "system",
        content: `Do not repeat any of the information in these questions   : ${othertp}`,
      },
      {
        role: "system",
        content: `Write a free response question for ${subject} unit ${unit}.`,
      },
      {
        role: "user",
        content: "Create a free response question for a test on " + unit + ".",
      },
      { role: "system", content: "The free response question is: " },
    ],
  });
  let answerkey = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: temp/10.0 || 0.1,
    messages: [
      {
        role: "system",
        content: `Write a Rubric for the free response question: ${r.choices[0].message.content}. Mention terms relavent to the prompt that should be included in the answer.`,
      },
      {
        role: "user",
        content:
          "Create a Rubric for the question " + r.choices[0].message.content,
      },
      { role: "system", content: "The rubric is:" },
    ],
  });
  return {
    question: r.choices[0].message.content.split(";")[0],
    rubric: answerkey.choices[0].message.content,
  };
}

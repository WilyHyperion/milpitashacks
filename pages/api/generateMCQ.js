import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});
/*
  {
  subject: 'testing',
  unit: 'testing',
  other: [ { question: 'What is the capital of France?' } ],
  nummc: 4
} 
  */
export default async function handler(req, res) {
  let body = req.body;
  if (body === undefined) {
    res.status(400).send("No body");
    return;
  }
  if (body.other === undefined) {
    body.other = [];
  }
  console.log(body);
  res
    .status(200)
    .send(
      await generateMCQuestion(body.subject, body.unit, body.other, body.nummc, body.temp)
    );
}

async function generateMCQuestion(subject, unit, other, choices, temp) {
  let othertp = "";
  if (other != "") {
    othertp = other.map((x) => x.question).join(";");
  }
  console.log(othertp);
  let r = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: temp/10.0 || 0.1,
    messages: [
      {
        role: "system",
        content: `Do not repeat any of the information covered in these questions: ${othertp}`,
      },
      {
        role: "system",
        content: `Write a multiple choice question for ${subject} unit ${unit}, with ${choices} choices. Seperate the question and each choice with a semi-colon(;). For example, "What is 2+2?;4;2;3;1. Always put the first answer first"`,
      },
      {
        role: "user",
        content:
          "Create a multiple choice question for a test on " + unit + ".",
      },
      {
        role: "system",
        content: `The multiple choice question and ${choices} answers are: `,
      },
    ],
  });
  let s = r.choices[0].message.content.split(";");
  return {
    question: s[0],
    choices: s.slice(1),
  };
}

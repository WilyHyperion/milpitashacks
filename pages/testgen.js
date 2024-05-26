import Header from "@/components/header";
import Question from "@/components/question";
import Image from "next/image";
import { useState } from "react";
import jsPDF from "jspdf";
const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
export default function Testgen() {
  const [removed, setRemoved] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [mcOptions, setMCOptions] = useState(4);
  const [versions, setVersions] = useState(1);
  const [Subject, SetSubject] = useState("World History");
  const [Unit, SetUnit] = useState("The French Revolution");
  const [temp, setTemp] = useState(0.5);
  async function getFRQ() {
    return await fetch("/api/createfrq", {
      method: "POST",
      accept: "application/json",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: document.getElementById("subject").value,
        unit: document.getElementById("unit").value,
        other: questions.concat(removed),
        temp: temp,
      }),
    }).then((r) => r.json());
  }
  async function getMCQ() {
    return await fetch("/api/generateMCQ", {
      method: "POST",
      accept: "application/json",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: document.getElementById("subject").value,
        unit: document.getElementById("unit").value,
        other: questions.concat(removed),
        nummc: mcOptions,
        temp: temp,
      }),
    }).then((r) => r.json());
  }
  async function addMCQ() {
    setQuestions([
      ...questions,
      await fetch("/api/generateMCQ", {
        method: "POST",
        accept: "application/json",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: document.getElementById("subject").value,
          unit: document.getElementById("unit").value,
          other: questions.concat(removed),
          nummc: mcOptions,
          temp: temp,
        }),
      }).then((r) => r.json()),
    ]);
  }
  async function exportPDF() {
    let oldquestions = [...questions];
    for (let i = 0; i < versions; i++) {
      let doc = new jsPDF();
      let key = new jsPDF();
      doc.setFontSize(11);
      key.setFontSize(11);
      doc.text("Name:", 10, 10);
      doc.text("Date:", 100, 10);
      doc.text("Period:", 140, 10);
      key.text("Key", 10, 10);
      doc.text("Version " + alphabet[i], 10, 20);
      key.text("Version " + alphabet[i], 10, 20);
      doc.setFontSize(16);
      key.setFontSize(16);
      doc.text(document.getElementById("subject").value, 100, 30, "center");
      doc.text(document.getElementById("unit").value, 100, 40, "center");
      key.text(document.getElementById("subject").value, 100, 30, "center");
      key.text(document.getElementById("unit").value, 100, 40, "center");
      let y = 50;
      doc.setFontSize(11);
      key.setFontSize(11);
      for (let q of questions) {
        if (q.choices) {
          q.choices = q.choices.sort(() => Math.random() - 0.5);
        }
        key.setTextColor(0, 0, 0);
        if (q.question.length > 111) {
          let split = q.question.split(" ");
          let line = "";
          for (let word of split) {
            if (line.length + word.length > 111) {
              doc.text(line, 10, y);
              key.text(line, 10, y);
              y += 10;
              line = word + " ";
            } else {
              line += word + " ";
            }
          }
          doc.text(line, 10, y);
          key.text(line, 10, y);
        } else {
          doc.text(q.question, 10, y);
          key.text(q.question, 10, y);
        }
        y += 10;
        if (q.choices) {
          q.choices = q.choices.sort(() => Math.random() - 0.5);
          for (let i = 0; i < q.choices.length; i++) {
            //create a circle around the letter
            doc.circle(11.125, y - 1.5, 3);
            key.circle(11.125, y - 1.5, 3);
            doc.text(alphabet[i] + "    " + q.choices[i], 10, y);

            if (
              oldquestions.find(
                (x) =>
                  x.question === q.question && x.choices[0] === q.choices[i]
              )
            ) {
              key.setTextColor(0, 255, 0);
            } else {
              key.setTextColor(255, 0, 0);
            }
            key.text(alphabet[i] + "    " + q.choices[i], 10, y);
            y += 10;
          }
        } else {
          key.setFontSize(6);
          let line = "";
          let i = 0;
          for (let word of q.rubric.split(" ")) {
            if (word.includes("\n")) {
              key.text(line, 10, y + i);
              i += 5;
              line = "";
            } else if (line.length + word.length > 180) {
              key.text(line, 10, y + i);
              line = "";
              i += 5;
            }

            line += word + " ";
          }
          key.setFontSize(11);
          for (let i = 0; i < 10; i++) {
            key.setTextColor(0, 0, 0);
            doc.text(
              "____________________________________________________________________________________________",
              6,
              y
            );

            y += 10;
          }
          y += 10;
        }
        if (y > 240 - 10 * mcOptions) {
          doc.addPage();
          key.addPage();
          y = 10;
        }
      }
      doc.save(`version${alphabet[i]}.pdf`);
      key.save(`version${alphabet[i]}key.pdf`);

      setQuestions(questions.sort(() => Math.random() - 0.5));
    }
  }
  async function addFRQ() {
    fetch("/api/createfrq", {
      method: "POST",
      accept: "application/json",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: document.getElementById("subject").value,
        unit: document.getElementById("unit").value,
        other: questions.concat(removed),
        temp: temp,
      }),
    })
      .then((r) => r.json())
      .then((r) => {
        console.log(r);
      });
    setQuestions([
      ...questions,
      await fetch("/api/createfrq", {
        method: "POST",
        accept: "application/json",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: document.getElementById("subject").value,
          unit: document.getElementById("unit").value,
          other: questions,
          temp: temp,
        }),
      }).then((r) => r.json()),
    ]);
  }
  return (
    <>
      <Header />
      <main className=" pt-[8vh] overflow-clip relative">
        <div className=" z-20 w-[100vw] flex items-center justify-around gap-9 sticky left-0 top-0 mt-10 bg-[#9dc3c2]  text-black font-antic text-xl">
          <h2 className="text-center text-3xl">Test Creator</h2>
          <button
            className="bg-[#FDE8C4] p-3 rounded-xl m-3"
            onClick={() => {
              exportPDF();
            }}
          >
            Export
          </button>
        </div>
        <div className=" w-[100vw]  flex items-center justify-center gap-9 pt-11 text-l text-black font-antic text-xl">
          <h2 className="text-center max-w-[5vw] ">Subject: </h2>
          <div className=" w-[40%] bg-[#FDE8C4]   min-h-14 rounded-full flex items-center justify-center ">
            <input
              className="w-full h-full m-5 bg-transparent"
              type="text"
              id="subject"
              placeholder="World History"
              onChange={(e) => {
                SetSubject(e.target.value);
              }}
            ></input>
          </div>
          <div></div>
        </div>
        <div className="w-[100vw] flex items-center justify-center gap-9 pt-11 text-l text-black font-antic text-xl">
          <h2 className=" text-center max-w-[5vw]">Unit: </h2>
          <div className=" w-[40%] bg-[#FDE8C4]   min-h-14 rounded-full flex items-center justify-center ">
            <input
              className="w-full h-full m-5 bg-transparent"
              type="text"
              id="unit"
              placeholder="The French Revolution"
              onChange={(e) => {
                SetUnit(e.target.value);
              }}
            ></input>
          </div>
        </div>
        <div className="w-[100vw] flex items-center justify-center gap-24 pt-11 text-l text-black font-antic text-xl">
          <div className="w-[10%]">
            <h2 className=" m-0">MC Options</h2>
            <div className="p-1 bg-[#FDE8C4] hover:bg-[#fce0ae]  rounded-xl flex-row flex ">
              <input
                type="number"
                name="mc"
                id="mcoptions"
                value={mcOptions}
                max={5}
                min={2}
                className=" w-[80%] bg-transparent text-center"
                onChange={(e) => {
                  setMCOptions(e.target.value);
                }}
              ></input>
              <div className="flex flex-col  cursor-pointer">
                <Image
                  src={require("/public/up.svg")}
                  alt="plus"
                  width={30}
                  height={30}
                  onClick={() => {
                    document.getElementById("mcoptions").value = Math.max(
                      2,
                      Math.min(
                        parseInt(document.getElementById("mcoptions").value) +
                          1,
                        6
                      )
                    );
                    setMCOptions(
                      parseInt(document.getElementById("mcoptions").value)
                    );
                  }}
                />
                <Image
                  src={require("/public/down.svg")}
                  alt="plus"
                  width={30}
                  height={30}
                  onClick={() => {
                    document.getElementById("mcoptions").value = Math.max(
                      2,
                      Math.min(
                        parseInt(document.getElementById("mcoptions").value) -
                          1,
                        6
                      )
                    );

                    setMCOptions(
                      parseInt(document.getElementById("mcoptions").value)
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="w-[10%]">
            <h2 className=" m-0">Versions</h2>
            <div className="p-1 bg-[#FDE8C4] hover:bg-[#fce0ae]  rounded-xl flex-row flex ">
              <input
                type="number"
                name="mc"
                id="versions"
                max={10}
                min={2}
                value={versions}
                className=" w-[80%] bg-transparent text-center"
                onChange={(e) => {
                  setVersions(e.target.value);
                }}
              ></input>
              <div className="flex flex-col  cursor-pointer">
                <Image
                  src={require("/public/up.svg")}
                  alt="plus"
                  width={30}
                  height={30}
                  onClick={() => {
                    document.getElementById("versions").value = Math.max(
                      1,
                      Math.min(
                        parseInt(document.getElementById("versions").value) + 1,
                        10
                      )
                    );
                    setVersions(
                      parseInt(document.getElementById("versions").value)
                    );
                  }}
                />
                <Image
                  src={require("/public/down.svg")}
                  alt="plus"
                  width={30}
                  height={30}
                  onClick={() => {
                    document.getElementById("versions").value = Math.max(
                      1,
                      Math.min(
                        parseInt(document.getElementById("versions").value) - 1,
                        10
                      )
                    );
                    setVersions(
                      parseInt(document.getElementById("versions").value)
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="w-[10%]">
            <h2 className=" m-0">Tempature</h2>
            <div className="p-1 bg-[#FDE8C4] hover:bg-[#fce0ae]  rounded-xl  flex-row flex  cursor-pointer">
              <input
                type="number"
                name="temp"
                id="temp"
                value= {temp}
                max={2}
                min={0.1}
                className=" w-[80%] bg-transparent text-center"
              ></input>
              <div className="flex flex-col">
                <Image
                  src={require("/public/up.svg")}
                  alt="plus"
                  width={30}
                  height={30}
                  onClick={
                    () => {
                      document.getElementById("temp").value = Math.trunc(Math.max(
                        1,
                        Math.min(
                          parseInt(document.getElementById("temp").value) + 1,
                          10
                        )
                      ));
                      setTemp(
                        parseInt(document.getElementById("temp").value)
                      );
                    
                    }
                  }
                />
                <Image
                  src={require("/public/down.svg")}
                  alt="plus"
                  width={30}
                  height={30}
                  onClick={() => {
                    document.getElementById("temp").value = Math.max(
                      1,
                      Math.min(
                        parseInt(document.getElementById("temp").value) - 1,
                        10
                      )
                    );
                    setTemp(
                      parseInt(document.getElementById("temp").value)
                    );
                  
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <ol className="">
          {questions.map((q) => {
            return (
              <li className="w-[100vw] flex items-center justify-center m-5">
                <Question
                  question={q.question}
                  choices={q.choices}
                  rubric={q.rubric}
                  setquestion={setQuestions}
                  allquestions={questions}
                  addRemoved={(e) => {
                    setRemoved([...removed, e]);
                  }}
                  getMCQ={getMCQ}
                  getFRQ={getFRQ}
                />
              </li>
            );
          })}
        </ol>
        <div className="w-[60%] bg-[#A2BDCD] p-5 mx-auto rounded-3xl flex flex-row justify-around mt-5">
          <div
            className="bg-[#FDE8C4] hover:bg-[#fce0ae]  p-5 rounded-3xl w-[40%] text-center font-antic flex items-center  cursor-pointer"
            onClick={(e) => {
              addMCQ();
            }}
          >
            <Image
              src={require("/public/plus.svg")}
              alt="plus"
              width={30}
              height={30}
              className=" mr-[30%]"
            />
            Add MCQ
          </div>
          <div
            className="bg-[#FDE8C4] hover:bg-[#fce0ae] p-5 rounded-3xl w-[40%] text-center font-antic flex items-center  cursor-pointer"
            onClick={(e) => {
              addFRQ();
            }}
          >
            <Image
              src={require("/public/plus.svg")}
              alt="plus"
              width={30}
              height={30}
              className=" mr-[30%]"
            />
            Add FRQ
          </div>
        </div>
      </main>
    </>
  );
}

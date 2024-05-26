import React, { useState, useRef } from "react";
import Header from "@/components/header";
import { Antic } from "next/font/google";
import jsPDF from "jspdf";

const antic = Antic({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-antic",
});

export default function Home() {
  const [type, setType] = useState("Text");
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [subjectList, setSubjectList] = useState([]);
  const [studyGuide, setStudyGuide] = useState([]);
  const [showRemoveButtons, setShowRemoveButtons] = useState(true);
  const [studyGuideTitle, setStudyGuideTitle] = useState("Study Guide");
  const [isGuideGenerated, setIsGuideGenerated] = useState(false);
  const studyGuideRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item) => {
    setType(item);
    setIsOpen(false);
    console.log(`Selected: ${item}`);
    // Reset subject list if switching from "Text" to "Photo"
    if (item === "Photo") {
      setSubjectList([]);
      setStudyGuide([]);
    }
  };

  const handleAddSubject = () => {
    if (subject.trim() !== "") {
      setSubjectList([...subjectList, subject.trim()]);
      setStudyGuide([
        ...studyGuide,
        { subject: subject.trim(), information: [] },
      ]);
      setSubject("");
    }
  };

  const handleCreateStudyGuide = async () => {
    console.log("Creating study guide with subjects:", subjectList);

    // Define a function to call the API for each subject
    async function generateGuide(subject) {
      return await fetch("/api/studyguide", {
        method: "POST",
        accept: "application/json",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word: subject,
        }),
      }).then((r) => r.json());
    }

    // Iterate over each subject and call the API
    const updatedStudyGuide = await Promise.all(
      subjectList.map(async (subject) => {
        const apiOutput = await generateGuide(subject);
        apiOutput.forEach((item, index) => {
          if (index != apiOutput.length - 1) {
            apiOutput[index][0] += "-";
          }
        });
        console.log(apiOutput);
        if (apiOutput) {
          // Split the API output by "." and add each part to the study guide
          return {
            subject,
            information: apiOutput,
          };
        } else {
          // Handle API call failure or empty response
          return null;
        }
      })
    );

    // Filter out null values (failed API calls) and update the study guide state
    setStudyGuide(updatedStudyGuide.filter((item) => item !== null));
    setIsGuideGenerated(true); // Set guide generation state to true
  };

  const generatePDF = () => {
    setShowRemoveButtons(false); // Hide remove buttons during PDF generation
    const doc = new jsPDF();
    let yPos = 20; // Starting position for content
    let page = 1;
  
    // Add Study Guide title
    doc.setFontSize(18);
    doc.text(studyGuideTitle, 105, yPos, { align: "center" });
    yPos += 20;
  
    studyGuide.forEach((item) => {
      // Add main subject
      if (yPos > 250) {
        // If content exceeds page height, create new page
        doc.addPage();
        yPos = 20;
        page++;
      }
      doc.setFontSize(14);
      doc.text(item.subject, 105, yPos, { align: "center" });
      yPos += 10;
  
      // Add subsections
      item.information.forEach((info) => {
        if (yPos > 250) {
          // If content exceeds page height, create new page
          doc.addPage();
          yPos = 20;
          page++;
        }
        doc.setFontSize(12);
        const textLines = doc.splitTextToSize(info, 170); // Split text into lines that fit within 170 units
        textLines.forEach((line) => {
          doc.text(line, 20, yPos); // Add information line by line
          yPos += 7; // Increase vertical position for next line
        });
      });
  
      // Add page number
      if (page > 1) {
        doc.text(`Page ${page}`, 195, 280);
      }
    });
  
    doc.save(`${studyGuideTitle}.pdf`);
    setShowRemoveButtons(true); // Show remove buttons after PDF generation
  };
  

  const handleReset = () => {
    setSubjectList([]);
    setStudyGuide([]);
    setIsGuideGenerated(false); // Reset guide generation state
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleAddSubject();
    }
  };

  const handleRemoveSentence = (subjectIndex, sentenceIndex) => {
    const updatedGuide = [...studyGuide];
    updatedGuide[subjectIndex].information.splice(sentenceIndex, 1);
    setStudyGuide(updatedGuide);
  };

  const handleRemoveSubjectWithSentences = (index) => {
    const updatedGuide = [...studyGuide];
    updatedGuide.splice(index, 1);
    setStudyGuide(updatedGuide);
  };

  const handleAddInformation = (subjectIndex) => {
    const updatedGuide = [...studyGuide];
    const newInformation = prompt("Enter additional information:");
    if (newInformation !== null) {
      updatedGuide[subjectIndex].information.push(newInformation);
      setStudyGuide(updatedGuide);
    }
  };

  return (
    <>
      <Header />
      <main
        className={`flex min-h-screen flex-col items-left justify-top p-24 ${antic.className} overflow-x-hidden`}
      >
        <div className="flex items-center mb-4">
          <button
            className="bg-[#FDE8C4] hover:bg-[#fce0ae] text-gray-800 font-bold py-2 px-4 rounded-full shadow-md text-now flex items-center"
            onClick={toggleDropdown}
          >
            <img
              src="down2.svg"
              className="h-6 w-6 ml-2 mr-2"
              alt="Dropdown Icon"
            />
            <span className="text-sm">Input Format: {type}</span>
          </button>
          {isOpen && (
            <div className="absolute bg-white border rounded mt-2">
              <a
                href="#"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 shadow-md"
                onClick={() => handleItemClick("Photo")}
              >
                Photo
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 shadow-md"
                onClick={() => handleItemClick("Text")}
              >
                Text
              </a>
            </div>
          )}
          <button
            className="bg-[#FDE8C4] hover:bg-[#fce0ae] text-gray-800 font-bold py-2 px-4 rounded-full shadow-md text-now flex items-center ml-auto"
            onClick={handleCreateStudyGuide}
          >
            Create Study Guide
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 ml-4 rounded-full shadow-md"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 ml-4 rounded-full shadow-md"
            onClick={generatePDF}
          >
            Export Study Guide
          </button>
        </div>

        <div className="flex items-center mt-4">
          <label className="text-gray-800 font-bold mr-2">
            Study Guide Title:
          </label>
          <input
            value={studyGuideTitle}
            onChange={(e) => setStudyGuideTitle(e.target.value)}
            className="bg-[#A2BDCD] hover:bg-[#96b5c7] text-white font-bold h-8 w-[40vw] rounded shadow-md"
            type="text"
            style={{ textAlign: "left", marginRight: "10px" }}
            placeholder="Enter the title of your study guide"
          />
        </div>

        {type === "Photo" ? (
          <div>
            <input
              type="file"
              accept="image/*"
              style={{ marginTop: "10px" }}
              multiple
            />
          </div>
        ) : (
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
          >
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-[#A2BDCD] hover:bg-[#96b5c7] text-white font-bold h-[5vh] w-[40vw] rounded shadow-md"
              type="text"
              style={{ textAlign: "left", marginRight: "10px" }}
              placeholder="Please enter one subject at a time"
            />
            <button
              className="bg-[#FDE8C4] hover:bg-[#fce0ae] text-gray-800 font-bold py-2 px-4 rounded-full shadow-md text-now flex items-center"
              onClick={handleAddSubject}
            >
              <img
                src="plus.svg"
                className="h-6 w-6 ml-2 mr-2"
                alt="Plus Icon"
              />
            </button>
          </div>
        )}

        <div ref={studyGuideRef}>
          <p className="text-gray-800 font-bold mb-2">
            To remove options, click on them.
            <br />
            To add more options under each subject, simply type in the input box
            and press Enter.
          </p>
          {studyGuide.map((item, subjectIndex) => (
            <div key={subjectIndex} className="flex flex-col items-start mt-2">
              <div
                className="bg-transparent p-2 rounded-md cursor-pointer"
                onClick={() => handleRemoveSubjectWithSentences(subjectIndex)}
              >
                {item.subject}
              </div>
              {item.information.map((sentence, sentenceIndex) => (
                <div
                  key={sentenceIndex}
                  className="flex items-center ml-4 cursor-pointer"
                  onClick={() =>
                    handleRemoveSentence(subjectIndex, sentenceIndex)
                  }
                >
                  <p className="mt-2 ml-2">{sentence}</p>
                </div>
              ))}
              {isGuideGenerated && ( // Only show "Add Information" button if guide is generated
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 ml-4 rounded-full shadow-md"
                  onClick={() => handleAddInformation(subjectIndex)}
                >
                  Add Information
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

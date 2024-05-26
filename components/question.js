import Image from "next/image";
const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
export default function Question(props) {
  if (props.choices) {
    return (
      <div className="bg-[#FDE8C4] w-[60%] rounded-3xl flex items-center justify-evenly p-5 font-antic relative overflow-visible ">
        <Image
          src={require("/public/refresh.svg")}
          
          id = "refresh"
          className="absolute top-[0] left-[0] cursor-pointer -translate-x-5  -translate-y-5 hover:rotate-45 transition duration-500 ease-in-out hover:scale-125"
          width={50}
          height={50}
          onClick={async () => {
            props.addRemoved(
              props.allquestions.filter(
                (question) => question.question === props.question
              )[0]
            );
            let index = props.allquestions.indexOf(
              props.allquestions.filter(
                (question) => question.question === props.question
              )[0]
            );
            let newquestion = await props.getMCQ();
            console.log(newquestion);

            props.setquestion([
              ...props.allquestions.slice(0, index),
              newquestion,
              ...props.allquestions.slice(index + 1),
            ]);
          }}
        />
        <Image
          src={require("/public/x.svg")}
          className="absolute top-[0] right-[0] cursor-pointer translate-x-5  -translate-y-5 hover:rotate-45 transition duration-500 ease-in-out hover:scale-125"
          width={50}
          height={50}
          onClick={() => {
            props.addRemoved(
              props.allquestions.filter(
                (question) => question.question === props.question
              )[0]
            );
            props.setquestion(
              props.allquestions.filter(
                (question) => question.question != props.question
              )
            );
          }}
        />

        <h1 className=" font-antic text-2xl">{props.question}</h1>
        <div>
          {props.choices.map((choice, index) => {
            return (
              <div
                key={index}
                className={
                  "border border-black px-3 flex flex-row  " +
                  (index === 0 ? "  bg-[#75A994]" : "")
                }
              >
                <div className=" px-3 w-[20%] text-center">
                  {alphabet[index]}
                </div>
                <div className={"border-l border-black px-3"}>{choice}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-[#FDE8C4] w-[60%] rounded-3xl flex items-center justify-evenly p-5 font-antic   text-ellipsis break-words   relative overflow-visible">
        <Image
          src={require("/public/refresh.svg")}
          id = "refresh"
          className="absolute top-[0] left-[0] cursor-pointer -translate-x-5  -translate-y- hover:rotate-45 transition duration-500 ease-in-out hover:scale-125"
          width={50}
          height={50}
          onClick={async () => {
            props.addRemoved(
              props.allquestions.filter(
                (question) => question.question === props.question
              )[0]
            );
            let index = props.allquestions.indexOf(
              props.allquestions.filter(
                (question) => question.question === props.question
              )[0]
            );
            let newquestion = await props.getFRQ();

            props.setquestion([
              ...props.allquestions.slice(0, index),
              newquestion,
              ...props.allquestions.slice(index + 1),
            ]);
          }}
        />
        <Image
          src={require("/public/x.svg")}
          className="absolute top-[0] right-[0] cursor-pointer translate-x-5 hover:scale-125 transition duration-500 ease-in-out -translate-y-5"
          width={50}
          height={50}
          onClick={() => {
            props.addRemoved(
              props.allquestions.filter(
                (question) => question.question === props.question
              )[0]
            );
            props.setquestion(
              props.allquestions.filter(
                (question) => question.question != props.question
              )
            );
          }}
        />
        <h1 className=" font-antic text-2xl w-[50%] ">{props.question}</h1>
        <h1 className=" font-antic text-sm w-[50%] border-l border-black  pl-2 max-h-[60vh] overflow-scroll">
          <span className=" whitespace-pre-wrap">{props.rubric}</span>
        </h1>
      </div>
    );
  }
}

import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/header";

import { Antic } from "next/font/google";
const antic =  Antic( {
  subsets:[ "latin"],
  weight: "400",
  variable: '--font-antic',
});

export default function Home() {
  return (
    <>
     <Header />
    <main
      className={`flex min-h-screen flex-col items-center justify-evenly p-24 ${antic.className} overflow-x-hidden`}
      >
      <div class="min-w-[50vw] min-h-[17vh] bg-[#77A6B6] rounded-lg shadow-md flex items-center justify-center mb-[5vh]">
      <p class="text-5xl font-antic text-center  text-[#4d7298]" > The all in one test <br></br>and study guide generator </p>
      </div>
      <div class="w-[100vw] min-h-[30vh] bg-[#FDE8C4] rounded-lg shadow-md flex items-center justify-center mb-[10vh]">
    <img src="paper.svg" class="h-[20vh] w-[20vh] ml-[1.5vw] mr-[1.5vw]" alt="SVG Icon" />
    <p class="text-3xl font-antic text-center text-[#4d7298] mr-[1.5vw]"> Welcome to a platform that makes studying and teaching easier and more enjoyable. For students, it begins with a simple upload of test papers, distilling key concepts into comprehensive study guides and practice questions. Educators can use the Test Generator to craft assessments by selecting their class and topics to compose tests. </p>
</div>


      <div class="min-w-64 h-64 bg-transparent flex items-even justify-center px-[50vw]">
    <button class="bg-[#77A6B6] hover:bg-[#6da0b1] text-white font-bold py-[2vh] px-[10vw] rounded min-w-[40vw] h-[10vh] mr-[10vw]" onClick = {() => {
      window.location.href = "/testgen";
    }}>
     <p class="text-3xl font-antic text-[#4d7298] whitespace-nowrap flex items-center justify-center" > Create Test </p>
    </button>
    <button class="bg-[#77A6B6] hover:bg-[#6da0b1] text-white font-bold py-[2vh] px-[10vw] rounded min-w-[4vw] h-[10vh]" onClick = {() => {
      window.location.href = "/studyguide"
    } }>
      <p class="text-3xl font-antic text-[#4d7298] whitespace-nowrap flex items-center justify-center" > Create Study Guide </p>
    </button> 
  </div>
    </main>
    </>
  );
}

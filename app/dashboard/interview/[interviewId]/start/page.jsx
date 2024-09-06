"use client";
import React,{useEffect, useState} from 'react';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import { MockInterview } from '@/utils/schema';
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


const StartInterview = ({params}) => {
    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setMockinterviewQuestion] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    useEffect(() => {
        GetInterviewDetails()
    }, [])

    const GetInterviewDetails = async ()=>{
        const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId)) 
        console.log(result[0].jsonMockResp)
        setInterviewData(result[0]);
          // Extract the JSON part
          const jsonStartIndex = result[0].jsonMockResp.indexOf('[');
          const jsonEndIndex = result[0].jsonMockResp.lastIndexOf(']') + 1;
          const jsonMockRespString = result[0].jsonMockResp.substring(jsonStartIndex, jsonEndIndex);
  
          // Parse the cleaned JSON string
          const jsonMockResp = JSON.parse(jsonMockRespString);
  
          // Update the state with the parsed data
          setMockinterviewQuestion(jsonMockResp);
          console.log(mockInterviewQuestion)
      }
  return (
    <div>
     <div className='grid grid-cols-1 md:grid-cols-2 gap-10' >
        {/* Question */}
        <QuestionSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex}/>

        {/* answer recording section  */}
        <RecordAnswerSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex}
        interviewData={interviewData}
        />

     </div>
     <div className='flex justify-end gap-5'>
     {activeQuestionIndex>0 && 
     <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
     {activeQuestionIndex<mockInterviewQuestion?.length-1 && 
     <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
     {activeQuestionIndex==mockInterviewQuestion?.length-1 && 
     <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}>
     <Button>End Interview</Button>
     </Link>}
     </div>
    </div>
  );
}

export default StartInterview;

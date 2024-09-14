'use client'
import React, {useState, useEffect} from 'react';
import { db } from '@/utils/db';
import { MockInterview, UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { ChevronsUpDown } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import QuestionList from './QuestionList';

const DiffJobPosition = () => {
    
    const [jobPosition, setJobPosition] = useState([]);
    const [questions, setQuestions] = useState({});

    useEffect(()=>{
        fetchJobPositions();
        fetchQuestions();
    },[])

    const fetchJobPositions = async () =>{
        const results = await db.select({jobPosition : MockInterview.jobPosition}).from(MockInterview)

        setJobPosition(results);
        // console.log(results)  
    }

    const fetchQuestions = async () =>{
      console.log("Fetching question")
      // const results = await db.select({jsonMockResp:MockInterview.jsonMockResp}).from(MockInterview).where(eq(MockInterview.jobPosition,position))
      jobPosition.forEach(async (position)=>{
        const results = await db.select({jsonMockResp:MockInterview.jsonMockResp}).from(MockInterview).then((result)=>{console.log(position,":",result)}).catch((err)=>{console.log(err)})
      })

      console.log("hello")

    }
  return (
    <div>
      {jobPosition && jobPosition.map((position,index)=>(
         <Collapsible key={index} className='mt-7'>
         <CollapsibleTrigger className= 'flex justify-between p-3 bg-secondary my-2 text-left w-full border rounded-xl'>{position.jobPosition} <ChevronsUpDown/></CollapsibleTrigger>
         <CollapsibleContent>
         <div className='flex flex-col gap-2'>
            
         </div>
         </CollapsibleContent>
       </Collapsible>
      ))}
    </div>
  );
}

export default DiffJobPosition;

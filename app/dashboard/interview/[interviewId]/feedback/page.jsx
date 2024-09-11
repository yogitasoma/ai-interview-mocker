"use client"
import { UserAnswer } from '@/utils/schema';
import { db } from '@/utils/db';
import React,{useEffect, useState} from 'react';
import { eq } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react';



const FeedBack = ({params}) => {

    const [feedbackList,setFeedbackList]= useState([]);
    const router = useRouter(); 

    useEffect(()=>{
      getFeedback();
    },[])

    const getFeedback= async ()=>{
      console.log(params)
      const result = await db.select().from(UserAnswer).where(eq(UserAnswer.mockIdRef, params.interviewId)).orderBy(UserAnswer.id);
      console.log(result)
      setFeedbackList(result)
    }
  return (
    <div className='p-10'>
      {feedbackList?.length==0?
      <h2 className='text-xl font-bold text-gray-500'>No Interview Feedback Record found</h2>
      
      :
      <>
      <h2 className='text-3xl text-green-500'>Congratulations!</h2>
      <h2 className='text-2xl font-bold'>Here is your Interview feedback</h2>
      <h2 className='text-primary my-3 text-lg'>Your overall Interview Rating: <strong>7/10</strong></h2>
      <h2 className='text-sm text-gray-500'>Find below Interview Question with correct and your answer and feedback for improvement.</h2>

      {feedbackList&& feedbackList.map((item,index)=>(
        <Collapsible key={index} className='mt-7'>
        <CollapsibleTrigger className= 'flex justify-between p-3 bg-secondary my-2 text-left w-full border rounded-xl'>{item.question} <ChevronsUpDown/></CollapsibleTrigger>
        <CollapsibleContent>
        <div className='flex flex-col gap-2'>
        <h2 className='text-red-500 p-2 rounded-lg'> <strong>Rating : </strong> {item.rating}</h2>
        <h2 className=' rounded-lg text-sm bg-red-50 p-2 text-red-900'><strong>Your Answer: </strong>{item.userAns}</h2>
        <h2 className='bg-green-50 text-sm text-green-900 p-2 rounded-lg'><strong>Correct Answer: </strong>{item.correctAns}</h2>
        <h2 className=' p-2 text-sm rounded-lg bg-blue-50 text-blue-900'><strong>Feedback: </strong>{item.feedback}</h2>
        </div>
        </CollapsibleContent>
      </Collapsible>
      ))}
      </>
    }

      <div className='flex justify-center items-center mt-10 '>
      <Button onClick={()=>router.replace('/dashboard')}>Go Home</Button>
      </div>

    </div>
  );
}

export default FeedBack;

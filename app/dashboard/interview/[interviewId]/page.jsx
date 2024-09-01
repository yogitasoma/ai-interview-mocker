"use client"
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import React,{ useEffect, useState } from 'react'
import { eq } from 'drizzle-orm'
import Webcam from 'react-webcam'
import { WebcamIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Interview = ({params}) => {
  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled ] = useState(false);
  useEffect(() => {
    console.log(params.interviewId)
    GetInterviewDetails();
  }, [])

  const GetInterviewDetails = async ()=>{
    const result = await db.select().from(MockInterview)
    .where(eq(MockInterview.mockId, params.interviewId))
    setInterviewData(result[0])
  }
  return (
    <div className='my-10 flex justify-center flex-col items-center'>
      <h2 className='font-bold text-2xl'>Let's Get Started</h2>
      <div>
        { webCamEnabled? <Webcam
        onUserMedia={()=>setWebCamEnabled(true)}
        onUserMediaError={()=>setWebCamEnabled(false)}
        style={{
          height:300,
          width:300
        }}
        />
        :
        <>
        <WebcamIcon className=' h-72 w-full bg-secondary p-20 rounded-lg border my-5' />
        <Button onclick={()=>setWebCamEnabled(true)}>Enable Webcam and Microphone</Button>
        </>

        }
      
      </div>
    </div>
  )   
}

export default Interview

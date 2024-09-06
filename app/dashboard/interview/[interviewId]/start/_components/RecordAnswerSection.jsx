
import Image from 'next/image'
import React,{useEffect, useState} from 'react'
import Webcam from 'react-webcam'
import { Button } from '@/components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text';
import { StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAIModel';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import moment from 'moment';

const RecordAnswerSection = ({mockInterviewQuestion, activeQuestionIndex, interviewData}) => {
    const [userAnswer, setUserAnswer] = useState('');
    const {user} = useUser()
    const [loading, setLoading] = useState(false);
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });

      useEffect(() => {
        if (typeof window !== 'undefined') {
            // Code that must run in the browser only
        }
    }, []);

      useEffect(()=>{
        results.map((result)=>(
            setUserAnswer(prevAns=>prevAns+result?.transcript)
        ))
      },[results])

      useEffect(() => {
        if(!isRecording&&userAnswer.length>10){
          UpdateUserAnswer();
        }
      }, [userAnswer])

      const StartStopRecording = async ()=>{
        if(isRecording){
          
          stopSpeechToText();
    
        }
        else{
          startSpeechToText();
        }
      }

      const UpdateUserAnswer = async ()=>{
        setLoading(true)
        const feedbackPrompt= "Question:"+mockInterviewQuestion[activeQuestionIndex]?.question+", User Answer"+userAnswer+",Depends on question and user answer for given interview question"+"please give us rating for the answer and feedback as area of improvement if any"+" in just 3 to 5 lines to improve it in JSON format with rating field and feedback field."

          const result = await chatSession.sendMessage(feedbackPrompt);

          const mockJsonResp = (result.response.text()).replace('```json','').replace('```','')
          console.log(mockJsonResp)
          const JsonFeedbackResp = JSON.parse(mockJsonResp);
          console.log(JsonFeedbackResp)
          const userEmail = user?.primaryEmailAddress?.emailAddress || 'default-email@example.com'; 
          console.log(interviewData?.mockId)
          console.log(mockInterviewQuestion[activeQuestionIndex]?.answer)

          const resp = await db.insert(UserAnswer).values({
            mockIdRef:interviewData?.mockId,
            question:mockInterviewQuestion[activeQuestionIndex]?.question,
            userAns:userAnswer,
            feedback:JsonFeedbackResp?.feedback,
            rating:JsonFeedbackResp?.rating,
            userEmail:userEmail,
            createdAt:moment().format('DD-MM-yyyy'),
            correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer
          })

          if(resp){
            toast('User answer recorded successfully!')
          }
          setUserAnswer('')
          setLoading(false)
      }


  return (
    <div className='flex flex-col items-center justify-center'>
    <div className='flex  justify-center items-center bg-black rounded-lg mt-20 p-5'>
    <Image src={'/webcam.png'} width={200} height={200} className='absolute'/>
   <Webcam  
   style={{
    height:350,
    width:'100%',
    zIndex:10,
   }}
   />
    </div>
    <Button 
    disabled={loading}
    variant="outline" className="my-10"
    onClick={StartStopRecording}
    >
        {
        isRecording ?
            <h2 className='text-red-600 animate-pulse flex gap-2 items-center justify-center'>
                <StopCircle/> Stop Recording
            </h2>
            : 'Start Recording'
            
        }
    </Button>
 

    </div>
  )
}

export default RecordAnswerSection

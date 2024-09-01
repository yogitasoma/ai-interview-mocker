"use client";
import React,{ useState } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { chatSession } from '@/utils/GeminiAIModel';
import { LoaderCircle } from 'lucide-react';
import { MockInterview } from '@/utils/schema';
import { db } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import Router from 'next/router';
  

const AddNewInterview = () => {
    const [openDiaglog, setOpenDialog] = useState(false);
    const [jobRole, setJobRole] = useState()
    const [jobDesc, setJobDesc] = useState()
    const [jobExp, setJobExp] = useState()
    const [loading, setLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState([])
    const {user} = useUser()
    
    const onSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        console.log(jobRole, jobDesc, jobExp);

        const InputPrompt = "Job position : "+ jobRole +", Job Description : "+ jobDesc +" , Years of Experience:"+ jobExp +" According to the above info phrase "+process.env.NEXT_PUBLIC_TOTAL_QUESTIONS+" interview questions with answers in json format give question and answer as the field in json";
        const result = await chatSession.sendMessage(InputPrompt);
        const MockJsonResponse = (result.response.text()).replace('```json','').replace('```','')
        // console.log(JSON.parse(MockJsonResponse));
        setJsonResponse(MockJsonResponse)
        console.log(user);
        const createdBy = user?.primaryEmailAddress?.emailAddress || 'default-email@example.com'; // Fallback email

        if(MockJsonResponse){
        const resp = await db.insert(MockInterview).values({ 
            mockId:uuidv4(),
            jsonMockResp:MockJsonResponse,
            jobPosition:jobRole,
            jobDesc:jobDesc,
            jobExperience:jobExp,
            createdBy:createdBy,
            createdAt:moment().format('DD-MM-yyyy')
        }).returning({mockId:MockInterview.mockId})
    
        console.log("Inserted id : ", resp)
    
    if(resp){
            setOpenDialog(false);
            Router.push('dashboard/interview/'+resp[0]?.mockId)
        }
    }
    else{
        console.log("ERROR")
    }
        setLoading(false)
    }
  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary hover:shadow-md hover:scale-105 cursor-pointer transition-all' onClick={()=>setOpenDialog(true)}>
            <h2 className='text-lg text-center'>+ Add New</h2>
        </div>
        <Dialog open={openDiaglog}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
            <DialogTitle className="text-2xl">Tell us about the Job your Interviewing</DialogTitle>
            <DialogDescription>
                <form onSubmit={onSubmit}>
            <div>
                <h2>Add details about job position, your skills and experience</h2>
                <div className='mt-7 my-3'>
                    <label className='font-bold'>Job Role/Job Position</label>
                    <Input placeholder="Ex. FullStack Developer" required onChange={(e)=>setJobRole(e.target.value)}/>
                </div>
                <div className='my-3'>
                    <label className='font-bold'>Job Description/ TechStack (Inshort)</label>
                    <Textarea placeholder="Ex. React, Angular, Nodejs, MySQL, etc" required onChange={(e)=>setJobDesc(e.target.value)}/>
                </div>
                <div className='my-3'>
                    <label className='font-bold'>Years of Experience</label>
                    <Input type="number" max="50" placeholder="Ex. 2,5" required onChange={(e)=>setJobExp(e.target.value)}/>
                </div>
            </div>
                <div className='flex gap-5 justify-end'>
                    <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
                    <Button type="submit" disabled={loading}> {loading? <><LoaderCircle className='animate-spin'/>'Generating from AI' </> : 'Start Interview'}
                    </Button>
                </div>
                </form>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>

    </div>
  )
}

export default AddNewInterview

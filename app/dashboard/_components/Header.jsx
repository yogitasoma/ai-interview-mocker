"use client";
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, {useEffect} from 'react'
import Link from 'next/link'

const Header = () => {
  const path =usePathname(); 
  useEffect(() => {
    console.log(path)
  }, [path])

  const isInterviewPage = path.startsWith('/dashboard/interview')

  return (
    <div className='flex p-5 items-center justify-between bg-secondary shadow-md'>
      <Image src={'/logo.svg'} width={160} height={100} alt='logo'/>
      {!isInterviewPage && (
      <ul className='hidden md:flex gap-6'>
       <Link href='/dashboard'> <li className={`hover:text-primary hover:font-bold cursor-pointer transition-all ${path =='/dashboard' && 'text-primary font-bold'}`}>Dashboard</li></Link>
        <li className={`hover:text-primary hover:font-bold cursor-pointer transition-all ${path =='/dashboard/questions' && 'text-primary font-bold'}`}>Questions</li>
       <Link href='dashboard/upgrade'> <li className={`hover:text-primary hover:font-bold cursor-pointer transition-all ${path =='/dashboard/upgrade' && 'text-primary font-bold'}`}>Upgrade</li> </Link>
        <li className={`hover:text-primary hover:font-bold cursor-pointer transition-all ${path =='/dashboard/how' && 'text-primary font-bold'}`}>How it Works?</li>
      </ul>
    )}
      <UserButton/>
    </div>
  )
}

export default Header

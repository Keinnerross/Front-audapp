'use client'
import { redirect } from 'next/navigation';
import { useEffect } from 'react';


export default function Home() {

  useEffect(() => {

    const session = localStorage.getItem("jwt");


    if (session) {
      redirect('/dashboard');
    } else {
      redirect('/signin');
    }


  }, [])

  return null;

}
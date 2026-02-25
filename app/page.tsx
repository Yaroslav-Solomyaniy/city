'use client'
import Hero from "@/app/Hero";

export default function Home() {
    return (
        <Hero onOpenModal={() => console.log('Modal')}/>
    );
}

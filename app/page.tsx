'use client'
import Hero from "@/app/components/Hero";

export default function Home() {
    return (
        <Hero onOpenModal={() => console.log('Modal')}/>
    );
}

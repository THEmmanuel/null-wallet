"use client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"



export default function StartPage() {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<span className="text-2xl font-semibold">
				<Input/>
				<Input/>

				<Button variant="outline">Button</Button>

			</span>
		</div>
	);
} 
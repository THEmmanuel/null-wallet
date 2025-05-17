"use client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"



export default function StartPage() {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<span className="text-2xl font-semibold">

				<div className="grid w-full max-w-sm items-center gap-1.5">
					{/* <Label htmlFor="email">Email</Label> */}
					<Input type="email" id="email" placeholder="Email" />
					<Input type="number" id="account" placeholder="Amount"/>
				</div>


				<Button variant="outline">Import</Button>
				<Button variant="outline">Create</Button>
			</span>
		</div>
	);
} 
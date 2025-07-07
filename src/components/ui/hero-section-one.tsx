"use client";


import { motion } from "motion/react";
import Link from "next/link"

export function HeroSectionOne() {
	return (
		<div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
			{/* <Navbar /> */}
			<div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
				<div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
			</div>
			<div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
				<div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
			</div>
			<div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
				<div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
			</div>
			<div className="px-4 py-10 md:py-20">
				<h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
					{"Asset  Sovereignty  Starts  Here."
						.split(" ")
						.map((word, index) => (
							<motion.span
								key={index}
								initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
								animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
								transition={{
									duration: 0.3,
									delay: index * 0.1,
									ease: "easeInOut",
								}}
								className="mr-2 inline-block"
							>
								{word}
							</motion.span>
						))}
				</h1>
				<motion.p
					initial={{
						opacity: 0,
					}}
					animate={{
						opacity: 1,
					}}
					transition={{
						duration: 0.3,
						delay: 0.8,
					}}
					className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
				>
					Build value with fiat-backed tokens and trade major coins privately across chains. From fiat to blockchain, Null Wallet keeps it simple, secure, and always in your control.

					Plug in finance with one SDK. Power wallets in minutes.
				</motion.p>
				<motion.div
					initial={{
						opacity: 0,
					}}
					animate={{
						opacity: 1,
					}}
					transition={{
						duration: 0.3,
						delay: 1,
					}}
					className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
				>
					<div className="text-center">
						<Link href="/auth/login">
							<div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer">
								<span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
									🚀 Launch App
								</span>
							</div>
						</Link>
						<p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
							Get started with Null Wallet today!
						</p>
					</div>
				</motion.div>
				<motion.div
					initial={{
						opacity: 0,
						y: 10,
					}}
					animate={{
						opacity: 1,
						y: 0,
					}}
					transition={{
						duration: 0.3,
						delay: 1.2,
					}}
					className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
				>
					<div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
						<img
							src="https://res.cloudinary.com/dcv1yl0u4/image/upload/v1746977724/Screenshot_2025-05-11_162739_odkn4k.png"
							alt="Landing page preview"
							className="aspect-[16/9] h-auto w-full object-cover"
							height={1000}
							width={1000}
						/>
					</div>
				</motion.div>

			</div>
		</div >
	);
}
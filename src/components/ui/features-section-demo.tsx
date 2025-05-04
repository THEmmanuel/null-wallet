import { cn } from "@/lib/utils";
import {
	IconWorldDollar,
	IconBriefcase2,
	IconCurrencyDollar,
	IconWallet,
	IconTerminal2,
	IconCash,
	IconLocationDollar,
	IconUsersGroup
} from "@tabler/icons-react";

export function FeaturesSectionDemo() {
	const features = [
		{
			title: "Unified Global Payments",
			description:
				"Use fiat-backed tokens to move value across regions with clarity and speed. Designed for consistent pricing and effortless international reach.",
			icon: <IconWorldDollar />,
		},
		{
			title: "Business-to-Business Transfers",
			description:
				"Simplify large transactions between organizations with predictable-value assets and direct wallet-to-wallet settlement.",
			icon: <IconBriefcase2 />,
		},
		{
			title: "Treasury and Cash Management",
			description:
				"Hold fiat-equivalent tokens for daily operations or strategic planning—stable, accessible, and blockchain-native.",
			icon: <IconCurrencyDollar />,
		},
		{
			title: "Platform Wallet Infrastructure",
			description:
				"Integrate token storage and payments into your product with SDKs designed for fast deployment and secure custody.",
			icon: <IconWallet />,
		},
		{
			title: "Fiat Onboarding for Web3 Apps",
			description:
				"Let users deposit fiat directly into Web3 wallets, creating stable tokens they can spend or save instantly.",
			icon: <IconCash />,
		},
		{
			title: "Developer Tools for Token Issuance",
			description:
				"Issue your own branded stable-value tokens in minutes. All handled via SDK and APIs.",
			icon: <  IconTerminal2 />,
		},
		{
			title: "Digital Commerce and Payments",
			description:
				"Accept stable tokens for online goods and services with low volatility and instant settlement—no chargebacks, no delays.",
			icon: <IconLocationDollar />,
		},
		{
			title: "Tokenized Payroll & Payouts",
			description:
				"Pay contributors, partners, or global teams in fiat-equivalent digital assets with traceable, scheduled, and secure delivery.",
			icon: <IconUsersGroup />,
		},
	];
	return (
		<div className="relative z-10 py-10 max-w-7xl mx-auto">
			<div className="px-8 mb-16">
				<h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
					A Toolkit for Modern Finance
				</h4>

				<p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
					Power up your financial flows: send, trade, and create assets with confidence and control.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
				{features.map((feature, index) => (
					<Feature key={feature.title} {...feature} index={index} />
				))}
			</div>
		</div>
	);
}

const Feature = ({
	title,
	description,
	icon,
	index,
}: {
	title: string;
	description: string;
	icon: React.ReactNode;
	index: number;
}) => {
	return (
		<div
			className={cn(
				"flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
				(index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
				index < 4 && "lg:border-b dark:border-neutral-800"
			)}
		>
			{index < 4 && (
				<div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
			)}
			{index >= 4 && (
				<div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
			)}
			<div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
				{icon}
			</div>
			<div className="text-lg font-bold mb-2 relative z-10 px-10">
				<div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
				<span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
					{title}
				</span>
			</div>
			<p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
				{description}
			</p>
		</div>
	);
};

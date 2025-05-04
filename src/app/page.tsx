"use client";


// import { Button } from "@/components/ui/button"
import { AuroraBackground } from "@/components/ui/aurora-background";
import { HeroSectionOne } from "@/components/ui/hero-section-one";
import { FeaturesSectionDemo } from "@/components/ui/features-section-demo";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Home() {
	return (
		<div>
			<ModeToggle/>
			<AuroraBackground>
				<HeroSectionOne />
			</AuroraBackground>

			<FeaturesSectionDemo/>
		</div>
	);
}

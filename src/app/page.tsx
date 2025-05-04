"use client";


// import { Button } from "@/components/ui/button"
import { AuroraBackground } from "@/components/ui/aurora-background";
import { HeroSectionOne } from "@/components/ui/hero-section-one";
import { FeaturesSectionDemo } from "@/components/ui/features-section-demo";
import { ModeToggle } from "@/components/ui/mode-toggle";
// import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export default function Home() {
	return (
		<div>
			<ModeToggle />
			<AuroraBackground>
			{/* <BackgroundGradientAnimation> */}
				<HeroSectionOne />
			{/* </BackgroundGradientAnimation> */}
			</AuroraBackground>

			<FeaturesSectionDemo />
		</div>
	);
}

"use client";


// import { Button } from "@/components/ui/button"
import { AuroraBackground } from "@/components/ui/aurora-background";
import { HeroSectionOne } from "@/components/ui/hero-section-one";
import { FeaturesSectionDemo } from "@/components/ui/features-section-demo";
import { ModeToggle } from "@/components/ui/mode-toggle";
// import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { AppleCardsCarouselDemo } from "@/components/ui/apple-cards";
import { Footer } from "@/components/ui/footer";

export default function Home() {
	return (
		<div>
			<ModeToggle />
			<AuroraBackground>
			{/* <BackgroundGradientAnimation> */}
				<HeroSectionOne />
			{/* </BackgroundGradientAnimation> */}
			</AuroraBackground>

			<div className="max-w-[1280px] mx-auto">
				<AppleCardsCarouselDemo/>
			</div>
			<FeaturesSectionDemo />
			<div className="h-64" />
			<Footer />
		</div>
	);
}

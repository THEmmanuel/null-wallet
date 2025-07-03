"use client";


// import { Button } from "@/components/ui/button"
import { AuroraBackground } from "@/components/ui/aurora-background";
import { HeroSectionOne } from "@/components/ui/hero-section-one";
import { FeaturesSectionDemo } from "@/components/ui/features-section-demo";
import { LandingNavbar } from "@/components/ui/landing-navbar";
// import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { AppleCardsCarouselDemo } from "@/components/ui/apple-cards";
import { Footer } from "@/components/ui/footer";

export default function Home() {
	return (
		<div>
			<LandingNavbar />
			<div id="hero">
				<AuroraBackground>
				{/* <BackgroundGradientAnimation> */}
					<HeroSectionOne />
				{/* </BackgroundGradientAnimation> */}
				</AuroraBackground>
			</div>

			<div id="cards" className="max-w-[1280px] mx-auto">
				<AppleCardsCarouselDemo/>
			</div>
			<div id="features">
				<FeaturesSectionDemo />
			</div>
			<div className="h-64" />
			<Footer />
		</div>
	);
}
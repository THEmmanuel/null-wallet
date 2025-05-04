"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        One Wallet. Infinite Possibilities.
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = ({ description }: { description: string }) => {
  return (
    <>
      {[...new Array(1).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              {description}
            </p>
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "Fiat-backed Stablecoins",
    title: "Create and Manage Your Own Stablecoins",
    description: "Deposit fiat and create your own custom stablecoins tied to the value of your chosen asset—secure and easy to manage.",
    src: "https://images.unsplash.com/photo-1610387849418-3ec12dc4b50b?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent description="Deposit fiat and create your own custom stablecoins tied to the value of your chosen asset—secure and easy to manage." />,
  },
  {
    category: "Seamless Blockchain Wallet",
    title: "Access All Your Crypto Assets in One Place",
    description: "A fully integrated blockchain wallet that supports popular tokens like ETH, USDT, BTC, and others across multiple chains, giving you full control over your crypto assets.",
    src: "https://images.unsplash.com/photo-1651063778437-b678538f7198?q=80&w=2700&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent description="A fully integrated blockchain wallet that supports popular tokens like ETH, USDT, BTC, and others across multiple chains, giving you full control over your crypto assets." />,
  },
  {
    category: "Trade Derivative Assets",
    title: "Trade Derivatives Directly Through Your Wallet",
    description: "Buy and manage derivative assets tied to commodities, stocks, or other market values directly through the wallet—no intermediaries needed.",
    src: "https://images.unsplash.com/photo-1745270917331-787c80129680?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent description="Buy and manage derivative assets tied to commodities, stocks, or other market values directly through the wallet—no intermediaries needed." />,
  },
  {
    category: "High-Level Security",
    title: "Your Assets Are Protected with Advanced Security",
    description: "Built with advanced encryption protocols to keep your data and assets secure, offering peace of mind with every transaction.",
    src: "https://images.unsplash.com/photo-1666559712858-37a253cdb34b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent description="Built with advanced encryption protocols to keep your data and assets secure, offering peace of mind with every transaction." />,
  },
  {
    category: "Easy-to-Use SDK",
    title: "Integrate Our Wallet with Your Platform",
    description: "Plug into your platform or services with our developer-friendly SDK, making it simple to extend wallet functionality or create new financial solutions.",
    src: "https://images.unsplash.com/photo-1607431067517-fda93b3e0aee?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent description="Plug into your platform or services with our developer-friendly SDK, making it simple to extend wallet functionality or create new financial solutions." />,
  }
];

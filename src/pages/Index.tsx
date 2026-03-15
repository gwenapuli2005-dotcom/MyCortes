import { HeroHeader } from "@/components/HeroHeader";
import { QuickServices } from "@/components/QuickServices";
import { RequestStatusCard } from "@/components/RequestStatusCard";
import { AnnouncementsFeed } from "@/components/AnnouncementsFeed";
import { BottomNav } from "@/components/BottomNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background lg:pt-14">
      <div className="app-container pb-24 lg:pb-12">
        {/* Hero Header */}
        <HeroHeader />

        {/* Main Content */}
        <main className="space-y-6 lg:space-y-10 pt-2 lg:pt-8">
          {/* Quick Services Grid */}
          <QuickServices />

          {/* Desktop: two-column layout for status + announcements */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-6 lg:space-y-0 desktop-sections">
            {/* Request Status */}
            <RequestStatusCard />

            {/* Announcements */}
            <AnnouncementsFeed />
          </div>
        </main>
      </div>

      {/* Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;

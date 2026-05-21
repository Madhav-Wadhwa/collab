import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Campaign from './models/Campaign.js';
import DealEscrow from './models/DealEscrow.js';
import FeedPost from './models/FeedPost.js';
import Message from './models/Message.js';

// Connect DB
await connectDB();

const seedData = async () => {
  try {
    // Clear all
    await User.deleteMany();
    await Campaign.deleteMany();
    await DealEscrow.deleteMany();
    await FeedPost.deleteMany();
    await Message.deleteMany();

    console.log('Collections cleared.');

    // Creators Profiles
    const creators = [
      {
        name: 'Alexis Rouge',
        email: 'alexis@creatorconnect.com',
        password: 'passcode_creator',
        role: 'creator',
        creatorProfile: {
          instagramUsername: 'alexisrouge',
          followersCount: 2400000,
          engagementRate: 4.8,
          niche: ['Luxury', 'Lifestyle'],
          bio: 'Curating elite automotive culture & luxury lifestyle trends.',
          profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
          aiInsights: {
            brandSafetyScore: 99,
            predictedRoiMultiplier: 4.8,
            audienceDemographics: { male: 65, female: 35 },
            nicheInsights: 'Premium target audience with extremely high converting automotive buyers. Zero artificial bot footprint.'
          }
        }
      },
      {
        name: 'Mara Nova',
        email: 'mara@creatorconnect.com',
        password: 'passcode_creator',
        role: 'creator',
        creatorProfile: {
          instagramUsername: 'maranova',
          followersCount: 1200000,
          engagementRate: 3.5,
          niche: ['Fitness', 'Gaming'],
          bio: 'Cyber-fitness trainer. Merging virtual fashion with high-end techwear.',
          profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
          aiInsights: {
            brandSafetyScore: 96,
            predictedRoiMultiplier: 3.1,
            audienceDemographics: { male: 52, female: 48 },
            nicheInsights: 'Excellent alignment with aesthetic apparel. High comment retention rate.'
          }
        }
      },
      {
        name: 'Dr. Ethan',
        email: 'ethan@creatorconnect.com',
        password: 'passcode_creator',
        role: 'creator',
        creatorProfile: {
          instagramUsername: 'drethan',
          followersCount: 820000,
          engagementRate: 5.2,
          niche: ['Tech', 'Health'],
          bio: 'Vascular surgeon & tech analyst. Explaining digital wellbeing.',
          profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
          aiInsights: {
            brandSafetyScore: 98,
            predictedRoiMultiplier: 3.9,
            audienceDemographics: { male: 40, female: 60 },
            nicheInsights: 'High authority rank in clinical fields. Top 1% conversion index.'
          }
        }
      },
      {
        name: 'Jordan Tech',
        email: 'jordan@creatorconnect.com',
        password: 'passcode_creator',
        role: 'creator',
        creatorProfile: {
          instagramUsername: 'jordantech',
          followersCount: 310000,
          engagementRate: 4.1,
          niche: ['Tech', 'Hardware'],
          bio: 'Next-Gen hardware customizer. Building liquid-cooled systems.',
          profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
          aiInsights: {
            brandSafetyScore: 97,
            predictedRoiMultiplier: 2.7,
            audienceDemographics: { male: 80, female: 20 },
            nicheInsights: 'Niche hardware builder. High retention rate on interactive build streams.'
          }
        }
      },
      {
        name: 'Chloe Digital',
        email: 'chloe@creatorconnect.com',
        password: 'passcode_creator',
        role: 'creator',
        creatorProfile: {
          instagramUsername: 'chloedigital',
          followersCount: 1500000,
          engagementRate: 12.4,
          niche: ['Tech-Fashion', 'Aesthetics'],
          bio: 'Specializing in AI-generated aesthetics & virtual fashion campaigns.',
          profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          aiInsights: {
            brandSafetyScore: 94,
            predictedRoiMultiplier: 5.2,
            audienceDemographics: { male: 30, female: 70 },
            nicheInsights: 'Extreme viral potential. AI-generated post structures yield 12.4% engagement.'
          }
        }
      }
    ];

    // Brands
    const brands = [
      {
        name: 'Luxe Audio Gear',
        email: 'brand1@creatorconnect.com',
        password: 'passcode_brand',
        role: 'brand'
      },
      {
        name: 'Cyber-Wear X',
        email: 'brand2@creatorconnect.com',
        password: 'passcode_brand',
        role: 'brand'
      },
      {
        name: 'Neon Energy Drink',
        email: 'brand3@creatorconnect.com',
        password: 'passcode_brand',
        role: 'brand'
      }
    ];

    // Save Users
    const savedCreators = await User.create(creators);
    const savedBrands = await User.create(brands);

    console.log('Creators and Brands seeded.');

    // Campaigns
    const campaigns = [
      {
        brandId: savedBrands[0]._id, // Luxe Audio
        title: 'Sonic Echo Launch',
        description: 'Introduce our new spatial audio ANC headphones to premium audiophile niches. Showcasing premium noise cancelation.',
        campaignType: 'Paid',
        budget: 12500,
        nicheTags: ['Tech', 'Luxury', 'Lifestyle'],
        metricsTarget: { engagementRate: 4.5, followersMin: 100000 }
      },
      {
        brandId: savedBrands[1]._id, // Cyber-Wear
        title: 'Futuristic Stealth Shells',
        description: 'Barter campaign offering our water-repellent Graphene shells to premium techwear design creators.',
        campaignType: 'Barter',
        budget: 1500,
        nicheTags: ['Luxury', 'Tech-Fashion', 'Fitness'],
        metricsTarget: { engagementRate: 3.5, followersMin: 50000 }
      },
      {
        brandId: savedBrands[2]._id, // Neon Energy
        title: 'Neon Rush Blast',
        description: 'Unpaid viral challenge: post creative transition videos drinking Neon Rush. Top 10 transition clicks get $5k bonuses.',
        campaignType: 'Unpaid',
        budget: 0,
        nicheTags: ['Fitness', 'Lifestyle', 'Gaming'],
        metricsTarget: { engagementRate: 8.0, followersMin: 10000 }
      }
    ];

    const savedCampaigns = await Campaign.create(campaigns);
    console.log('Campaigns seeded.');

    // Deals / Escrow
    const deals = [
      {
        campaignId: savedCampaigns[0]._id, // Sonic Echo Launch
        brandId: savedBrands[0]._id, // Luxe Audio
        creatorId: savedCreators[0]._id, // Alexis Rouge
        status: 'Locked',
        contractAmount: 12500,
        escrowFundsPercent: 80,
        milestones: [
          { label: 'Concept & Script Approval', amount: 2500, completed: true, completedAt: new Date(Date.now() - 86400000 * 3) },
          { label: 'Video Production (Unboxing)', amount: 6000, completed: false },
          { label: 'Final Release & Engagement', amount: 4000, completed: false }
        ]
      },
      {
        campaignId: savedCampaigns[1]._id, // Futuristic Stealth Shells
        brandId: savedBrands[1]._id, // Cyber-Wear
        creatorId: savedCreators[1]._id, // Mara Nova
        status: 'Shipped',
        contractAmount: 1500,
        trackingNumber: 'CX-889-766-99',
        escrowFundsPercent: 100,
        milestones: [
          { label: 'Sample Locked & Escrow Setup', amount: 500, completed: true, completedAt: new Date(Date.now() - 86400000 * 2) },
          { label: 'Shipment Receipt Verification', amount: 500, completed: false },
          { label: 'Stealth Fit Review Post', amount: 500, completed: false }
        ]
      }
    ];

    const savedDeals = await DealEscrow.create(deals);
    console.log('Deals seeded.');

    // Create Initial Chat Message
    await Message.create({
      dealId: savedDeals[0]._id,
      senderId: savedBrands[0]._id, // Luxe Audio
      text: 'Hi Alexis! I have reviewed the initial proposal for the "Sonic Echo" campaign. We are excited about the creative direction, but we would like to adjust the milestone for the unboxing video.'
    });

    await Message.create({
      dealId: savedDeals[0]._id,
      senderId: savedCreators[0]._id, // Alexis
      text: 'Understood. Are you looking to pull the deadline forward or change the deliverable requirements?'
    });

    await Message.create({
      dealId: savedDeals[0]._id,
      senderId: savedBrands[0]._id, // Luxe Audio
      text: "We'd like to include a secondary short-form edit for TikTok. I have attached the updated brand guidelines and the revised budget breakdown here.",
      attachment: {
        name: 'Revised_Budget_Q4.pdf',
        url: '#',
        size: '4.2 MB'
      }
    });

    console.log('Deal messages seeded.');

    // Seed Feed Posts
    await FeedPost.create({
      creatorId: savedCreators[4]._id, // Chloe Digital
      content: 'Stunning conversion metrics from the Cyberpunk Stealth shell campaign. 12.4% engagement rate verified using artificial intelligence structures!',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
      likes: [savedCreators[0]._id, savedBrands[1]._id],
      metricsData: {
        views: 245000,
        engagementRate: 12.4,
        salesGenerated: 14800,
        roiMultiplier: 5.2
      },
      aiPerformanceScore: 94,
      aiAnalysisSummary: 'Chloe Digital virtual fashion post shows extreme niche alignment. Verified ROI: 5.2x. Bot activity: 0% detected.'
    });

    await FeedPost.create({
      creatorId: savedCreators[0]._id, // Alexis
      content: 'Secured the Escrow. Automotive luxury campaign for Lexus is officially Live! Check the deal room for real-time reach.',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=600',
      likes: [savedCreators[1]._id, savedBrands[0]._id],
      metricsData: {
        views: 890000,
        engagementRate: 4.8,
        salesGenerated: 32000,
        roiMultiplier: 4.8
      },
      aiPerformanceScore: 99,
      aiAnalysisSummary: 'Alexis Rouge high-velocity engagement verified. High-net-worth demographic matching confirmed.'
    });

    console.log('Feed seeded successfully.');
    console.log('Database Seeding Completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();

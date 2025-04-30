import React from "react";
import { useParams } from "react-router-dom";
import AnimationRevealPage from "helpers/AnimationRevealPage.jsx";

// Importação da página principal
import Home from "pages/Home.jsx";

// Importações das páginas internas que ainda existem
import LoginPage from "pages/Login.jsx";
import SignupPage from "pages/Signup.jsx";
import PricingPage from "pages/Pricing.jsx";
import AboutUsPage from "pages/AboutUs.jsx";
import ContactUsPage from "pages/ContactUs.jsx";
import BlogIndexPage from "pages/BlogIndex.jsx";
import TermsOfServicePage from "pages/TermsOfService.jsx";
import PrivacyPolicyPage from "pages/PrivacyPolicy.jsx";

// Imagens das páginas de demonstração (que ainda existem em images/demo)
import HotelTravelLandingPageImageSrc from "images/demo/HotelTravelLandingPage.jpeg";
import LoginPageImageSrc from "images/demo/LoginPage.jpeg";
import SignupPageImageSrc from "images/demo/SignupPage.jpeg";
import PricingPageImageSrc from "images/demo/PricingPage.jpeg";
import AboutUsPageImageSrc from "images/demo/AboutUsPage.jpeg";
import ContactUsPageImageSrc from "images/demo/ContactUsPage.jpeg";
import BlogIndexPageImageSrc from "images/demo/BlogIndexPage.jpeg";
import TermsOfServicePageImageSrc from "images/demo/TermsOfServicePage.jpeg";
import PrivacyPolicyPageImageSrc from "images/demo/PrivacyPolicyPage.jpeg";

// Importação dos componentes de blocos que ainda existem
import BackgroundAsImageHero from "components/hero/BackgroundAsImage.jsx";
import IllustrationAndVideoHero from "components/hero/TwoColumnWithVideo.jsx";
import IllustrationAndInputHero from "components/hero/TwoColumnWithInput.jsx";
import FeaturesAndTestimonialHero from "components/hero/TwoColumnWithFeaturesAndTestimonial.jsx";
import FullWidthWithImageHero from "components/hero/FullWidthWithImage.jsx";
import BackgroundAsImageWithCenteredContentHero from "components/hero/BackgroundAsImageWithCenteredContent.jsx";
import IllustrationAndPrimaryBackgroundHero from "components/hero/TwoColumnWithPrimaryBackground.jsx";

import TwoPlansWithDurationSwitcherPricing from "components/pricing/TwoPlansWithDurationSwitcher.jsx";
import ThreePlansWithHalfPrimaryBackgroundPricing from "components/pricing/ThreePlansWithHalfPrimaryBackground.jsx";
import ThreePlansPricing from "components/pricing/ThreePlans.jsx";

import ThreeColWithSideImageFeatures from "components/features/ThreeColWithSideImage.jsx";
import TwoColWithButtonFeatures from "components/features/TwoColWithButton.jsx";
import ThreeColSimpleFeatures from "components/features/ThreeColSimple.jsx";
import ThreeColWithSideImageWithPrimaryBackgroundFeatures from "components/features/ThreeColWithSideImageWithPrimaryBackground.jsx";
import TwoColVerticalWithButtonFeatures from "components/features/TwoColWithTwoFeaturesAndButtons.jsx";
import TwoColHorizontalWithButtonFeatures from "components/features/TwoColWithTwoHorizontalFeaturesAndButton.jsx";
import WithStepsAndImageFeatures from "components/features/TwoColWithSteps.jsx";
import ThreeColumnDashedBorderFeatures from "components/features/DashedBorderSixFeatures";
import ThreeColCenteredStatsWithPrimaryBackgroundFeatures from "components/features/ThreeColCenteredStatsPrimaryBackground.jsx";
import WithStatsAndImageFeatures from "components/features/TwoColSingleFeatureWithStats.jsx";
import WithStatsAndImage2Features from "components/features/TwoColSingleFeatureWithStats2.jsx";
import VerticalWithAlternateImageAndTextFeatures from "components/features/VerticalWithAlternateImageAndText.jsx";

import SliderCards from "components/cards/ThreeColSlider.jsx";
import TrendingCards from "components/cards/TwoTrendingPreviewCardsWithImage.jsx";
import PortfolioCards from "components/cards/PortfolioTwoCardsWithImage.jsx";
import TabGridCards from "components/cards/TabCardGrid.jsx";
import ProfileThreeColGridCards from "components/cards/ProfileThreeColGrid.jsx";
import ThreeColContactDetailsCards from "components/cards/ThreeColContactDetails.jsx";

import ThreeColSimpleWithImageBlog from "components/blogs/ThreeColSimpleWithImage.jsx";
import ThreeColSimpleWithImageAndDashedBorderBlog from "components/blogs/ThreeColSimpleWithImageAndDashedBorder.jsx";
import PopularAndRecentPostsBlog from "components/blogs/PopularAndRecentBlogPosts.jsx";
import GridWithFeaturedPostBlog from "components/blogs/GridWithFeaturedPost.jsx";

import TwoColumnWithImageTestimonial from "components/testimonials/TwoColumnWithImage.jsx";
import TwoColumnWithImageAndProfilePictureReviewTestimonial from "components/testimonials/TwoColumnWithImageAndProfilePictureReview.jsx";
import TwoColumnWithImageAndRatingTestimonial from "components/testimonials/TwoColumnWithImageAndRating.jsx";
import ThreeColumnWithProfileImageTestimonial from "components/testimonials/ThreeColumnWithProfileImage.jsx";
import SimplePrimaryBackgroundTestimonial from "components/testimonials/SimplePrimaryBackground.jsx";

import SimpleWithSideImageFAQS from "components/faqs/SimpleWithSideImage.jsx";
import SingleColFAQS from "components/faqs/SingleCol.jsx";
import TwoColumnPrimaryBackgroundFAQS from "components/faqs/TwoColumnPrimaryBackground.jsx";

import SimpleContactUsForm from "components/forms/SimpleContactUs.jsx";
import SimpleSubscribeNewsletterForm from "components/forms/SimpleSubscribeNewsletter.jsx";
import TwoColContactUsForm from "components/forms/TwoColContactUsWithIllustration.jsx";
import TwoColContactUsFullForm from "components/forms/TwoColContactUsWithIllustrationFullForm.jsx";

import GetStartedCTA from "components/cta/GetStarted.jsx";
import GetStartedLightCTA from "components/cta/GetStartedLight.jsx";
import DownloadAppCTA from "components/cta/DownloadApp.jsx";

import SimpleFiveColumnFooter from "components/footers/SimpleFiveColumn.jsx";
import FiveColumnWithInputFormFooter from "components/footers/FiveColumnWithInputForm.jsx";
import FiveColumnWithBackgroundFooter from "components/footers/FiveColumnWithBackground.jsx";
import FiveColumnDarkFooter from "components/footers/FiveColumnDark.jsx";
import MiniCenteredFooter from "components/footers/MiniCenteredFooter.jsx";

export const components = {
  landingPages: {
    HotelTravelLandingPage: {
      component: Home,
      imageSrc: HotelTravelLandingPageImageSrc,
      url: "/components/landingPages/HotelTravelLandingPage",
    },
  },

  innerPages: {
    LoginPage: {
      component: LoginPage,
      imageSrc: LoginPageImageSrc,
      scrollAnimationDisabled: true,
      url: "/components/innerPages/LoginPage",
    },
    SignupPage: {
      component: SignupPage,
      url: `/components/innerPages/SignupPage`,
      imageSrc: SignupPageImageSrc,
      scrollAnimationDisabled: true,
    },
    PricingPage: {
      component: PricingPage,
      url: `/components/innerPages/PricingPage`,
      imageSrc: PricingPageImageSrc,
    },
    AboutUsPage: {
      component: AboutUsPage,
      url: `/components/innerPages/AboutUsPage`,
      imageSrc: AboutUsPageImageSrc,
    },
    ContactUsPage: {
      component: ContactUsPage,
      url: `/components/innerPages/ContactUsPage`,
      imageSrc: ContactUsPageImageSrc,
    },
    BlogIndexPage: {
      component: BlogIndexPage,
      url: `/components/innerPages/BlogIndexPage`,
      imageSrc: BlogIndexPageImageSrc,
    },
    TermsOfServicePage: {
      component: TermsOfServicePage,
      url: `/components/innerPages/TermsOfServicePage`,
      imageSrc: TermsOfServicePageImageSrc,
    },
    PrivacyPolicyPage: {
      component: PrivacyPolicyPage,
      url: `/components/innerPages/PrivacyPolicyPage`,
      imageSrc: PrivacyPolicyPageImageSrc,
    },
  },

  blocks: {
    Hero: {
      type: "Hero Section",
      elements: {
        BackgroundAsImage: {
          name: "With Background Image",
          component: BackgroundAsImageHero,
          url: "/components/blocks/Hero/BackgroundAsImage",
        },
        IllustrationAndInput: {
          name: "With Image Illustration and Input",
          component: IllustrationAndInputHero,
          url: "/components/blocks/Hero/IllustrationAndInput",
        },
        IllustrationAndVideo: {
          name: "With Image Illustration and Video",
          component: IllustrationAndVideoHero,
          url: "/components/blocks/Hero/IllustrationAndVideo",
        },
        FeaturesAndTestimonial: {
          name: "With Features And Customer Testimonial",
          component: FeaturesAndTestimonialHero,
          url: "/components/blocks/Hero/FeaturesAndTestimonial",
        },
        FullWidthWithImage: {
          name: "Full Width With Image",
          component: FullWidthWithImageHero,
          url: "/components/blocks/Hero/FullWidthWithImage",
        },
        BackgroundAsImageWithCenteredContent: {
          name: "Full Width Background Image with centered content",
          component: BackgroundAsImageWithCenteredContentHero,
          url: "/components/blocks/Hero/BackgroundAsImageWithCenteredContent",
        },
        IllustrationAndPrimaryBackground: {
          name: "Primary Background With Illustration",
          component: IllustrationAndPrimaryBackgroundHero,
          url: "/components/blocks/Hero/IllustrationAndPrimaryBackground",
        },
      },
    },
    Pricing: {
      type: "Pricing Section",
      elements: {
        TwoPlansWithDurationSwitcher: {
          name: "Two Plans With Duration Switcher",
          component: TwoPlansWithDurationSwitcherPricing,
          url: "/components/blocks/Pricing/TwoPlansWithDurationSwitcher",
        },
        ThreePlansWithHalfPrimaryBackground: {
          name: "Three Plans With Primary Background at Top",
          component: ThreePlansWithHalfPrimaryBackgroundPricing,
          url: "/components/blocks/Pricing/ThreePlansWithHalfPrimaryBackground",
        },
        ThreePlans: {
          name: "Simple Three Plans",
          component: ThreePlansPricing,
          url: "/components/blocks/Pricing/ThreePlans",
        },
      },
    },
    Features: {
      type: "Features Section",
      elements: {
        ThreeColWithSideImage: {
          name: "Three Column With Side Image",
          component: ThreeColWithSideImageFeatures,
          url: "/components/blocks/Features/ThreeColWithSideImage",
        },
        TwoColWithButton: {
          name: "Two Column With Image and Action Button",
          component: TwoColWithButtonFeatures,
          url: "/components/blocks/Features/TwoColWithButton",
        },
        ThreeColSimple: {
          name: "Three Column Simple",
          component: ThreeColSimpleFeatures,
          url: "/components/blocks/Features/ThreeColSimple",
        },
        ThreeColWithSideImageWithPrimaryBackground: {
          name: "Three Column With Side Image With Primary Background",
          component: ThreeColWithSideImageWithPrimaryBackgroundFeatures,
          url: "/components/blocks/Features/ThreeColWithSideImageWithPrimaryBackground",
        },
        TwoColHorizontalWithButton: {
          name: "Two Column With Button and Horizonatal Features with Icon",
          component: TwoColHorizontalWithButtonFeatures,
          url: "/components/blocks/Features/TwoColHorizontalWithButton",
        },
        TwoColVerticalWithButton: {
          name: "Two Column With Vertical Features and Button",
          component: TwoColVerticalWithButtonFeatures,
          url: "/components/blocks/Features/TwoColVerticalWithButton",
        },
        WithStepsAndImage: {
          name: "Steps with Image",
          component: WithStepsAndImageFeatures,
          url: "/components/blocks/Features/WithStepsAndImage",
        },
        ThreeColumnDashedBorder: {
          name: "Three Column With Dashed Primary Border",
          component: ThreeColumnDashedBorderFeatures,
          url: "/components/blocks/Features/ThreeColumnDashedBorder",
        },
        ThreeColCenteredStatsPrimaryBackground: {
          name: "Three Column With Centered Stats on Primary Background",
          component: ThreeColCenteredStatsWithPrimaryBackgroundFeatures,
          url: "/components/blocks/Features/ThreeColCenteredStatsPrimaryBackground",
        },
        WithStatsAndImage: {
          name: "Stats With Image",
          component: WithStatsAndImageFeatures,
          url: "/components/blocks/Features/WithStatsAndImage",
        },
        WithStatsAndImage2: {
          name: "Stats With Image 2",
          component: WithStatsAndImage2Features,
          url: "/components/blocks/Features/WithStatsAndImage2",
        },
        VerticalWithAlternateImageAndText: {
          name: "Vertical Feature Cards With Alternate Image and Text",
          component: VerticalWithAlternateImageAndTextFeatures,
          url: "/components/blocks/Features/VerticalWithAlternateImageAndText",
        },
      },
    },

    Cards: {
      type: "Cards",
      elements: {
        Slider: {
          name: "Three Column Slider",
          component: SliderCards,
          url: "/components/blocks/Cards/Slider",
        },
        Portfolio: {
          name: "Two Column Portfolio Cards With Images ",
          component: PortfolioCards,
          url: "/components/blocks/Cards/Portfolio",
        },
        TabGrid: {
          name: "Tab Card Grid With Tab Switcher",
          component: TabGridCards,
          url: "/components/blocks/Cards/TabGrid",
        },
        ProfileThreeColGrid: {
          name: "Three Column Grid Cards For Profile",
          component: ProfileThreeColGridCards,
          url: "/components/blocks/Cards/ProfileThreeColGrid",
        },
        ThreeColContactDetails: {
          name: "Three Column Contact Details Cards",
          component: ThreeColContactDetailsCards,
          url: "/components/blocks/Cards/ThreeColContactDetails",
        },
        Trending: {
          name: "Two Trending Preview Cards With Images",
          component: TrendingCards,
          url: "/components/blocks/Cards/Trending",
        },
      },
    },

    Blog: {
      type: "Blog Section",
      elements: {
        GridWithFeaturedPost: {
          name: "Grid With Featured Post",
          component: GridWithFeaturedPostBlog,
          url: "/components/blocks/Blog/GridWithFeaturedPost",
        },
        PopularAndRecentPosts: {
          name: "Popular And Recent Posts",
          component: PopularAndRecentPostsBlog,
          url: "/components/blocks/Blog/PopularAndRecentPosts",
        },
        ThreeColSimpleWithImage: {
          name: "Simple Three Column With Image",
          component: ThreeColSimpleWithImageBlog,
          url: "/components/blocks/Blog/ThreeColSimpleWithImage",
        },
        ThreeColSimpleWithImageAndDashedBorder: {
          name: "Simple Three Column With Image and Dashed Border",
          component: ThreeColSimpleWithImageAndDashedBorderBlog,
          url: "/components/blocks/Blog/ThreeColSimpleWithImageAndDashedBorder",
        },
      },
    },

    Testimonial: {
      type: "Testimonial Section",
      elements: {
        TwoColumnWithImage: {
          name: "Two Column With Image",
          component: TwoColumnWithImageTestimonial,
          url: "/components/blocks/Testimonial/TwoColumnWithImage",
        },
        TwoColumnWithImageAndProfilePictureReview: {
          name: "Two Column With Image And Profile Picture Review",
          component: TwoColumnWithImageAndProfilePictureReviewTestimonial,
          url: "/components/blocks/Testimonial/TwoColumnWithImageAndProfilePictureReview",
        },
        TwoColumnWithImageAndRating: {
          name: "Two Column With Image And Rating",
          component: TwoColumnWithImageAndRatingTestimonial,
          url: "/components/blocks/Testimonial/TwoColumnWithImageAndRating",
        },
        ThreeColumnWithProfileImage: {
          name: "Three Column With Profile Image",
          component: ThreeColumnWithProfileImageTestimonial,
          url: "/components/blocks/Testimonial/ThreeColumnWithProfileImage",
        },
        SimplePrimaryBackground: {
          name: "Simple With Primary Background",
          component: SimplePrimaryBackgroundTestimonial,
          url: "/components/blocks/Testimonial/SimplePrimaryBackground",
        },
      },
    },

    FAQS: {
      type: "FAQs Section",
      elements: {
        SimpleWithSideImage: {
          name: "Simple With Side Image",
          component: SimpleWithSideImageFAQS,
          url: "/components/blocks/FAQS/SimpleWithSideImage",
        },
        SingleCol: {
          name: "Single Column",
          component: SingleColFAQS,
          url: "/components/blocks/FAQS/SingleCol",
        },
        TwoColumnPrimaryBackground: {
          name: "Two Column With Primary Background",
          component: TwoColumnPrimaryBackgroundFAQS,
          url: "/components/blocks/FAQS/TwoColumnPrimaryBackground",
        },
      },
    },

    Form: {
      type: "Forms Section",
      elements: {
        SimpleContactUs: {
          name: "Simple Contact Us",
          component: SimpleContactUsForm,
          url: "/components/blocks/Form/SimpleContactUs",
        },
        SimpleSubscribeNewsletter: {
          name: "Simple Subscribe newsletter",
          component: SimpleSubscribeNewsletterForm,
          url: "/components/blocks/Form/SimpleSubscribeNewsletter",
        },
        TwoColContactUs: {
          name: "Two Column Contact Us",
          component: TwoColContactUsForm,
          url: "/components/blocks/Form/TwoColContactUs",
        },
        TwoColContactUsFull: {
          name: "Two Column Contact Us - Full Form",
          component: TwoColContactUsFullForm,
          url: "/components/blocks/Form/TwoColContactUsFull",
        },
      },
    },

    CTA: {
      type: "CTA Section",
      elements: {
        GetStarted: {
          name: "Get Started",
          component: GetStartedCTA,
          url: "/components/blocks/CTA/GetStarted",
        },
        GetStartedLight: {
          name: "Get Started Light",
          component: GetStartedLightCTA,
          url: "/components/blocks/CTA/GetStartedLight",
        },
        DownloadApp: {
          name: "Download App",
          component: DownloadAppCTA,
          url: "/components/blocks/CTA/DownloadApp",
        },
      },
    },

    Footer: {
      type: "Footers Section",
      elements: {
        SimpleFiveColumn: {
          name: "Simple Five Column",
          component: SimpleFiveColumnFooter,
          url: "/components/blocks/Footer/SimpleFiveColumn",
        },
        FiveColumnWithInputForm: {
          name: "Five Column With Input Form",
          component: FiveColumnWithInputFormFooter,
          url: "/components/blocks/Footer/FiveColumnWithInputForm",
        },
        FiveColumnWithBackground: {
          name: "Five Column With background",
          component: FiveColumnWithBackgroundFooter,
          url: "/components/blocks/Footer/FiveColumnWithBackground",
        },
        FiveColumnDark: {
          name: "Five Column Dark",
          component: FiveColumnDarkFooter,
          url: "/components/blocks/Footer/FiveColumnDark",
        },
        MiniCentered: {
          name: "Mini Centered Dark",
          component: MiniCenteredFooter,
          url: "/components/blocks/Footer/MiniCentered",
        },
      },
    },
  },
};

export default () => {
  const { type, subtype, name } = useParams();

  try {
    let Component = null;
    if (type === "blocks" && subtype) {
      Component = components[type][subtype]["elements"][name].component;
      return (
        <AnimationRevealPage disabled>
          <Component />
        </AnimationRevealPage>
      );
    } else Component = components[type][name].component;

    if (Component) return <Component />;

    throw new Error("Component Not Found");
  } catch (e) {
    console.log(e);
    return <div>Error: Component Not Found</div>;
  }
};

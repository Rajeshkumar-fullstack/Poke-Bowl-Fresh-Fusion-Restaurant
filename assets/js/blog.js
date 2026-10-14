/**
 * Poke Bowl & Fresh Fusion - Blog & Article Showcase Script
 * Features: Live Search, Category Filtering, Article Modal Reader, Reading Progress Bar
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Article Database for Modal Reader
  const blogArticles = {
    'perfect-poke-guide': {
      title: 'The Anatomy of a Perfect Poke Bowl: Balancing Flavors, Umami & Crunch',
      category: 'Culinary Guide',
      badgeClass: 'badge-coral',
      date: 'October 8, 2026',
      readTime: '6 min read',
      author: 'Chef Kai Nakamura',
      authorRole: 'Executive Chef & Co-Founder',
      authorAvatar: 'assets/images/team/chef-kai.jpg',
      imageSm: 'assets/images/blog/blog-anatomy-perfect-poke-sm.jpg',
      imageMd: 'assets/images/blog/blog-anatomy-perfect-poke-md.jpg',
      imageLg: 'assets/images/blog/blog-anatomy-perfect-poke.jpg',
      content: `
        <p class="lead fw-semibold text-emerald-600 dark:text-emerald-400 mb-4">
          A genuine Hawaiian poke bowl is much more than raw fish on rice—it is an art form of harmonious textures, umami depth, balanced acidity, and refreshing crunch.
        </p>

        <h3>1. The Foundation: Base Selection</h3>
        <p>
          The base sets the thermal and textural stage. While warm, lightly seasoned short-grain sushi rice is the timeless classic, combining warm rice with chilled sashimi creates an exquisite contrast. For lighter, nutrient-dense alternatives, organic brown rice, mixed leafy greens, or spiralized zucchini noodles provide crispness and fiber without overshadowing delicate proteins.
        </p>

        <div class="blog-article-callout">
          <i class="bi bi-lightbulb-fill text-amber-500 me-2"></i>
          <strong>Chef Kai's Pro-Tip:</strong> Never assemble cold fish over boiling-hot rice. Let the seasoned rice cool to lukewarm (~35°C / 95°F) so the delicate sashimi oils remain velvety and fresh.
        </div>

        <h3>2. Sashimi-Grade Fish & Marinades</h3>
        <p>
          The soul of poke lies in clean, sashimi-grade cuts (Ahi Tuna, King Salmon, or Hamachi). The cut must be clean, cubed precisely to 3/4-inch dice for optimal mouthfeel. Unlike ceviche, which cures fish in high-acid citrus for hours, poke is tossed gently right before serving or marinated for mere minutes in toasted sesame oil, tamari, and grated ginger.
        </p>

        <h3>3. Textural Accents & Umami Finish</h3>
        <p>
          Every sensational bowl requires layered textures: the creaminess of Hass avocado, the pop of steamed edamame, the briny crunch of wakame seaweed, and the nutty crunch of roasted kukui nuts (inamona) or toasted sesame seeds. Finish with a drizzle of house sesame shoyu or citrus ponzu to tie every layer together.
        </p>
      `
    },
    'omega3-health-boost': {
      title: 'Omega-3 Superpowers: Why Sashimi-Grade Salmon & Tuna Boost Longevity',
      category: 'Nutrition & Health',
      badgeClass: 'badge-green',
      date: 'October 5, 2026',
      readTime: '5 min read',
      author: 'Dr. Maya Lin',
      authorRole: 'Lead Nutritionist',
      authorAvatar: 'assets/images/team/nutritionist-maya.jpg',
      imageSm: 'assets/images/blog/blog-omega3-salmon-health-sm.jpg',
      imageMd: 'assets/images/blog/blog-omega3-salmon-health-md.jpg',
      imageLg: 'assets/images/blog/blog-omega3-salmon-health.jpg',
      content: `
        <p class="lead fw-semibold text-emerald-600 dark:text-emerald-400 mb-4">
          Cold-water pelagic fish like wild salmon and yellowfin ahi tuna are nature’s richest dietary sources of EPA and DHA long-chain omega-3 fatty acids.
        </p>

        <h3>Cardiovascular Protection & Cellular Vitality</h3>
        <p>
          Consuming raw, minimally processed sashimi-grade fish ensures that heat-sensitive omega-3 polyunsaturated fatty acids remain 100% intact and bioavailable. Clinical studies consistently correlate regular dietary omega-3 intake with lower systemic inflammation, optimal triglyceride levels, and improved vascular elasticity.
        </p>

        <div class="blog-article-callout">
          <i class="bi bi-heart-pulse-fill text-rose-500 me-2"></i>
          <strong>Macro Fact:</strong> A standard 6oz serving of Atlantic Salmon in our Signature Bowls delivers over 2,200mg of active Omega-3s plus 34g of complete lean protein.
        </div>

        <h3>Synergy with Healthy Fats and Leafy Greens</h3>
        <p>
          When paired with monounsaturated fats from fresh avocado and antioxidants from dark leafy greens and seaweed, fat-soluble vitamins (A, D, E, K) are absorbed up to 400% more efficiently by the digestive system.
        </p>
      `
    },
    'sustainable-fisheries': {
      title: 'From Ocean to Bowl: Our 100% Sustainable Fishery and Farm Partnerships',
      category: 'Sustainability',
      badgeClass: 'badge-blue',
      date: 'September 28, 2026',
      readTime: '4 min read',
      author: 'David Vance',
      authorRole: 'Operations & Sourcing Director',
      authorAvatar: 'assets/images/team/manager-david.jpg',
      imageSm: 'assets/images/blog/blog-sustainable-fisheries-sm.jpg',
      imageMd: 'assets/images/blog/blog-sustainable-fisheries-md.jpg',
      imageLg: 'assets/images/blog/blog-sustainable-fisheries.jpg',
      content: `
        <p class="lead fw-semibold text-emerald-600 dark:text-emerald-400 mb-4">
          We believe delicious food should never come at the expense of our marine ecosystems. Here is our rigorous sourcing blueprint.
        </p>

        <h3>Traceable Line-Caught Sourcing</h3>
        <p>
          Every catch delivered to our prep kitchens is traceable back to certified sustainable fishing cooperatives. We partner exclusively with MSC-certified (Marine Stewardship Council) pole-and-line tuna fisheries in the Pacific, eliminating destructive drift nets and bycatch.
        </p>

        <div class="blog-article-callout">
          <i class="bi bi-shield-check text-emerald-500 me-2"></i>
          <strong>Zero-Waste Kitchen Mandate:</strong> 100% of our takeout bowls, cutlery, and cups are certified compostable BPI plant-fiber polymers.
        </div>

        <h3>Supporting Local Organic Farmers</h3>
        <p>
          Our produce—from organic Persian cucumbers and microgreens to Hass avocados—is harvested from regional partner farms within a 150-mile radius, ensuring optimal freshness and minimizing transport emissions.
        </p>
      `
    },
    'plant-based-tofu-guide': {
      title: 'Beyond Fish: The Rise of Plant-Based Poke & House-Marinated Tofu',
      category: 'Plant Power',
      badgeClass: 'badge-green',
      date: 'September 22, 2026',
      readTime: '5 min read',
      author: 'Leila Alvarez',
      authorRole: 'Prep & Recipe Specialist',
      authorAvatar: 'assets/images/team/prep-leila.jpg',
      imageSm: 'assets/images/blog/blog-plant-based-tofu-guide-sm.jpg',
      imageMd: 'assets/images/blog/blog-plant-based-tofu-guide-md.jpg',
      imageLg: 'assets/images/blog/blog-plant-based-tofu-guide.jpg',
      content: `
        <p class="lead fw-semibold text-emerald-600 dark:text-emerald-400 mb-4">
          Plant-based poke is no longer an afterthought—it is a culinary sensation loaded with complex marinades, earthy textures, and vibrant colors.
        </p>

        <h3>The Art of Pressing and Marinating Organic Tofu</h3>
        <p>
          The secret to our Tofu Goddess Bowl begins with non-GMO organic extra-firm tofu. We press out excess moisture for 4 hours, then slow-braise the cubes in roasted ginger, tamari, and toasted sesame oil. A quick sear over cast-iron creates a caramelized crust with a silky, rich interior.
        </p>

        <h3>Superfood Additions</h3>
        <p>
          We layer our vegan creations with spiralized rainbow carrots, steamed edamame, pickled red cabbage, sliced avocado, and house-made roasted tahini garlic dressing for deep, savory umami without dairy or fish sauce.
        </p>
      `
    },
    'artisan-sauces-guide': {
      title: 'The Secret Behind Authentic Shoyu & Citrus Yuzu Ponzu Sauces',
      category: 'Secret Recipes',
      badgeClass: 'badge-amber',
      date: 'September 15, 2026',
      readTime: '4 min read',
      author: 'Chef Kai Nakamura',
      authorRole: 'Executive Chef & Co-Founder',
      authorAvatar: 'assets/images/team/chef-kai.jpg',
      imageSm: 'assets/images/blog/blog-artisan-sauces-guide-sm.jpg',
      imageMd: 'assets/images/blog/blog-artisan-sauces-guide-md.jpg',
      imageLg: 'assets/images/blog/blog-artisan-sauces-guide.jpg',
      content: `
        <p class="lead fw-semibold text-emerald-600 dark:text-emerald-400 mb-4">
          Great dressings bring a poke bowl alive. Learn the ratios and artisanal philosophy behind our top handcrafted signature sauces.
        </p>

        <h3>1. House Sesame Shoyu</h3>
        <p>
          Our flagship sauce blends naturally brewed Japanese tamari with cold-pressed toasted sesame oil, grated ginger root, minced scallions, and a touch of organic agave nectar. It provides roundness, warmth, and savory depth without drowning the delicate fish.
        </p>

        <h3>2. Citrus Yuzu Ponzu</h3>
        <p>
          Yuzu, a fragrant Japanese citrus fruit with notes of mandarin, grapefruit, and lime, is combined with rice vinegar and gluten-free soy sauce. Its bright, crisp acidity cuts through the richness of King Salmon and avocado like a culinary dream.
        </p>
      `
    },
    'fitness-macro-prep': {
      title: 'Poke for Athletes: Building High-Protein Macro Bowls for Recovery',
      category: 'Fitness & Lifestyle',
      badgeClass: 'badge-coral',
      date: 'September 10, 2026',
      readTime: '5 min read',
      author: 'Dr. Maya Lin',
      authorRole: 'Lead Nutritionist',
      authorAvatar: 'assets/images/team/nutritionist-maya.jpg',
      imageSm: 'assets/images/blog/blog-fitness-macro-prep-sm.jpg',
      imageMd: 'assets/images/blog/blog-fitness-macro-prep-md.jpg',
      imageLg: 'assets/images/blog/blog-fitness-macro-prep.jpg',
      content: `
        <p class="lead fw-semibold text-emerald-600 dark:text-emerald-400 mb-4">
          Customizable poke bowls are the ultimate athlete's meal: high bioavailable protein, clean complex carbs, and recovery-enhancing micronutrients.
        </p>

        <h3>The Muscle-Recovery Formula</h3>
        <p>
          For post-workout glycogen replenishment and protein synthesis, aim for a 2:1 or 3:1 carb-to-protein ratio. Double-protein portions (e.g. Grilled Chicken + Poached Shrimp or Double Salmon) easily hit 45g–55g of high-quality protein per meal.
        </p>

        <div class="blog-article-callout">
          <i class="bi bi-activity text-blue-500 me-2"></i>
          <strong>Electrolyte Hydration:</strong> Fresh cucumbers and seaweed provide natural potassium and magnesium to prevent cramping and accelerate cellular hydration.
        </div>

        <h3>Clean Fuel Without the Sugar Spike</h3>
        <p>
          Opt for brown rice or quinoa as your base, ask for dressings on the side or choose light ponzu, and load up on antioxidant-rich toppings like microgreens, radishes, and edamame.
        </p>
      `
    },
    'hawaiian-poke-history': {
      title: 'A Brief History of Hawaiian Poke: From Native Fishermen to Modern Fusion',
      category: 'Heritage & Culture',
      badgeClass: 'badge-blue',
      date: 'September 01, 2026',
      readTime: '7 min read',
      author: 'David Vance',
      authorRole: 'Operations & Sourcing Director',
      authorAvatar: 'assets/images/team/manager-david.jpg',
      imageSm: 'assets/images/blog/blog-hawaiian-poke-history-sm.jpg',
      imageMd: 'assets/images/blog/blog-hawaiian-poke-history-md.jpg',
      imageLg: 'assets/images/blog/blog-hawaiian-poke-history.jpg',
      content: `
        <p class="lead fw-semibold text-emerald-600 dark:text-emerald-400 mb-4">
          The word "poke" (pronounced poh-KAY) translates directly in the Hawaiian language to "to slice or cut crosswise into pieces."
        </p>

        <h3>Ancient Polynesian Roots</h3>
        <p>
          Centuries before poke gained global acclaim, native Hawaiian fishermen prepared freshly caught reef fish by gutting, skinning, and cutting the raw meat into bite-sized morsels. They seasoned it simply with Hawaiian sea salt (pa'akai), limu (crunchy reef seaweed), and inamona (roasted, crushed candlenuts / kukui).
        </p>

        <h3>The 19th & 20th Century Asian Culinary Fusion</h3>
        <p>
          In the late 1800s and early 1900s, immigrant workers from Japan, the Philippines, and China arrived to work on Hawaiian plantations. They introduced shoyu (soy sauce), sesame oil, and ginger to the islands. This cross-cultural dialogue transformed poke into the beloved modern staple we celebrate today.
        </p>
      `
    },
    'knife-skills-sashimi': {
      title: 'Japanese Yanagiba Knife Mastery: How Precision Cuts Transform Sashimi Texture',
      category: 'Culinary Guide',
      badgeClass: 'badge-coral',
      date: 'August 26, 2026',
      readTime: '5 min read',
      author: 'Chef Kai Nakamura',
      authorRole: 'Executive Chef & Co-Founder',
      authorAvatar: 'assets/images/team/chef-kai.jpg',
      imageSm: 'assets/images/blog/blog-knife-skills-sashimi-sm.jpg',
      imageMd: 'assets/images/blog/blog-knife-skills-sashimi-md.jpg',
      imageLg: 'assets/images/blog/blog-knife-skills-sashimi.jpg',
      content: `
        <p class="lead fw-semibold text-emerald-600 dark:text-emerald-400 mb-4">
          In Japanese and Hawaiian sashimi preparation, how you slice the fish determines its gloss, mouthfeel, and how evenly it absorbs house marinades.
        </p>

        <h3>The Single-Bevel Pull Stroke</h3>
        <p>
          Our kitchen artisans use traditional long-bladed Yanagiba knives sharpened on 8,000-grit water stones. By drawing the blade from heel to tip in a single smooth motion rather than sawing downward, microscopic cell walls stay intact—preventing moisture loss and keeping each cube of Ahi tuna and Norwegian salmon buttery smooth.
        </p>
      `
    },
    'gut-health-seaweed': {
      title: 'Seaweed, Pickled Ginger & Ferments: The Microbiome Benefits of Poke Toppings',
      category: 'Nutrition & Health',
      badgeClass: 'badge-green',
      date: 'August 19, 2026',
      readTime: '6 min read',
      author: 'Dr. Maya Lin',
      authorRole: 'Lead Nutritionist',
      authorAvatar: 'assets/images/team/nutritionist-maya.jpg',
      imageSm: 'assets/images/blog/blog-gut-health-seaweed-sm.jpg',
      imageMd: 'assets/images/blog/blog-gut-health-seaweed-md.jpg',
      imageLg: 'assets/images/blog/blog-gut-health-seaweed.jpg',
      content: `
        <p class="lead fw-semibold text-emerald-600 dark:text-emerald-400 mb-4">
          Your favorite crunchy poke toppings do far more than add flavor—they deliver marine prebiotics, organic acids, and trace minerals essential for gut diversity.
        </p>

        <h3>Marine Polysaccharides & Digestive Enzymes</h3>
        <p>
          Wakame and nori seaweeds are rich in fucoidan and alginate fibers that nourish beneficial gut flora, while house-pickled ginger and fermented miso dressings stimulate digestive enzymes for effortless nutrient absorption.
        </p>
      `
    },
    'compostable-packaging': {
      title: 'Plastic-Free Oceans: Inside Our 100% Plant-Fiber Compostable Bowl Initiative',
      category: 'Sustainability',
      badgeClass: 'badge-blue',
      date: 'August 12, 2026',
      readTime: '4 min read',
      author: 'David Vance',
      authorRole: 'Operations & Sourcing Director',
      authorAvatar: 'assets/images/team/manager-david.jpg',
      imageSm: 'assets/images/blog/blog-compostable-packaging-sm.jpg',
      imageMd: 'assets/images/blog/blog-compostable-packaging-md.jpg',
      imageLg: 'assets/images/blog/blog-compostable-packaging.jpg',
      content: `
        <p class="lead fw-semibold text-emerald-600 dark:text-emerald-400 mb-4">
          Protecting the oceans that provide our seafood starts right at our takeout counter with 100% PFAS-free, plant-based compostable packaging.
        </p>

        <h3>Upcycled Sugarcane Bagasse & Bamboo</h3>
        <p>
          Every bowl, lid, and sauce cup we use is crafted from reclaimed sugarcane fiber and rapidly renewable bamboo that breaks down completely within 90 days in commercial composting facilities.
        </p>
      `
    },
    'avocado-superfood-pairing': {
      title: 'Hass Avocado & Edamame: Complete Plant Proteins for Vibrant Vegan Bowls',
      category: 'Plant Power',
      badgeClass: 'badge-green',
      date: 'August 05, 2026',
      readTime: '5 min read',
      author: 'Leila Alvarez',
      authorRole: 'Prep & Recipe Specialist',
      authorAvatar: 'assets/images/team/prep-leila.jpg',
      imageSm: 'assets/images/blog/blog-avocado-superfood-pairing-sm.jpg',
      imageMd: 'assets/images/blog/blog-avocado-superfood-pairing-md.jpg',
      imageLg: 'assets/images/blog/blog-avocado-superfood-pairing.jpg',
      content: `
        <p class="lead fw-semibold text-emerald-600 dark:text-emerald-400 mb-4">
          Combining steamed young edamame beans with organic tofu, tri-color quinoa, and creamy Hass avocado creates a complete amino acid profile rivaling any animal protein.
        </p>

        <h3>Sustained Plant Energy</h3>
        <p>
          With 10g+ of soluble and insoluble fiber per bowl alongside heart-healthy monounsaturated fats, our Plant Power bowls keep blood sugar steady and energy high all afternoon.
        </p>
      `
    },
    'spicy-sriracha-aioli': {
      title: 'Crafting Our Signature Roasted Chili Sriracha Aioli & Wasabi Citrus Drizzle',
      category: 'Secret Recipes',
      badgeClass: 'badge-amber',
      date: 'July 28, 2026',
      readTime: '4 min read',
      author: 'Chef Kai Nakamura',
      authorRole: 'Executive Chef & Co-Founder',
      authorAvatar: 'assets/images/team/chef-kai.jpg',
      imageSm: 'assets/images/blog/blog-spicy-sriracha-aioli-sm.jpg',
      imageMd: 'assets/images/blog/blog-spicy-sriracha-aioli-md.jpg',
      imageLg: 'assets/images/blog/blog-spicy-sriracha-aioli.jpg',
      content: `
        <p class="lead fw-semibold text-emerald-600 dark:text-emerald-400 mb-4">
          Balanced heat should elevate sashimi rather than mask it. Here is how we craft our small-batch spicy emulsions every morning.
        </p>

        <h3>Sun-Ripened Chili & Cold-Pressed Avocado Oil</h3>
        <p>
          We slow-roast red jalapeño peppers with garlic, balance the heat with organic lime juice and Japanese rice vinegar, and whisk it into a velvety avocado-oil emulsion for clean, lingering warmth.
        </p>
      `
    },
    'hydration-electrolytes': {
      title: 'Pre- vs. Post-Workout Poke: Timing Complex Carbs and Lean Marine Proteins',
      category: 'Fitness & Lifestyle',
      badgeClass: 'badge-coral',
      date: 'July 19, 2026',
      readTime: '5 min read',
      author: 'Dr. Maya Lin',
      authorRole: 'Lead Nutritionist',
      authorAvatar: 'assets/images/team/nutritionist-maya.jpg',
      imageSm: 'assets/images/blog/blog-hydration-electrolytes-sm.jpg',
      imageMd: 'assets/images/blog/blog-hydration-electrolytes-md.jpg',
      imageLg: 'assets/images/blog/blog-hydration-electrolytes.jpg',
      content: `
        <p class="lead fw-semibold text-emerald-600 dark:text-emerald-400 mb-4">
          Whether you are training for a marathon or lifting heavy, tailoring your poke base and protein ratio unlocks peak performance and faster recovery.
        </p>

        <h3>Pre-Workout Fuel vs. Post-Workout Repair</h3>
        <p>
          90 minutes before training, pair sushi rice with lean Ahi tuna and mango for rapid glycogen availability. Post-training, choose brown rice or quinoa with double salmon or grilled chicken for sustained amino acid delivery and anti-inflammatory omega-3 recovery.
        </p>
      `
    }
  };

  // DOM Elements
  const searchInput = document.getElementById('blogSearchInput');
  const filterButtons = document.querySelectorAll('.blog-filter-btn');
  const blogCards = document.querySelectorAll('.blog-card-item');
  const featuredSection = document.getElementById('featuredStorySection');
  const blogGridSection = document.getElementById('blogGridContainer')?.closest('section');
  const noResultsMsg = document.getElementById('noBlogResults');
  const modalElement = document.getElementById('blogArticleModal');
  const readingProgressBar = document.getElementById('readingProgressBar');
  const newsletterForm = document.getElementById('blogNewsletterForm');
  const newsletterAlert = document.getElementById('newsletterSuccessAlert');

  // Search & Filter Bar Sentinel references
  const stickySentinel = document.getElementById('blogStickySentinel');
  const stickyBar = document.getElementById('blogStickyBar');
  const mainNavbar = document.getElementById('mainNavbar');
  const blogHero = stickySentinel?.closest('header');

  // Sticky Filter Bar Controller with sentinel height compensation
  function updateStickyFilterBar() {
    if (!stickySentinel || !stickyBar) return;
    const navHeight = mainNavbar ? mainNavbar.offsetHeight : 70;
    const sentinelRect = stickySentinel.getBoundingClientRect();

    if (sentinelRect.top <= navHeight) {
      if (!stickyBar.classList.contains('is-stuck')) {
        stickySentinel.style.minHeight = `${stickyBar.offsetHeight}px`;
        stickyBar.classList.add('is-stuck');
        if (blogHero) blogHero.classList.add('has-stuck-bar');
      }
      stickyBar.style.top = `${navHeight}px`;
    } else {
      if (stickyBar.classList.contains('is-stuck')) {
        stickyBar.classList.remove('is-stuck');
        stickyBar.style.top = '';
        stickySentinel.style.minHeight = '';
        if (blogHero) blogHero.classList.remove('has-stuck-bar');
      }
    }
  }

  window.addEventListener('scroll', updateStickyFilterBar, { passive: true });
  window.addEventListener('resize', updateStickyFilterBar);
  updateStickyFilterBar();

  let currentCategory = 'all';
  let currentSearchQuery = '';

  // Filter & Search Handler
  function filterArticles() {
    let visibleCount = 0;

    blogCards.forEach((card) => {
      const category = card.getAttribute('data-category') || '';
      const badgeText = card.querySelector('.blog-card-badge')?.textContent || '';
      const title = card.querySelector('.blog-card-title')?.textContent.toLowerCase() || '';
      const excerpt = card.querySelector('.blog-card-excerpt')?.textContent.toLowerCase() || '';
      const author = card.querySelector('.blog-author-name')?.textContent.toLowerCase() || '';

      const matchesCategory =
        currentCategory === 'all' ||
        category.toLowerCase() === currentCategory.toLowerCase() ||
        badgeText.toLowerCase() === currentCategory.toLowerCase();
      const matchesSearch =
        !currentSearchQuery ||
        title.includes(currentSearchQuery) ||
        excerpt.includes(currentSearchQuery) ||
        author.includes(currentSearchQuery) ||
        category.toLowerCase().includes(currentSearchQuery) ||
        badgeText.toLowerCase().includes(currentSearchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = '';
        card.classList.remove('d-none', 'is-hidden');
        card.classList.add('is-visible');
        card.style.transitionDelay = '0ms';
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.classList.add('d-none', 'is-hidden');
      }
    });

    if (featuredSection) {
      const featuredCard = featuredSection.querySelector('.featured-blog-card');
      if (featuredCard && featuredCard.classList.contains('d-none')) {
        featuredSection.classList.add('d-none');
      } else {
        featuredSection.classList.remove('d-none');
      }
    }

    if (noResultsMsg) {
      if (visibleCount === 0) {
        noResultsMsg.classList.remove('d-none');
      } else {
        noResultsMsg.classList.add('d-none');
      }
    }
  }

  // Category Filter Buttons
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      filterArticles();

      const targetSec = (featuredSection && !featuredSection.classList.contains('d-none')) ? featuredSection : blogGridSection;
      if (targetSec && window.scrollY > targetSec.offsetTop) {
        const navHeight = mainNavbar ? mainNavbar.offsetHeight : 70;
        window.scrollTo({ top: Math.max(0, targetSec.offsetTop - navHeight - 12), behavior: 'smooth' });
      }
    });
  });

  // Search Input Handler (Immediate + Debounced)
  if (searchInput) {
    let searchDebounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        currentSearchQuery = e.target.value.trim().toLowerCase();
        filterArticles();
      }, 80);
    });
  }

  // Article Modal Reader Trigger & Active State
  let currentOpenArticle = null;
  document.querySelectorAll('[data-article-id]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const articleId = trigger.getAttribute('data-article-id');
      const article = blogArticles[articleId];
      if (!article) return;

      // Populate Modal Fields
      const modalTitle = document.getElementById('modalArticleTitle');
      const modalBadge = document.getElementById('modalArticleBadge');
      const modalDate = document.getElementById('modalArticleDate');
      const modalReadTime = document.getElementById('modalArticleReadTime');
      const modalAuthorName = document.getElementById('modalArticleAuthorName');
      const modalAuthorRole = document.getElementById('modalArticleAuthorRole');
      const modalAuthorAvatar = document.getElementById('modalArticleAuthorAvatar');
      const modalBody = document.getElementById('modalArticleBody');
      const modalImg = document.getElementById('modalArticleImg');
      const modalSourceSm = document.getElementById('modalArticleSourceSm');
      const modalSourceMd = document.getElementById('modalArticleSourceMd');

      if (modalTitle) modalTitle.textContent = article.title;
      if (modalBadge) {
        modalBadge.textContent = article.category;
        modalBadge.className = `badge-poke ${article.badgeClass}`;
      }
      if (modalDate) modalDate.innerHTML = `<i class="bi bi-calendar3 me-1"></i> ${article.date}`;
      if (modalReadTime) modalReadTime.innerHTML = `<i class="bi bi-clock me-1"></i> ${article.readTime}`;
      if (modalAuthorName) modalAuthorName.textContent = article.author;
      if (modalAuthorRole) modalAuthorRole.textContent = article.authorRole;
      if (modalAuthorAvatar) modalAuthorAvatar.src = article.authorAvatar;
      if (modalBody) modalBody.innerHTML = article.content;

      if (modalSourceSm) modalSourceSm.srcset = article.imageSm;
      if (modalSourceMd) modalSourceMd.srcset = article.imageMd;
      if (modalImg) {
        modalImg.src = article.imageLg;
        modalImg.srcset = `${article.imageSm} 480w, ${article.imageMd} 800w, ${article.imageLg} 1600w`;
        modalImg.alt = article.title;
      }

      // Store active article for sharing and ordering
      currentOpenArticle = { id: articleId, ...article };

      // Open Bootstrap Modal
      if (window.bootstrap && modalElement) {
        const bsModal = bootstrap.Modal.getOrCreateInstance(modalElement);
        bsModal.show();
      }
    });
  });

  // ========================================================================
  // Article Social Media Sharing Handlers
  // ========================================================================
  const shareTwitterBtn = document.getElementById('modalShareTwitterBtn');
  const shareFacebookBtn = document.getElementById('modalShareFacebookBtn');
  const shareCopyBtn = document.getElementById('modalShareCopyBtn');
  const shareToastMsg = document.getElementById('modalShareToastMsg');

  function getArticleShareUrl() {
    const origin = window.location.origin && window.location.origin !== 'null' ? window.location.origin : '';
    const pathname = window.location.pathname || '';
    const articleId = currentOpenArticle ? currentOpenArticle.id : '';
    return articleId ? `${origin}${pathname}?article=${encodeURIComponent(articleId)}` : window.location.href;
  }

  function getArticleShareTitle() {
    return currentOpenArticle ? `${currentOpenArticle.title} | Poke Bowl & Fresh Fusion` : document.title;
  }

  if (shareTwitterBtn) {
    shareTwitterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = getArticleShareTitle();
      const url = getArticleShareUrl();
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      window.open(tweetUrl, '_blank', 'width=600,height=450,noopener,noreferrer');
    });
  }

  if (shareFacebookBtn) {
    shareFacebookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = getArticleShareUrl();
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(fbUrl, '_blank', 'width=600,height=500,noopener,noreferrer');
    });
  }

  function fallbackCopyText(text) {
    const temp = document.createElement('textarea');
    temp.value = text;
    temp.style.position = 'fixed';
    temp.style.opacity = '0';
    document.body.appendChild(temp);
    temp.focus();
    temp.select();
    try {
      document.execCommand('copy');
      showCopyToast();
    } catch (err) {
      console.warn('Copy fallback failed', err);
    }
    document.body.removeChild(temp);
  }

  function showCopyToast() {
    if (shareToastMsg) {
      shareToastMsg.classList.remove('d-none');
      setTimeout(() => {
        shareToastMsg.classList.add('d-none');
      }, 2500);
    }
    if (shareCopyBtn) {
      const origHtml = shareCopyBtn.innerHTML;
      shareCopyBtn.innerHTML = '<i class="bi bi-check-lg text-emerald-500 fs-6"></i>';
      setTimeout(() => {
        shareCopyBtn.innerHTML = origHtml;
      }, 2000);
    }
    if (window.PokeCart && typeof window.PokeCart.showToastNotification === 'function') {
      window.PokeCart.showToastNotification('Article link copied to clipboard!');
    }
  }

  if (shareCopyBtn) {
    shareCopyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = getArticleShareUrl();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          showCopyToast();
        }).catch(() => {
          fallbackCopyText(url);
        });
      } else {
        fallbackCopyText(url);
      }
    });
  }

  // ========================================================================
  // "Order This Bowl" Modal & Form Handling
  // ========================================================================
  const modalArticleOrderBtn = document.getElementById('modalArticleOrderBtn');
  const blogOrderModalEl = document.getElementById('blogOrderModal');
  const blogOrderBowlImg = document.getElementById('blogOrderBowlImg');
  const blogOrderBowlTitle = document.getElementById('blogOrderBowlTitle');
  const blogOrderBowlPrice = document.getElementById('blogOrderBowlPrice');
  const blogOrderForm = document.getElementById('blogOrderForm');
  const blogOrderSuccessBox = document.getElementById('blogOrderSuccessBox');
  const blogOrderSuccessBowlName = document.getElementById('blogOrderSuccessBowlName');
  const blogOrderSuccessRef = document.getElementById('blogOrderSuccessRef');
  const blogOrderErrorAlert = document.getElementById('blogOrderErrorAlert');
  const blogOrderErrorAlertText = document.getElementById('blogOrderErrorAlertText');
  const blogOrderFullPageLink = document.getElementById('blogOrderFullPageLink');
  const blogOrderQtyMinus = document.getElementById('blogOrderQtyMinus');
  const blogOrderQtyPlus = document.getElementById('blogOrderQtyPlus');
  const blogOrderQtyVal = document.getElementById('blogOrderQtyVal');

  let currentBlogOrderQty = 1;

  function getArticleBowlInfo(article) {
    if (!article) return { title: 'Signature Hawaiian Poke Bowl', price: '$14.95', img: 'assets/images/bowls/classic-ahi-tuna.jpg' };
    
    const bowlMap = {
      'perfect-poke-guide': { title: 'Classic Hawaiian Ahi Tuna Bowl', price: '$14.95', img: 'assets/images/bowls/classic-ahi-tuna.jpg' },
      'omega3-health-boost': { title: 'Spicy Atlantic Salmon Crunch', price: '$15.50', img: 'assets/images/bowls/spicy-salmon-crunch.jpg' },
      'sustainable-fisheries': { title: 'Wild Pacific Hamachi Citrus Bowl', price: '$16.25', img: 'assets/images/bowls/wild-hamachi-citrus.jpg' },
      'plant-based-poke': { title: 'Sesame Ginger Tofu & Edamame Bowl', price: '$13.50', img: 'assets/images/bowls/sesame-tofu-vegan.jpg' },
      'authentic-shoyu-yuzu-ponzu': { title: 'Yuzu Ponzu Albacore Tuna Bowl', price: '$14.95', img: 'assets/images/bowls/yuzu-ponzu-albacore.jpg' },
      'high-protein-athletes': { title: 'High-Protein Double Salmon Superbowl', price: '$17.50', img: 'assets/images/bowls/double-salmon-protein.jpg' },
      'hawaiian-poke-history': { title: 'Heritage Inamona Shoyu Poke', price: '$14.50', img: 'assets/images/bowls/heritage-inamona.jpg' },
      'knife-mastery-sashimi': { title: 'Chef Kai Master Cut Sashimi Bowl', price: '$16.95', img: 'assets/images/bowls/master-cut-sashimi.jpg' },
      'seaweed-ferments-microbiome': { title: 'Fermented Kimchi & Seaweed Poke', price: '$14.25', img: 'assets/images/bowls/kimchi-seaweed-poke.jpg' },
      'plastic-free-compostable': { title: 'Eco Island Harvest Bowl', price: '$13.95', img: 'assets/images/bowls/island-harvest.jpg' },
      'avocado-edamame-vegan': { title: 'Green Goddess Avocado Superfood Bowl', price: '$13.75', img: 'assets/images/bowls/green-goddess-avocado.jpg' },
      'spicy-sriracha-aioli': { title: 'Roasted Chili Sriracha Aioli Salmon Bowl', price: '$15.50', img: 'assets/images/bowls/spicy-salmon-crunch.jpg' },
      'workout-nutrition-timing': { title: 'Post-Workout Fuel Power Bowl', price: '$16.50', img: 'assets/images/bowls/power-protein-bowl.jpg' }
    };

    return bowlMap[article.id] || {
      title: article.relatedBowl || article.title,
      price: article.bowlPrice || '$14.95',
      img: article.imageSm || 'assets/images/bowls/classic-ahi-tuna.jpg'
    };
  }

  function openBlogOrderModal(article) {
    const bowlInfo = getArticleBowlInfo(article);

    // 1. Hide blogArticleModal
    if (modalElement && window.bootstrap && bootstrap.Modal) {
      const articleModalInstance = bootstrap.Modal.getInstance(modalElement);
      if (articleModalInstance) articleModalInstance.hide();
    }

    // 2. Populate Bowl Info
    if (blogOrderBowlTitle) blogOrderBowlTitle.textContent = bowlInfo.title;
    if (blogOrderBowlPrice) blogOrderBowlPrice.textContent = bowlInfo.price;
    if (blogOrderBowlImg) {
      blogOrderBowlImg.src = bowlInfo.img;
      blogOrderBowlImg.onerror = function() { this.src = 'assets/images/bowls/spicy-salmon-crunch.jpg'; };
    }

    // 3. Update Full Page Link
    if (blogOrderFullPageLink) {
      blogOrderFullPageLink.href = `contact.html?bowl=${encodeURIComponent(bowlInfo.title)}&price=${encodeURIComponent(bowlInfo.price)}&source=blog#order-enquiry-section`;
    }

    // 4. Reset Form State
    currentBlogOrderQty = 1;
    if (blogOrderQtyVal) blogOrderQtyVal.textContent = '1';
    if (blogOrderErrorAlert) blogOrderErrorAlert.classList.add('d-none');
    if (blogOrderForm) {
      blogOrderForm.reset();
      blogOrderForm.classList.remove('d-none');
      blogOrderForm.querySelectorAll('.is-invalid, .is-valid').forEach((el) => {
        el.classList.remove('is-invalid', 'is-valid');
      });
    }
    if (blogOrderSuccessBox) blogOrderSuccessBox.classList.add('d-none');

    // 5. Show blogOrderModal
    if (blogOrderModalEl && window.bootstrap && bootstrap.Modal) {
      bootstrap.Modal.getOrCreateInstance(blogOrderModalEl).show();
    } else if (blogOrderModalEl) {
      blogOrderModalEl.classList.add('show');
      blogOrderModalEl.style.display = 'block';
    }
  }

  // Quantity Stepper Controls
  if (blogOrderQtyMinus) {
    blogOrderQtyMinus.addEventListener('click', () => {
      if (currentBlogOrderQty > 1) {
        currentBlogOrderQty--;
        if (blogOrderQtyVal) blogOrderQtyVal.textContent = currentBlogOrderQty;
      }
    });
  }
  if (blogOrderQtyPlus) {
    blogOrderQtyPlus.addEventListener('click', () => {
      if (currentBlogOrderQty < 50) {
        currentBlogOrderQty++;
        if (blogOrderQtyVal) blogOrderQtyVal.textContent = currentBlogOrderQty;
      }
    });
  }

  // Handle Form Submission with Validation
  if (blogOrderForm) {
    blogOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('blogOrderName');
      const phoneInput = document.getElementById('blogOrderPhone');
      const emailInput = document.getElementById('blogOrderEmail');
      const typeSelect = document.getElementById('blogOrderType');
      const notesInput = document.getElementById('blogOrderNotes');

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';

      // Validation
      const nameValid = /^[A-Za-z\s]{2,}$/.test(nameVal);
      const phoneValid = /^\d{10}$/.test(phoneVal);
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);

      if (nameInput) {
        nameInput.classList.toggle('is-invalid', !nameValid);
        nameInput.classList.toggle('is-valid', nameValid);
      }
      if (phoneInput) {
        phoneInput.classList.toggle('is-invalid', !phoneValid);
        phoneInput.classList.toggle('is-valid', phoneValid);
      }
      if (emailInput) {
        emailInput.classList.toggle('is-invalid', !emailValid);
        emailInput.classList.toggle('is-valid', emailValid);
      }

      if (!nameValid || !phoneValid || !emailValid) {
        if (blogOrderErrorAlert) {
          blogOrderErrorAlert.classList.remove('d-none');
          if (!nameValid) {
            if (blogOrderErrorAlertText) blogOrderErrorAlertText.textContent = 'Please enter a valid full name (letters only, minimum 2 characters).';
          } else if (!phoneValid) {
            if (blogOrderErrorAlertText) blogOrderErrorAlertText.textContent = 'Please enter a valid 10-digit phone number without letters or symbols.';
          } else {
            if (blogOrderErrorAlertText) blogOrderErrorAlertText.textContent = 'Please enter a valid email address (e.g. name@example.com).';
          }
        }
        return;
      }

      if (blogOrderErrorAlert) blogOrderErrorAlert.classList.add('d-none');

      // Generate Reference Code
      const orderRef = 'POKE-ORD-' + Math.floor(100000 + Math.random() * 900000);
      const bowlInfo = getArticleBowlInfo(currentOpenArticle);

      if (blogOrderSuccessRef) blogOrderSuccessRef.textContent = orderRef;
      if (blogOrderSuccessBowlName) blogOrderSuccessBowlName.textContent = bowlInfo.title;

      // Save to localStorage
      try {
        const orderRecord = {
          ref: orderRef,
          bowl: bowlInfo.title,
          price: bowlInfo.price,
          qty: currentBlogOrderQty,
          name: nameVal,
          phone: phoneVal,
          email: emailVal,
          type: typeSelect ? typeSelect.value : 'Takeout Pickup',
          notes: notesInput ? notesInput.value : '',
          source: 'blog',
          submittedAt: new Date().toISOString()
        };
        localStorage.setItem('poke_last_blog_order', JSON.stringify(orderRecord));
      } catch (err) {
        // ignore
      }

      // Show success feedback box
      blogOrderForm.classList.add('d-none');
      if (blogOrderSuccessBox) blogOrderSuccessBox.classList.remove('d-none');
    });
  }

  // Trigger Order Modal on "Order This Bowl" click
  if (modalArticleOrderBtn) {
    modalArticleOrderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openBlogOrderModal(currentOpenArticle);
    });
  }

  // Modal Scroll Reading Progress Bar
  const modalDialog = modalElement?.querySelector('.modal-body');
  if (modalElement && readingProgressBar) {
    modalElement.addEventListener('scroll', () => {
      const scrollTop = modalElement.scrollTop;
      const scrollHeight = modalElement.scrollHeight - modalElement.clientHeight;
      if (scrollHeight > 0) {
        const progress = (scrollTop / scrollHeight) * 100;
        readingProgressBar.style.width = `${progress}%`;
      }
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
      readingProgressBar.style.width = '0%';
    });
  }

  // Newsletter Subscription Form
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (window.PokeValidation) {
        const { isValid, firstInvalid } = window.PokeValidation.validateForm(newsletterForm);
        if (!isValid) {
          if (firstInvalid) firstInvalid.focus();
          return;
        }
      }

      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Subscribing...';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;

          if (newsletterAlert) {
            newsletterAlert.classList.remove('d-none');
            newsletterAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }

          if (window.PokeValidation) {
            window.PokeValidation.resetForm(newsletterForm);
          } else {
            newsletterForm.reset();
            newsletterForm.querySelectorAll('.is-valid, .is-invalid').forEach((el) => el.classList.remove('is-valid', 'is-invalid'));
          }

          setTimeout(() => {
            if (newsletterAlert) newsletterAlert.classList.add('d-none');
          }, 6000);
        }, 600);
      }
    });
  }
});

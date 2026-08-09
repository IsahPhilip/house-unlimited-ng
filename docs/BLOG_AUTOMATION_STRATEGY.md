# Blog Automation Strategy — House Unlimited Nigeria
# Goal: Rank as a verified AI/SEO source for Abuja real estate queries

## How the Automation Works

1. You publish a post in WordPress admin
2. WordPress fires a webhook to `https://houseunlimitednigeria.com/api/revalidate`
3. Next.js instantly revalidates the blog index, homepage, and the new post page
4. The post is live within seconds — no rebuild needed

## Setup Checklist

### On Render (environment variables)
- [ ] Add `WORDPRESS_WEBHOOK_SECRET=your_random_secret` (generate any random string)

### On WordPress (Hostinger)
- [ ] Upload `wordpress-theme/hun-revalidate-plugin/` folder to `/wp-content/plugins/`
- [ ] Activate "HUN Revalidate" in WP Admin → Plugins
- [ ] Go to Settings → HUN Revalidate
  - Frontend URL: `https://houseunlimitednigeria.com`
  - Webhook Secret: same value as `WORDPRESS_WEBHOOK_SECRET` on Render

---

## Content Topic Clusters (Publish in this order for fastest ranking)

### Cluster 1 — Buyer Intent (highest commercial value)
Target: People actively looking to buy in Abuja

1. "How to Buy Land in Abuja in 2025: Step-by-Step Guide"
2. "How to Verify a Certificate of Occupancy (C of O) in Abuja"
3. "Maitama Extension vs Katampe Extension: Which is the Better Investment?"
4. "Off-Plan vs Completed Properties in Abuja: Pros and Cons"
5. "How Much Does Land Cost in Abuja in 2025? (By District)"

### Cluster 2 — Diaspora Investors (high intent, low competition)
Target: Nigerians abroad buying remotely

6. "How Diaspora Nigerians Can Safely Buy Property in Abuja Remotely"
7. "5 Red Flags of Property Fraud in Abuja (And How to Avoid Them)"
8. "Can I Buy Land in Abuja Without Being in Nigeria?"
9. "Best Areas to Invest in Abuja Real Estate for Diaspora Buyers"
10. "How to Send Money to Nigeria to Buy Property Safely"

### Cluster 3 — Market Intelligence (builds authority with AI crawlers)
Target: Investors, journalists, AI systems looking for data

11. "Abuja Real Estate Market Report 2025"
12. "Which Abuja Districts Have the Highest Capital Appreciation?"
13. "Why Guzape is Abuja's Fastest-Growing Investment Corridor"
14. "The Rise of Off-Plan Developments in Abuja: What Investors Need to Know"
15. "Abuja vs Lagos Real Estate: Where Should You Invest in 2025?"

### Cluster 4 — FAQ / Long-tail (AEO — answers AI questions directly)
Target: AI search engines (Perplexity, ChatGPT, Google SGE)

16. "What Documents Do You Need to Buy Land in Abuja?"
17. "What is AGIS and How Does It Work in Abuja?"
18. "What is the Difference Between C of O and R of O in Nigeria?"
19. "Is It Safe to Buy Off-Plan Property in Abuja?"
20. "What Are the Best Luxury Estates in Abuja?"

---

## Post Structure for Maximum AEO Impact

Every post should follow this structure:

```
H1: [Exact question or keyword]

[1-paragraph direct answer — this is what AI will cite]

H2: [Subtopic 1]
[Content]

H2: [Subtopic 2]
[Content]

H2: Frequently Asked Questions
Q: [Related question]
A: [Direct answer]

H2: Conclusion
[Summary + CTA to contact or browse properties]
```

## WordPress Post Checklist (per post)

- [ ] Title contains the primary keyword
- [ ] Excerpt written (max 160 characters) — used as meta description
- [ ] Featured image uploaded with descriptive alt text
- [ ] Category assigned (e.g. "Buying Guide", "Market Report", "Investment")
- [ ] 3–5 tags added (e.g. "Abuja", "Land", "C of O", "Off-Plan")
- [ ] Internal links to at least 2 other posts or property pages
- [ ] Post ends with a CTA (link to /contact or /properties)

## Publishing Cadence

- Minimum: 2 posts per week
- Ideal: 4 posts per week (Mon, Tue, Thu, Fri)
- Market reports: monthly (first Monday of each month)
- Property spotlights: whenever a new listing goes live

export type Step = { title: string; text: string };

export type Faq = { q: string; a: string };
export type ToolContent = {
  name: string;
  title: string; // search title, under 60 chars
  description: string; // under 155 chars
  ogTitle: string;
  ogDescription: string;
  steps: [Step, Step, Step];
  greatFor: string[];
  tips: string[];
  faqs: Faq[];
  related: string;
};

const FREE_FAQ: Faq = {
  q: "Is it really free?",
  a: "Yes. There's no sign-up, no watermark and no daily limit. The work happens on your own device, so it costs us nothing per photo.",
};
const PRIVATE_FAQ: Faq = {
  q: "Is my photo uploaded anywhere?",
  a: "No. Your photo stays on your phone or computer the whole time. Nothing is sent to a server or saved by us.",
};
const PHONE_FAQ: Faq = {
  q: "Does it work on my phone?",
  a: "Yes, in any modern browser. The first time takes a little longer while the AI downloads. Older phones can be slower, so give it a minute.",
};

export const TOOL_CONTENT: Record<string, ToolContent> = {
  "/": {
    name: "Remove background",
    title: "Remove Image Background Free — QuikEdits",
    description: "Remove the background from any photo in seconds and download a transparent PNG. Free, no sign-up, and your photo never leaves your device.",
    ogTitle: "Remove a photo background for free",
    ogDescription: "Get a transparent PNG of any photo in seconds. Free, private, no sign-up.",
    steps: [{ title: "Add your photo", text: "Drop in a JPG, PNG or WebP of a person, pet or object. Photos where the subject is clear and in focus give the cleanest edges." }, { title: "The AI cuts it out", text: "The AI finds your subject and removes everything behind it, right on your device. The first time takes a little longer while the AI loads." }, { title: "Download a see-through PNG", text: "Save your cutout with a transparent background, ready to drop into slides, designs or another photo." }],
    greatFor: ["Putting yourself into a slide or poster", "School and work projects", "Collages and greeting cards", "Pet and family photos", "Designs for t-shirts and mugs"],
    tips: ["Pick a photo where the subject is in focus.", "A clear gap between the subject and the background helps.", "Very fine hair or fur can look a little rough at the edges."],
    faqs: [FREE_FAQ, PRIVATE_FAQ, { q: "What do I get?", a: "A PNG file with a see-through background, so you can place it on anything." }, PHONE_FAQ],
    related: "/colour-background",
  },
  "/colour-background": {
    name: "Colour background",
    title: "Add a Colour Background to a Photo — Free",
    description: "Swap your photo's background for a solid colour you pick. Great for profile pictures and product shots. Free and private in your browser.",
    ogTitle: "Put any photo on a solid colour",
    ogDescription: "Pick a colour and we'll replace your photo's background. Free and private.",
    steps: [{ title: "Add your photo", text: "Upload a photo of a person, pet or object. The background is removed once, on your device." }, { title: "Tap a colour", text: "Pick any solid colour from the palette. Switching colours is instant, so try a few and compare." }, { title: "Download the result", text: "Save the photo with your new colour behind it as a PNG, ready for profiles, cards or listings." }],
    greatFor: ["Matching team photos", "Brand-coloured social posts", "Clean product shots", "Bright profile pictures"],
    tips: ["Light colours hide small edge mistakes best.", "Use the colour picker to match your brand exactly.", "Changing colour after the first one is instant."],
    faqs: [FREE_FAQ, PRIVATE_FAQ, { q: "Can I use gradients or patterns?", a: "Not here. This tool keeps it simple with solid colours. To use another picture as the background, try Photo background." }, PHONE_FAQ],
    related: "/profile-picture",
  },
  "/product-photo": {
    name: "Product photos",
    title: "White Background Product Photos — Free Tool",
    description: "Put product photos on clean white, centred and sized for Amazon, eBay, Etsy and Shopify. Do up to 20 at once. Free and private.",
    ogTitle: "Product photos on clean white, ready to list",
    ogDescription: "White-background product photos for online shops, up to 20 at once. Free.",
    steps: [{ title: "Add your product photos", text: "Upload one or more shots of your product. A phone photo on a plain table works well." }, { title: "Straighten and clean up", text: "Crop or rotate if needed, then the AI clears the background and puts your product on clean white." }, { title: "Pick a size and download", text: "Choose a square or marketplace size and save each photo, ready for your shop or listing." }],
    greatFor: ["Amazon and eBay listings", "Etsy and Shopify shops", "Facebook Marketplace and Vinted", "Selling a car or furniture", "Menus and catalogues"],
    tips: ["Shoot in daylight, away from busy patterns.", "Fill most of the frame with the product.", "Use the same padding for a tidy-looking shop."],
    faqs: [FREE_FAQ, PRIVATE_FAQ, { q: "What sizes can I get?", a: "Square 2000 × 2000 (fits most marketplaces), landscape 4:3 or portrait 4:5 for Instagram." }, { q: "Can I do several at once?", a: "Yes, up to 20 photos. They're done one after another so your device doesn't run out of memory." }],
    related: "/colour-background",
  },
  "/passport-photo": {
    name: "Passport photo",
    title: "Passport & ID Photo Maker — Free, Print at Home",
    description: "Make a passport, visa or ID photo on a white background in the right size, plus a 6×4 in sheet to print at home. Free and private.",
    ogTitle: "A passport photo you can print at home",
    ogDescription: "Right-size passport and ID photos on white, with a printable sheet. Free.",
    steps: [{ title: "Add a front-facing photo", text: "Use a photo where you look straight at the camera, with even light and nothing covering your face." }, { title: "Choose your country", text: "Select your document size, then line up your head so it sits inside the guide. The background turns plain white." }, { title: "Download or print", text: "Save a single photo for online forms, or a print-ready sheet with several copies to print at home or a shop." }],
    greatFor: ["Passport renewals", "Visa applications", "Driving licences and ID cards", "Student and work badges"],
    tips: ["Stand in even light with no shadows on your face.", "Look straight at the camera with a neutral face.", "Remove glasses if your country asks for it.", "Always check your country's official photo rules."],
    faqs: [FREE_FAQ, PRIVATE_FAQ, { q: "Which sizes are included?", a: "USA (2 × 2 in), UK, EU and Australia (35 × 45 mm), Canada (50 × 70 mm) and China (33 × 48 mm)." }, { q: "How do I print it?", a: "Download the print sheet and print it at 6 × 4 in (10 × 15 cm) at a photo shop or at home. Don't let the printer resize it." }],
    related: "/profile-picture",
  },
  "/profile-picture": {
    name: "Profile picture",
    title: "Profile Picture Maker for LinkedIn & CVs — Free",
    description: "Turn a headshot into a clean profile picture on a solid colour, in a circle or square. For LinkedIn, CVs, Slack and team pages. Free.",
    ogTitle: "A sharp profile picture in seconds",
    ogDescription: "Clean headshots on a solid colour for LinkedIn, CVs and team pages. Free.",
    steps: [{ title: "Add a headshot", text: "Upload a photo of your head and shoulders. A friendly, well-lit shot works best." }, { title: "Style it", text: "Pick a background colour, choose a circle or square, and zoom until your face is framed nicely." }, { title: "Download your picture", text: "Save a sharp 1000 × 1000 image that looks great on LinkedIn, CVs, Slack or any profile." }],
    greatFor: ["LinkedIn and job sites", "CVs and résumés", "Slack, Teams and email", "Company team pages", "Speaker and author bios"],
    tips: ["Face a window for soft, even light.", "Leave some space above your head.", "Use one colour for the whole team for a matching look."],
    faqs: [FREE_FAQ, PRIVATE_FAQ, { q: "What size is the picture?", a: "1000 × 1000 pixels, which looks sharp on every major site." }, PHONE_FAQ],
    related: "/passport-photo",
  },
  "/sticker-maker": {
    name: "Sticker maker",
    title: "Photo Sticker Maker for WhatsApp — Free",
    description: "Turn a photo of a person, pet or thing into a sticker with an outline. 512 × 512 PNG or WebP for WhatsApp and Telegram. Free.",
    ogTitle: "Turn any photo into a sticker",
    ogDescription: "Cut-out stickers with an outline for WhatsApp and Telegram. Free and private.",
    steps: [{ title: "Add your photo", text: "Pick a photo of a person, pet or object. The AI cuts out the subject so only they remain." }, { title: "Add an outline", text: "Choose the outline colour and how thick it is, for that classic die-cut sticker look." }, { title: "Download your sticker", text: "Save a 512 × 512 sticker with a see-through background, ready for WhatsApp, Telegram or printing." }],
    greatFor: ["WhatsApp and Telegram chats", "Inside jokes and memes", "Pet stickers", "Printed sticker sheets"],
    tips: ["Close-up photos make the best stickers.", "A white outline stands out on dark chats.", "Choose WebP for WhatsApp sticker apps."],
    faqs: [FREE_FAQ, PRIVATE_FAQ, { q: "How do I add it to WhatsApp?", a: "Save the WebP file, then add it with a sticker app such as Sticker Maker, or send it as an image in Telegram." }, PHONE_FAQ],
    related: "/photo-background",
  },
  "/photo-background": {
    name: "Photo background",
    title: "Change Photo Background to Any Picture — Free",
    description: "Cut out a person or object and pick a playful background or add your own photo. Move and resize it to fit. Free and private in your browser.",
    ogTitle: "Put yourself anywhere",
    ogDescription: "Swap a photo's background for another picture of your choice. Free and private.",
    steps: [{ title: "Add your photo", text: "Upload a photo of the person or object you want to move somewhere new." }, { title: "Choose a new scene", text: "Pick one of our playful backgrounds, follow the suggestion that suits your colours, or add your own picture." }, { title: "Position and download", text: "Move and resize your subject until it looks right, then save the finished photo." }],
    greatFor: ["Holiday and travel fun", "Posters and flyers", "Thumbnails", "Family and pet collages"],
    tips: ["Pick a backdrop with similar light to your photo.", "Keep the person's size realistic for the scene.", "Wide, simple backdrops look most natural."],
    faqs: [FREE_FAQ, PRIVATE_FAQ, { q: "Can I use any picture as the background?", a: "Yes, any JPG, PNG or WebP image you have. Make sure you have the right to use it." }, PHONE_FAQ],
    related: "/sticker-maker",
  },
  "/logo-cleaner": {
    name: "Logo & signature",
    title: "Make a Logo or Signature Transparent — Free",
    description: "Remove the white or coloured background behind a logo, signature or stamp. Sharp edges, instant, no AI download. Free and private.",
    ogTitle: "Transparent logos and signatures",
    ogDescription: "Clear the background behind logos, signatures and stamps in seconds. Free.",
    steps: [{ title: "Add your logo or signature", text: "Take a photo or scan of a signature on paper, or upload a logo with a plain background." }, { title: "Adjust the slider", text: "Slide until the paper or background disappears and only your ink or logo stays." }, { title: "Download a see-through PNG", text: "Save it with a transparent background to sign documents, brand slides or add to designs." }],
    greatFor: ["Signing PDFs and contracts", "Logos for websites and slides", "Company stamps", "Email signatures"],
    tips: ["Sign in dark ink on plain white paper.", "Photograph flat, in good light, with no shadow.", "Raise the slider if specks of paper remain."],
    faqs: [FREE_FAQ, PRIVATE_FAQ, { q: "Why is it so fast?", a: "Logos and signatures are simple shapes, so this tool skips the AI and just removes the background colour." }, { q: "Does it work on photos of people?", a: "Not well. For people, pets or products, use Remove background instead." }],
    related: "/",
  },
};

export type Faq = { q: string; a: string };
export type ToolContent = {
  name: string;
  title: string; // search title, under 60 chars
  description: string; // under 155 chars
  ogTitle: string;
  ogDescription: string;
  steps: [string, string, string];
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
    steps: ["Add a photo of a person, pet or object.", "Wait a few seconds while the AI cuts it out.", "Download your see-through PNG."],
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
    steps: ["Add your photo.", "Tap the colour you want behind it.", "Download it, or try another colour instantly."],
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
    steps: ["Add one or more product photos.", "Crop or straighten, then let the AI clear the background.", "Pick a size and download each photo."],
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
    steps: ["Add a photo facing the camera.", "Choose your country and line up your head.", "Download the photo or a print-ready sheet."],
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
    steps: ["Add a headshot.", "Pick a colour, a circle or square, and the zoom.", "Download a 1000 × 1000 picture."],
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
    steps: ["Add a photo of a person, pet or object.", "Pick the outline colour and thickness.", "Download a 512 × 512 sticker."],
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
    steps: ["Add the photo with the person or object.", "Pick a playful background or add your own picture.", "Move, resize and download."],
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
    steps: ["Add a picture of your logo or signature.", "Adjust the slider until only the background disappears.", "Download a see-through PNG."],
    greatFor: ["Signing PDFs and contracts", "Logos for websites and slides", "Company stamps", "Email signatures"],
    tips: ["Sign in dark ink on plain white paper.", "Photograph flat, in good light, with no shadow.", "Raise the slider if specks of paper remain."],
    faqs: [FREE_FAQ, PRIVATE_FAQ, { q: "Why is it so fast?", a: "Logos and signatures are simple shapes, so this tool skips the AI and just removes the background colour." }, { q: "Does it work on photos of people?", a: "Not well. For people, pets or products, use Remove background instead." }],
    related: "/",
  },
};

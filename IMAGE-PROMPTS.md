# Website Images: Where They Go and How to Generate Them

The website has 20 image slots. Each one stays hidden until you add its file, so you can add images one at a time and nothing breaks if some are missing.

## How to add an image

1. Generate the image with the prompt below.
2. Save it into `att-site/public/images/` with the **exact file name** shown (any of `.jpg`, `.png` or `.webp` works).
3. Refresh the page. The dev server picks it up immediately. For a production build, run the build again.

Example: the home page background goes to `att-site/public/images/home-hero.jpg`.

## Settings for Gemini (Nano Banana)

- **Hero backgrounds:** aspect ratio **16:9**, highest resolution available (at least 1920 px wide).
- **Service cards:** aspect ratio **4:3** (at least 1200 px wide).
- **Section photos:** aspect ratio **4:3** (at least 1600 px wide).

## Rules for every image

Paste this line at the end of every prompt:

> Photorealistic, natural light, shot on a full-frame camera, shallow depth of field. No text, no words, no logos, no brand names, no watermarks, no carrier branding, no visible app screens or readable screen content. Clean, modern, professional, cool blue and white color palette.

Why these rules:
- The site cannot show AT&T logos or the AT&T globe without licensed artwork, and a phone or router must not look like a specific brand.
- Hero photos sit under a dark navy overlay with white headline text on the left. Bright, well-lit photos with the main subject on the **right side** look best. The left half should be calm and uncluttered.

---

## 1. Hero backgrounds (16:9)

| # | File name | Page |
|---|---|---|
| 1 | `home-hero` | Home |
| 2 | `internet-hero` | Internet |
| 3 | `fiber-hero` | AT&T Fiber, and the Fiber ad landing page |
| 4 | `internet-air-hero` | AT&T Internet Air, and the Internet Air ad landing page |
| 5 | `wireless-hero` | Wireless, and the Wireless ad landing page |
| 6 | `plans-hero` | Unlimited Plans |
| 7 | `phone-deals-hero` | Phone Deals |
| 8 | `switch-hero` | Switch to AT&T |
| 9 | `home-phone-hero` | AT&T Phone (home phone) |
| 10 | `deals-hero` | Current Deals |
| 11 | `availability-hero` | Check Availability |
| 12 | `about-hero` | About Us |
| 13 | `contact-hero` | Contact Us |
| 14 | `faq-hero` | FAQ |

**1. `home-hero`**
> Wide 16:9 photograph of a happy family in a bright, modern open-plan living room in an American suburban home. A parent is on a laptop, a teenager is watching a large wall-mounted TV, and a child is on a tablet on the sofa, all relaxed and connected. The people are positioned in the right half of the frame; the left half is a soft, out-of-focus wall and window light with plenty of empty space. Large windows, light wood floors, white and soft blue decor, warm afternoon sunlight.

**2. `internet-hero`**
> Wide 16:9 photograph of a tidy, modern home office corner. A sleek unbranded white Wi-Fi router with soft status lights sits on a shelf next to a laptop and a small plant. The desk and router are in the right third of the frame; the left side is a clean, softly lit white wall with lots of negative space. Morning light, minimalist Scandinavian style, cool white and pale blue tones.

**3. `fiber-hero`**
> Wide 16:9 photograph of a professional woman in her thirties working from home, smiling during a video call on a laptop at a light wooden desk. She is positioned in the right third of the frame. In the softly blurred left background, subtle glowing blue light streaks suggest high-speed fiber-optic data. Bright modern apartment, large window, crisp daylight, cool blue accents.

**4. `internet-air-hero`**
> Wide 16:9 photograph of a compact, unbranded white cylindrical wireless home internet gateway standing on a light oak sideboard in a cozy, modern living room, with a couch and a plant softly blurred behind it. The device sits in the right third of the frame; the left side is open, calm and softly lit. Natural window light, neutral and pale blue palette, very clean styling.

**5. `wireless-hero`**
> Wide 16:9 photograph of three diverse young adult friends walking and laughing together on a sunny city sidewalk, each holding an unbranded smartphone, one taking a photo. The group is in the right half of the frame; the left half is a soft-focus street with open sky and blurred buildings. Golden-hour light, energetic and natural, cool blue sky tones.

**6. `plans-hero`**
> Wide 16:9 photograph of a multigenerational family of four sitting together on a sofa at home, each person using their own unbranded smartphone, sharing a laugh. The family is in the right half of the frame; the left half is a softly blurred bright living room wall. Soft daylight, warm and friendly, white and blue decor.

**7. `phone-deals-hero`**
> Wide 16:9 product-style photograph of several modern unbranded smartphones in different colors laid out neatly on a clean white stone table, screens dark, no logos on the back. The phones are grouped on the right side of the frame; the left side is clean, empty white surface fading into a soft blue gradient background. Studio lighting, premium retail look.

**8. `switch-hero`**
> Wide 16:9 photograph of a man in his forties at a bright kitchen table, smiling while setting up a new unbranded smartphone, with the phone's open box beside him and his old phone next to it. He is in the right third of the frame; the left side is a softly blurred white kitchen with open space. Morning light, relaxed and confident mood, cool white and blue tones.

**9. `home-phone-hero`**
> Wide 16:9 photograph of a modern white cordless home phone on its charging base on a clean kitchen counter, next to a cup of coffee and a small vase of flowers, with an older woman smiling in soft focus in the background. The phone is in the right third of the frame; the left side is an uncluttered, softly lit kitchen. Warm daylight, calm and trustworthy, white and pale blue palette.

**10. `deals-hero`**
> Wide 16:9 photograph of a couple in their thirties sitting together on a sofa, comparing options on an unbranded tablet with a laptop open on the coffee table, looking pleased. The couple is in the right half of the frame; the left half is a softly blurred, bright living room. Natural daylight, modern home, cool blue and white tones.

**11. `availability-hero`**
> Wide 16:9 aerial drone photograph of a tidy American suburban residential neighborhood at blue hour, rows of houses with warm lit windows, tree-lined streets and soft streetlights. The densest part of the neighborhood is on the right side of the frame; the left side shows calmer rooftops and open sky. Deep blue twilight sky, crisp detail, cinematic.

**12. `about-hero`**
> Wide 16:9 photograph of a friendly, professional sales specialist wearing a lightweight headset, smiling while helping a customer by phone, seated at a clean desk with a monitor in a bright modern office. The specialist is in the right third of the frame; the left side is a soft-focus open office with lots of negative space. Natural daylight, approachable and trustworthy, white and blue tones.

**13. `contact-hero`**
> Wide 16:9 photograph of a smiling woman in her late twenties sitting by a large window at home, holding an unbranded smartphone to her ear during a pleasant phone conversation, with a notebook on the table. She is in the right third of the frame; the left side is softly blurred window light with plenty of empty space. Bright, calm, cool blue and white palette.

**14. `faq-hero`**
> Wide 16:9 photograph of a man in his thirties at a dining table at home, reading on a laptop with a relaxed, focused expression, a cup of coffee beside him. The screen faces away from the camera. He is in the right third of the frame; the left side is a clean, softly lit wall with open space. Morning daylight, minimalist modern interior, cool white and blue tones.

---

## 2. Service cards on the Home page (4:3)

These appear at the top of the four service cards (AT&T Fiber, AT&T Internet Air, AT&T Wireless, AT&T Phone). Keep the subject centered and simple; they display at a small size.

| # | File name | Card |
|---|---|---|
| 15 | `card-fiber` | AT&T Fiber |
| 16 | `card-internet-air` | AT&T Internet Air |
| 17 | `card-wireless` | AT&T Wireless |
| 18 | `card-home-phone` | AT&T Phone |

**15. `card-fiber`**
> 4:3 close-up macro photograph of a bundle of fiber-optic strands glowing with bright blue and white light against a dark navy background, light pulses traveling along the fibers. Centered composition, crisp focus, high-tech and clean.

**16. `card-internet-air`**
> 4:3 photograph of a compact, unbranded white cylindrical wireless home internet gateway on a light wooden shelf beside a small green plant, in a bright modern living room. Device centered, soft natural light, minimal and clean.

**17. `card-wireless`**
> 4:3 photograph of two modern unbranded smartphones, one in navy blue and one in silver, resting side by side on a clean light-grey desk, screens dark, soft shadows. Centered composition, bright even studio light, premium and minimal.

**18. `card-home-phone`**
> 4:3 photograph of a sleek white cordless home phone standing in its base on a clean white kitchen counter, with a softly blurred bright kitchen behind it. Centered composition, soft natural light, calm and simple.

---

## 3. Section photos (4:3)

| # | File name | Where it appears |
|---|---|---|
| 19 | `specialist` | Home page, "Pricing and Availability for Your Address" section |
| 20 | `bundle` | Internet page, bundle savings section |

**19. `specialist`**
> 4:3 photograph of a friendly, professional customer sales specialist with a lightweight headset, smiling at the camera while seated at a tidy desk in a bright, modern office, with softly blurred colleagues in the background. Natural daylight, approachable and trustworthy, white and navy blue clothing and decor.

**20. `bundle`**
> 4:3 photograph of a family at home in the evening: a parent on a laptop at the kitchen island, a teenager on an unbranded smartphone, and a child watching a tablet, all comfortably connected in a warm, modern open-plan home. Soft warm interior light mixed with cool blue accents, natural and candid.

---

## Checklist before sending images

- No logos, brand names, carrier marks or readable text anywhere in the image (check phone backs, router fronts and screens).
- No distorted hands, faces or extra fingers.
- Hero images: main subject on the right, calm left side.
- File names exactly as listed above.

/**
 * SINGLE SOURCE OF TRUTH for every plan, price and promotion shown on the site.
 *
 * Generated on 2026-10-21T06:33:22.971Z by scripts/research/build-offers.mjs from the att.com evidence
 * saved in research/raw/ (fine print is copied verbatim, never retyped). Maintain this file by hand from
 * now on: re-check the sourceUrl, update price / finePrint / retrievedAt, and run `npm run build`.
 * The production build fails if any offer lacks a sourceUrl or was verified more than
 * OFFER_MAX_AGE_DAYS days ago (scripts/prebuild-check.ts).
 */
import type { Offer, OfferCategory } from "./offer-types";

export const OFFER_MAX_AGE_DAYS = 14;

export const offers: Offer[] = [
  {
    "id": "fiber-300",
    "category": "fiber",
    "title": "AT&T Internet 300",
    "headline": "AT&T Internet 300: 300Mbps speed, $50/mo.",
    "price": {
      "amount": 50,
      "unit": "/mo.",
      "qualifier": "with AutoPay & Paperless bill",
      "was": 60
    },
    "altPrice": {
      "label": "With an eligible AT&T wireless plan",
      "price": {
        "amount": 35,
        "unit": "/mo.",
        "qualifier": "with eligible wireless, AutoPay & Paperless bill",
        "was": 60
      },
      "conditions": [
        "Price plus taxes and fees after $10/mo. discount w/elig. wrls svc, Autopay & Paperless bill (w/in 2 bills). Ltd. avail/areas."
      ]
    },
    "conditions": [
      "Plus taxes & fees",
      "After $10/mo. AutoPay & Paperless bill discount (within 2 bills)",
      "Limited availability/areas"
    ],
    "finePrint": "Price plus taxes and fees after $10/mo. discount w/ elig. Autopay & Paperless bill (w/in 2 bills). Ltd. avail/areas.\n\nWith wireless plan: Price plus taxes and fees after $10/mo. discount w/elig. wrls svc, Autopay & Paperless bill (w/in 2 bills). Ltd. avail/areas.\n\nAutopay & Paperless Bill Discount: $10/mo if enrolled in Autopay & Paperless billing w/ your bank account or the AT&T Points Plus® Card from Citi. Discount reduced to $5/mo when enrolled with a debit card. No discount if enrolled with any other credit card. Discount starts w/in 2 bills. Must maintain valid email address to continue discount. Taxes & Fees: Up to $99 installation fee may apply, plus tax where applicable. Monthly State Cost Recovery charge, which is not gov’t req’d applies in NV, OH, TX. Taxes also apply. For one time AT&T transactional fees, see www.att.com/fees for details. Pricing subject to change. Subj. to Internet Terms of Service at www.att.com/internet-terms.\n\nInternet w/ Wireless Savings Offer: Subj to change. Available to existing postpaid AT&T wireless customers or new customers who purchase an eligible AT&T unlimited voice & data plan for smartphones and an AT&T Fiber plan (300M or higher) are eligible for tiered discount off the monthly recurring charge for fiber ($15/mo w/300M or 500M; $20/mo w/1-Gig; $25/mo w/5-Gig). Pay full cost for fiber plan until discount starts w/in 3 bills and applied before any Autopay and Paperless bill discount. Wireless & Internet accounts must match names and addresses to qualify and services are billed separately. Must maintain eligible wireless svc for continued receipt of fiber discount. Customers already receiving 25% off eligible unlimited plans not eligible. AT&T employees or residents of select multi-dwelling units not eligible. Req’d Wireless: Postpaid unlimited voice & data plan for smartphones (for new customers min $60/mo. before discounts Eligible plans: AT&T Value 2.0, AT&T Extra 2.0, AT&T Premium 2.0 or AT&T Elite 2.0. Speed, usage & other restr’s apply. See att.com/unlimited for current unlimited plans.\n\nSpeeds based on wired connection. Actual customer speeds may vary. For 5 GIG, single-device wired speed maximum 4.7 Gbps. For more information, go to www.att.com/speed101.\n\nOffers may be modified or discontinued at any time without notice and may not be combined with other promotional offers on the same service(s).",
    "features": [
      "Game, stream, and video chat with confidence.",
      "Support your smart home devices.",
      "AT&T internet backup included for unlimited wireless customers to help you stay connected at no additional cost—if internet goes down, your wireless data steps up."
    ],
    "speed": "300Mbps speed",
    "sourceUrl": "https://www.att.com/internet/fiber/",
    "retrievedAt": "2026-10-21T06:09:28.874Z",
    "expiresAt": null,
    "videoRef": "0:49 (hero card), 0:52 (tier card), 0:86 (terms table)"
  },
  {
    "id": "fiber-500",
    "category": "fiber",
    "title": "AT&T Internet 500",
    "headline": "AT&T Internet 500: 500Mbps speed, $60/mo. for 12 mos.",
    "price": {
      "amount": 60,
      "unit": "/mo.",
      "qualifier": "for 12 mos. with AutoPay & Paperless bill",
      "was": 75,
      "thenAmount": 65
    },
    "altPrice": {
      "label": "With an eligible AT&T wireless plan",
      "price": {
        "amount": 45,
        "unit": "/mo.",
        "qualifier": "for 12 mos. with eligible wireless, AutoPay & Paperless bill",
        "was": 75
      },
      "conditions": [
        "Price plus taxes and fees after $10/mo. discount w/elig. wrls svc, Autopay & Paperless bill (w/in 2 bills). Ltd. avail/areas."
      ]
    },
    "conditions": [
      "Plus taxes & fees",
      "After $10/mo. AutoPay & Paperless bill discount (within 2 bills)",
      "Limited availability/areas"
    ],
    "finePrint": "Price plus taxes and fees after $10/mo. discount w/ elig. Autopay & Paperless bill (w/in 2 bills). Ltd. avail/areas.\n\nWith wireless plan: Price plus taxes and fees after $10/mo. discount w/elig. wrls svc, Autopay & Paperless bill (w/in 2 bills). Ltd. avail/areas.\n\nUp to $15 Off Fiber Offer: Subj to change. New AT&T Fiber customers will receive a discount for 12 months off the monthly recurring charge for an AT&T Fiber plan ($5/mo w/500M; $10/mo w/1 Gig; $15/mo w/5 Gig). Pay full plan cost until discount starts w/in 3 bills. After 12 mos, prevailing rate for fiber plan applies. Must maintain qualifying speed tier for continued receipt of monthly discount. Access and Bulk accounts not eligible. Autopay & Paperless Bill Discount: $10/mo if enrolled in Autopay & Paperless billing w/ your bank account or the AT&T Points Plus® Card from Citi. Discount reduced to $5/mo when enrolled with a debit card. No discount if enrolled with any other credit card. Discount starts w/in 2 bills. Must maintain valid email address to continue discount. Taxes & Fees: Up to $99 installation fee may apply, plus tax where applicable. Monthly State Cost Recovery charge, which is not gov’t req’d applies in NV, OH, TX. Taxes also apply. For one time AT&T transactional fees, see www.att.com/fees/ for details. Pricing subject to change. Subj. to Internet Terms of Service at www.att.com/internet-terms.\n\nInternet w/ Wireless Savings Offer: Subj to change. Available to existing postpaid AT&T wireless customers or new customers who purchase an eligible AT&T unlimited voice & data plan for smartphones and an AT&T Fiber plan (300M or higher) are eligible for tiered discount off the monthly recurring charge for fiber ($15/mo w/300M or 500M; $20/mo w/1-Gig; $25/mo w/5-Gig). Pay full cost for fiber plan until discount starts w/in 3 bills and applied before any Autopay and Paperless bill discount. Wireless & Internet accounts must match names and addresses to qualify and services are billed separately. Must maintain eligible wireless svc for continued receipt of fiber discount. Customers already receiving 25% off eligible unlimited plans not eligible. AT&T employees or residents of select multi-dwelling units not eligible. Req’d Wireless: Postpaid unlimited voice & data plan for smartphones (for new customers min $60/mo. before discounts Eligible plans: AT&T Value 2.0, AT&T Extra 2.0, AT&T Premium 2.0 or AT&T Elite 2.0. Speed, usage & other restr’s apply. See att.com/unlimited for current unlimited plans.\n\nSpeeds based on wired connection. Actual customer speeds may vary. For 5 GIG, single-device wired speed maximum 4.7 Gbps. For more information, go to www.att.com/speed101.\n\nOffers may be modified or discontinued at any time without notice and may not be combined with other promotional offers on the same service(s).",
    "features": [
      "Level up your gaming with low lag.",
      "Connect and control multiple smart devices with ease.",
      "AT&T internet backup included for unlimited wireless customers to help you stay connected at no additional cost—if internet goes down, your wireless data steps up."
    ],
    "speed": "500Mbps speed",
    "sourceUrl": "https://www.att.com/internet/fiber/",
    "retrievedAt": "2026-10-21T06:09:28.874Z",
    "expiresAt": null,
    "videoRef": "0:52 (tier card), 0:86 (terms table)"
  },
  {
    "id": "fiber-1000",
    "category": "fiber",
    "title": "AT&T Internet 1000",
    "headline": "AT&T Internet 1000: Up to 1 GIG speed, $70/mo. for 12 mos.",
    "price": {
      "amount": 70,
      "unit": "/mo.",
      "qualifier": "for 12 mos. with AutoPay & Paperless bill",
      "was": 90,
      "thenAmount": 80
    },
    "altPrice": {
      "label": "With an eligible AT&T wireless plan",
      "price": {
        "amount": 50,
        "unit": "/mo.",
        "qualifier": "for 12 mos. with eligible wireless, AutoPay & Paperless bill",
        "was": 90
      },
      "conditions": [
        "Price plus taxes and fees after $10/mo. discount w/elig. wrls svc, Autopay & Paperless bill (w/in 2 bills). Ltd. avail/areas."
      ]
    },
    "conditions": [
      "Plus taxes & fees",
      "After $10/mo. AutoPay & Paperless bill discount (within 2 bills)",
      "Limited availability/areas"
    ],
    "finePrint": "Price plus taxes and fees after $10/mo. discount w/ elig. Autopay & Paperless bill (w/in 2 bills). Ltd. avail/areas.\n\nWith wireless plan: Price plus taxes and fees after $10/mo. discount w/elig. wrls svc, Autopay & Paperless bill (w/in 2 bills). Ltd. avail/areas.\n\nUp to $15 Off Fiber Offer: Subj to change. New AT&T Fiber customers will receive a discount for 12 months off the monthly recurring charge for an AT&T Fiber plan ($5/mo w/500M; $10/mo w/1 Gig; $15/mo w/5 Gig). Pay full plan cost until discount starts w/in 3 bills. After 12 mos, prevailing rate for fiber plan applies. Must maintain qualifying speed tier for continued receipt of monthly discount. Access and Bulk accounts not eligible. Autopay & Paperless Bill Discount: $10/mo if enrolled in Autopay & Paperless billing w/ your bank account or the AT&T Points Plus® Card from Citi. Discount reduced to $5/mo when enrolled with a debit card. No discount if enrolled with any other credit card. Discount starts w/in 2 bills. Must maintain valid email address to continue discount. Taxes & Fees: Up to $99 installation fee may apply, plus tax where applicable. Monthly State Cost Recovery charge, which is not gov’t req’d applies in NV, OH, TX. Taxes also apply. For one time AT&T transactional fees, see www.att.com/fees/ for details. Pricing subject to change. Subj. to Internet Terms of Service at www.att.com/internet-terms.\n\nInternet w/ Wireless Savings Offer: Subj to change. Available to existing postpaid AT&T wireless customers or new customers who purchase an eligible AT&T unlimited voice & data plan for smartphones and an AT&T Fiber plan (300M or higher) are eligible for tiered discount off the monthly recurring charge for fiber ($15/mo w/300M or 500M; $20/mo w/1-Gig; $25/mo w/5-Gig). Pay full cost for fiber plan until discount starts w/in 3 bills and applied before any Autopay and Paperless bill discount. Wireless & Internet accounts must match names and addresses to qualify and services are billed separately. Must maintain eligible wireless svc for continued receipt of fiber discount. Customers already receiving 25% off eligible unlimited plans not eligible. AT&T employees or residents of select multi-dwelling units not eligible. Req’d Wireless: Postpaid unlimited voice & data plan for smartphones (for new customers min $60/mo. before discounts Eligible plans: AT&T Value 2.0, AT&T Extra 2.0, AT&T Premium 2.0 or AT&T Elite 2.0. Speed, usage & other restr’s apply. See att.com/unlimited for current unlimited plans.\n\nSpeeds based on wired connection. Actual customer speeds may vary. For 5 GIG, single-device wired speed maximum 4.7 Gbps. For more information, go to www.att.com/speed101.\n\nOffers may be modified or discontinued at any time without notice and may not be combined with other promotional offers on the same service(s).",
    "features": [
      "The speed to succeed for work and pro-level gaming.",
      "Unleash the full potential of your smart home ecosystem.",
      "AT&T internet backup included for unlimited wireless customers to help you stay connected at no additional cost—if internet goes down, your wireless data steps up."
    ],
    "speed": "Up to 1 GIG speed",
    "sourceUrl": "https://www.att.com/internet/fiber/",
    "retrievedAt": "2026-10-21T06:09:28.874Z",
    "expiresAt": null,
    "videoRef": "0:52 (tier card, POPULAR), 0:86 (terms table)"
  },
  {
    "id": "fiber-5000",
    "category": "fiber",
    "title": "AT&T Internet 5000",
    "headline": "AT&T Internet 5000: Up to 5 GIG speed, $110/mo. for 12 mos.",
    "price": {
      "amount": 110,
      "unit": "/mo.",
      "qualifier": "for 12 mos. with AutoPay & Paperless bill",
      "was": 135,
      "thenAmount": 125
    },
    "altPrice": {
      "label": "With an eligible AT&T wireless plan",
      "price": {
        "amount": 85,
        "unit": "/mo.",
        "qualifier": "for 12 mos. with eligible wireless, AutoPay & Paperless bill",
        "was": 135
      },
      "conditions": [
        "Price plus taxes and fees after $10/mo. discount w/elig. wrls svc, Autopay & Paperless bill (w/in 2 bills). Ltd. avail/areas."
      ]
    },
    "conditions": [
      "Plus taxes & fees",
      "After $10/mo. AutoPay & Paperless bill discount (within 2 bills)",
      "Limited availability/areas"
    ],
    "finePrint": "Price plus taxes and fees after $10/mo. discount w/ elig. Autopay & Paperless bill (w/in 2 bills). Ltd. avail/areas.\n\nWith wireless plan: Price plus taxes and fees after $10/mo. discount w/elig. wrls svc, Autopay & Paperless bill (w/in 2 bills). Ltd. avail/areas.\n\nUp to $15 Off Fiber Offer: Subj to change. New AT&T Fiber customers will receive a discount for 12 months off the monthly recurring charge for an AT&T Fiber plan ($5/mo w/500M; $10/mo w/1 Gig; $15/mo w/5 Gig). Pay full plan cost until discount starts w/in 3 bills. After 12 mos, prevailing rate for fiber plan applies. Must maintain qualifying speed tier for continued receipt of monthly discount. Access and Bulk accounts not eligible. Autopay & Paperless Bill Discount: $10/mo if enrolled in Autopay & Paperless billing w/ your bank account or the AT&T Points Plus® Card from Citi. Discount reduced to $5/mo when enrolled with a debit card. No discount if enrolled with any other credit card. Discount starts w/in 2 bills. Must maintain valid email address to continue discount. Taxes & Fees: Up to $99 installation fee may apply, plus tax where applicable. Monthly State Cost Recovery charge, which is not gov’t req’d applies in NV, OH, TX. Taxes also apply. For one time AT&T transactional fees, see www.att.com/fees/ for details. Pricing subject to change. Subj. to Internet Terms of Service at www.att.com/internet-terms.\n\nInternet w/ Wireless Savings Offer: Subj to change. Available to existing postpaid AT&T wireless customers or new customers who purchase an eligible AT&T unlimited voice & data plan for smartphones and an AT&T Fiber plan (300M or higher) are eligible for tiered discount off the monthly recurring charge for fiber ($15/mo w/300M or 500M; $20/mo w/1-Gig; $25/mo w/5-Gig). Pay full cost for fiber plan until discount starts w/in 3 bills and applied before any Autopay and Paperless bill discount. Wireless & Internet accounts must match names and addresses to qualify and services are billed separately. Must maintain eligible wireless svc for continued receipt of fiber discount. Customers already receiving 25% off eligible unlimited plans not eligible. AT&T employees or residents of select multi-dwelling units not eligible. Req’d Wireless: Postpaid unlimited voice & data plan for smartphones (for new customers min $60/mo. before discounts Eligible plans: AT&T Value 2.0, AT&T Extra 2.0, AT&T Premium 2.0 or AT&T Elite 2.0. Speed, usage & other restr’s apply. See att.com/unlimited for current unlimited plans.\n\nSpeeds based on wired connection. Actual customer speeds may vary. For 5 GIG, single-device wired speed maximum 4.7 Gbps. For more information, go to www.att.com/speed101.\n\nOffers may be modified or discontinued at any time without notice and may not be combined with other promotional offers on the same service(s).",
    "features": [
      "Experience cutting-edge technologies beyond the internet.",
      "Supports the latest gadgets with unmatched efficiency.",
      "Our maximum speed for truly immersive experiences.",
      "AT&T internet backup included for unlimited wireless customers to help you stay connected at no additional cost—if internet goes down, your wireless data steps up."
    ],
    "speed": "Up to 5 GIG speed",
    "sourceUrl": "https://www.att.com/internet/fiber/",
    "retrievedAt": "2026-10-21T06:09:28.874Z",
    "expiresAt": null,
    "videoRef": "0:52 (tier card), 0:86 (terms table)"
  },
  {
    "id": "internet-air",
    "category": "internet-air",
    "title": "AT&T Internet Air",
    "headline": "AT&T Internet Air 5G home internet starting at $55/mo.",
    "price": {
      "amount": 55,
      "unit": "/mo.",
      "qualifier": "with AutoPay & Paperless bill"
    },
    "conditions": [
      "Plus taxes & fees",
      "AutoPay & Paperless bill required",
      "Not available in all areas"
    ],
    "finePrint": "Price plus taxes and fees. AutoPay & Paperless bill req’d. Not available in all areas. In rare cases, if your usage is contributing to congestion on the network, AT&T will greatly reduce your speed for a min. of 30 min. 5G coverage not available in all areas.\n\nAutoPay & Paperless bill discount: $10/mo if enrolled in Autopay w/ your bank account.  Discount reduced to $5/mo when enrolled with a debit or credit card.  Paperless billing required. Pay full plan cost until discounts start w/in 2 bills. Taxes & Fees: Monthly State Cost Recovery Charge which is not government-required applies in NV, OH, TX. Taxes also apply.  For one time AT&T transactional fees, see www.att.com/fees for details. If service is canceled, you must return AT&T All-Fi Hub to AT&T or be subject to a non-return equipment fee. Pricing subj to change.  Service subj. to Internet Terms of Service at att.com/internet-terms.\n\nAT&T Internet Air limitations: AT&T may temporarily slow data speeds if the network is busy.  In addition, in very rare cases, if your data usage is contributing significantly to congestion on the wireless network, AT&T will slow your speed to as low as 512Kbps for a minimum of 30 minutes.  For details visit www.att.com/broadbandinfo. Other restrictions apply and may result in service termination.\n\nOffers may be modified or discontinued at any time without notice and may not be combined with other promotional offers on the same service(s).",
    "features": [
      "No overage fees, and no annual contract",
      "Complete Wi-Fi for enhanced coverage, speed, and security",
      "$0 self-startup—plug in your AT&T All-Fi™ Hub and connect in minutes"
    ],
    "sourceUrl": "https://www.att.com/internet/internet-service-plans/",
    "retrievedAt": "2026-10-21T06:11:06.323Z",
    "expiresAt": null,
    "videoRef": "0:64–0:67 (standalone card)"
  },
  {
    "id": "all-fi-pro",
    "category": "add-on",
    "title": "AT&T All-Fi Pro",
    "headline": "Add AT&T All-Fi Pro with Wi-Fi 7 for $25/mo.",
    "price": {
      "amount": 25,
      "unit": "/mo.",
      "qualifier": "add-on, plus tax"
    },
    "conditions": [
      "Plus tax",
      "Limited availability/areas"
    ],
    "finePrint": "All our fiber plans include All-Fi®. AT&T All-Fi Pro can be added for $25/mo. plus tax\n\nMust maintain All-Fi Pro, in good standing, for minimum of 12 months to be eligible for equipment upgrade. Limited to one upgrade every 36 months.\n\nNumber of extenders determined at the sole discretion of AT&T.\n\nLtd. avail/areas. Speeds based on wired connection Actual speeds may vary. Single device wired speed maximum 4.7Gbps. For more info, go to www.att.com/speed101.",
    "features": [
      "Wi-Fi 7 technology",
      "Equipment upgrade program",
      "AT&T ActiveArmor® advanced internet security",
      "AT&T Extended Wi-Fi® Coverage Service"
    ],
    "sourceUrl": "https://www.att.com/wi-fi/",
    "retrievedAt": "2026-10-21T06:21:18.108Z",
    "expiresAt": null
  },
  {
    "id": "bundle-fiber-wireless",
    "category": "bundle",
    "title": "AT&T Fiber + AT&T Wireless bundle savings",
    "headline": "Save up to $420/year when you bundle AT&T Fiber and wireless",
    "price": null,
    "conditions": [
      "Discount of $15–$25/mo. on AT&T Fiber with an eligible AT&T unlimited wireless plan",
      "Limited availability/areas"
    ],
    "finePrint": "$420 savings for new customers based on combined discounts of $35/mo. on 5-GIG internet w/ elig wireless svc and elig. AutoPay & paperless bill. Ltd. Avail/areas.\n\nInternet Savings Offer: Subj to change. New residential customers who purchase an AT&T Fiber plan (300M or higher) and an eligible unlimited postpaid wireless plan are eligible for tiered discount off the monthly recurring charge for fiber ($15/mo w/300M or 500M; $20/mo w/1-Gig; $25/mo w/5-Gig).  Pay full cost for fiber plan until discount starts w/in 3 bills and applied before any Autopay and Paperless bill discount.  Wireless & Internet accounts must match names and addresses to qualify and services are billed separately. Must maintain eligible wireless svc for continued receipt of fiber discount. Customers already receiving 25% off eligible unlimited plans not eligible. AT&T employees or residents of select multi-dwelling units not eligible. Req’d Wireless: Postpaid unlimited voice & data plan for smartphones (for new customers min $60/mo. before discounts Eligible plans: AT&T Value 2.0, AT&T Extra 2.0, AT&T Premium 2.0 or AT&T Elite 2.0).  Speed, usage & other restr’s apply. See att.com/unlimited for current unlimited plans.\n\nAutopay & Paperless Bill Discount: $10/mo if enrolled in Autopay & paperless billing w/ your bank account or the AT&T Points Plus® Card from Citi. Discount reduced to $5/mo when enrolled with a debit card. No discount if enrolled with any other credit card. Discount starts w/in 2 bills. Must maintain valid email address to continue discount. Taxes & Fees: Up to $99 installation fee may apply, plus tax where applicable. Monthly State Cost Recovery charge which is not gov’t req’d applies in NV, OH, TX. Taxes also apply.  For one time AT&T transactional fees, see www.att.com/fees for details.  Pricing subject to change. Subj. to Internet Terms of Service at www.att.com/internet-terms.",
    "features": [
      "Get AT&T internet backup included when you have AT&T Fiber® and an AT&T Wireless plan at no extra cost.",
      "Choose the wireless plan option that works best for you and your family.",
      "Wi-Fi personalization that adapts to your in-home Wi-Fi activities, regardless of device."
    ],
    "sourceUrl": "https://www.att.com/bundles/",
    "retrievedAt": "2026-10-21T06:17:51.312Z",
    "expiresAt": null,
    "videoRef": "0:72–0:75 (bundle section; video headline \"20% off\" not confirmed on att.com)"
  },
  {
    "id": "phone-unlimited-north-america",
    "category": "phone",
    "title": "AT&T Phone Unlimited North America",
    "headline": "AT&T Phone Unlimited North America for $24.99/mo. for 12 mos.",
    "price": {
      "amount": 24.99,
      "unit": "/mo.",
      "qualifier": "for 12 mos.",
      "thenAmount": 34.99
    },
    "conditions": [
      "Plus taxes & fees",
      "New residential AT&T Phone customers",
      "Restrictions apply"
    ],
    "finePrint": "Geographic and service restrictions apply to AT&T Phone services.\n\nUnlimited North America Plan: Pricing ($24.99/mo per line; maximum of two) for the first 12 mos only for new residential AT&T Phone customers only. After 12 mos., or loss of eligibility, then prevailing rate applies, (currently $34.99/mo) unless cancelled or changed prior to the end of 12 months. Pricing subject to change. Must maintain all bundled services to receive continual discount on plan. Includes unlimited nationwide calling within the U.S., plus calls to Canada, Mexico and U.S. Territories. International calls billed at additional per minute rates. An additional per minute rate may apply for international calls terminating on mobile phones. Pricing excludes taxes, additional fees and other charges, including a monthly Administrative Fee, Regulatory Cost Recovery Charge. See att.com/fees for details.\n\nAT&T PHONE: AT&T Phone service is provided over an Internet Protocol connection and powered by electricity in your home. Service may require AT&T Internet (min 1.5Mbps or higher). Unless you provide any necessary backup battery power, AT&T Phone service, including 911 dialing, will not function during a power outage. See att.com/batterybackup more details.\n\nOffers may not be combined with certain other promotional offers on the same services and may be modified or discontinued at any time without notice. Other conditions apply to all offers.",
    "features": [
      "Unlimited nationwide calling within the U.S. and to Canada, Mexico, Puerto Rico, the U.S. Virgin Islands, Guam, and the Northern Marianas",
      "Calls to other countries at additional cost per-minute"
    ],
    "sourceUrl": "https://www.att.com/home-phone/",
    "retrievedAt": "2026-10-21T06:29:20.823Z",
    "expiresAt": null
  },
  {
    "id": "phone-international-plus-ii",
    "category": "phone",
    "title": "AT&T Phone International Plus II",
    "headline": "AT&T Phone International Plus II for $34.99/mo. for 12 mos.",
    "price": {
      "amount": 34.99,
      "unit": "/mo.",
      "qualifier": "for 12 mos.",
      "thenAmount": 44.99
    },
    "conditions": [
      "Plus taxes & fees",
      "New residential AT&T Phone customers",
      "Restrictions apply"
    ],
    "finePrint": "Geographic and service restrictions apply to AT&T Phone services.\n\nInternational Plus II Plan: Pricing ($34.99/mo) for the first 12 mos for new residential AT&T Phone customers. After 12 mos., or loss of eligibility, then prevailing rate applies, (currently $44.99/mo) unless cancelled or changed prior to the end of 12 months. Includes unlimited nationwide calling within the U.S. plus calls to Canada, Mexico, U.S. Territories and unlimited calling to 50+ countries. An additional per minute rate may apply for international calls terminating on mobile phones. Pricing excludes taxes, additional fees and other charges, including a monthly Administrative Fee, and a Regulatory Cost Recovery Charge. For one time AT&T transactional fees, see att.com/fees for details. Pricing subject to change.\n\nAT&T PHONE: AT&T Phone service is provided over an Internet Protocol connection and powered by electricity in your home. Service may require AT&T Internet (min 1.5Mbps or higher) for an add’l cost. Unless you provide any necessary backup battery power, AT&T Phone service, including 911 dialing, will not function during a power outage. See att.com/batterybackup for more details.\n\nOffers may not be combined with certain other promotional offers on the same services and may be modified or discontinued at any time without notice. Other conditions apply to all offers.",
    "features": [
      "Unlimited calling to over 50 countries including Canada and Mexico; unlimited nationwide calling within the United States, Puerto Rico, U.S. Virgin Islands, Guam, and the Northern Marianas.",
      "Low international rates to many other countries"
    ],
    "sourceUrl": "https://www.att.com/home-phone/",
    "retrievedAt": "2026-10-21T06:29:20.823Z",
    "expiresAt": null
  },
  {
    "id": "wireless-elite-2",
    "category": "wireless-plan",
    "title": "AT&T Elite 2.0℠",
    "headline": "AT&T Elite 2.0℠: $70/mo. per line when you get 4 lines",
    "price": {
      "amount": 70,
      "unit": "/mo. per line",
      "qualifier": "when you get 4 lines"
    },
    "conditions": [
      "Price per line with 4 lines",
      "After $10/mo. per line AutoPay & paperless bill discount (starts within 2 bills)",
      "Taxes & fees extra"
    ],
    "finePrint": "AT&T ELITE 2.0: Other Non-Phone Device Monthly Charges: No monthly service charge for one tablet and one smartwatch wearable plan per phone line (discount limited to two non-phone devices). Taxes, fees, and device charges extra. Standard monthly rates: $20.99 per tablet, $20.99 per camera, $10.99 per wearable. Requires active phone line. If you cancel the phone line(s) first standalone non-phone device will be billed at $75.99. If you switch plans, the non-phone device standard monthly rates apply and may be eligible for discounts based on new rate plan. Each additional line billed at the standard monthly rate. VIDEO STREAMING: Video typically streams at standard-definition. Content bundled with video may be slow to load. Go to att.com/myatt to change your settings to view in higher definition. Details at att.com/VideoFeature. HOTSPOT DATA: Requires compatible device. Includes up to 250GB per line per month. After 250GB, hotspot speed slowed to max of 128Kbps for the rest of bill cycle. After this, hotspot data usage will be impacted and not fully functional. AT&T TURBO: Plan includes AT&T Turbo. Provides customers with the ability to optimize their line’s premium and mobile hotspot data allotments to performance data by enabling customers to prioritize their data traffic for these allotments to help the performance of their data connection, even during busy times on the network. Eligible Devices: 5G-capable smartphones only. Excludes all non-smartphone devices (e.g. tablets, wearables, connected cars and devices). Upgrades data only. During peak network congestion, AT&T Turbo performance benefits may not be noticeable. Will not upgrade your voice or messaging. Your plan’s other management policies and restrictions, including your Video Management feature, will apply. Coverage: For use in United States only (excludes U.S. territories). Available on AT&T owned and operated wireless network only. Not available when roaming or via Wi-Fi (including Wi-Fi Calling). Learn more at att.com/turbo. Other Restrictions: Performance, experience, and speeds are not guaranteed and may vary due to factors such as network congestion, coverage, device capabilities, and third-party limitations. ROAM LATIN AMERICA: Eligibility: Compatible smartphones only. Countries: For a list of included countries, go to www.att.com/roamlatam. Countries are subject to change without notice. Coverage and data speeds vary by country (may be at 3G speed) and may change without notice. Coverage not available in all areas. Unlimited Talk, Text, and Data Usage: This feature allows you to use data in an included country, make calls between included countries and from included countries to the U.S. and any country included in att.com/elite2intl and send text messages in an included country without roaming charges. Calls made to included countries while in the U.S. are not included. Text messages received are rated as domestic. Unlimited text applies only to SMS and MMS and not to other messaging services or applications like iMessage. Calls to countries not included: Calls from included Latin America countries to countries not included in this plan will get International Long Distance (ILD) charges. For a list of countries, go to att.com/elite2intl. Pay-per-use rates apply unless you add an ILD package to your device. Rates are subject to change without notice. For details, go to att.com/intlcalling. INTERNATIONAL: Compatible smartphones only. Includes unlimited talk, text, and data in over 190 destinations and on enabled flights on Select Airlines (destinations) listed at att.com/elite2intl. Destinations, airlines, coverage and speeds vary and are subject to change. Video Management feature applies to your international data usage if turned on. Details at att.com/VideoFeature. Service restrictions: Use on cruise ships not included. Unlimited Talk, Text and Data: Available in included destinations with no roaming charges. Calls made to any countries other than Canada and Mexico while in the U.S. are not included. Unlimited text applies to AT&T SMS and MMS only; other messaging apps excluded (including iMessage). After 20GB of international data per bill cycle, speeds may be reduced to a maximum of 512Kbps for the rest of the bill cycle (not applicable in Canada, Mexico, or Roam Latin America countries). International Day Pass and additional high-speed data is not available with this plan. Pay-per-use rates: Apply when traveling outside covered destinations and on cruise ships without an active cruise package. Adding a cruise package to your line: When using a Compatible Device on a Cellular Network on Select Ships, AT&T will automatically add a cruise package to your line and notify you by text message; you will have the option to opt-out at any time. The package remains until you remove it at att.com/myatt or by calling 214-547-2300. See att.com/cruisedpterms. Excessive Use/Abuse: These international features are intended for roaming use by residents with a primary place of use in the DCA during periods of travel to included countries only. Predominantly using your rate plan in one or more of the included countries may result in this feature being removed from your line. Incidental data usage: Apps on your device use data even when you may not be aware.\n\nALL PLANS UNLIMITED YOUR WAY: Plans avail. in select locations only. All AT&T wireless services subject to terms and conditions in the Consumer Service Agreement (att.com/csa). Advertised monthly price includes monthly plan charge for talk, text and data & monthly per-line phone access charge. Other Non-Phone Device Monthly Charges: $20.99 per tablet; $20.99 per camera; $10.99 per wearable. Requires active phone line. If you cancel your phone line(s) first standalone non-phone device will be billed at $75.99. If you switch plans, the non-phone device standard monthly rates apply and may be eligible for discounts based on new rate plan. Each additional line billed at the standard monthly rate. AT&T Connected Car Monthly Charges: $15 per vehicle. OTHER RESTRICTIONS & FEES: Activation/upgrade fee (up to $50) & deposit may apply. Credit, debit, or reloadable prepaid card may be required (except in MA, PA, and ND). AUTOPAY & PAPERLESS BILL DISCOUNT: $10 a month per phone line discount if enrolled in both paperless billing and AutoPay with a bank account or the AT&T Points Plus® Card from Citi. Discount reduced to $5 a month per phone line when enrolled in AutoPay with a debit card. No discount if enrolled in AutoPay with any other credit card. Pay full plan cost until discount starts within 2 bills. Must maintain valid email address to continue discount. AT&T employees, retirees & IMO consumers are not eligible for the AutoPay and Paperless bill discount. UNLIMITED DATA: For use in the United States (the “Domestic Coverage Area” or “DCA”), Mexico and Canada. 2G off-net data speeds may apply. All AT&T service is subject to AT&T network management policies. See att.com/broadbandinfo for details. UNLIMITED TALK: Phones only. Includes calls w/in and between the DCA, Canada and Mexico. You may be charged for calls to special or premium service numbers and calls to other countries. For rates, see att.com/intlcalling. UNLIMITED TEXT: Compatible phone and rate plan required. Includes unlimited messages up to 1MB in size within and from DCA, Mexico and Canada. For texting to other countries, see att.com/text2world. Messages sent through applications may incur data or other charges. Advanced Messaging: Not available for use in Mexico and Canada. Other restrictions apply & can be found at att.com/advancedmessaging. 5G SERVICE: Requires a compatible 5G device. Coverage not available everywhere. See att.com/5Gforyou for details. ACTIVEARMOR MOBILE SECURITY: Compatible device required. You must download the AT&T ActiveArmor app and accept its terms and conditions for full App functionality. May not detect all threats. May inadvertently block wanted calls; settings can be adjusted in the App. Details at www.att.com/activearmor. LIMITS: Select devices only (sold separately). Max 10 phone lines and 20 lines total (including both phone and non-phone device lines) per Unlimited Your Way group. These plans may not be eligible for additional discounts, including but not limited to Signature and Appreciation discounts. AT&T employees & retirees may not be eligible for certain benefits, offers, and discounts associated with these plans.\n\nADDITIONAL AT&T FEES & GOVT. TAXES: Monthly AT&T Fees apply per line & include Administrative/Regulatory Cost Recovery Fee, up to $4.99 & other fees which are not government-required. Add’l one-time AT&T fees may apply. Govt. taxes are extra. See att.com/mobilityfees for more details.\n\nAll offers, programming, promotions, pricing, terms, restrictions & conditions subject to change & may be modified, discontinued, or terminated at any time without notice.",
    "features": [
      "Unlimited talk, text, & high-speed data that can’t slow down based on how much you use",
      "AT&T 5G℠ with 4K ultra high definition (UHD) streaming available",
      "Unlimited talk, text & high-speed data in 20 Latin American countries",
      "AT&T ActiveArmor® mobile security",
      "250GB hotspot data per line per month",
      "Includes connectivity for one tablet and watch per phone line at no extra cost",
      "Unlimited international talk, text, and 20GB of data per month to keep you connected in over 210 destinations"
    ],
    "sourceUrl": "https://www.att.com/plans/unlimited-data-plans/",
    "retrievedAt": "2026-10-21T06:13:48.628Z",
    "expiresAt": null
  },
  {
    "id": "wireless-premium-2",
    "category": "wireless-plan",
    "title": "AT&T Premium 2.0℠",
    "headline": "AT&T Premium 2.0℠: $50/mo. per line when you get 4 lines",
    "price": {
      "amount": 50,
      "unit": "/mo. per line",
      "qualifier": "when you get 4 lines"
    },
    "conditions": [
      "Price per line with 4 lines",
      "After $10/mo. per line AutoPay & paperless bill discount (starts within 2 bills)",
      "Taxes & fees extra"
    ],
    "finePrint": "AT&T PREMIUM 2.0: Other Non-Phone Device Monthly Charges: Get 50% off the monthly service charge for one eligible tablet or smartwatch wearable plan (discount limited to one non-phone device line). Taxes, fees, and device charges extra. Standard monthly rate: $20.99 per tablet, $20.99 per camera; $10.99 per wearable. Requires active phone line. If you cancel the phone line(s) first standalone non-phone device will be billed at $75.99. If you switch plans, the non-phone device standard monthly rates apply and may be eligible for discounts based on new rate plan. Each additional line billed at the standard monthly rate. VIDEO STREAMING: Video typically streams at standard-definition. Content bundled with video may be slow to load. Go to att.com/myatt to change your settings to view in higher definition. Details at att.com/VideoFeature. HOTSPOT DATA: Requires compatible device. Includes up to 100GB per line per month. After 100GB, hotspot speed slowed to max of 128Kbps for the rest of bill cycle. After this, hotspot data usage will be impacted and not fully functional. ROAM LATIN AMERICA: Eligibility: Compatible smartphones only. Countries: For a list of included countries, go to www.att.com/roamlatam. Countries are subject to change without notice. Coverage and data speeds vary by country (may be at 3G speed) and may change without notice. Coverage not available in all areas. Unlimited Talk, Text, and Data Usage: This feature allows you to use data in an included country, make calls between included countries and from included countries to the U.S. and any country included in International Day Pass (“IDP”), and send text messages in an included country without roaming charges. Calls made to included countries while in the U.S. are not included. Text messages received are rated as domestic. Unlimited text applies only to SMS and MMS and not to other messaging services or applications like iMessage. Excessive Use/Abuse: This feature is intended for roaming use during periods of travel to included countries by customers whose primary place of use is within the USA. Predominantly using your rate plan in one or more of the included countries may result in this feature being removed from your line. Calls to countries not included: Calls from included Latin America countries to countries not included in IDP will get International Long Distance (ILD) charges. For a list of IDP countries, go to att.com/globalcountries. Pay-per-use rates apply unless you add an ILD package to your device. Rates are subject to change without notice. For details, go to att.com/intlcalling.\n\nALL PLANS UNLIMITED YOUR WAY: Plans avail. in select locations only. All AT&T wireless services subject to terms and conditions in the Consumer Service Agreement (att.com/csa). Advertised monthly price includes monthly plan charge for talk, text and data & monthly per-line phone access charge. Other Non-Phone Device Monthly Charges: $20.99 per tablet; $20.99 per camera; $10.99 per wearable. Requires active phone line. If you cancel your phone line(s) first standalone non-phone device will be billed at $75.99. If you switch plans, the non-phone device standard monthly rates apply and may be eligible for discounts based on new rate plan. Each additional line billed at the standard monthly rate. AT&T Connected Car Monthly Charges: $15 per vehicle. OTHER RESTRICTIONS & FEES: Activation/upgrade fee (up to $50) & deposit may apply. Credit, debit, or reloadable prepaid card may be required (except in MA, PA, and ND). AUTOPAY & PAPERLESS BILL DISCOUNT: $10 a month per phone line discount if enrolled in both paperless billing and AutoPay with a bank account or the AT&T Points Plus® Card from Citi. Discount reduced to $5 a month per phone line when enrolled in AutoPay with a debit card. No discount if enrolled in AutoPay with any other credit card. Pay full plan cost until discount starts within 2 bills. Must maintain valid email address to continue discount. AT&T employees, retirees & IMO consumers are not eligible for the AutoPay and Paperless bill discount. UNLIMITED DATA: For use in the United States (the “Domestic Coverage Area” or “DCA”), Mexico and Canada. 2G off-net data speeds may apply. All AT&T service is subject to AT&T network management policies. See att.com/broadbandinfo for details. UNLIMITED TALK: Phones only. Includes calls w/in and between the DCA, Canada and Mexico. You may be charged for calls to special or premium service numbers and calls to other countries. For rates, see att.com/intlcalling. UNLIMITED TEXT: Compatible phone and rate plan required. Includes unlimited messages up to 1MB in size within and from DCA, Mexico and Canada. For texting to other countries, see att.com/text2world. Messages sent through applications may incur data or other charges. Advanced Messaging: Not available for use in Mexico and Canada. Other restrictions apply & can be found at att.com/advancedmessaging. 5G SERVICE: Requires a compatible 5G device. Coverage not available everywhere. See att.com/5Gforyou for details. ACTIVEARMOR MOBILE SECURITY: Compatible device required. You must download the AT&T ActiveArmor app and accept its terms and conditions for full App functionality. May not detect all threats. May inadvertently block wanted calls; settings can be adjusted in the App. Details at www.att.com/activearmor. LIMITS: Select devices only (sold separately). Max 10 phone lines and 20 lines total (including both phone and non-phone device lines) per Unlimited Your Way group. These plans may not be eligible for additional discounts, including but not limited to Signature and Appreciation discounts. AT&T employees & retirees may not be eligible for certain benefits, offers, and discounts associated with these plans.\n\nADDITIONAL AT&T FEES & GOVT. TAXES: Monthly AT&T Fees apply per line & include Administrative/Regulatory Cost Recovery Fee, up to $4.99 & other fees which are not government-required. Add’l one-time AT&T fees may apply. Govt. taxes are extra. See att.com/mobilityfees for more details.\n\nAll offers, programming, promotions, pricing, terms, restrictions & conditions subject to change & may be modified, discontinued, or terminated at any time without notice.",
    "features": [
      "Unlimited talk, text, & high-speed data that can’t slow down based on how much you use",
      "AT&T 5G℠ with 4K ultra high definition (UHD) streaming available",
      "Unlimited talk, text & high-speed data in 20 Latin American countries",
      "AT&T ActiveArmor® mobile security",
      "100GB hotspot data per line per month",
      "Get 50% off connectivity for one tablet or watch per phone line"
    ],
    "sourceUrl": "https://www.att.com/plans/unlimited-data-plans/",
    "retrievedAt": "2026-10-21T06:13:48.628Z",
    "expiresAt": null,
    "videoRef": "0:68–0:70 (\"$50.00/line/mo\" for 4 lines)"
  },
  {
    "id": "wireless-extra-2",
    "category": "wireless-plan",
    "title": "AT&T Extra 2.0℠",
    "headline": "AT&T Extra 2.0℠: $40/mo. per line when you get 4 lines",
    "price": {
      "amount": 40,
      "unit": "/mo. per line",
      "qualifier": "when you get 4 lines"
    },
    "conditions": [
      "Price per line with 4 lines",
      "After $10/mo. per line AutoPay & paperless bill discount (starts within 2 bills)",
      "Taxes & fees extra"
    ],
    "finePrint": "AT&T EXTRA 2.0: 100GB of high-speed data. After 100GB of data usage on a line in a bill cycle, for the remainder of the cycle, AT&T may temporarily slow data speeds if the network is busy. VIDEO STREAMING: Video typically streams at standard-definition. Content bundled with video may be slow to load. Details at att.com/VideoFeature. HOTSPOT DATA: Requires compatible device. Includes up to 50GB per line per month. After 50GB, hotspot speed slowed to max of 128Kbps for the rest of bill cycle. After this, hotspot data usage will be impacted and not fully functional.\n\nALL PLANS UNLIMITED YOUR WAY: Plans avail. in select locations only. All AT&T wireless services subject to terms and conditions in the Consumer Service Agreement (att.com/csa). Advertised monthly price includes monthly plan charge for talk, text and data & monthly per-line phone access charge. Other Non-Phone Device Monthly Charges: $20.99 per tablet; $20.99 per camera; $10.99 per wearable. Requires active phone line. If you cancel your phone line(s) first standalone non-phone device will be billed at $75.99. If you switch plans, the non-phone device standard monthly rates apply and may be eligible for discounts based on new rate plan. Each additional line billed at the standard monthly rate. AT&T Connected Car Monthly Charges: $15 per vehicle. OTHER RESTRICTIONS & FEES: Activation/upgrade fee (up to $50) & deposit may apply. Credit, debit, or reloadable prepaid card may be required (except in MA, PA, and ND). AUTOPAY & PAPERLESS BILL DISCOUNT: $10 a month per phone line discount if enrolled in both paperless billing and AutoPay with a bank account or the AT&T Points Plus® Card from Citi. Discount reduced to $5 a month per phone line when enrolled in AutoPay with a debit card. No discount if enrolled in AutoPay with any other credit card. Pay full plan cost until discount starts within 2 bills. Must maintain valid email address to continue discount. AT&T employees, retirees & IMO consumers are not eligible for the AutoPay and Paperless bill discount. UNLIMITED DATA: For use in the United States (the “Domestic Coverage Area” or “DCA”), Mexico and Canada. 2G off-net data speeds may apply. All AT&T service is subject to AT&T network management policies. See att.com/broadbandinfo for details. UNLIMITED TALK: Phones only. Includes calls w/in and between the DCA, Canada and Mexico. You may be charged for calls to special or premium service numbers and calls to other countries. For rates, see att.com/intlcalling. UNLIMITED TEXT: Compatible phone and rate plan required. Includes unlimited messages up to 1MB in size within and from DCA, Mexico and Canada. For texting to other countries, see att.com/text2world. Messages sent through applications may incur data or other charges. Advanced Messaging: Not available for use in Mexico and Canada. Other restrictions apply & can be found at att.com/advancedmessaging. 5G SERVICE: Requires a compatible 5G device. Coverage not available everywhere. See att.com/5Gforyou for details. ACTIVEARMOR MOBILE SECURITY: Compatible device required. You must download the AT&T ActiveArmor app and accept its terms and conditions for full App functionality. May not detect all threats. May inadvertently block wanted calls; settings can be adjusted in the App. Details at www.att.com/activearmor. LIMITS: Select devices only (sold separately). Max 10 phone lines and 20 lines total (including both phone and non-phone device lines) per Unlimited Your Way group. These plans may not be eligible for additional discounts, including but not limited to Signature and Appreciation discounts. AT&T employees & retirees may not be eligible for certain benefits, offers, and discounts associated with these plans.\n\nADDITIONAL AT&T FEES & GOVT. TAXES: Monthly AT&T Fees apply per line & include Administrative/Regulatory Cost Recovery Fee, up to $4.99 & other fees which are not government-required. Add’l one-time AT&T fees may apply. Govt. taxes are extra. See att.com/mobilityfees for more details.\n\nAll offers, programming, promotions, pricing, terms, restrictions & conditions subject to change & may be modified, discontinued, or terminated at any time without notice.",
    "features": [
      "Unlimited talk, text, data + 100GB of high-speed data",
      "After 100GB, AT&T may temporarily slow data speeds if the network is busy.",
      "AT&T 5G℠",
      "Unlimited talk, text, and data between the U.S., Canada & Mexico",
      "AT&T ActiveArmor® mobile security",
      "50GB hotspot data per line per month"
    ],
    "sourceUrl": "https://www.att.com/plans/unlimited-data-plans/",
    "retrievedAt": "2026-10-21T06:13:48.628Z",
    "expiresAt": null,
    "videoRef": "0:68–0:70 (\"$40.00/line/mo\" for 4 lines)"
  },
  {
    "id": "wireless-value-2",
    "category": "wireless-plan",
    "title": "AT&T Value 2.0℠",
    "headline": "AT&T Value 2.0℠: $30/mo. per line when you get 4 lines",
    "price": {
      "amount": 30,
      "unit": "/mo. per line",
      "qualifier": "when you get 4 lines"
    },
    "conditions": [
      "Price per line with 4 lines",
      "After $10/mo. per line AutoPay & paperless bill discount (starts within 2 bills)",
      "Taxes & fees extra"
    ],
    "finePrint": "AT&T VALUE 2.0: 5GB of high-speed data. After 5GB of data usage on a line in a bill cycle, for the remainder of the cycle, AT&T may temporarily slow data speeds if the network is busy. VIDEO STREAMING: Video typically streams at standard-definition. Content bundled with video may be slow to load. Details at att.com/VideoFeature. HOTSPOT DATA: Requires compatible device. Includes up to 3GB per line per month. After 3GB, hotspot speed slowed to max of 128Kbps for the rest of bill cycle. After this, hotspot data usage will be impacted and not fully functional.\n\nALL PLANS UNLIMITED YOUR WAY: Plans avail. in select locations only. All AT&T wireless services subject to terms and conditions in the Consumer Service Agreement (att.com/csa). Advertised monthly price includes monthly plan charge for talk, text and data & monthly per-line phone access charge. Other Non-Phone Device Monthly Charges: $20.99 per tablet; $20.99 per camera; $10.99 per wearable. Requires active phone line. If you cancel your phone line(s) first standalone non-phone device will be billed at $75.99. If you switch plans, the non-phone device standard monthly rates apply and may be eligible for discounts based on new rate plan. Each additional line billed at the standard monthly rate. AT&T Connected Car Monthly Charges: $15 per vehicle. OTHER RESTRICTIONS & FEES: Activation/upgrade fee (up to $50) & deposit may apply. Credit, debit, or reloadable prepaid card may be required (except in MA, PA, and ND). AUTOPAY & PAPERLESS BILL DISCOUNT: $10 a month per phone line discount if enrolled in both paperless billing and AutoPay with a bank account or the AT&T Points Plus® Card from Citi. Discount reduced to $5 a month per phone line when enrolled in AutoPay with a debit card. No discount if enrolled in AutoPay with any other credit card. Pay full plan cost until discount starts within 2 bills. Must maintain valid email address to continue discount. AT&T employees, retirees & IMO consumers are not eligible for the AutoPay and Paperless bill discount. UNLIMITED DATA: For use in the United States (the “Domestic Coverage Area” or “DCA”), Mexico and Canada. 2G off-net data speeds may apply. All AT&T service is subject to AT&T network management policies. See att.com/broadbandinfo for details. UNLIMITED TALK: Phones only. Includes calls w/in and between the DCA, Canada and Mexico. You may be charged for calls to special or premium service numbers and calls to other countries. For rates, see att.com/intlcalling. UNLIMITED TEXT: Compatible phone and rate plan required. Includes unlimited messages up to 1MB in size within and from DCA, Mexico and Canada. For texting to other countries, see att.com/text2world. Messages sent through applications may incur data or other charges. Advanced Messaging: Not available for use in Mexico and Canada. Other restrictions apply & can be found at att.com/advancedmessaging. 5G SERVICE: Requires a compatible 5G device. Coverage not available everywhere. See att.com/5Gforyou for details. ACTIVEARMOR MOBILE SECURITY: Compatible device required. You must download the AT&T ActiveArmor app and accept its terms and conditions for full App functionality. May not detect all threats. May inadvertently block wanted calls; settings can be adjusted in the App. Details at www.att.com/activearmor. LIMITS: Select devices only (sold separately). Max 10 phone lines and 20 lines total (including both phone and non-phone device lines) per Unlimited Your Way group. These plans may not be eligible for additional discounts, including but not limited to Signature and Appreciation discounts. AT&T employees & retirees may not be eligible for certain benefits, offers, and discounts associated with these plans.\n\nADDITIONAL AT&T FEES & GOVT. TAXES: Monthly AT&T Fees apply per line & include Administrative/Regulatory Cost Recovery Fee, up to $4.99 & other fees which are not government-required. Add’l one-time AT&T fees may apply. Govt. taxes are extra. See att.com/mobilityfees for more details.\n\nAll offers, programming, promotions, pricing, terms, restrictions & conditions subject to change & may be modified, discontinued, or terminated at any time without notice.",
    "features": [
      "Unlimited talk, text & data + 5GB of high-speed data",
      "After 5GB, AT&T may temporarily slow data speeds if the network is busy.",
      "AT&T 5G℠",
      "Unlimited talk, text, and data between the U.S., Canada & Mexico",
      "AT&T ActiveArmor® mobile security",
      "3GB Hotspot data per line per month"
    ],
    "sourceUrl": "https://www.att.com/plans/unlimited-data-plans/",
    "retrievedAt": "2026-10-21T06:13:48.628Z",
    "expiresAt": null,
    "videoRef": "0:68–0:70 (\"$30.00/line/mo\" for 4 lines)"
  },
  {
    "id": "wireless-switch-reward-800",
    "category": "wireless-promo",
    "title": "Up to $800 Reward Card Switcher Offer",
    "headline": "Switch to AT&T and get up to $800 per line to help pay off your phone",
    "price": null,
    "conditions": [
      "Up to $800 via AT&T Visa Reward Card (redemption required)",
      "Requires port-in of a new line with eligible postpaid service",
      "Restrictions apply"
    ],
    "finePrint": "Up to $800 Reward Card Switcher Offer Details\n\nSubject to change at any time and without notice.\n\nReward Card: Get up to an $800 AT&T Visa Reward card when you switch to AT&T or FirstNet and port-in a new line with eligible postpaid service. Excludes AT&T OneConnect and AT&T Build-A-Plan.\nRequirements: (1) previously had active wireless service from a competing wireless provider for a min. of 120 days and in good standing with a min. of 4 smartphone installment payments with an amount owed (payoff and/or early termination fee (ETF)) on a smartphone; (2) purchase of a new smartphone on a qualifying 0% APR 36-mo. installment plan, purchase of a new smartphone bought at full price (“No-Commit”), or bring your own compatible, unlocked smartphone (“BYOD”); and (3) port-in of new line from an eligible third-party carrier (excludes Cricket, AT&T PREPAID, AT&T Resellers, Residential Wireless, Wireline VOIP) on a qualifying postpaid wireless line of svc (voice & data).\nCard amount will be determined by the amount owed on the competing wireless provider smartphone (payoff or ETF) and will not exceed $800 per line; new line must remain active for minimum of 60 days from activation. Activation date starts same day as AT&T Installment Plan or start date of service for BYOD and No-Commit.   BYO device must be a smartphone; tablets, wearables, and hotspots are not included.  Some phone features may not work on AT&T network. Other installment options may be available and vary by account type.\nReward Card Redemption:\nPhone number used for card redemption must match the eligible ported number.\nReq’s most recent customer bill with current payoff balance (dated within one calendar month of activation with AT&T) or final bill with ETF from eligible third-party mobile carrier must be uploaded via att.com/switcherpayoff within 60 days of activation of new line. Must submit copy of most recent bill for each line ported in.\nCard(s) delivered within 8-10 weeks after bill upload to customers who maintain and pay for qualifying service on eligible line(s) from activation date and through reward fulfillment.  Card expires at month-end 6 mos. after issuance. For Cardholder Agreement, go to rewardcenter.att.com. Card is issued by The Bancorp Bank, Member FDIC, pursuant to a license from Visa U.S.A. Inc. and can be used everywhere Visa debit cards are accepted in the United States, District of Columbia, US Virgin Islands, and Puerto Rico.  No cash access. The Bancorp Bank does not endorse or sponsor and is not affiliated in any way with any product or service offered by AT&T.\nLimits: One switcher reward card per eligible new line. If new port-in line of service is cancelled within 36 months of activation or becomes ineligible, AT&T may charge back all or part of the value of the AT&T Visa Reward Card. The charge back will be 100% if cancellation within 12 months, 50% if cancellation within 13-24 months, 25% if cancellation within 25-36 months on the final bill and will not be able to reactivate the line of service or have the charge removed. The charge back will occur on next bill cycle if additional lines are active on the account.",
    "sourceUrl": "https://www.att.com/wireless/switch-and-save/",
    "retrievedAt": "2026-10-21T06:30:10.625Z",
    "expiresAt": null
  },
  {
    "id": "wireless-byod-credit-360",
    "category": "wireless-promo",
    "title": "BYOD Bill Credit Switcher Offer",
    "headline": "Bring your own smartphone and save up to $360 per line",
    "price": null,
    "conditions": [
      "Req. port-in (transfer) of new line. Up to $360 in credits over 36 mos. for AT&T Premium 2.0SM or AT&T Extra 2.0SM. $35 activation and other terms apply."
    ],
    "finePrint": "BYOD Bill Credit Switcher Offer: Subject to Change. Available to AT&T post-paid wireless customers and verified FirstNet Subscriber Paid Users on FirstNet and Family plan. FirstNet Subscriber Paid User Eligibility: Eligible & verified employees/volunteers of qual. public safety entities or entities that contribute, enable, or support public safety services to first responders and whose duties are directly related to such services. New subscribers must qualify for FirstNet service and complete verification process w/in 30 days. Check elig. at firstnet.com/eligibility. Req. FirstNet-Capable device provisioned with a FirstNet Trio SIM or eSIM card. Limits: Max of 4 lines (1 smartphone, 1 tablet, 1 wearable, 1 connected device) per elig. FirstNet Subscriber Paid User. Account subj. to periodic re-verification. If you are not a valid Subscriber Paid User or exceed the single line limit for each type of device, AT&T may suspend, change or terminate your FirstNet svc. For additional info. see firstnet.com/firstnetandfamily. Requires new qualifying postpaid line of wireless svc (voice & data) on a smartphone bought at full price (\"No-Commit\") or bring your own compatible, unlocked smartphone (\"BYOD\") and port-in of new line from an eligible third-party carrier to receive up to $360 off ($10/mo. for 36 months) or up to $180 off ($5/mo. for 36 months). Excludes port-in from wireline or VOIP provider. BYO device must be a smartphone; tablets not included. Some phone features may not work on AT&T network. Req'd Wireless: AT&T Premium 2.0, AT&T Extra 2.0 plan ($360 Bill Credit offer); AT&T Value 2.0 ($180 Bill Credit offer). On unlimited plans, video may be ltd to SD. Speed, usage & other restr's apply. See att.com/unlimited for current unlimited plans. If you cancel service on any other line within 90 days of activating the line under this offer, credits will stop. Activation Fee: $35 Activ. credited w/in 3 bills for online orders only. Bill Credits: Credits start w/in 3 bills. Tax on wireless service, if any, is calculated prior to application of monthly bill credit. To qualify for bill credits, must remain active and in good-standing on new line w/your No-Commit/BYOD for thirty (30) days. To get all credits, No-Commit/BYOD smartphone must keep eligible service for 36 months after credits start. If you cancel service, credits will end. LIMITS: Limit one (1) bill credit offer per eligible ported new line. May not be combined with other offers, discounts, or credits. Other limits & restr's apply. Participation in this offer may make your wireless account ineligible for select other offers (including select bill credit offers) for a 12-month period. Ask rep for details.\n\nGEN. WIRELESS SVC: Subject to Consumer Service Agreement (att.com/consumerserviceagreement) and credit approval. Pricing, promotion, terms, & restr’s subject to change & may be modified or terminated at any time without notice.",
    "sourceUrl": "https://www.att.com/wireless/switch-and-save/",
    "retrievedAt": "2026-10-21T06:30:10.625Z",
    "expiresAt": null
  },
  {
    "id": "wireless-new-line-5-off",
    "category": "wireless-promo",
    "title": "Unlimited Your Way new line discount",
    "headline": "An extra $5/mo. off for 12 months for each new line you add, when you have 4 or more lines",
    "price": null,
    "conditions": [
      "Limited time",
      "Must maintain a minimum of 4 Unlimited Your Way plans",
      "Taxes and fees extra"
    ],
    "finePrint": "New line discount: Limited time. Must maintain a minimum of 4 Unlimited Your Way plans. Taxes and fees extra. Plan price after $10/mo. discount (starts within 2 bills) per phone line when you sign up for paperless billing and AutoPay with a bank account or AT&T Points Plus® Card from Citi.",
    "features": [
      "AT&T Elite 2.0: $65.00/mo. per line when you get 4 lines (was $80.00)",
      "AT&T Premium 2.0: $45.00/mo. per line when you get 4 lines (was $60.00)",
      "AT&T Extra 2.0: $35.00/mo. per line when you get 4 lines (was $50.00)",
      "AT&T Value 2.0: $25.00/mo. per line when you get 4 lines (was $40.00)"
    ],
    "sourceUrl": "https://www.att.com/wireless/switch-and-save/",
    "retrievedAt": "2026-10-21T06:15:12.316Z",
    "expiresAt": null
  },
  {
    "id": "wireless-trade-in-samsung-z8",
    "category": "wireless-promo",
    "title": "Samsung Galaxy Z Flip8 and Z Fold8 Series Trade-in Offer",
    "headline": "Up to $1,200 off Galaxy Z Flip8, Z Fold8, Z Fold8 Ultra with an eligible trade-in",
    "price": null,
    "conditions": [
      "New and existing customers activating a new line or upgrading",
      "Requires eligible trade-in and eligible unlimited plan",
      "0% APR 36-month installment plan; credits over the installment term"
    ],
    "finePrint": "Samsung Galaxy Z Flip8 and Z Fold8 Series Trade-in Offer\n\nTrade-In Offer Details\n\nEligibility: New and existing customers activating a new line or upgrading an existing line.\nDiscounts:\nUp to $1,200 off Galaxy Z Flip8, Z Fold8, Z Fold8 Ultra with activation on AT&T Premium 2.0 plan or higher (starting at $100/mo. plus taxes and fees, before discounts for single line) or select retired/legacy unlimited plans and trade-in of an eligible smartphone with min. trade-in value of $95 or more (up to $1,000 off with trade-in value of $35-$94).\nUp to $1,000 off eligible devices with activation on AT&T Extra 2.0 plan (starting at $80/mo. plus taxes and fees, before discounts for single line) and trade-in of an eligible smartphone with min. trade-in value of $95 (up to $800 off with trade-in value of $35-$94). Customers on legacy Starter/Starter SL plans qualify for a max of $800 off eligible devices with trade-in of eligible smartphone with min. trade-in value of $35 or more.\nUp to $500 off eligible devices with activation on AT&T Value 2.0 plan (starting at $60/mo. plus taxes and fees, before discounts for single line) and trade-in of eligible smartphone with min. trade-in value of $35 or more.\nPurchase Requirements: Requires qualifying 0% APR 36-month installment plan with monthly payments of up to $75; based on eligible device purchased. $0 down is available for well-qualified customers; others may require a down payment. Other installment options may vary by account type. Customers must pay tax on full retail price and an activation/upgrade fee of $35 per line.\nCredits: Credits applied over installment term, starting within 3 bills. If the wireless plan on the purchased device is lowered during the installment term, credits may stop or be reduced to the max avail. for the lower plan, if eligible. Canceling wireless service stops credits and remaining device balance is due. If adding a new line, must not cancel service on any other line within 90 days or credits may stop. Early payoff or upgrade may stop credits. Max credit will not exceed device cost or eligible credit amt.\nPlan Limitations/Restrictions: This offer requires an eligible postpaid unlimited voice & data plan. AT&T may temporarily slow data speeds if the network is busy.  AT&T 55+, Value Plus, Value Plus VL, and Value Plus Unlimited plans are not eligible. See att.com/unlimited for current unlimited plans.\nOffer and requirements subject to change at any time and without notice.\n\nAdditional Details\n\nTrade-In Devices:\nEligibility: The trade-in device must not be on an existing installment plan must be completed within 30 days from the start of the new smartphone's installment plan. For online orders or when the new device must be shipped, installment plan and 30-day Trade-in window start when the new purchased device is shipped.\nEligible Trade-in Devices: Eligible trade-in devices are subject to change at any time and without notice. For terms and to check if your device is eligible, visit tradein.att.com.\nTo qualify for max credit (based on purchased device), trade-in device must have min. trade-in value (as defined below) after device condition questions have been answered.\nEligible Trade-in devices with min. $95+ TiV:\nApple iPhone: 11 Pro, 11 Pro Max, 12, 12 mini, 12 Pro, 12 Pro Max, 13, 13 mini, 13 Pro, 13 Pro Max, 14, 14 Plus, 14 Pro, 14 Pro Max, 15, 15 Plus, 15 Pro, 15 Pro Max, 16, 16 Plus, 16 Pro, 16 Pro Max, 16e, 17, 17 Pro, 17 Pro Max, iPhone Air, 17e\nSamsung Galaxy: F55, XCover7 Pro, Z Fold3 5G, S22+ 5G, S22 Ultra 5G, Z Fold4, Z Flip4, S23, S23+, S23 Ultra, S23 FE, Z Flip5, S24, S24+, S24 Ultra, S24 FE, Z Fold5, Z Flip6, Z Fold6, S25, S25+, S25 Edge, S25 Ultra, S25 FE, S26, S26+, S26 Ultra, Z Flip7 FE, Z Flip7, Z Fold7\nGoogle: Pixel 10 Pro XL, 9 Pro Fold, 10 Pro, 10, 9 Pro XL, 9 Pro, 9, 8 Pro, 9a, 8a, 8, 7 Pro, Fold, 10 Pro Fold\nOther: Moto Razr Ultra 2025, Razr+ 2025, OnePlus Open, Moto Razr 2025, OnePlus 13, 12R, 12 5G, 11 Lite 5G NE, 11 5G, Moto G Stylus (2025)\nEligible Trade-in devices with min. $35+ TiV:\nApple iPhone: XR, XS, XS Max, 11, iPhone SE (3rd gen), 11 Pro, 11 Pro Max, 12, 12 mini, 12 Pro, 12 Pro Max, 13, 13 mini, 13 Pro, 13 Pro Max, 14, 14 Plus, 14 Pro, 14 Pro Max, 15, 15 Plus, 15 Pro, 15 Pro Max, 16, 16 Plus, 16 Pro, 16 Pro Max, 16e, 17, 17 Pro, 17 Pro Max, iPhone Air, 17e\nSamsung Galaxy: M33, M35, M54, A17, A17 5G, A36, S10, S10 5G, S10 Lite, S10+, S10E, Note10, Note10 5G, Note10+, Note10+ 5G, S20, S20 5G, S20 FE, S20 FE 5G, S20+, S20+ 5G, S20 Ultra 5G, Note20, Note20 5G, Note20 Ultra, Note20 Ultra 5G, S21, S21 FE 5G, S21+, S21 Ultra, Z Flip3 5G, S22 5G, Z Fold3 5G, S22+ 5G, S22 Ultra 5G, Z Fold4, Z Flip4, S23, S23+, S23 Ultra, S23 FE, Z Flip5, S24, S24+, S24 Ultra, S24 FE, Z Fold5, Z Flip6, Z Fold6, S25, S25+, S25 Edge, S25 Ultra, S25 FE, A56, S26, S26+, S26 Ultra, Z Flip7 FE, Z Flip7, Z Fold7\nGoogle: Pixel 4, 4 XL, 5a, 6, 6 Pro, 6a, 7, 7 Pro, 7a, 8, 8a, Fold, 10 Pro XL, 9 Pro Fold, 10 Pro, 10, 9 Pro XL, 9 Pro, 9, 8 Pro, 10 Pro Fold\nOther: OnePlus 8 5G, OnePlus 8 Pro, OnePlus 8T, OnePlus 8T+, One Plus 8, ZTE Red Magic 3, OnePlus 10T, Moto Razr 2023, Moto razr Plus 5G, Moto E13, Moto Edge (2025), Moto Edge 50 Pro, Redmi Note 13 Pro, Moto Razr Ultra 2025, Razr+ 2025, OnePlus Open, Moto Razr 2025, razr+ 2024, OnePlus 13, 12R, 12 5G, 11 Lite 5G NE, 11 5G, Moto G Stylus (2025), razr+ 2024\nNext Up Anytime: Available with qualifying AT&T Installment plans for additional charge (currently $10/mo). This charge does not apply toward financed device cost balance, is non-refundable. Feature may be canceled at any time resulting in waiver of right to turn in and upgrade during current installment agreement term. Upgrade eligible after 1 installment and Next Up Anytime payment made and turn-in of qualifying smartphone. Max of 3 upgrades in a 12-month period. Existing Next Up Anytime Customers: To qualify for this offer, must turn-in a qualifying device with minimum 1/3 of existing device balance paid. Must re-add Next Up Anytime on new smartphone. If cancel Next Up Anytime, promotional credits (if any) on new smartphone will be stopped Limits & restr's apply. See att.com/nextupanytime for details.\n\nSee additional offers",
    "sourceUrl": "https://www.att.com/wireless/switch-and-save/",
    "retrievedAt": "2026-10-21T06:30:10.625Z",
    "expiresAt": null
  },
  {
    "id": "wireless-trade-in-iphone-18",
    "category": "wireless-promo",
    "title": "iPhone 17, iPhone 18 Pro Series & iPhone Duo Trade-in Offer",
    "headline": "Up to $1,200 off iPhone 18 Pro, iPhone 18 Pro Max and iPhone Duo with an eligible trade-in",
    "price": null,
    "conditions": [
      "New and existing customers activating a new line or upgrading",
      "Requires eligible trade-in and eligible unlimited plan",
      "0% APR 36-month installment plan; credits over the installment term"
    ],
    "finePrint": "iPhone 17, iPhone 18 Pro Series & iPhone Duo Trade-in Offer\n\nTrade-In Offer Details\n\nEligibility: New and existing customers activating a new line or upgrading an existing line.\nDiscounts:\nUp to $1,200 off iPhone 18 Pro and iPhone 18 Pro Max and iPhone Duo with activation on AT&T Premium 2.0 plan or higher (min. $100/mo. plus taxes and fees, before discounts for single line) or select retired/legacy unlimited plans and trade-in of an eligible smartphone with min. trade-in value of $230 or more.\nUp to $930 off iPhone 18 Pro, iPhone 18 Pro Max, iPhone Duo, and iPhone 17 with activation on AT&T Extra 2.0 plan or higher (min. $80/mo. plus taxes and fees, before discounts for single line) and trade-in of an eligible smartphone with min. trade-in value of $130 or more. Customers on AT&T Extra 2.0 or legacy AT&T Extra, Starter/SL plans qualify for a max credit of $930 with eligible trade-in of $130 or more.\nMax credit of up to $500 off all eligible devices with activation on Value 2.0 plan and trade-in of an eligible smartphone with min. trade-in value of $130 or more.\nMax credit of up to $350 off all eligible devices with activation on any eligible unlimited plan and trade-in of an eligible smartphone with min. trade-in value of $35-$129.\nPurchase Requirements: Requires 0% APR 36-month installment plan with monthly payments of up to $88.89; based on eligible device purchased. $0 down is available for well-qualified customers; others may require a down payment. Other installment options may vary by account type. Customers must pay tax on full retail price and an activation/upgrade fee of $35 per line.\nCredits:  Credits applied over installment term, starting within 3 bills. If the wireless plan on the purchased device is lowered during the installment term, credits may stop or be reduced to the max avail. for the lower plan, if eligible. Canceling wireless service stops credits and remaining device balance is due.  If adding a new line, must not cancel service on any other line within 90 days or credits may stop. Early payoff or upgrade may stop credits. Max credit will not exceed device cost or eligible credit amt.\nPlan Limitations/Restrictions: This offer requires an eligible postpaid unlimited voice & data plan. AT&T may temporarily slow data speeds if the network is busy. AT&T 55+, Value Plus, Value Plus VL, and Value Plus Unlimited plans are not eligible. See att.com/unlimited for current unlimited plans.\nOffer and requirements subject to change at any time and without notice.\n\nAdditional Details\n\nTrade-In Devices:\nEligibility: The trade-in device must not be on an existing installment plan must be completed within 30 days from the start of the new smartphone's installment plan. For online orders or when the new device must be shipped, installment plan and 30-day Trade-in window start when the new purchased device is shipped.\nEligible Trade-in Devices: Eligible trade-in devices are subject to change at any time and without notice.  For terms and to check if your device is eligible, visit tradein.att.com.\nTo qualify for max credit (based on purchased device), trade-in device must have min. trade-in value (as defined below) after device condition questions have been answered.\nTo qualify for up to $1,200 credit on iPhone 18 Pro, iPhone 18 Pro Max and iPhone Duo, minimum Trade-In value must be $230 or above.\nEligible Trade-in devices with min. $230 TiV:\nApple iPhone: 14 Pro Max, 15, 15 Plus, 15 Pro, 15 Pro Max, 16, 16 Plus, 16 Pro, 16 Pro Max, Air, 17, 17 Pro, 17 Pro Max\nSamsung Galaxy: S24+, S24 Ultra, Z Fold6, Z Flip7 FE, Z Flip7, Z Fold7, S25, S25 FE, S25+, S25 Edge, S25 Ultra, S26, S26+, S26 Ultra\nGoogle Pixel: 9 Pro Fold, 10, 10a, 10 Pro, 10 Pro XL, 10 Pro Fold\nOTHER:\nTo qualify for up to $930 credit, minimum Trade-In value must be $130 or above:\nEligible Trade-in devices with min. $130 TiV:\nApple iPhone: 14, 14 Plus, 14 Pro, 14 Pro Max, 15, 15 Plus, 15 Pro, 15 Pro Max, 16, 16 Plus, 16 Pro, 16 Pro Max, Air, 17e, 17, 17 Pro, 17 Pro Max\nSamsung Galaxy: S22+ 5G, S22 Ultra 5G, S23, S23+, S23 Ultra, S24, S24 FE, S24+, S24 Ultra, Z Fold5, Z Flip6, Z Fold6, Z Flip7 FE, Z Flip7, Z Fold7, S25, S25 FE, S25+, S25 Edge, S25 Ultra, S26, S26+, S26 Ultra\nGoogle Pixel: 8 Pro, 9, 9a, 9 Pro, 9 Pro XL, 9 Pro Fold, 10, 10a, 10 Pro, 10 Pro XL, 10 Pro Fold\nOther: OnePlus Open, Moto Razr 2025, Moto Razr Ultra 2025\nTo qualify for up to $350 credit, minimum Trade-In value must be $35-$129:\nEligible Trade-in devices with min. $35-$129 TiV:\nApple iPhone: XR, XS, XS Max, iPhone SE (3rd Gen), 11, 11 Pro, 11 Pro Max, 12 mini, 12, 12 Pro, 12 Pro Max, 13 Mini, 13, 13 Pro, 13 Pro Max, 16e\nSamsung Galaxy: S10, S10E, S10+, S10 5G, Note10, Note10 5G, Note10+, Note10+ 5G, S20, S20 5G, S20+ 5G, S20 Ultra 5G, S20 FE, S20 FE 5G, Note20, Note20 5G, Note20 Ultra, Note20 Ultra 5G, S21, S21+, S21 Ultra, S21 FE 5G, Z Flip3 5G, Z Fold3, S22 5G, S23 FE, Z Flip4, Z Fold4, Z Flip5, M33, M54, A17, A56\nGoogle Pixel: 4, 4 XL, 5a, 6, 6a, 6 Pro, 7, 7a, 7 Pro, Fold, 8, 8a\nOther: Red Magic 3, Red Magic 5S, 8, 8 5G, 8 Pro, 8T, 8T+, 9R, Redmi Note 10, Redmi Note 10 Pro, Redmi Note 10Pro Max, Redmi Note 11, Redmi Note 11 Pro, Redmi Note 11 Pro 5G, Redmi Note 11 Pro+ 5G, Redmi Note 13 Pro, OnePlus 11 Lite 5G NE, 11 5G, 12 5G, 12R, OnePlus 13, OnePlus 13R, Edge 40, Edge 40 Neo, Edge 50, Edge 50 Pro, Moto E13, Moto G 5G 2024, Moto Razr, Plus 2024, Moto Razr 2024, razr 2024, Moto Razr Plus 5G, razr+ 2024, Edge 2024, Moto Edge (2025), Motorola G Stylus (2025)\nNext Up Anytime: Available with qualifying AT&T Installment plans for additional charge (currently $10/mo). This charge does not apply toward financed device cost balance, is non-refundable. Feature may be canceled at any time resulting in waiver of right to turn in and upgrade during current installment agreement term. Upgrade eligible after 1 installment and Next Up Anytime payment made and turn-in of qualifying smartphone. Max of 3 upgrades in a 12-month period. Existing Next Up Anytime Customers: To qualify for this offer, must turn-in a qualifying device with minimum 1/3 of existing device balance paid. Must re-add Next Up Anytime on new smartphone. If cancel Next Up Anytime, promotional credits (if any) on new smartphone will be stopped Limits & restr's apply. See att.com/nextupanytime for details.\n\nSee additional terms",
    "sourceUrl": "https://www.att.com/",
    "retrievedAt": "2026-10-21T06:07:22.737Z",
    "expiresAt": null
  },
  {
    "id": "wireless-appreciation-savings",
    "category": "wireless-promo",
    "title": "AT&T Appreciation Savings℠",
    "headline": "Military, veterans, retired responders, teachers and their families can save up to 20% on wireless",
    "price": null,
    "conditions": [
      "Req. proof of eligibility & eligible plan. Save 20% off AT&T Premium 2.0℠, 15% off Extra 2.0, and 10% off Value 2.0 plan lines of service. Credit(s) within 3 bills. Terms apply."
    ],
    "finePrint": "MILITARY & VETERAN: Eligibility: Requires proof of eligibility & subj. to annual recertification. Avail. to: (i) active U.S. military service personnel providing a paystub from w/in 90 days; (ii) U.S. military veterans providing either a Department of War (DOW) Form DD214 indicating honorable discharge, a DOW form NGB 22/22A, or veteran designated driver’s license where applicable; and (iii) qualified spouses or surviving spouse of active duty U.S. military service personnel providing a paystub from w/in 90 days and proof of marriage (e.g. marriage certificate). Spouses and surviving spouse of Veterans are not eligible. Offer available only in select locations/channels. Customers accepting offer certify they are permitted to under applicable law. Eligibility is subject to annual recertification. Customers on certain offers may not be eligible. Other restr’s may apply. Up to 20% off Wireless service discount: Plans avail. in select locations only. Get 10% off AT&T Value 2.0, 15% off AT&T Extra 2.0, and 20% off AT&T Premium 2.0 plan monthly service charge for smartphone lines of service; 20% off the monthly service charge for eligible connected data device (tablet, smartwatch, hotspot, Connected Car, and camera) lines of service. With Premium 2.0 the first eligible tablet or smartwatch wearable line of service will get 50% off. Excludes AT&T Elite 2.0. Discount applied after any applicable multi-line, Autopay, paperless bill, or other discount. Start w/in 3 bill cycles after service activation & eligibility confirmed. Unlimited Data: AT&T may temporarily slow data speeds if the network is busy. All AT&T service is subject to AT&T network management policies. See att.com/broadbandinfo for details. For use in the United States (“Domestic Coverage Area” or “DCA”), Mexico and Canada. 2G off-net data speeds may apply. Limits: Max 20 lines total (including both 10 phone lines and 10 non-phone device lines) per Unlimited Your Way group. May not be stackable w/other oﬀers, credits or discounts. AT&T reserves right to discontinue offer in select jurisdictions at any time in AT&T’s sole discretion. Offer not made as a solicitation of business from governmental agencies.\n\nRETIRED LAW ENFORCEMENT OFFICER & FIREFIGHTER OFFER: Eligibility: Avail. to retired Law Enforcement officers & Firefighters. Excludes EMS, Emergency Management Agencies, PSAP, Federal Government retirees. As proof of eligibility, must provide a valid Pension letter or Retiree ID/badge. Customers accepting this offer certify they are permitted to under applicable law. Eligibility is subject to annual recertification. Customers on certain offers may not be eligible. Other restr’s may apply. Up to 20% off Wireless service discount: Plans avail. in select locations only. Get 10% off AT&T Value 2.0, 15% off AT&T Extra 2.0, and 20% off AT&T Premium 2.0 plan monthly service charge for smartphone lines of service; 20% off the monthly service charge for eligible connected data device (tablet, smartwatch, hotspot, Connected Car, and camera) lines of service. With Premium 2.0 the first eligible tablet or smartwatch wearable line of service will get 50% off. Excludes AT&T Elite 2.0. Discount applied after any applicable multi-line, Autopay, paperless bill, or other discount. Start w/in 3 bill cycles after service activation & eligibility confirmed. Unlimited Data: AT&T may temporarily slow data speeds if the network is busy. All AT&T service is subject to AT&T network management policies. See att.com/broadbandinfo for details. For use in the United States (“Domestic Coverage Area” or “DCA”), Mexico and Canada. 2G off-net data speeds may apply. Limits: Max 20 lines total (including both 10 phone lines and 10 non-phone device lines) per Unlimited Your Way group. May not be stackable w/other oﬀers, credits or discounts. AT&T reserves right to discontinue offer in select jurisdictions at any time in AT&T’s sole discretion. Offer not made as a solicitation of business from governmental agencies.\n\nTEACHER/EDUCATOR: Eligibility: Avail. to K-12 classroom teachers and college/university professors and instructors based in the US. As proof of eligibility, must provide unexpired employee ID, recent paystub from w/in 90 days, or employment letter w/in 30 days. Offer available only in select locations/channels. Customers accepting this offer certify they are permitted to under applicable law. Eligibility is subject to annual recertification. Customers on certain offers may not be eligible. Other restr’s may apply. Up to 20% off Wireless service discount: Plans avail. in select locations only. Get 10% off AT&T Value 2.0, 15% off AT&T Extra 2.0, and 20% off AT&T Premium 2.0 plan monthly service charge for smartphone lines of service; 20% off the monthly service charge for eligible connected data device (tablet, smartwatch, hotspot, Connected Car, and camera) lines of service. With Premium 2.0 the first eligible tablet or smartwatch wearable line of service will get 50% off. Excludes AT&T Elite 2.0. Discount applied after any applicable multi-line, Autopay, paperless bill, or other discount. Start w/in 3 bill cycles after service activation & eligibility confirmed. Unlimited Data: AT&T may temporarily slow data speeds if the network is busy. All AT&T services are subject to AT&T network management policies. See att.com/broadbandinfo for details. For use in the United States (“Domestic Coverage Area” or “DCA”), Mexico and Canada. 2G off-net data speeds may apply. Limits: Max 20 lines total (including both 10 phone lines and 10 non-phone device lines) per Unlimited Your Way group. May not be stackable w/other oﬀers, credits or discounts. AT&T reserves right to discontinue offer in select jurisdictions at any time in AT&T’s sole discretion. Offer not made as a solicitation of business from governmental agencies.\n\niPhone Air Offer: Offer and req’ts subj. to change at any time and w/o notice. Discounts:  iPhone Air 256GB for $0.43/mo. for 36 mos. after up to $884.36 in bill credits applied over the installment term, plus an additional $5.56/mo. bill credit for 36 mos. (which may be applied to wireless service), iPhone Air 512GB for $6.43/mo. for 36 mos. after up to $868.36 in bill credits applied over the installment term, plus an additional $5.56/mo. bill credit for 36 mos. (which may be applied to wireless service), or iPhone Air 1TB for $12.43/mo. after up to $1,052.36 in bill credits applied over the installment term, plus an additional $5.56/mo. bill credit for 36 mos. (which may be applied to wireless service).  Purchase Requirements: Requires new line activation on AT&T Value 2.0 plan or higher (starting at $60/mo. plus taxes and fees before discounts for a single line) and 0% APR 36-mo. installment plan w/ monthly pmts of up to $25, based on the eligible device purchased. $0 down is avail. for well-qualified customers; others may req. a down payment. Tax on full retail price due at sale. Activation fee: $35/line. Credits: Applied over installment term, starting w/in 3 bills. If the wireless plan on the purchased device is lowered during the installment term, credits may stop or be reduced to the max avail. for the lower plan, if eligible. Canceling wireless svc stops credits and the remaining device balance is due. Must not cancel service on any other line within 90 days or credits may stop. Early payoff or upgrade may stop credits. Purchase, financing, and other limits and restr’s apply.\n\nALL PLANS UNLIMITED YOUR WAY: Plans avail. in select locations only. All AT&T wireless services subject to terms and conditions in the Consumer Service Agreement (att.com/csa). Advertised monthly price includes monthly plan charge for talk, text and data & monthly per-line phone access charge. Other Non-Phone Device Monthly Charges: $20.99 per tablet; $20.99 per camera; $10.99 per wearable. Requires active phone line. If you cancel your phone line(s) first standalone non-phone device will be billed at $75.99. If you switch plans, the non-phone device standard monthly rates apply and may be eligible for discounts based on new rate plan. Each additional line billed at the standard monthly rate. AT&T Connected Car Monthly Charges: $15 per vehicle. OTHER RESTRICTIONS & FEES: Activation/upgrade fee (up to $50) & deposit may apply. Credit, debit, or reloadable prepaid card may be required (except in MA, PA, and ND). AUTOPAY & PAPERLESS BILL DISCOUNT: $10 a month per phone line discount if enrolled in both paperless billing and AutoPay with a bank account or the AT&T Points Plus® Card from Citi. Discount reduced to $5 a month per phone line when enrolled in AutoPay with a debit card. No discount if enrolled in AutoPay with any other credit card. Pay full plan cost until discount starts within 2 bills. Must maintain valid email address to continue discount. AT&T employees, retirees & IMO consumers are not eligible for the AutoPay and Paperless bill discount. UNLIMITED DATA: For use in the United States (the “Domestic Coverage Area” or “DCA”), Mexico and Canada. 2G off-net data speeds may apply. All AT&T service is subject to AT&T network management policies. See att.com/broadbandinfo for details. UNLIMITED TALK: Phones only. Includes calls w/in and between the DCA, Canada and Mexico. You may be charged for calls to special or premium service numbers and calls to other countries. For rates, see att.com/intlcalling. UNLIMITED TEXT: Compatible phone and rate plan required. Includes unlimited messages up to 1MB in size within and from DCA, Mexico and Canada. For texting to other countries, see att.com/text2world. Messages sent through applications may incur data or other charges. Advanced Messaging: Not available for use in Mexico and Canada. Other restrictions apply & can be found at att.com/advancedmessaging. 5G SERVICE: Requires a compatible 5G device. Coverage not available everywhere. See att.com/5Gforyou for details. ACTIVEARMOR MOBILE SECURITY: Compatible device required. You must download the AT&T ActiveArmor app and accept its terms and conditions for full App functionality. May not detect all threats. May inadvertently block wanted calls; settings can be adjusted in the App. Details at www.att.com/activearmor. LIMITS: Select devices only (sold separately). Max 10 phone lines and 20 lines total (including both phone and non-phone device lines) per Unlimited Your Way group. These plans may not be eligible for additional discounts, including but not limited to Signature and Appreciation discounts. AT&T employees & retirees may not be eligible for certain benefits, offers, and discounts associated with these plans.\n\nTablets Add-On Plan: All AT&T wireless services, including data services, are subject to terms and conditions in Consumer Service Agreement (att.com/csa) and the Wireless Data Services (att.com/dcpp). Phone line required to add non-phone device to an Unlimited Your Way plan group. Plan Pricing: $20.99/mo. If no phone line, first standalone non-phone device will be billed at $75.99/mo. plus taxes & fees. Subject to applicable discounts. Eligibility: Consumer only plan. AT&T may slow data speeds if the network is busy. VIDEO STREAMING: Video typically streams at standard-definition. Content bundled with video may be slow to load. Go to att.com/myatt to change your settings to view in higher definition. Details at att.com/VideoFeature. HOTSPOT DATA: 30GB hotspot per line per month. After 30GB, hotspot speed slowed to max of 128Kbps for the rest of bill cycle. After this, hotspot data usage will be impacted and not fully functional. International Roaming: Monthly plan prices do not apply to data usage while roaming. If roaming outside the DCA, Mexico or Canada international data usage will be charged at pay-per-use rates, found at att.com/ppurates, unless an international data package is added. For available international options, go to att.com/global. Not all devices may be eligible for international roaming service.\n\nAT&T VALUE 2.0: 5GB of high-speed data. After 5GB of data usage on a line in a bill cycle, for the remainder of the cycle, AT&T may temporarily slow data speeds if the network is busy. VIDEO STREAMING: Video typically streams at standard-definition. Content bundled with video may be slow to load. Details at att.com/VideoFeature. HOTSPOT DATA: Requires compatible device. Includes up to 3GB per line per month. After 3GB, hotspot speed slowed to max of 128Kbps for the rest of bill cycle. After this, hotspot data usage will be impacted and not fully functional.\n\nAT&T EXTRA 2.0: 100GB of high-speed data. After 100GB of data usage on a line in a bill cycle, for the remainder of the cycle, AT&T may temporarily slow data speeds if the network is busy. VIDEO STREAMING: Video typically streams at standard-definition. Content bundled with video may be slow to load. Details at att.com/VideoFeature. HOTSPOT DATA: Requires compatible device. Includes up to 50GB per line per month. After 50GB, hotspot speed slowed to max of 128Kbps for the rest of bill cycle. After this, hotspot data usage will be impacted and not fully functional.\n\nAT&T PREMIUM 2.0: Other Non-Phone Device Monthly Charges: Get 50% off the monthly service charge for one eligible tablet or smartwatch wearable plan (discount limited to one non-phone device line). Taxes, fees, and device charges extra. Standard monthly rate: $20.99 per tablet, $20.99 per camera; $10.99 per wearable. Requires active phone line. If you cancel the phone line(s) first standalone non-phone device will be billed at $75.99. If you switch plans, the non-phone device standard monthly rates apply and may be eligible for discounts based on new rate plan. Each additional line billed at the standard monthly rate. VIDEO STREAMING: Video typically streams at standard-definition. Content bundled with video may be slow to load. Go to att.com/myatt to c ange your settings to view in higher definition. Details at att.com/VideoFeature. HOTSPOT DATA: Requires compatible device. Includes up to 100GB per line per month. After 100GB, hotspot speed slowed to max of 128Kbps for the rest of bill cycle. After this, hotspot data usage will be impacted and not fully functional. ROAM LATIN AMERICA: Eligibility: Compatible smartphones only. Countries: For a list of included countries, go to www.att.com/roamlatam. Countries are subject to change without notice. Coverage and data speeds vary by country (may be at 3G speed) and may change without notice. Coverage not available in all areas. Unlimited Talk, Text, and Data Usage: This feature allows you to use data in an included country, make calls between included countries and from included countries to the U.S. and any country included in International Day Pass (“IDP”), and send text messages in an included country without roaming charges. Calls made to included countries while in the U.S. are not included. Text messages received are rated as domestic. Unlimited text applies only to SMS and MMS and not to other messaging services or applications like iMessage. Excessive Use/Abuse: This feature is intended for roaming use during periods of travel to included countries by customers whose primary place of use is within the USA. Predominantly using your rate plan in one or more of the included countries may result in this feature being removed from your line. Calls to countries not included: Calls from included Latin America countries to countries not included in IDP will get International Long Distance (ILD) charges. For a list of IDP countries, go to att.com/globalcountries. Pay-per-use rates apply unless you add an ILD package to your device. Rates are subject to change without notice. For details, go to att.com/intlcalling.\n\nADDITIONAL AT&T FEES & GOVT. TAXES: Monthly AT&T Fees apply per line & include Administrative/Regulatory Cost Recovery Fee, up to $4.99 & other fees which are not government-required. Add’l one-time AT&T fees may apply. Govt. taxes are extra. See att.com/mobilityfees for more details.\n\nAll offers, programming, promotions, pricing, terms, restrictions & conditions subject to change & may be modified, discontinued, or terminated at any time without notice.\n\n©2026 AT&T Intellectual Property. All rights reserved. AT&T, the AT&T logo, all other AT&T marks contained herein are trademarks of AT&T Intellectual Property and/or AT&T affiliated companies.",
    "sourceUrl": "https://www.att.com/bundles/",
    "retrievedAt": "2026-10-21T06:28:09.227Z",
    "expiresAt": null
  }
];

export function getOffer(id: string): Offer {
  const o = offers.find((x) => x.id === id);
  if (!o) throw new Error(`Unknown offer id: ${id}`);
  return o;
}

export function offersBy(category: OfferCategory): Offer[] {
  return offers.filter((o) => o.category === category);
}

/** Most recent verification date across all offers (shown in the footer). */
export const offersVerifiedAt = offers.map((o) => o.retrievedAt).sort().at(-1) as string;

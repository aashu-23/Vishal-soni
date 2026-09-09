/* =============================================================================
   SITE PROFILE
   Every fact below is taken from Vishal's public Behance profile
   (behance.net/vishalsoni24) — nothing here is invented.
   The ONE exception is `email`, which is not public. Replace it before launch.
   ============================================================================= */

export const site = {
  name: 'Vishal Soni',
  role: 'Graphic, Motion Graphics & 3D Artist',
  roleLines: ['Motion Graphics', 'Video Editing', '3D'],
  location: 'Nagpur, India',
  studio: 'Pixellus Design Solutions',
  availability: 'Available for freelance & full-time',
  experience: '8+ years',
  yearsRange: '2025—2026',

  // Verbatim from his Behance bio.
  bio: 'Creative design lead with 8+ years across branding, advertising and digital design, including 4+ years agency-side running creative teams and client delivery. Works end to end from brand identity through motion and 3D, with recent work concentrated in fintech, SaaS and enterprise tech.',

  email: 'sonivishal76@gmail.com',

  whatsapp: '+91 8368168904',
  whatsappHref: 'https://wa.me/918368168904?text=' + encodeURIComponent("Hi Vishal, I'd like to talk about a project."),

  links: [
    { label: 'Instagram', href: 'https://instagram.com/3d_craft_059' },
    { label: 'Behance', href: 'https://www.behance.net/vishalsoni24' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/' }, // ⚠️ profile slug not public — replace
    { label: 'YouTube', href: 'https://youtube.com/@Vishal_Soni_76' },
    { label: 'All links', href: 'https://linktr.ee/vishalsoni76' },
  ],
}

/* Named in his Behance bio. Do not add brands he hasn't publicly claimed. */
export const clients = [
  'Maruti Suzuki',
  'Hero MotoCorp',
  'ITC',
  'Keyy',
  'Ciferon',
  'Genpact',
]

export const nav = [
  { label: 'Work', to: '/', hash: '#work' },
  { label: 'Reels', to: '/', hash: '#reels' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/', hash: '#contact' },
]
